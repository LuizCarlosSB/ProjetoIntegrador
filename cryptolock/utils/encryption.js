import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'saved_passwords';

// Função para "criptografar" (hash) a senha
async function encryptData(data) {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data
  );
}

// Salvar uma nova senha
export async function savePassword(title, password) {
  const encrypted = await encryptData(password);
  const existing = await getSavedPasswords();

  const newEntry = {
    id: uuidv4(),
    title,
    password: encrypted,
  };

  const updated = [...existing, newEntry];
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updated));
}

// Buscar todas as senhas salvas
export async function getSavedPasswords() {
  const raw = await SecureStore.getItemAsync(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

// Excluir uma senha por ID
export async function deletePassword(id) {
  const existing = await getSavedPasswords();
  const filtered = existing.filter((item) => item.id !== id);
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(filtered));
}

// Excluir todas as senhas
export async function clearPasswords() {
  await SecureStore.deleteItemAsync(STORAGE_KEY);
}
