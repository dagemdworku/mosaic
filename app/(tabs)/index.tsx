import { Button, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useContext } from 'react';
import { StorageContext } from '@/contexts/StorageContext';
import S3ClientService from '@/services/S3ClientService';

export default function TabOneScreen() {
  const { endpoint, username, password, connected, setConnected } = useContext(StorageContext);

  const connect = async () => {
    if (!endpoint || !username || !password) {
      alert('Please set credentials first');
      return;
    }

    const s3Client = new S3ClientService(endpoint, username, password);
    const verified: boolean = await s3Client.verify();

    if (!verified) {
      alert('Invalid credentials');
    } else {
      setConnected!(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Text>Endpoint: {endpoint}</Text>
      <Text>Username: {username}</Text>
      <Text>Connected: {connected ? 'Yes' : 'No'}</Text>

      <Button title="Connect" onPress={connect} />
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
