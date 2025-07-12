import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Video } from 'expo-av';

const { height } = Dimensions.get('window');

const Index = () => {
    const slideAnimation = useRef(new Animated.Value(0)).current;

    const handleNavigate = (route: '/login' | '/signup') => {
        Animated.timing(slideAnimation, {
            toValue: -height,
            duration: 400,
            useNativeDriver: false,
        }).start(() => {
            router.push(route);
            slideAnimation.setValue(0);
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <Video
                source={{
                    uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                }}
                style={styles.backgroundVideo}
                shouldPlay
                isLooping
                isMuted
                resizeMode="cover"
                onError={e => console.log('VIDEO ERROR', e)}
            />
            <SafeAreaView style={styles.safeAreaContainer}>
                <Animated.View style={[styles.contentContainer, { transform: [{ translateY: slideAnimation }] }]}>
                    <Text style={styles.logo}>AgriSkills</Text>
                    <Text style={styles.subtitle}>
                        Upgrade your skills and be knowledgeable by watching videos anytime, anywhere, and any platform.
                    </Text>

                    <TouchableOpacity style={styles.loginButton} onPress={() => handleNavigate('/login')}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.createAccountButton} onPress={() => handleNavigate('/signup')}>
                        <Text style={styles.createAccountButtonText}>Create a new account</Text>
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: '100%',
        height: '100%',
    },
    safeAreaContainer: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingBottom: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Adds a dark overlay for text readability
    },
    logo: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    loginButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 18,
        borderRadius: 15,
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    loginButtonText: {
        color: '#333333',
        fontSize: 18,
        fontWeight: 'bold',
    },
    createAccountButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 18,
        borderRadius: 15,
        width: '100%',
        alignItems: 'center',
    },
    createAccountButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Index;
