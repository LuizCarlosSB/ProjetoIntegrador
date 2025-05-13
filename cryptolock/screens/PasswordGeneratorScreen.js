import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { savePassword } from '../utils/encryption';

export default function PasswordGeneratorScreen({ navigation }) {
  const [generated, setGenerated] = useState('');
  const [title, setTitle] = useState('');

  const generatePassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setGenerated(pass);
  };

  const handleSave = async () => {
    if (!title || !generated) {
      Alert.alert('Erro', 'Preencha o título e gere uma senha.');
      return;
    }
    await savePassword(title, generated);
    Alert.alert('Sucesso', 'Senha gerada e salva!');
    setTitle('');
    setGenerated('');
    navigation.navigate('Senhas');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: GitHub"
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity style={styles.generateButton} onPress={generatePassword}>
        <Text style={styles.buttonText}>Gerar Senha</Text>
      </TouchableOpacity>

      {generated !== '' && (
        <>
          <Text style={styles.generatedLabel}>Senha:</Text>
          <Text style={styles.generated}>{generated}</Text>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Salvar Senha</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontWeight: 'bold', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  generateButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  generatedLabel: { marginTop: 20, fontWeight: 'bold' },
  generated: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 6,
    marginTop: 4,
  },
});
