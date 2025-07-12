import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

const Dashboard = () => {
    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace("/"); // go back to login
        } catch (error: any) {
            console.log(error);
            Toast.show({ type: "error", text1: "Error logging out", text2: error.message });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welcome to Dashboard</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E8F5E9",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 40,
        color: "#333",
    },
    button: {
        backgroundColor: "#A5D6A7",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    buttonText: {
        color: "#2E7D32",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Dashboard;
