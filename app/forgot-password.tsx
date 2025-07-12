import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            Toast.show({ type: 'error', text1: 'Email required', text2: 'Please enter your email address.' });
            return;
        }
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            Toast.show({
                type: 'success',
                text1: 'Password Reset Email Sent',
                text2: 'Check your inbox for the reset link.',
            });
            router.back();
        } catch (error: any) {
            console.log(error);
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>Enter your email to receive a password reset link.</Text>

                <TextInput
                    placeholder="Enter your Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                    placeholderTextColor="#B0B0B0"
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#4A7C59" style={{ marginTop: 20 }} />
                ) : (
                    <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
                        <Text style={styles.resetButtonText}>Send Reset Link</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backLink}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F2F2',
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: 25,
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
        marginBottom: 20,
    },
    resetButton: {
        backgroundColor: '#4A7C59',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    resetButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backLink: {
        color: '#4A7C59',
        textAlign: 'center',
        marginTop: 20,
        fontWeight: 'bold',
    },
});

export default ForgotPassword;
