import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TextInput, KeyboardAvoidingView, Button, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useContext, useState } from 'react';
import { StorageContext } from '@/contexts/StorageContext';
import { useNavigation } from 'expo-router';

export default function CredentialsScreen() {
  const { endpoint: initialEndpoint, username: initialUsername, setCredentials } = useContext(StorageContext);

  const [endpoint, setEndpoint] = useState(initialEndpoint ?? '');
  const [username, setUsername] = useState(initialUsername ?? '');
  const [password, setPassword] = useState('');


  const navigation = useNavigation();

  const saveCredentials = () => {
    if (setCredentials) {
      setCredentials(endpoint, username, password);
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <Text style={styles.title}>Set Credentials</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <TextInput
        style={styles.input}
        placeholder="Endpoint"
        value={endpoint}
        onChangeText={setEndpoint}
        textContentType="oneTimeCode"
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        textContentType="oneTimeCode"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        textContentType="oneTimeCode"
      />


      <TouchableOpacity style={styles.button} onPress={saveCredentials}>
        <Text style={styles.buttonText}>Save</Text>
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
    backgroundColor: 'white',
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