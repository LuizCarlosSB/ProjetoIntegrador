import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { savePassword } from '../utils/encryption';

export default function SavePasswordScreen() {
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');

  const handleSave = async () => {
    if (!title || !password) {
      Alert.alert('Erro', 'Preencha os dois campos.');
      return;
    }

    try {
      await savePassword(title, password);
      Alert.alert('Sucesso', 'Senha salva com sucesso!');
      setTitle('');
      setPassword('');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar senha.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Salvar Senha" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
