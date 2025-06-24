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
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import { checkPasswordStrength } from '../utils/passwordUtils';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function VaultScreen({ navigation }) {
  const [passwords, setPasswords] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [formData, setFormData] = useState({ servico: '', usuario: '', senha: '' });
  const modalScale = useRef(new Animated.Value(0)).current;
  const [visiblePasswords, setVisiblePasswords] = useState(new Set());
  const [passwordStrength, setPasswordStrength] = useState(null);

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
    const initialFormData = password
      ? { servico: password.servico, usuario: password.usuario, senha: password.senha }
      : { servico: '', usuario: '', senha: '' };
    setFormData(initialFormData);
    setPasswordStrength(checkPasswordStrength(initialFormData.senha)); // Calcula a força inicial
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
    }).start(() => {
      setModalVisible(false);
      setPasswordStrength(null); // Limpa a força ao fechar
    });
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
      console.error("Erro ao salvar senha: ", e); // Adicione isso para ver o erro detalhado no console
      Alert.alert('Erro', 'Ocorreu um erro ao salvar a senha. Tente novamente.');
    }
  };

  const deletePassword = async (id) => {
    try {
      await deleteDoc(doc(db, 'Senhas', id));
    } catch (e) {
      Alert.alert('Erro', 'Erro ao excluir a senha');
    }
  };

  const togglePasswordVisibility = (id) => {
    const newVisiblePasswords = new Set(visiblePasswords);
    if (newVisiblePasswords.has(id)) {
      newVisiblePasswords.delete(id);
    } else {
      newVisiblePasswords.add(id);
    }
    setVisiblePasswords(newVisiblePasswords);
  };

    const handleFormChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    if (field === 'senha') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  return (
    <View style={styles.container}>
      <Icon
        name={passwords.length > 0 ? 'unlock' : 'lock'}
        style={styles.backgroundIcon}
      />

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
          renderItem={({ item }) => {
            const isVisible = visiblePasswords.has(item.id);
            const strength = checkPasswordStrength(item.senha);
            return (
              <View style={styles.item}>
                <Text style={styles.itemText}>🔹 Serviço: {item.servico}</Text>
                <Text style={styles.itemText}>👤 Usuário: {item.usuario}</Text>
                <View style={styles.passwordRow}>
                  <Text style={styles.itemText}>
                    🔑 Senha: {isVisible ? item.senha : '••••••••'}
                  </Text>
                  <TouchableOpacity onPress={() => togglePasswordVisibility(item.id)}>
                    <Icon name={isVisible ? 'eye-slash' : 'eye'} size={20} color="#ccc" />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.strengthText, { color: strength.color }]}>
                  Força: {strength.label}
                </Text>
                <View style={styles.buttonGroup}>
                </View>
              </View>
            );
          }}
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
              onChangeText={(t) => handleFormChange('servico', t)}
              style={styles.input}
            />
            <TextInput
              placeholder="Usuário"
              placeholderTextColor="#888"
              value={formData.usuario}
              onChangeText={(t) => handleFormChange('usuario', t)}
              style={styles.input}
            />
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#888"
              value={formData.senha}
              onChangeText={(t) => handleFormChange('senha', t)}
              secureTextEntry // A senha no modal já estava segura
              style={styles.input}
            />
            {passwordStrength && passwordStrength.label && (
              <Text style={[styles.strengthText, { color: passwordStrength.color, marginBottom: 15, textAlign: 'center' }]}>
                Força: {passwordStrength.label}
              </Text>
            )}
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
    passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  strengthText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
});
