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
import { checkPasswordStrength } from '../utils/passwordUtils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c2e',
    paddingHorizontal: 30,
    paddingTop: 100,
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
    marginBottom: 15, // Reduzido um pouco para dar espaço à força
    fontWeight: '500',
    width: '100%',
  },
  strengthText: { // Estilo para o texto de força da senha
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
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
  const [strength, setStrength] = useState(null);

const handleGenerate = () => {
    let newPass = '';
    let strengthResult = null;
    let attempts = 0; // Trava de segurança para evitar loop infinito

    // Continua gerando senhas até que a pontuação seja 4 (Forte) ou 5 (Muito Forte)
    while (true) {
      newPass = generatePassword(length);
      strengthResult = checkPasswordStrength(newPass);

      // Se a pontuação for >= 4, a senha é aceitável e o loop para.
      if (strengthResult.score >= 4) {
        break;
      }

      attempts++;
      // Se por algum motivo não conseguir gerar em 100 tentativas, avisa o usuário.
      if (attempts > 100) {
        Alert.alert(
          'Aviso',
          'Não foi possível gerar uma senha forte com o tamanho atual. Tente aumentar o comprimento.'
        );
        return;
      }
    }

    setPassword(newPass);
    setStrength(strengthResult);

    if (route.params?.addPassword) {
      route.params.addPassword(newPass);
    }
  };

  const handleCopy = () => {
    Clipboard.setStringAsync(password);
    Alert.alert('Copiado!', 'Senha copiada para a área de transferência.');
  };

  return (
    <View style={styles.container}>
      {/* Ícone de fundo suave */}
      <Icon name="lock" style={styles.backgroundLockIcon} />

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

      {/* --- EXIBIÇÃO DA FORÇA --- */}
      {strength && (
        <Text style={[styles.strengthText, { color: strength.color }]}>
          Força: {strength.label}
        </Text>
      )}

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
