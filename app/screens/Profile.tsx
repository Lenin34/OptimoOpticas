import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Pencil } from 'lucide-react-native';

// @ts-ignore
import DefaultAvatar from '../../assets/duko.png';

const Profile = () => {
    const { authState } = useAuth();
    const user = authState?.user;

    return (
        <LinearGradient colors={['#111921', '#124DDE']} style={styles.gradient}>
            <View style={styles.profileContainer}>

                {user?.profilePicture ? (
                    <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
                ) : (
                    <View style={styles.emptyAvatar} />
                )}


                <Text style={styles.name}>{user?.name || 'Nombre no disponible'}</Text>
                <Text style={styles.subtitle}>{user?.lastname || ''}</Text>
                <Text style={styles.phone}>{user?.phone || 'Número no disponible'}</Text>
                <Text style={styles.email}>{user?.email || 'Correo no disponible'}</Text>

                <Text style={styles.company}>{user?.company || 'Empresa no especificada'}</Text>
            </View>
        </LinearGradient>
    );
};

export default Profile;


const styles = StyleSheet.create({
    gradient: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    profileContainer: {
        backgroundColor: '#394867',
        borderRadius: 15,
        padding: 25,
        width: '100%',
        alignItems: 'center',
        elevation: 5,
    },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#fff', marginBottom: 10 },
    emptyAvatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#222', marginBottom: 10 },
    name: { fontSize: 22, fontWeight: 'bold', color: 'white', textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#ccc', textAlign: 'center', marginBottom: 10 },
    phone: { fontSize: 16, color: '#ffffff', textAlign: 'center' },
    email: { fontSize: 16, color: '#ffffff', textAlign: 'center', marginBottom: 15 },
    company: { fontSize: 18, fontWeight: 'bold', color: 'white', textAlign: 'center', marginTop: 10 },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6C63FF',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 15,
    },
    editButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginRight: 8 },
});
