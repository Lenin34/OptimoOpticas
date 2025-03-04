import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useAuth } from "../context/AuthContext";
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';

import type { RootStackParamList } from "./navigation";
// @ts-ignore
import ImageGroup from '../../assets/Optimo.png';
// @ts-ignore
import Iris from '../../assets/IrisCristal.png';

type LoginScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList, 'Login'
>;

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { onLogin } = useAuth();
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const login = async () => {
        const result = await onLogin!(usuario, password);
        if (result && result.error) {
            alert(result.msg);
        } else {
            console.log("Inicio de sesión exitoso");
        }
    };

    const handleNavigateRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#124DDE', '#128CDE']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.logoContainer}>
                <Image source={ImageGroup} style={styles.logoImage} />
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.label}>USUARIO</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Correo Electrónico"
                        placeholderTextColor="#666"
                        value={usuario}
                        onChangeText={setUsuario}
                        autoCapitalize="none"
                        textAlign="center"
                    />
                </View>

                <Text style={styles.label}>CONTRASEÑA</Text>

                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Contraseña"
                        placeholderTextColor="#666"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        textAlign="center"
                    />

                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={22}
                            color="#000"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={login}>
                    <Text style={styles.loginButtonText}>INGRESAR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ marginTop: 15 }}
                    onPress={() => alert('Función para recuperar contraseña')}
                >
                    <Text style={styles.forgotText}>Olvidé mi contraseña</Text>
                </TouchableOpacity>

                <View style={styles.registerContainer}>
                    <Text style={styles.registerLabel}>¿No tienes cuenta? </Text>
                    <TouchableOpacity onPress={handleNavigateRegister}>
                        <Text style={styles.registerLink}>Regístrate</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Image source={Iris} style={styles.irisImage} />
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    formContainer: {
        flexGrow: 2,
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 10,
    },
    logoContainer: {
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:80,
    },
    logoImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    label: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 5,
        alignItems: 'center',
        paddingBottom: 15,
    },
    inputWrapper: {
        width: '100%',
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#ccc',
        height: 45,
        fontSize: 16,
    },
    passwordInput: {
        backgroundColor: '#FFF',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#ccc',
        height: 45,
        fontSize: 16,
        paddingRight: 40,
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
        paddingHorizontal: 10,
    },
    loginButton: {
        backgroundColor: '#7589A2',
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 40,
        marginTop: 10,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    forgotText: {
        color: '#fff',
        textDecorationLine: 'underline',
        fontSize: 14,
    },
    registerContainer: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
    },
    registerLabel: {
        color: '#fff',
        fontSize: 14,
    },
    registerLink: {
        color: '#9FE6BC',
        fontWeight: 'bold',
        fontSize: 14,
    },
    irisImage: {
        width: 260,
        height: 260,
        resizeMode: 'contain',
        alignSelf: 'center',
        paddingBottom: 10,
    },
});
