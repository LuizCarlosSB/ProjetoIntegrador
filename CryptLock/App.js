import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import LoginScreen from './screens/LoginScreen';
import VaultScreen from './screens/VaultScreen';
import GeneratorScreen from './screens/GeneratorScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator({ passwords, addPassword, deletePassword }) {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#6200ee' },
        headerTintColor: '#fff',
      }}
    >
      <Drawer.Screen name="Gerador de Senhas">
        {(props) => <GeneratorScreen {...props} addPassword={addPassword} />}
      </Drawer.Screen>
      <Drawer.Screen name="Cofre de Senhas">
        {(props) => <VaultScreen {...props} passwords={passwords} deletePassword={deletePassword} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

export default function App() {
  const [passwords, setPasswords] = useState([]);

  const addPassword = (pass) => {
    setPasswords([pass, ...passwords]);
  };

  const deletePassword = (index) => {
    const newPasswords = [...passwords];
    newPasswords.splice(index, 1);
    setPasswords(newPasswords);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Drawer">
          {() => <DrawerNavigator 
            passwords={passwords} 
            addPassword={addPassword} 
            deletePassword={deletePassword} 
          />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}