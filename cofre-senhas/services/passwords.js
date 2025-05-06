import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { encryptData, decryptData } from '../utils/crypto';

export const savePassword = async (userId, label, password) => {
  const encrypted = await encryptData(password);
  await setDoc(doc(db, 'users', userId, 'passwords', label), {
    password: encrypted,
    createdAt: new Date(),
  });
};

export const getPassword = async (userId, label) => {
  const docRef = doc(db, 'users', userId, 'passwords', label);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const encrypted = docSnap.data().password;
    return await decryptData(encrypted);
  } else {
    return null;
  }
};
