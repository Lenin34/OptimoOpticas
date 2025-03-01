import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// @ts-ignore
import ImageGroup from "../../assets/Group.png";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Venta {
    idventa: string;
    cliente: string;
    fecha: { date: string } | string; // Manejo de estructura de fecha
    total: string;
}

const API_URL = "http://192.168.200.216:8000/cliente-api";

const RifaScreen = () => {
    const { authState } = useAuth();
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVentas = async () => {
            try {
                console.log("🔹 AuthState en useEffect:", authState);

                if (!authState?.token) {
                    console.warn("⛔ No hay token disponible, no se puede hacer la petición.");
                    setLoading(false);
                    return;
                }
                if (!authState?.user?.id) {
                    console.warn("⛔ No hay ID de usuario disponible, no se puede hacer la petición.");
                    setLoading(false);
                    return;
                }

                console.log("📢 Haciendo petición con ID de usuario:", authState.user.id);
                console.log(`📌 URL de petición: ${API_URL}/get-ventas-app`);
                console.log(`📌 Token usado: ${authState?.token}`);

                const response = await axios.post(
                    `${API_URL}/get-ventas-app`,
                    { idcliente: authState.user.id }, // Asegurar que el body tiene el ID
                    {
                        headers: {
                            Authorization: `Bearer ${authState.token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                console.log("✅ Respuesta de la API:", response.data);

                if (Array.isArray(response.data)) {
                    setVentas(response.data);
                } else {
                    console.warn("⚠️ La respuesta de la API no es un array:", response.data);
                    setVentas([]);
                }

            } catch (error) {
                // @ts-ignore
                console.error("❌ Error obteniendo ventas:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVentas();
    }, [authState]);

    const renderBoleto = ({ item }: { item: Venta }) => {
        // 📌 Manejar la conversión de fecha
        let fechaStr = "Fecha no disponible";
        if (typeof item.fecha === "string") {
            fechaStr = item.fecha;
        } else if (item.fecha && typeof item.fecha === "object" && "date" in item.fecha) {
            fechaStr = item.fecha.date; // Extraer la fecha si está en formato de objeto
        }

        return (
            <View style={styles.card}>
                <Text style={styles.ticketNumber}>🎟️ Boleto: {item.idventa}</Text>
                <Text style={styles.cliente}>Cliente: {item.cliente}</Text>
                <Text style={styles.fecha}>📅 {fechaStr}</Text>
                <Text style={styles.total}>💲 Total: {item.total}</Text>
            </View>
        );
    };

    return (
        <LinearGradient
            colors={['#124DDE', '#128CDE']}
            style={styles.gradient}>
            <View style={styles.logoContainer}>
                <Image source={ImageGroup} style={styles.logoImage} />
            </View>

            <Text style={styles.title}>RIFA - BOLETOS GENERADOS</Text>

            {
                loading ? (<ActivityIndicator size="large" color="#fff" />) : ventas.length === 0 ?
                    (<Text style={styles.noVentasText}>No tienes ventas registradas aún.</Text>) :
                    (
                        <FlatList
                    data={ventas}
                    keyExtractor={(item) => item.idventa}
                    renderItem={renderBoleto}
                    contentContainerStyle={styles.list}
                        />
                    )}

        </LinearGradient>
    );
};

export default RifaScreen;

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    logoContainer: { alignItems: 'center', paddingTop: 20, paddingBottom: 10 },
    logoImage: { width: 120, height: 80, resizeMode: 'contain' },
    title: { fontSize: 22, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 10 },
    list: { paddingBottom: 20 },
    card: { backgroundColor: '#444', borderRadius: 10, padding: 12, marginBottom: 10, alignItems: 'center' },
    ticketNumber: { fontSize: 18, fontWeight: 'bold', color: 'white' },
    cliente: { fontSize: 14, color: '#bbb' },
    fecha: { fontSize: 14, color: '#bbb' },
    total: { fontSize: 14, fontWeight: 'bold', color: '#0d6efd' },
    noVentasText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});
