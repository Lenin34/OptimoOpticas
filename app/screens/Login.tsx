// Login.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useAuth } from "../context/AuthContext";
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Importamos nuestro RootStackParamList
import type { RootStackParamList } from "./navigation";

// Definimos el tipo específico de la navegación en "Login"
type LoginScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Login'
>;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { onLogin } = useAuth();

    // Tipamos el hook de navegación para que acepte las rutas definidas
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const login = async () => {
        console.log("Intentando iniciar sesión...");
        const result = await onLogin!(email, password);
        if (result && result.error) {
            Alert.alert("Error", result.msg);
            console.log("Error en login:", result.msg);
        } else {
            console.log("Inicio de sesión exitoso");
        }
    };

    const handleNavigateRegister = () => {
        // TypeScript ahora sabe que "Register" es una ruta válida
        navigation.navigate('Register');
    };

    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                source={{
                    uri: 'https://media.licdn.com/dms/image/v2/C560BAQFoumf7gTMNfg/company-logo_200_200/company-logo_200_200/0/1652460472603/grupo_optimo_logo?e=2147483647&v=beta&t=M821e5JT1Lhq7bi7BUmEbGlrGjrv-LrjkJE6_B-3qiM',
                }}
            />
            <Text style={styles.title}>Bienvenido</Text>

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={login}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.buttonRegister]}
                onPress={handleNavigateRegister}
            >
                <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafd',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
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
    buttonRegister: {
        backgroundColor: '#ff6347',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
    },
});
