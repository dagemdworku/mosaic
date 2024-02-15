import { Button, ScrollView, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useContext, useRef, useState } from 'react';
import { StorageContext } from '@/contexts/StorageContext';
import S3ClientService from '@/services/S3ClientService';
import { ObjectList } from 'aws-sdk/clients/s3';

import { ResizeMode } from 'expo-av';
import VideoPlayer from 'expo-video-player'
import { SliderProps } from '@react-native-community/slider';

export default function TabOneScreen() {

  const videoRef = useRef(null);

  const { endpoint, username, password, connected, setConnected } = useContext(StorageContext);
  const [s3Client, setS3Client] = useState<S3ClientService | null>(null);
  const [videos, setVideos] = useState<ObjectList | null>(null);

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



  const slider: SliderProps = {
    style: {
      width: 300,
      height: 40,
    },
    minimumValue: 0,
    maximumValue: 1,
    minimumTrackTintColor: '#000000',
    maximumTrackTintColor: '#000000',
    thumbTintColor: '#000000',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Text>Endpoint: {endpoint}</Text>
      <Text>Username: {username}</Text>
      <Text>Connected: {connected ? 'Yes' : 'No'}</Text>

      <Button title="Connect" onPress={connect} />
      <Button title="List Videos" onPress={listVideos} />

      <Text>Videos:</Text>
      <ScrollView>
        {videos?.map((video, index) => (
          <View
            key={video.Key}>
            <VideoPlayer
              style={styles.video}
              defaultControlsVisible={false}
              timeVisible={false}
              fullscreen={{
                visible: false,
              }}
              slider={{
                style: {
                  marginLeft: 10,
                  marginRight: 10,
                },
                visible: true,
                minimumValue: 0,
                maximumValue: 1,
                minimumTrackTintColor: '#FFF',
                maximumTrackTintColor: '#FFF5',
                thumbTintColor: '#FFF',
              }}
              videoProps={{
                shouldPlay: false,
                resizeMode: ResizeMode.CONTAIN,
                source: {
                  uri: 'http://172.20.10.7:9000/videos/' + video.Key,
                },
              }}
            />
            <Text>http://172.20.10.7:9000/videos/{video.Key}</Text>
          </View>
        ))}

      </ScrollView>
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
  video: {
    width: 300,
    height: 300,
  },
});
