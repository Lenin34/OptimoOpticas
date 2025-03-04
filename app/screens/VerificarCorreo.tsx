import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from './navigation';
import { LinearGradient } from "expo-linear-gradient";
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { API_URL,useAuth } from '../context/AuthContext';

const VerificarCorreo = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'VerificarCorreo'>>();
    const route = useRoute();
    const { phone } = route.params as { phone: string };

    const [emailConv, setEmailConv] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);

    const sendVerificationCode = async () => {
        if (!emailConv.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Correo requerido',
                text2: 'Por favor, ingresa un correo electrónico válido.',
                position: 'bottom',
            });
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/send-verification-code`, {
                phone,
                email: emailConv,
            });

            if (response.status === 200) {
                setIsCodeSent(true);
                Toast.show({
                    type: 'success',
                    text1: 'Código enviado',
                    text2: 'Revisa tu correo para el código de verificación.',
                    position: 'bottom',
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error al enviar código',
                text2: 'Inténtalo de nuevo más tarde.',
                position: 'bottom',
            });
            console.error("Error al enviar el código:", error);
        }
    };

    const verifyCode = async () => {
        if (!verificationCode.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Código requerido',
                text2: 'Por favor, ingresa el código de verificación.',
                position: 'bottom',
            });
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/verify-code-update-email`, {
                phone,
                email: emailConv,
                code: verificationCode,
            });

            if (response.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Verificación exitosa',
                    text2: 'Tu correo ha sido confirmado.',
                    position: 'bottom',
                });

                setTimeout(() => {
                    navigation.navigate('Login');
                }, 2000);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Código incorrecto',
                text2: 'Por favor, revisa tu correo e ingresa el código correcto.',
                position: 'bottom',
            });
            console.error("Error al verificar código:", error);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#124DDE', '#128CDE']} style={StyleSheet.absoluteFill} />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Verificar Correo</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Correo Electrónico</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ingresa tu correo"
                        value={emailConv}
                        onChangeText={setEmailConv}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        textAlign="center"
                    />

                    <TouchableOpacity style={styles.button} onPress={sendVerificationCode}>
                        <Text style={styles.buttonText}>Enviar Código</Text>
                    </TouchableOpacity>
                </View>

                {isCodeSent && (
                    <View style={styles.card}>
                        <Text style={styles.label}>Código de Verificación</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingresa el código"
                            value={verificationCode}
                            onChangeText={setVerificationCode}
                            keyboardType="numeric"
                            maxLength={6}
                            textAlign="center"
                        />

                        <TouchableOpacity style={styles.button} onPress={verifyCode}>
                            <Text style={styles.buttonText}>Verificar Código</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
};

export default VerificarCorreo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 25,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        color: '#000',
        marginBottom: 4,
        textAlign: 'left',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        height: 38,
        backgroundColor: '#f9f9f9',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 14,
    },
    button: {
        width: '100%',
        backgroundColor: '#124DDE',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
});
