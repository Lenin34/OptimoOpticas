import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { API_URL, useAuth } from '../context/AuthContext';
import { Download } from 'lucide-react-native';

interface Venta {
    idventa: string;
    cliente: string;
    fecha: { date: string } | string;
    total: string;
    Sucursal: string;
}

const formatFecha = (fecha: string) => {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const mes = meses[fechaObj.getMonth()];
    const anio = fechaObj.getFullYear();

    return `${dia}-${mes}-${anio}`;
};

const VentasScreen = () => {
    const { authState } = useAuth();
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVentas = async () => {
            try {
                if (!authState?.token || !authState?.user?.id) {
                    console.warn("No hay credenciales disponibles.");
                    setLoading(false);
                    return;
                }

                const response = await axios.post(
                    `${API_URL}/get-ventas-app`,
                    { idcliente: authState.user.id },
                    {
                        headers: {
                            Authorization: `Bearer ${authState.token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (Array.isArray(response.data)) {
                    setVentas(response.data);
                } else {
                    console.warn("La respuesta de la API no es un array:", response.data);
                    setVentas([]);
                }

            } catch (error) {
                console.error("Error obteniendo ventas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVentas();
    }, [authState]);

    const renderVenta = ({ item }: { item: Venta }) => {
        let fechaStr = "Fecha no disponible";

        if (typeof item.fecha === "string") {
            fechaStr = formatFecha(item.fecha);
        } else if (item.fecha && typeof item.fecha === "object" && "date" in item.fecha) {
            fechaStr = formatFecha(item.fecha.date);
        }
        console.log("🔍 Venta recibida en renderBoleto:", item);

        return (
            <View style={styles.card}>
                <Text style={styles.fecha}>FECHA: {fechaStr}</Text>
                <View style={styles.separator} />
                <View style={styles.infoContainer}>
                    <View style={styles.infoColumn}>
                        <Text style={styles.label}>SUCURSAL:</Text>
                        <Text style={styles.infoText}>{item.Sucursal}</Text>
                    </View>
                    <View style={styles.infoColumn}>
                        <Text style={styles.label}>CLIENTE:</Text>
                        <Text style={styles.infoText}>{item.cliente}</Text>
                    </View>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>TOTAL:</Text>
                    <Text style={styles.totalText}>${item.total}</Text>
                </View>
                <TouchableOpacity style={styles.downloadButton}>
                    <Text style={styles.downloadText}>DESCARGAR PDF</Text>
                    <Download color="white" size={18} />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <LinearGradient colors={['#111921', '#124DDE']} style={styles.gradient}>
            <Text style={styles.title}>HISTORIAL DE VENTAS</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#fff" />
            ) : ventas.length === 0 ? (
                <Text style={styles.noVentasText}>No tienes ventas registradas aún.</Text>
            ) : (
                <FlatList
                    data={ventas}
                    keyExtractor={(item) => item.idventa}
                    renderItem={renderVenta}
                    contentContainerStyle={styles.list}
                />
            )}
        </LinearGradient>
    );
};

export default VentasScreen;

const styles = StyleSheet.create({
    gradient: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
    title: { fontSize: 22, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 20 },
    list: { paddingBottom: 20 },
    card: {
        backgroundColor: '#5A5A5A',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
    },
    fecha: { fontSize: 16, fontWeight: 'bold', color: 'white', textAlign: 'center' },
    separator: { height: 1, backgroundColor: '#bbb', marginVertical: 8 },
    infoContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    infoColumn: { flex: 1 },
    label: { fontSize: 14, fontWeight: 'bold', color: 'white' },
    infoText: { fontSize: 14, color: 'white' },
    totalText: { fontSize: 14, fontWeight: 'bold', color: 'white' },
    downloadButton: {
        flexDirection: 'row',
        backgroundColor: 'green',
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    downloadText: { color: 'white', fontSize: 14, fontWeight: 'bold', marginRight: 5 },
    noVentasText: { color: 'white', fontSize: 18, textAlign: 'center', marginTop: 20 },
});
