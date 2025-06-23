import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem , DrawerContentComponentProps} from '@react-navigation/drawer';
import { useTheme, ThemeProvider } from '../components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import TabNavigator from './TabNavigator'; // Make sure this is defined as your bottom tab navigator
import { FavoritesProvider } from '../components/FavoritesContext';

const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation }: DrawerContentComponentProps) {
  const { theme } = useTheme();

  const navigateToTab = (tabName: string) => {
    navigation.navigate('Main', { screen: tabName });
  };

  return (
    <DrawerContentScrollView style={{ backgroundColor: theme.background }}>
      <DrawerItem
        label="Home"
        labelStyle={{ color: theme.text, fontWeight: 'bold' }}
        icon={({ size }) => <Ionicons name="home" size={size} color={theme.icon} />}
        onPress={() => navigateToTab('Home')}
      />
      <DrawerItem
        label="Search"
        labelStyle={{ color: theme.text, fontWeight: 'bold' }}
        icon={({ size }) => <Ionicons name="search" size={size} color={theme.icon} />}
        onPress={() => navigateToTab('Search')}
      />
      <DrawerItem
        label="Favourites"
        labelStyle={{ color: theme.text, fontWeight: 'bold' }}
        icon={({ size }) => <Ionicons name="heart" size={size} color={theme.icon} />}
        onPress={() => navigateToTab('Favourites')}
      />
      <DrawerItem
        label="Settings"
        labelStyle={{ color: theme.text, fontWeight: 'bold' }}
        icon={({ size }) => <Ionicons name="settings" size={size} color={theme.icon} />}
        onPress={() => navigateToTab('Settings')}
      />
    </DrawerContentScrollView>
  );
}

function DrawerLayout() {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      key={theme.mode}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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
        headerShown: false, 
      }}
    >
      <Drawer.Screen
        name="Main"
        component={TabNavigator}
        options={{ drawerLabel: 'Home' }}
      />
    </Drawer.Navigator>
  );
}

export default function AppLayout() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <DrawerLayout />
      </FavoritesProvider>
    </ThemeProvider>
  );
}
