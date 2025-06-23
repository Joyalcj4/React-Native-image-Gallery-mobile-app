import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../../components/ThemeContext';
import { useFavorites } from '../../components/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

export default function FavouritesScreen() {
    const { theme } = useTheme();
    const { favorites, removeFavorite, isFavorite } = useFavorites();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedImageObj, setSelectedImageObj] = useState<any>(null);
    const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.3)).current;

    const animateIn = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true })
        ]).start();
    };
    const animateOut = (callback: () => void) => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 0.3, duration: 200, useNativeDriver: true })
        ]).start(callback);
    };
    const handleImagePress = (imageUrl: string) => {
        const imgObj = favorites.find(img => img.url_s === imageUrl) || null;
        setSelectedImage(imageUrl);
        setSelectedImageObj(imgObj);
        setIsImageViewerVisible(true);
        animateIn();
    };
    const handleCloseViewer = () => {
        animateOut(() => {
            setIsImageViewerVisible(false);
            setSelectedImage(null);
            setSelectedImageObj(null);
        });
    };
    const handleRemoveFavorite = () => {
        if (selectedImageObj) {
            removeFavorite(selectedImageObj.id);
            handleCloseViewer();
        }
    };
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}> 
            <FlatList
                data={favorites}
                keyExtractor={(item) => `${item.id}_${item.secret}_${item.server}`}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleImagePress(item.url_s)}>
                        <Image source={{ uri: item.url_s }} style={styles.image} />
                    </TouchableOpacity>
                )}
                numColumns={2}
                contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}
                ListEmptyComponent={<Text style={{ color: theme.text, marginTop: 20 }}>No favorites yet.</Text>}
            />
            {isImageViewerVisible && selectedImage && (
                <Animated.View 
                    style={[
                        styles.overlay,
                        { opacity: fadeAnim }
                    ]}
                >
                    <TouchableOpacity
                        style={styles.overlayClose}
                        onPress={handleCloseViewer}
                    >
                        <Ionicons name="close" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Animated.View
                        style={{
                            transform: [{ scale: scaleAnim }],
                            width: '90%',
                            height: '75%',
                        }}
                    >
                        <Image 
                            source={{ uri: selectedImage }} 
                            style={styles.fullImage}
                        />
                        {selectedImageObj && (
                            <TouchableOpacity
                                style={styles.favoriteBtn}
                                onPress={handleRemoveFavorite}
                            >
                                <Ionicons
                                    name={'heart'}
                                    size={32}
                                    color={'red'}
                                />
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 16 },
    heading: { fontSize: 28, fontWeight: 'bold', letterSpacing: 1, marginBottom: 16 },
    image: { width: 140, height: 140, margin: 8, borderRadius: 12 },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    overlayClose: {
        position: 'absolute',
        top: 40,
        right: 24,
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        padding: 6,
    },
    fullImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        borderRadius: 16,
    },
    favoriteBtn: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 24,
        padding: 10,
        zIndex: 1001,
    },
}); 