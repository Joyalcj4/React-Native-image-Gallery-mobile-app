import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, Image, ActivityIndicator, StyleSheet, RefreshControl, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import { useFavorites } from '../../components/FavoritesContext';

const API_URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s';

type FlickrImage = {
    id: string;
    url_s: string;
    secret: string;
    server: string;
};

export default function HomeScreen({ navigation }: any) {
    const [images, setImages] = useState<FlickrImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isImageViewerVisible, setIsImageViewerVisible] = useState(false)
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.3)).current;

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [retryAction, setRetryAction] = useState<null | (() => void)>(null);

    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const [selectedImageObj, setSelectedImageObj] = useState<FlickrImage | null>(null);

    const animateIn = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            })
        ]).start();
    };

    const animateOut = (callback: () => void) => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.3,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(callback);
    };

    const handleImagePress = (imageUrl: string) => {
        const imgObj = images.find(img => img.url_s === imageUrl) || null;
        setSelectedImage(imageUrl);
        setSelectedImageObj(imgObj);
        setIsImageViewerVisible(true);
        animateIn();
    };

    const handleCloseViewer = () => {
        animateOut(() => {
            setIsImageViewerVisible(false);
            setSelectedImage(null);
        });
    };

    const handleFavoriteToggle = () => {
        if (selectedImageObj) {
            isFavorite(selectedImageObj.id)
                ? removeFavorite(selectedImageObj.id)
                : addFavorite(selectedImageObj);
        }
    };

    const fetchImages = async (pageNum = 1, append = false) => {
        try {
            const url = `https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=${pageNum}&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s,secret,server`;
            const res = await fetch(url);
            const json = await res.json();
            const newImages = json.photos.photo;
            if (append) {
                setImages(prev => [...prev, ...newImages]);
            } else {
                setImages(newImages);
            }
            await AsyncStorage.setItem('cachedImages', JSON.stringify(newImages));
        } catch (err) {
            setSnackbarMsg('Network error. Please try again.');
            setSnackbarVisible(true);
            setRetryAction(() => () => fetchImages(pageNum, append));
            const cached = await AsyncStorage.getItem('cachedImages');
            const cachedData = cached ? JSON.parse(cached) : [];
            if (!append) setImages(cachedData);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchImages(1);
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchImages();
    };

    const loadMore = () => {
        if (!loadingMore && !loading) {
            setLoadingMore(true);
            const nextPage = page + 1;
            setPage(nextPage);
            fetchImages(nextPage, true);
        }
    };


    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {loading ? (
                <ActivityIndicator size="large" color={theme.accent} />
            ) : (
                <FlatList
                    data={images}
                    keyExtractor={(item) => `${item.id}_${item.secret}_${item.server}`}
                    renderItem={({ item }) => (
                        <View style={[styles.imageWrapper, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
                            <TouchableOpacity onPress={() => handleImagePress(item.url_s)}>
                                <Image source={{ uri: item.url_s }} style={styles.image} />
                            </TouchableOpacity>
                        </View>
                    )}
                    numColumns={2}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    contentContainerStyle={[styles.list, { paddingBottom: 80 }]}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color={theme.accent} /> : null}
                />
            )}
            {isImageViewerVisible && selectedImage && (
                <Animated.View 
                    style={[
                        styles.overlay,
                        {
                            opacity: fadeAnim,
                        }
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
                                onPress={handleFavoriteToggle}
                            >
                                <Ionicons
                                    name={isFavorite(selectedImageObj.id) ? 'heart' : 'heart-outline'}
                                    size={32}
                                    color={isFavorite(selectedImageObj.id) ? 'red' : '#fff'}
                                />
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                </Animated.View>
            )}
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                action={{ label: 'RETRY', onPress: () => { setSnackbarVisible(false); retryAction && retryAction(); } }}
                duration={3000}
            >
                {snackbarMsg}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
        paddingHorizontal: 8,
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        alignSelf: 'center',
        letterSpacing: 1,
    },
    imageWrapper: {
        flex: 1,
        margin: 6,
        borderRadius: 14,
        overflow: 'hidden',
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    image: {
        width: '100%',
        height: 170,
        borderRadius: 14,
    },
    list: {
        paddingBottom: 16,
    },
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

    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    footerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: '100%',
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 8,
    },
    footerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    footerButtonText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    footerIcon: {
        marginRight: 4,
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
