
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
// @ts-ignore
import DefaultAvatar from '../../assets/duko.png';

const Profile = () => {
    const { authState, onLogout } = useAuth();
    const user = authState?.user;

    return (
        <View style={styles.container}>
            <LinearGradient
                            colors={['#124DDE', '#128CDE']}
                            style={styles.gradient}>

                <Image
                    source={DefaultAvatar}
                    style={styles.avatar}
                />

                <View style={styles.infoContainer}>
                    <Text style={styles.nameText}>{user?.name || 'Duko'}</Text>
                    <Text style={styles.emailText}>{user?.email || 'Sin email'}</Text>
                </View>


                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Rifas</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>8</Text>
                        <Text style={styles.statLabel}>Ganadas</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>5</Text>
                        <Text style={styles.statLabel}>Pendientes</Text>
                    </View>
                </View>


                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Editar Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                    <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        alignItems: 'center',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#fff',
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    nameText: {
        fontSize: 22,
        color: '#fff',
        fontWeight: 'bold',
    },
    emailText: {
        fontSize: 16,
        color: '#fff',
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    statItem: {
        alignItems: 'center',
        marginHorizontal: 15,
    },
    statValue: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 14,
        color: '#fff',
    },
    editButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    editButtonText: {
        color: '#000',
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: 'red',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 5,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
