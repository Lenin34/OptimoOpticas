import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Picker} from '@react-native-picker/picker';
import type {RootStackParamList} from './navigation';
import {LinearGradient} from "expo-linear-gradient";
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';

const Register = () => {
    const {onRegister} = useAuth();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Register'>>();

    const [selectedValue, setSelectedValue] = useState<'pub_general' | 'convenio' | 'vacio_'>('vacio_');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [passwordPub, setPasswordPub] = useState('');
    const [passwordConv, setPasswordConv] = useState('');
    const [phoneConv, setPhoneConv] = useState('');
    const [emailConv, setEmailConv] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [employeeNumber, setEmployeeNumber] = useState('');
    const [nameConv, setNameConv] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (isLoading) return;
        setIsLoading(true);

        console.log('Inicio de handleRegister', {
            selectedValue, name, email, phone, passwordPub,
            employeeNumber, passwordConv, selectedCompany, phoneConv
        });

        let payload;

        const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
        const isValidPhone = (phone: string) => /^[0-9]{10}$/.test(phone);

        if (selectedValue === 'pub_general') {
            if (!name || !email || !phone || !passwordPub) {
                Toast.show({ type: 'info', text1: 'Cuidado', text2: 'Todos los campos son obligatorios', position: 'bottom' });
                setIsLoading(false);
                return;
            }

            if (!isValidEmail(email)) {
                Toast.show({ type: 'error', text1: 'Correo inválido', text2: 'Ingresa un correo válido', position: 'bottom' });
                setIsLoading(false);
                return;
            }

            if (!isValidPhone(phone)) {
                Toast.show({ type: 'error', text1: 'Número inválido', text2: 'Debe tener 10 dígitos', position: 'bottom' });
                setIsLoading(false);
                return;
            }

            if (passwordPub.length < 6) {
                Toast.show({ type: 'error', text1: 'Contraseña débil', text2: 'Debe tener al menos 6 caracteres', position: 'bottom' });
                setIsLoading(false);
                return;
            }

            payload = { name, email, number: phone, password: passwordPub };

        } else if (selectedValue === 'convenio') {
            if (!nameConv || !employeeNumber || !passwordConv || !selectedCompany || !phoneConv) {
                Toast.show({ type: 'info', text1: 'Cuidado', text2: 'Todos los campos son obligatorios en convenio', position: 'bottom' });
                setIsLoading(false);
                return;
            }

            if (!isValidPhone(phoneConv)) {
                Toast.show({ type: 'error', text1: 'Número inválido', text2: 'Debe tener 10 dígitos', position: 'bottom' });
                setIsLoading(false);
                return;
            }

            if (emailConv && !isValidEmail(emailConv)) {
                Toast.show({ type: 'error', text1: 'Correo inválido', text2: 'Ingresa un correo válido', position: 'bottom' });
                setIsLoading(false);
                return;
            }

            if (passwordConv.length < 6) {
                Toast.show({ type: 'error', text1: 'Contraseña débil', text2: 'Debe tener al menos 6 caracteres', position: 'bottom' });
                setIsLoading(false);
                return;
            }

            payload = {
                name: nameConv,
                email: emailConv || null,
                number: phoneConv,
                password: passwordConv,
                company: selectedCompany,
                employeeNumber: employeeNumber,
            };
        } else {
            Toast.show({ type: 'info', text1: 'Aviso', text2: 'Selecciona el tipo de usuario', position: 'bottom' });
            setIsLoading(false);
            return;
        }

        console.log('Payload preparado:', payload);

        try {
            const result = await onRegister!(payload);
            console.log('Resultado de onRegister:', result);

            if (result?.msg === 'Un usuario de convenio ya existe con ese número de teléfono') {
                Toast.show({
                    type: 'info',
                    text1: 'Usuario encontrado',
                    text2: 'Ingresa tu correo para continuar',
                    position: 'bottom',
                });

                navigation.navigate("VerificarCorreo", { phone: phoneConv || phone });
                setIsLoading(false);
                return;
            }

            Toast.show({
                type: 'success',
                text1: 'Registro exitoso',
                text2: 'Redirigiendo...',
                visibilityTime: 2000,
                position: 'bottom',
            });

            setTimeout(() => {
                navigation.navigate('Login');
                setIsLoading(false);
            }, 2500);

        } catch (error) {
            console.error('Error en el proceso de registro:', error);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Ocurrió un error durante el registro', position: 'bottom' });
            setIsLoading(false);
        }
    };



    return (
        <View style={styles.container}>
            <LinearGradient
                            colors={['#124DDE', '#128CDE']}
                            style={StyleSheet.absoluteFill} />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>REGISTRO</Text>

                <View style={styles.card}>
                    <Text style={styles.labelOne}>TIPO DE USUARIO</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedValue}
                            onValueChange={(itemValue) => setSelectedValue(itemValue)}
                            style={styles.picker}
                            dropdownIconColor="#000"
                        >
                            <Picker.Item label="Selecciona un tipo de Usuario" value="vacio_" />
                            <Picker.Item label="Público en General" value="pub_general" />
                            <Picker.Item label="Convenio" value="convenio" />
                        </Picker>
                    </View>
                </View>


                {selectedValue === 'pub_general' && (
                    <View style={styles.card}>
                        <Text style={styles.labelTwo}>NOMBRE</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre"
                            value={name}
                            onChangeText={setName}
                            textAlign="center"
                        />

                        <Text style={styles.labelTwo}>CORREO ELECTRÓNICO</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Correo electrónico"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            textAlign="center"
                        />

                        <Text style={styles.labelTwo}>NÚMERO DE TELÉFONO</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Número de teléfono"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            textAlign="center"
                        />

                        <Text style={styles.labelTwo}>CONTRASEÑA</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            value={passwordPub}
                            onChangeText={setPasswordPub}
                            secureTextEntry
                            textAlign="center"
                        />
                    </View>
                )}

                {selectedValue === 'convenio' && (
                    <View style={styles.card}>
                        <Text style={styles.labelTwo}>EMPRESA</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedCompany}
                                onValueChange={(itemValue) => setSelectedCompany(itemValue)}
                                style={styles.picker}
                                dropdownIconColor="#000"
                            >
                                <Picker.Item label="Selecciona tu Empresa" value="" />
                                <Picker.Item label="Optimo" value="Opt" />
                                <Picker.Item label="UAM" value="uam" />
                            </Picker>
                        </View>

                        <Text style={styles.labelTwo}>NOMBRE</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre"
                            value={nameConv}
                            onChangeText={setNameConv}
                            textAlign="center"
                        />

                        <Text style={styles.labelTwo}>NÚMERO DE EMPLEADO</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Número de empleado"
                            value={employeeNumber}
                            onChangeText={setEmployeeNumber}
                            keyboardType="phone-pad"
                            textAlign="center"
                        />

                        <Text style={styles.labelTwo}>NÚMERO DE TELÉFONO</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Número de teléfono"
                            value={phoneConv}
                            onChangeText={setPhoneConv}
                            keyboardType="phone-pad"
                            textAlign="center"
                        />

                        <Text style={styles.labelTwo}>CORREO ELECTRÓNICO</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Correo (opcional)"
                            value={emailConv}
                            onChangeText={setEmailConv}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            textAlign="center"
                        />

                        <Text style={styles.labelTwo}>CONTRASEÑA</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            value={passwordConv}
                            onChangeText={setPasswordConv}
                            secureTextEntry
                            textAlign="center"
                        />
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Procesando...' : 'Registrarme'}
                    </Text>
                </TouchableOpacity>

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
};

export default Register;

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
    labelOne: {
        fontSize: 16,
        color: '#000',
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: '600',
    },
    labelTwo: {
        fontSize: 14,
        color: '#000',
        marginBottom: 4,
        textAlign: 'left',
        fontWeight: '500',
    },
    pickerContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 12,
        width: '100%',
        height: 50,
        justifyContent: 'center',
    },
    picker: {
        width: '100%',
        height: 50,
        color: '#000',
        fontSize: 14,
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
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
        fontWeight: '600',
    },
    buttonDisabled: {
        backgroundColor: '#aaa',
    }
});
