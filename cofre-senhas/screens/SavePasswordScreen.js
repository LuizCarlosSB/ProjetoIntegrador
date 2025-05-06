import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { savePassword } from '../services/passwords';

export default function SavePasswordScreen({ route }) {
  const { userId } = route.params;
  const [label, setLabel] = useState('');
  const [senha, setSenha] = useState('');

  const salvar = async () => {
    await savePassword(userId, label, senha);
    Alert.alert('Sucesso', 'Senha salva com segurança!');
    setLabel('');
    setSenha('');
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Título (ex: Gmail)" value={label} onChangeText={setLabel} />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <Button title="Salvar" onPress={salvar} />
    </View>
  );
}
