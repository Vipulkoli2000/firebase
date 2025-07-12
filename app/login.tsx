import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const signIn = async () => {
        setLoading(true);
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            if (cred) router.replace('/dashboard');
        } catch (error: any) {
            console.log(error);
            Toast.show({ type: 'error', text1: 'Error signing in', text2: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.headerContainer}></View>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Login</Text>
                <Text style={styles.subtitle}>Your journey is finally here</Text>

                <TextInput
                    placeholder="Username or Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                    placeholderTextColor="#B0B0B0"
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!passwordVisible}
                        style={styles.input}
                        placeholderTextColor="#B0B0B0"
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
                        <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="#B0B0B0" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                    <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>

                {loading ? (
                    <ActivityIndicator size="large" color="#4A7C59" style={{ marginTop: 20 }} />
                ) : (
                    <TouchableOpacity style={styles.loginButton} onPress={signIn}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have account? </Text>
                    <TouchableOpacity onPress={() => router.push('/signup')}>
                        <Text style={[styles.signupText, styles.signupLink]}>Create one!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F2F2',
    },
    headerContainer: {
        flex: 0.4,
        backgroundColor: '#4A7C59',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        flex: 0.6,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 25,
        paddingTop: 30,
        marginTop: -30, // To pull the form container up over the header
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        backgroundColor: '#F0F4F3',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        marginBottom: 15,
        width: '100%',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 15, // Adjust based on padding
    },
    forgotPassword: {
        color: '#4A7C59',
        textAlign: 'right',
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: '#4A7C59',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signupText: {
        color: '#666666',
        fontSize: 14,
    },
    signupLink: {
        color: '#4A7C59',
        fontWeight: 'bold',
    },
});

export default Login;
