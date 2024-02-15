import { useContext, useState } from 'react';
import { Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { Text, View } from '@/components/Themed';
import S3ClientService from '@/services/S3ClientService';
import { StorageContext } from '@/contexts/StorageContext';

export default function TabTwoScreen() {
  const { endpoint, username, password, connected, setConnected } = useContext(StorageContext);
  const [s3Client, setS3Client] = useState<S3ClientService | null>(null);
  const [status, setStatus] = useState<string>('No updates yet');

  const connect = async () => {
    if (!endpoint || !username || !password) {
      alert('Please set credentials first');
      return;
    }

    const client = new S3ClientService(endpoint, username, password);
    const verified: boolean = await client.verify();

    if (!verified) {
      alert('Invalid credentials');
    } else {
      setS3Client(client);
      setConnected!(true);
      return client;
    }
  };


  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      videoQuality: ImagePicker.UIImagePickerControllerQualityType.Medium,
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
      console.log('Selected File:', result);
      uploadVideo(result.assets[0].uri);
    } else {
      alert('You did not select any video.');
    }
  };

  const uploadVideo = async (uri: string) => {
    let client = s3Client;
    if (!connected) client = await connect() ?? null;

    if (!client) {
      alert('Please connect first');
      return;
    }

    try {
      setStatus('Uploading...');

      const result = await client.uploadVideo('videos', uri, (progress) => {
        console.log(`Upload progress: ${progress}%`);
      });

      setStatus('Upload complete');
      console.log('Result:', result);
    } catch (err) {
      setStatus('Upload failed');
      console.error('Error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Text>Connected: {connected ? 'Yes' : 'No'}</Text>

      <Button title="Connect" onPress={connect} />
      <Button title="Pick an video from gallery" onPress={pickVideo} />

      <Text>Status: {status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
