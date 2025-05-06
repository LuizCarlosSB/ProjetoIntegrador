import React from 'react';
import { View, Button, Text } from 'react-native';

export default function HomeScreen({ route, navigation }) {
  const { userId } = route.params;

  return (
    <View style={{ padding: 20 }}>
      <Text>Bem-vindo!</Text>
      <Button title="Salvar nova senha" onPress={() => navigation.navigate('SalvarSenha', { userId })} />
    </View>
  );
}
