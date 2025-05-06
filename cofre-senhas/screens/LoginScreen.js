import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const entrarOuCadastrar = async () => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, senha);
      navigation.replace('Home', { userId: cred.user.uid });
    } catch {
      // Se não existir, cria a conta
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, senha);
        navigation.replace('Home', { userId: cred.user.uid });
      } catch (err) {
        Alert.alert('Erro', err.message);
      }
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} autoCapitalize="none" />
      <TextInput placeholder="Senha" onChangeText={setSenha} value={senha} secureTextEntry />
      <Button title="Entrar / Cadastrar" onPress={entrarOuCadastrar} />
    </View>
  );
}
