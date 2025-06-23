import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../components/ThemeContext';

import HomeScreen from './(tabs)/home';
import SearchScreen from './(tabs)/search';
import FavouritesScreen from './(tabs)/favourites';
import SettingsScreen from './(tabs)/settings';

const Tab = createBottomTabNavigator();

function HeaderRight() {
  const { theme, toggleTheme } = useTheme();
  return (
    <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 16 }}>
      <Ionicons
        name={theme.mode === 'light' ? 'moon' : 'sunny'}
        size={24}
        color={theme.icon}
      />
    </TouchableOpacity>
  );
}

export default function TabNavigator() {
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      key={theme.mode}
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleAlign: 'center',
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 16 }}>
            <Ionicons name="menu" size={24} color={theme.icon} />
          </TouchableOpacity>
        ),
        headerRight: () => <HeaderRight />,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Search') iconName = 'search';
          else if (route.name === 'Favourites') iconName = 'heart';
          else if (route.name === 'Settings') iconName = 'settings';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.inactive,
        tabBarInactiveTintColor: theme.icon,
        tabBarStyle: { backgroundColor: theme.background },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favourites" component={FavouritesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
