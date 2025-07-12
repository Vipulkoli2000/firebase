import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Platform, FlatList } from "react-native";
import { WebView } from 'react-native-webview';
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { getDatabase, ref, onValue } from 'firebase/database';
import { router } from "expo-router";
import Toast from "react-native-toast-message";

const Dashboard = () => {
    const db = getDatabase();
    const [videos, setVideos] = useState<string[]>([]);
    const [loadingVideo, setLoadingVideo] = useState(true);

    useEffect(() => {
        const unsub = onValue(ref(db, 'videos'), snap => {
            const data = snap.val() || {};
            const list = Object.values<string>(data);
            setVideos(list.reverse()); // latest first
            setLoadingVideo(false);
        });
        return () => unsub();
    }, []);

    const renderShort = ({ item }: { item: string }) => (
        Platform.OS === 'web' ? (
            <View style={styles.videoWrapper}>
                {/* @ts-ignore */}
                <iframe
                    src={transformYoutubeUrl(item)}
                    style={{ width: '100%', height: '100%', borderWidth: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </View>
        ) : (
            <View style={styles.videoWrapper}>
                <WebView
                    source={{ uri: transformYoutubeUrl(item) }}
                    style={styles.webview}
                    javaScriptEnabled
                    allowsFullscreenVideo
                />
            </View>
        )
    );


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
            {loadingVideo ? (
                <ActivityIndicator style={{ flex: 1 }} />
            ) : (
                <FlatList
                    data={videos}
                    keyExtractor={(item, idx) => idx.toString()}
                    renderItem={renderShort}
                    pagingEnabled
                    showsVerticalScrollIndicator={false}
                />
            )}
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
    videoWrapper: { width: '100%', height: Dimensions.get('window').width * 0.56, marginBottom: 20 },
    webview: { flex: 1 },
});

const transformYoutubeUrl = (url: string) => {
    // convert https://www.youtube.com/watch?v=ID or youtu.be/ID to embed link
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)||youtu\.be\/)([\w-]{11})/;
    const match = url.match(regex);
    if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
};

export default Dashboard;
