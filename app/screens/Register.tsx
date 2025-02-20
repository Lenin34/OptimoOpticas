// Register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';


import type { RootStackParamList } from './navigation';


type RegisterScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Register'
>;

const Register = () => {
    const { onRegister } = useAuth();
    // Tipamos el hook para que TypeScript reconozca las rutas
    const navigation = useNavigation<RegisterScreenNavigationProp>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor, completa todos los campos');
            return;
        }

        const result = await onRegister!(email, password);
        if (result && result.error) {
            Alert.alert('Error', result.msg);
        } else {
            Alert.alert('Registro', '¡Registro exitoso!');
            // Navegar de regreso a la pantalla de Login
            navigation.navigate('Login');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crea tu cuenta</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Registrarme</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Register;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafd',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        marginBottom: 20,
        color: '#051d5f',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    button: {
        width: '100%',
        backgroundColor: '#2e64e5',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 5,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
    },
});
