import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from '../firebaseConfig';

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
  addButton: {
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default function VaultScreen() {
  const [passwords, setPasswords] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [formData, setFormData] = useState({
    servico: '',
    usuario: '',
    senha: ''
  });

  // Carrega as senhas em tempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Senhas"), (querySnapshot) => {
      const fetchedPasswords = [];
      querySnapshot.forEach((doc) => {
        fetchedPasswords.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setPasswords(fetchedPasswords);
    });

    return () => unsubscribe();
  }, []);

  // Manipula mudanças nos inputs do formulário
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Abre o modal para adicionar ou editar
  const openModal = (password = null) => {
    if (password) {
      setCurrentPassword(password);
      setFormData({
        servico: password.servico,
        usuario: password.usuario,
        senha: password.senha
      });
    } else {
      setCurrentPassword(null);
      setFormData({
        servico: '',
        usuario: '',
        senha: ''
      });
    }
    setModalVisible(true);
  };

  // Fecha o modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Adiciona uma nova senha
  const addPassword = async () => {
    try {
      await addDoc(collection(db, "Senhas"), formData);
      closeModal();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar a senha");
      console.error("Erro ao adicionar senha:", error);
    }
  };

  // Atualiza uma senha existente
  const updatePassword = async () => {
    try {
      await updateDoc(doc(db, "Senhas", currentPassword.id), formData);
      closeModal();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a senha");
      console.error("Erro ao atualizar senha:", error);
    }
  };

  // Remove uma senha
  const deletePassword = async (id) => {
    try {
      await deleteDoc(doc(db, "Senhas", id));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível apagar a senha");
      console.error("Erro ao deletar senha:", error);
    }
  };

  // Submissão do formulário
  const handleSubmit = () => {
    if (!formData.servico || !formData.senha) {
      Alert.alert("Atenção", "Serviço e senha são obrigatórios");
      return;
    }

    if (currentPassword) {
      updatePassword();
    } else {
      addPassword();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cofre de Senhas</Text>
      
      <Button
        title="Adicionar Senha"
        onPress={() => openModal()}
        style={styles.addButton}
        color="#6200ee"
      />

      {passwords.length === 0 ? (
        <Text style={styles.emptyMessage}>Nenhuma senha armazenada</Text>
      ) : (
        <FlatList
          data={passwords}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item}>
              <Text selectable style={styles.passwordText}>
                Serviço: {item.servico || 'Não especificado'}
              </Text>
              <Text selectable style={styles.passwordText}>
                Usuário: {item.usuario || 'Não especificado'}
              </Text>
              <Text selectable style={styles.passwordText}>
                Senha: {item.senha || 'Não especificado'}
              </Text>
              <View style={styles.buttonGroup}>
                <Button 
                  title="Editar" 
                  onPress={() => openModal(item)} 
                  color="#6200ee"
                />
                <Button 
                  title="Apagar" 
                  onPress={() => deletePassword(item.id)} 
                  color="#ff3d00"
                />
              </View>
            </TouchableOpacity>
          )}
          style={styles.list}
        />
      )}

      {/* Modal para adicionar/editar senhas */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ marginBottom: 10, fontSize: 18 }}>
              {currentPassword ? 'Editar Senha' : 'Adicionar Nova Senha'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Serviço (ex: Google)"
              value={formData.servico}
              onChangeText={(text) => handleInputChange('servico', text)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Usuário/E-mail"
              value={formData.usuario}
              onChangeText={(text) => handleInputChange('usuario', text)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={formData.senha}
              onChangeText={(text) => handleInputChange('senha', text)}
              secureTextEntry={true}
            />
            
            <View style={styles.buttonGroup}>
              <Button title="Cancelar" onPress={closeModal} color="#666" />
              <Button 
                title={currentPassword ? 'Atualizar' : 'Salvar'} 
                onPress={handleSubmit} 
                color="#6200ee"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}