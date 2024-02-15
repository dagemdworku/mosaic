import React, { useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';

import { Text, View } from './Themed';

import { ResizeMode } from 'expo-av';
import VideoPlayer from 'expo-video-player'

export default function MVideoPlayer({ videoKey, path }: { videoKey: string, path: string }) {

  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const videoHeight = screenHeight * 0.8;

  return (
    <View
      key={videoKey} style={{ ...styles.container, height: videoHeight }}>
      <VideoPlayer
        style={{ ...styles.video, height: videoHeight, width: screenWidth }}
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
          shouldPlay: true,
          isLooping: true,
          resizeMode: ResizeMode.CONTAIN,
          source: {
            uri: path,
          },
        }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{path}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  video: {
  },
  textContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  text: {
    color: '#fff',
  },
});
