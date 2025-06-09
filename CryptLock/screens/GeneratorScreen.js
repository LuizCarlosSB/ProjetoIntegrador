import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Icon from 'react-native-vector-icons/FontAwesome';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c2e',
    paddingHorizontal: 30,
    paddingTop: 100,  // Mais espaço no topo para "baixar" os elementos
    alignItems: 'center',
  },
  backgroundLockIcon: {
    position: 'absolute',
    fontSize: 100,
    color: '#ffffff',
    opacity: 0.05,
    top: '40%',
    alignSelf: 'center',
    zIndex: -1,
  },
  topLockIcon: {
    fontSize: 60,
    color: '#ffffff',
    opacity: 0.15,
    marginBottom: 20,
    alignSelf: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 40,
    position: 'absolute',
    top: 40,
    right: 30,
    zIndex: 1,
  },
  logoutIcon: {
    padding: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
  },
  generatedPassword: {
    backgroundColor: '#2c2c3e',
    color: '#00e0b8',
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    fontWeight: '500',
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
  },
  buttonSecondary: {
    backgroundColor: '#4d4d5e',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  lengthControl: {
    marginBottom: 30,
    width: '100%',
  },
  lengthLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  lengthButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  lengthButton: {
    backgroundColor: '#2c2c3e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  lengthButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

function generatePassword(length = 16) {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export default function GeneratorScreen({ route, navigation }) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);

  const handleGenerate = () => {
    const newPass = generatePassword(length);
    setPassword(newPass);
    if (route.params?.addPassword) {
      route.params.addPassword(newPass);
    }
  };

  const handleCopy = () => {
    Clipboard.setStringAsync(password);
    Alert.alert('Copiado!', 'Senha copiada para a área de transferência.');
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.container}>
      {/* Ícone de fundo suave */}
      <Icon name="lock" style={styles.backgroundLockIcon} />

      {/* Botão de sair no topo direito */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
          <Icon name="sign-out" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Ícone de cadeado maior e mais opaco acima do título */}
      <Icon name="lock" style={styles.topLockIcon} />

      {/* Título */}
      <Text style={styles.title}>Gerador de Senhas</Text>

      {/* Controles de tamanho */}
      <View style={styles.lengthControl}>
        <Text style={styles.lengthLabel}>Tamanho: {length}</Text>
        <View style={styles.lengthButtons}>
          <TouchableOpacity
            style={styles.lengthButton}
            onPress={() => setLength(Math.max(8, length - 1))}
          >
            <Text style={styles.lengthButtonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.lengthButton}
            onPress={() => setLength(Math.min(32, length + 1))}
          >
            <Text style={styles.lengthButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Senha gerada */}
      <Text selectable style={styles.generatedPassword}>
        {password || 'Clique em Gerar'}
      </Text>

      {/* Botões */}
      <TouchableOpacity style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Gerar Senha</Text>
      </TouchableOpacity>

      {password !== '' && (
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleCopy}
        >
          <Text style={styles.buttonText}>Copiar para a Área de Transferência</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
