import { Button, Dimensions, FlatList, ScrollView, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useContext, useRef, useState } from 'react';
import { StorageContext } from '@/contexts/StorageContext';
import S3ClientService from '@/services/S3ClientService';
import { ObjectList } from 'aws-sdk/clients/s3';

import MVideoPlayer from '@/components/MVideoPlayer';

export default function TabOneScreen() {
  const { endpoint, username, password, connected, setConnected } = useContext(StorageContext);
  const [s3Client, setS3Client] = useState<S3ClientService | null>(null);
  const [videos, setVideos] = useState<ObjectList | null>(null);


  const screenHeight = Dimensions.get('window').height;
  const videoHeight = screenHeight * 0.8;

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
    }
  };

  const listVideos = async () => {
    if (!s3Client) {
      alert('Please connect first');
      return;
    }

    try {
      const buckets = await s3Client.listBuckets();
      console.log('Buckets:', buckets);

      const videos = [];

      for (const bucket of buckets) {
        if (!bucket.Name) continue;

        const files = await s3Client.listVideosInBucket(bucket.Name);
        console.log(`Files in ${bucket.Name}:`, files);
        videos.push(...files);
      }

      setVideos(videos);
    } catch (err) {
      console.error('Error:', err);
    }
  }

  if (!connected ?? false) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Not connected!</Text>

        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.textRight]}>Endpoint:</Text>
            <Text style={styles.tableCell}>{endpoint}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.textRight]}>Username:</Text>
            <Text style={styles.tableCell}>{username}</Text>
          </View>
        </View>

        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

        <Button title="Connect" onPress={connect} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {(videos ?? []).length === 0 ? <Button title="List Videos" onPress={listVideos} /> : null}
      <FlatList
        data={videos}
        renderItem={({ item: video }) => (
          <MVideoPlayer videoKey={video.Key ?? ''} path={'http://172.20.10.7:9000/videos/' + video.Key} />
        )}
        keyExtractor={(video) => video.Key ?? ''}
        snapToInterval={videoHeight}
        decelerationRate={'fast'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  table: {
    width: '80%',
    borderWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    borderWidth: 0,
    padding: 10,
  },
  textRight: {
    textAlign: 'right',
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
