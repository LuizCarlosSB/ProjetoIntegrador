// screens/LoginScreen.js hello sir =)
import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#6200ee',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    width: '100%',
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Login bem-sucedido, o onAuthStateChanged em App.js irá lidar com a navegação
      })
      .catch(error => {
        let errorMessage;
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Email inválido.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Esta conta foi desativada.';
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = 'Email ou senha incorretos.';
            break;
          default:
            errorMessage = 'Ocorreu um erro. Tente novamente.';
        }
        Alert.alert('Erro', errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CryptLock</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Entrar" onPress={handleLogin} color="#6200ee" />
      <Button 
        title="Criar conta" 
        onPress={() => navigation.navigate('Register')} 
        color="#888"
      />
    </View>
  );
}