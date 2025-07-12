import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig';
import { getDatabase, ref, set } from 'firebase/database';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

const SignUp = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    const signUp = async () => {
        if (!agreeToTerms) {
            Toast.show({ type: 'error', text1: 'Terms not accepted', text2: 'Please agree to the terms and conditions.' });
            return;
        }
        setLoading(true);
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            if (cred) {
                const db = getDatabase();
                const role = 'user';
                await set(ref(db, `users/${cred.user.uid}`), {
                    email,
                    role,
                    fullName,
                });
                router.replace('/dashboard');
            }
        } catch (error: any) {
            console.log(error);
            Toast.show({ type: 'error', text1: 'Error signing up', text2: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.headerContainer}></View>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Create Your Account</Text>
                <Text style={styles.subtitle}>Create your account to start your journey</Text>

                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    placeholder="Enter your full name"
                    value={fullName}
                    onChangeText={setFullName}
                    style={styles.input}
                    placeholderTextColor="#B0B0B0"
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder="Enter your email address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                    placeholderTextColor="#B0B0B0"
                />

                <Text style={styles.label}>Password</Text>
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

                <View style={styles.termsContainer}>
                    <TouchableOpacity onPress={() => setAgreeToTerms(!agreeToTerms)} style={styles.checkbox}>
                        {agreeToTerms && <Ionicons name="checkmark" size={20} color="#FFFFFF" />}
                    </TouchableOpacity>
                    <Text style={styles.termsText}>
                        I agree to the <Text style={styles.linkText}>Term & Conditions</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
                    </Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#4A7C59" style={{ marginTop: 20 }} />
                ) : (
                    <TouchableOpacity style={styles.signUpButton} onPress={signUp}>
                        <Text style={styles.signUpButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.signInContainer}>
                    <Text style={styles.signInText}>Already have account? </Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={[styles.signInText, styles.signInLink]}>Sign in</Text>
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
        flex: 0.3,
        backgroundColor: '#4A7C59',
    },
    formContainer: {
        flex: 0.7,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 25,
        paddingTop: 30,
        marginTop: -30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 25,
    },
    label: {
        fontSize: 14,
        color: '#333333',
        marginBottom: 5,
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
        top: 15,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        width: 24,
        height: 24,
        backgroundColor: '#4A7C59',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    termsText: {
        flex: 1,
        fontSize: 14,
        color: '#666666',
    },
    linkText: {
        color: '#4A7C59',
        fontWeight: 'bold',
    },
    signUpButton: {
        backgroundColor: '#4A7C59',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    signUpButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signInText: {
        color: '#666666',
        fontSize: 14,
    },
    signInLink: {
        color: '#4A7C59',
        fontWeight: 'bold',
    },
});

export default SignUp;
