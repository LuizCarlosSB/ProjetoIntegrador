import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import VaultScreen from './screens/VaultScreen';
import GeneratorScreen from './screens/GeneratorScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const drawerStyles = {
  drawerStyle: {
    backgroundColor: '#1c1c2e',
  },
  drawerActiveTintColor: '#00e0b8',
  drawerInactiveTintColor: '#ccc',
  drawerLabelStyle: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerStyle: {
    backgroundColor: '#1c1c2e',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#1c1c2e', flex: 1 }}>
      <View style={styles.drawerHeader}>
        <Icon name="lock" size={50} color="#00e0b8" />
        <Text style={styles.drawerTitle}>CryptLock</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={drawerStyles}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Gerador de Senhas"
        component={GeneratorScreen}
        options={{
          drawerIcon: ({ color, size }) => <Icon name="bolt" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Cofre de Senhas"
        component={VaultScreen}
        options={{
          drawerIcon: ({ color, size }) => <Icon name="lock" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Drawer" component={DrawerNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 10,
  },
  drawerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
  },
});
