// screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert('Sucesso', 'Conta criada com sucesso!');
        navigation.navigate('Login');
      })
      .catch(error => {
        let errorMessage;
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Este email já está em uso.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Email inválido.';
            break;
          case 'auth/weak-password':
            errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
            break;
          default:
            errorMessage = 'Ocorreu um erro. Tente novamente.';
        }
        Alert.alert('Erro', errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
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
      <TextInput
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Registrar" onPress={handleRegister} color="#6200ee" />
      <Button 
        title="Já tem uma conta? Faça login" 
        onPress={() => navigation.navigate('Login')} 
        color="#888"
      />
    </View>
  );
}