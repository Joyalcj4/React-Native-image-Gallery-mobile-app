import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
    const { theme, toggleTheme } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}> 
            <View style={styles.optionRow}>
                <Ionicons name={theme.mode === 'light' ? 'sunny' : 'moon'} size={24} color={theme.icon} style={{ marginRight: 12 }} />
                <Text style={[styles.optionLabel, { color: theme.text }]}>Theme: {theme.mode === 'light' ? 'Light' : 'Dark'}</Text>
                <TouchableOpacity onPress={toggleTheme} style={styles.toggleBtn}>
                    <Text style={{ color: theme.accent, fontWeight: 'bold' }}>Toggle</Text>
                </TouchableOpacity>
            </View>
            <Text style={[styles.info, { color: theme.text }]}>Settings Page is not implemented completely</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 32 },
    heading: { fontSize: 28, fontWeight: 'bold', letterSpacing: 1, marginBottom: 24 },
    optionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 12, padding: 16 },
    optionLabel: { fontSize: 18, flex: 1 },
    toggleBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.08)' },
    info: { fontSize: 18, marginTop: 24, textAlign: 'center' },
}); 