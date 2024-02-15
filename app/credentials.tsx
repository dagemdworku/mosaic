import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity, useColorScheme } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useContext, useState } from 'react';
import { StorageContext } from '@/contexts/StorageContext';
import { useNavigation } from 'expo-router';
import S3ClientService from '@/services/S3ClientService';

export default function CredentialsScreen() {
  const { endpoint: initialEndpoint, username: initialUsername, setCredentials, setConnected } = useContext(StorageContext);

  const [endpoint, setEndpoint] = useState(initialEndpoint ?? '');
  const [username, setUsername] = useState(initialUsername ?? '');
  const [password, setPassword] = useState('');


  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const saveCredentials = async () => {
    const s3Client = new S3ClientService(endpoint, username, password);
    const verified: boolean = await s3Client.verify();

    if (!verified) {
      alert('Invalid credentials');
    } else {
      setCredentials!(endpoint, username, password);
      setConnected!(true);
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <Text style={styles.title}>Set Credentials</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <TextInput
        style={[styles.input, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}
        placeholder="Endpoint"
        value={endpoint}
        onChangeText={setEndpoint}
        textContentType="oneTimeCode"
      />

      <TextInput
        style={[styles.input, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        textContentType="oneTimeCode"
      />

      <TextInput
        style={[styles.input, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        textContentType="oneTimeCode"
      />


      <TouchableOpacity style={styles.button} onPress={saveCredentials}>
        <Text style={styles.buttonText}>Connect</Text>
      </TouchableOpacity>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'white',
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
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  button: {
    width: '80%',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});