import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SavePasswordScreen from './screens/SavePasswordScreen';
import PasswordGeneratorScreen from './screens/PasswordGeneratorScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [logado, setLogado] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={logado ? 'Home' : 'Login'}>
        {!logado ? (
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => <LoginScreen {...props} aoLogar={() => setLogado(true)} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SalvarSenha" component={SavePasswordScreen} />
            <Stack.Screen name="Gerador" component={PasswordGeneratorScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
