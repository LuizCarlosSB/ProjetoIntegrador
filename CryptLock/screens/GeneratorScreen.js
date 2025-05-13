import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';


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
  generatedPassword: {
    fontSize: 18,
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
    width: '100%',
    textAlign: 'center',
    color: '#00796b',
  },
  buttonGroup: {
    width: '100%',
    marginTop: 20,
  },
  lengthControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  lengthButtons: {
    flexDirection: 'row',
    gap: 10,
  },
});

function generatePassword(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export default function GeneratorScreen({ route }) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);

  const handleGenerate = () => {
    const newPass = generatePassword(length);
    setPassword(newPass);
    if (route.params?.addPassword) {
      route.params.addPassword(newPass);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerador de Senhas</Text>

      <View style={styles.lengthControl}>
        <Text>Tamanho: {length}</Text>
        <View style={styles.lengthButtons}>
          <Button title="-" onPress={() => setLength(Math.max(8, length - 1))} />
          <Button title="+" onPress={() => setLength(Math.min(32, length + 1))} />
        </View>
      </View>

      <Text selectable style={styles.generatedPassword}>{password || 'Clique em Gerar'}</Text>

      <View style={styles.buttonGroup}>
        <Button title="Gerar Senha" onPress={handleGenerate} color="#6200ee" />
        {password && (
          <Button
            title="Copiar para Área de Transferência"
            onPress={() => {
              Clipboard.setStringAsync(password);
              Alert.alert('Copiado!', 'Senha copiada para a área de transferência.');
            }}
            color="#03dac6"
          />
        )}

      </View>
    </View>
  );
}