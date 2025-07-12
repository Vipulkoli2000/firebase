import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebaseConfig';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

interface UserItem {
    uid: string;
    email: string;
    role?: string;
}

const Admin = () => {
    const db = getDatabase();
    const functions = getFunctions(app);
    const updateUser = httpsCallable(functions, 'updateUser');

    const [users, setUsers] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [selected, setSelected] = useState<UserItem | null>(null);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const unsub = onValue(ref(db, 'users'), snap => {
            const data = snap.val() ?? {};
            const list = Object.entries(data).map(([uid, v]: any) => ({ uid, ...(v as any) }));
            setUsers(list as UserItem[]);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const openEdit = (u: UserItem) => {
        setSelected(u);
        setNewEmail(u.email);
        setNewPassword('');
        setModalVisible(true);
    };

    const save = async () => {
        if (!selected) return;
        try {
            setSaving(true);
            await updateUser({ uid: selected.uid, newEmail, newPassword });
            Toast.show({ type: 'success', text1: 'User updated' });
            setModalVisible(false);
        } catch (err: any) {
            console.log(err);
            Toast.show({ type: 'error', text1: 'Error', text2: err.message });
        } finally {
            setSaving(false);
        }
    };

    const renderItem = ({ item }: { item: UserItem }) => (
        <TouchableOpacity style={styles.row} onPress={() => openEdit(item)}>
            <Text style={[styles.cell, { flex: 3 }]}>{item.email}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{item.role ?? 'user'}</Text>
        </TouchableOpacity>
    );

    if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>All Users</Text>
            <Text style={styles.subtitle}>Total users: {users.length}</Text>
            <FlatList
                data={users}
                keyExtractor={u => u.uid}
                renderItem={renderItem}
                ListHeaderComponent={() => (
                    <View style={styles.headerRow}>
                        <Text style={[styles.headerCell, { flex: 3 }]}>Email</Text>
                        <Text style={[styles.headerCell, { flex: 1 }]}>Role</Text>
                    </View>
                )}
            />

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalWrapper}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Edit user</Text>
                        <TextInput value={newEmail} onChangeText={setNewEmail} style={styles.input} placeholder="New email" />
                        <TextInput
                            value={newPassword}
                            onChangeText={setNewPassword}
                            style={styles.input}
                            placeholder="New password"
                            secureTextEntry
                        />
                        <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
                            <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default Admin;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 10 },
    headerRow: { flexDirection: 'row', backgroundColor: '#f0f0f0', paddingVertical: 8, paddingHorizontal: 10 },
    headerCell: { fontWeight: 'bold' },
    row: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderColor: '#ddd' },
    cell: {},
    modalWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0006' },
    modal: { width: '80%', backgroundColor: '#fff', padding: 20, borderRadius: 10 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginVertical: 8 },
    saveBtn: { backgroundColor: '#4A7C59', padding: 12, borderRadius: 6, marginTop: 10, alignItems: 'center' },
    saveText: { color: '#fff', fontWeight: 'bold' },
    cancelText: { textAlign: 'center', color: '#4A7C59', marginTop: 10 },
});
