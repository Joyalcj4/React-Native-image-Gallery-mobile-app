import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home');
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Ionicons name="image-outline" size={80} color="#4a4e69" style={styles.logo} />
      <Text style={styles.title}>Gallery</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2e9e4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#22223b',
    letterSpacing: 2,
  },
}); 