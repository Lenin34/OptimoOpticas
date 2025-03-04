import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { API_URL,useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import {normalizeBodyInitAsync} from "expo/build/winter/fetch/RequestUtils";


const Profile = () => {
    const { authState } = useAuth();
    const user = authState?.user;

    // Estados para el formulario
    const [name, setName] = useState(user?.name || '');
    const [lastName, setLastName] = useState(user?.lastname || '');
    const [surName, setSurName] = useState(user?.surname || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        try {

            const response = await fetch(`${API_URL}/update-profile-app`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // @ts-ignore
                    Authorization: `Bearer ${authState.token}`
                },
                body: JSON.stringify({
                    name,
                    lastname: lastName,
                    surname: surName,
                    phone,
                    email
                })
            });

            const result = await response.json();
            console.log("✅ Respuesta del servidor:", result);

            if (!response.ok) {
                throw new Error(result.message || "Error al actualizar perfil");
            }

            alert("Perfil actualizado con éxito");
        } catch (error) {
            console.error("❌ Error actualizando perfil:", error);
            alert("Hubo un error al actualizar el perfil");
        }
    };


    return (
        <LinearGradient colors={['#111921', '#124DDE']} style={styles.gradient}>
            <View style={styles.profileContainer}>
                <Text style={styles.title}>Perfil</Text>

                <Text style={styles.label}>Nombre:</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre" placeholderTextColor="#aaa" />

                <Text style={styles.label}>Apellido Paterno:</Text>
                <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Apellido Paterno" placeholderTextColor="#aaa" />

                <Text style={styles.label}>Apellido Materno:</Text>
                <TextInput style={styles.input} value={surName} onChangeText={setSurName} placeholder="Apellido Materno" placeholderTextColor="#aaa" />

                <Text style={styles.label}>Teléfono:</Text>
                <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Teléfono" keyboardType="phone-pad" placeholderTextColor="#aaa" />

                <Text style={styles.label}>Correo:</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Correo" keyboardType="email-address" placeholderTextColor="#aaa" />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                    <Text style={styles.saveButtonText}>{loading ? "Guardando..." : "Guardar Cambios"}</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default Profile;

const styles = StyleSheet.create({
    gradient: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    profileContainer: { backgroundColor: '#394867', borderRadius: 15, padding: 25, width: '100%', alignItems: 'center', elevation: 5 },
    title: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 10 },
    label: { fontSize: 16, color: 'white', alignSelf: 'flex-start', marginBottom: 5 },
    input: { width: '100%', backgroundColor: '#fff', borderRadius: 8, padding: 10, fontSize: 16, color: '#000', marginBottom: 15 },
    saveButton: { backgroundColor: '#6C63FF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginTop: 15 },
    saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
