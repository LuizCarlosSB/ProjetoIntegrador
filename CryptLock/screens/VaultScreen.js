import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, doc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function VaultScreen({ navigation }) {
  const [passwords, setPasswords] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [formData, setFormData] = useState({ servico: '', usuario: '', senha: '' });
  const modalScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, 'Senhas'), where('userId', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setPasswords(data);
    });
    return unsubscribe;
  }, []);

  const openModal = (password) => {
    setCurrentPassword(password || null);
    setFormData(
      password
        ? { servico: password.servico, usuario: password.usuario, senha: password.senha }
        : { servico: '', usuario: '', senha: '' }
    );
    setModalVisible(true);
    Animated.spring(modalScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalScale, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const savePassword = async () => {
    if (!formData.servico || !formData.senha) {
      Alert.alert('Atenção', 'Serviço e senha são obrigatórios');
      return;
    }

    try {
      if (currentPassword) {
        await updateDoc(doc(db, 'Senhas', currentPassword.id), formData);
      } else {
        await addDoc(collection(db, 'Senhas'), {
          ...formData,
          userId: auth.currentUser.uid,
        });
      }
      closeModal();
    } catch (e) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar');
    }
  };

  const deletePassword = async (id) => {
    try {
      await deleteDoc(doc(db, 'Senhas', id));
    } catch (e) {
      Alert.alert('Erro', 'Erro ao excluir a senha');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.container}>
      {/* Ícone decorativo */}
      <Icon
        name={passwords.length > 0 ? 'unlock' : 'lock'}
        style={styles.backgroundIcon}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Gerenciador de Senhas</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Icon name="sign-out" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Text style={styles.buttonText}>Adicionar Senha</Text>
      </TouchableOpacity>

      {passwords.length === 0 ? (
        <Text style={styles.emptyMessage}>Nenhuma senha cadastrada ainda.</Text>
      ) : (
        <FlatList
          data={passwords}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>🔹 Serviço: {item.servico}</Text>
              <Text style={styles.itemText}>👤 Usuário: {item.usuario}</Text>
              <Text style={styles.itemText}>🔑 Senha: {item.senha}</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity onPress={() => openModal(item)} style={styles.smallButton}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deletePassword(item.id)}
                  style={[styles.smallButton, styles.deleteButton]}
                >
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <Modal transparent visible={modalVisible} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContainer, { transform: [{ scale: modalScale }] }]}>
            <Text style={styles.modalTitle}>
              {currentPassword ? 'Editar Senha' : 'Nova Senha'}
            </Text>
            <TextInput
              placeholder="Serviço"
              placeholderTextColor="#888"
              value={formData.servico}
              onChangeText={(t) => setFormData({ ...formData, servico: t })}
              style={styles.input}
            />
            <TextInput
              placeholder="Usuário"
              placeholderTextColor="#888"
              value={formData.usuario}
              onChangeText={(t) => setFormData({ ...formData, usuario: t })}
              style={styles.input}
            />
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#888"
              value={formData.senha}
              onChangeText={(t) => setFormData({ ...formData, senha: t })}
              secureTextEntry
              style={styles.input}
            />
            <View style={styles.buttonGroup}>
              <TouchableOpacity onPress={closeModal} style={[styles.smallButton, styles.cancelButton]}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={savePassword} style={styles.smallButton}>
                <Text style={styles.buttonText}>{currentPassword ? 'Atualizar' : 'Salvar'}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c2e',
    padding: 20,
    paddingTop: 60,
  },
  backgroundIcon: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    fontSize: 140,
    color: '#ffffff',
    opacity: 0.05,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 25,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyMessage: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 50,
  },
  listContent: {
    paddingBottom: 40,
  },
  item: {
    backgroundColor: '#2c2c3e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  itemText: {
    color: '#ffffff',
    marginBottom: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  smallButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#2c2c3e',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1c1c2e',
    color: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#3c3c4e',
  },
});
