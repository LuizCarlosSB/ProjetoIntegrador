import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';

const SECRET_KEY_NAME = 'aes-key';

export async function getSecretKey() {
  let key = await SecureStore.getItemAsync(SECRET_KEY_NAME);

  if (!key) {
    key = CryptoJS.lib.WordArray.random(32).toString();
    await SecureStore.setItemAsync(SECRET_KEY_NAME, key);
  }

  return key;
}

export async function encryptData(data) {
  const key = await getSecretKey();
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  return ciphertext;
}

export async function decryptData(ciphertext) {
  const key = await getSecretKey();
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
}
