import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

const SignUp = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const signUp = async () => {
        if (password !== confirmPassword) {
            Toast.show({ type: "error", text1: "Passwords do not match" });
            return;
        }
        setLoading(true);
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            if (cred) router.replace("/(tabs)");
        } catch (error: any) {
            console.log(error);
            Toast.show({ type: "error", text1: "Error signing up", text2: error.message });
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                    placeholderTextColor="#A9A9A9"
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                    placeholderTextColor="#A9A9A9"
                />
                <TextInput
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={styles.input}
                    placeholderTextColor="#A9A9A9"
                />
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={signUp}>
                        <Text style={styles.buttonText}>Create Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.backButton]} onPress={goBack}>
                        <Text style={[styles.buttonText, styles.backButtonText]}>Back to Login</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#F5F5F5",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 40,
        color: "#333",
    },
    inputContainer: {
        width: "100%",
        marginBottom: 20,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 8,
        padding: 15,
        marginVertical: 10,
        fontSize: 16,
        width: "100%",
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
    },
    button: {
        backgroundColor: "#007BFF",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        width: "100%",
        marginVertical: 5,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    backButton: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#007BFF",
    },
    backButtonText: {
        color: "#007BFF",
    },
});

export default SignUp;
