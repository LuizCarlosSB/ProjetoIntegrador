import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Salvar Senha" onPress={() => navigation.navigate('SalvarSenha')} />
      <Button title="Gerador de Senhas" onPress={() => navigation.navigate('Gerador')} />
      <Button title="Logout" onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, gap: 20 },
});
