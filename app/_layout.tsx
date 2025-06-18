import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './(tabs)/home';
import SplashScreen from './(tabs)/splash';
import { ThemeProvider, useTheme } from '../components/ThemeContext';

const Drawer = createDrawerNavigator();

function DrawerLayout() {
  const { theme } = useTheme();
  return (
    <Drawer.Navigator
      initialRouteName="Splash"
      screenOptions={{
        drawerStyle: {
          backgroundColor: theme.background,
          width: 220,
        },
        drawerActiveTintColor: theme.text,
        drawerInactiveTintColor: theme.accent,
        drawerLabelStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleAlign: 'center',
      }}
    >
      <Drawer.Screen
        name="Splash"
        component={SplashScreen}
        options={{ drawerItemStyle: { display: 'none' }, headerShown: false }}
      />
      <Drawer.Screen name="Home" component={HomeScreen} />
    </Drawer.Navigator>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <DrawerLayout />
    </ThemeProvider>
  );
} 