import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from 'react-native';

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
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    width: '100%',
    elevation: 2,
  },
  passwordText: {
    marginBottom: 10,
    fontSize: 16,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  list: {
    width: '100%',
  },
});

export default function VaultScreen({ passwords, deletePassword }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cofre de Senhas</Text>
      
      {passwords.length === 0 ? (
        <Text style={styles.emptyMessage}>Nenhuma senha armazenada</Text>
      ) : (
        <FlatList
          data={passwords}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={styles.item}>
              <Text selectable style={styles.passwordText}>Senha {index + 1}: {item}</Text>
              <Button 
                title="Apagar" 
                onPress={() => deletePassword(index)} 
                color="#ff3d00"
              />
            </TouchableOpacity>
          )}
          style={styles.list}
        />
      )}
    </View>
  );
}