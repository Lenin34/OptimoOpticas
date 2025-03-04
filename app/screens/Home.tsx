import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { API_URL, useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from './navigation';
import { LogOut, X, Ticket, ShoppingCart } from 'lucide-react-native';
import Modal from 'react-native-modal';

// @ts-ignore
import OptimoLogo from '../../assets/OptimoOpticas.png';
// @ts-ignore
import RifaImage from '../../assets/moto.png';
// @ts-ignore
import ProfilePicture from '../../assets/duko.png';

interface Venta {
    idventa: string;
    cliente: string;
    fecha: { date: string } | string;
    total: string;
}

const Home = () => {
    const { authState, onLogout } = useAuth();
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();

    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const result = await axios.get(`${API_URL}/me`);
                console.log('Usuario:', result.data);
            } catch (error) {
                console.error('Error en la API:', error);
            }
        };

        const fetchVentas = async () => {
            try {
                console.log("AuthState en useEffect:", authState);

                if (!authState?.token) {
                    console.warn("No hay token disponible, no se puede hacer la petición.");
                    setLoading(false);
                    return;
                }
                if (!authState?.user?.id) {
                    console.warn("No hay ID de usuario disponible, no se puede hacer la petición.");
                    setLoading(false);
                    return;
                }

                console.log("📢 Haciendo petición con ID de usuario:", authState.user.id);
                console.log(`URL de petición: ${API_URL}/get-ventas-app`);
                console.log(`Token usado: ${authState?.token}`);

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

                console.log("Respuesta de la API:", response.data);

                if (Array.isArray(response.data)) {
                    setVentas(response.data);
                } else {
                    console.warn("⚠La respuesta de la API no es un array:", response.data);
                    setVentas([]);
                }

            } catch (error) {
                // @ts-ignore
                console.error("Error obteniendo ventas:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        fetchVentas();
    }, [authState]); // Se ejecutará cuando cambie el estado de autenticación

    return (
        <LinearGradient colors={['#111921', '#124DDE']} style={styles.gradient}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <View style={styles.header}>
                    <Image source={OptimoLogo} style={styles.logo} />
                    <TouchableOpacity onPress={onLogout}>
                        <LogOut color="white" size={24} />
                    </TouchableOpacity>
                </View>

                <View style={styles.userInfo}>
                    <Text style={styles.greeting}>Hola, {authState?.user?.name || 'Usuario Invitado'}</Text>
                </View>

                <View style={styles.rifaContainer}>
                    <Image source={RifaImage} style={styles.rifaImage} />
                    <TouchableOpacity style={styles.verMasButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.verMasText}>VER MÁS</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardRow}>
                    <View style={styles.card}>
                        <Ticket color="yellow" size={32} />
                        <Text style={styles.cardTitle}>BOLETOS GANADOS</Text>
                        <Text style={styles.boletosCount}>{ventas.length}</Text>
                        <Text style={styles.cardSubtitle}>Por cada venta recibes boletos</Text>
                    </View>

                    <View style={styles.card}>
                        <ShoppingCart color="yellow" size={32} />
                        <Text style={styles.cardTitle}>COMPRAS</Text>
                        <Text style={styles.boletosCount}>{ventas.length}</Text>
                        <Text style={styles.cardSubtitle}>Historial de tus compras</Text>
                    </View>
                </View>

                <Modal isVisible={isModalVisible} animationIn="fadeInUp" animationOut="fadeOutDown">
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <X color="black" size={32} />
                        </TouchableOpacity>

                        <Image source={RifaImage} style={styles.modalImage} />
                        <Text style={styles.modalTitle}>¡NO PIERDAS ESTA OPORTUNIDAD!</Text>
                        <Text style={styles.modalDescription}>
                            Óptimo Ópticas te premia por tu confianza y preferencia.
                            Estos son los increíbles premios para ti:
                        </Text>


                        <Text style={styles.rifaInfo}>PRIMERA RIFA: 28 de marzo de 2025</Text>
                        <Text style={styles.rifaDetails}>1° LUGAR: Una moto</Text>
                        <Text style={styles.rifaDetails}>2° LUGAR: Un scooter</Text>
                        <Text style={styles.rifaDetails}>3° LUGAR: Un scooter</Text>

                        <Text style={styles.rifaInfo}>SEGUNDA RIFA: 28 de junio de 2025</Text>
                        <Text style={styles.rifaDetails}>1° LUGAR: Una moto</Text>
                        <Text style={styles.rifaDetails}>2° LUGAR: Un scooter</Text>
                        <Text style={styles.rifaDetails}>3° LUGAR: Un scooter</Text>
                    </View>
                </Modal>

            </ScrollView>
        </LinearGradient>
    );
};

export default Home;

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    scrollContainer: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 100 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    logo: { width: 120, height: 40, resizeMode: 'contain' },
    userInfo: { alignItems: 'center', marginTop: 30 },
    greeting: { color: '#FFF', fontSize: 18 },
    rifaContainer: { alignItems: 'center', marginTop: 20 },
    rifaImage: { width: '100%', height: 150, borderRadius: 10, resizeMode: 'contain' },
    verMasButton: { backgroundColor: 'yellow', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, marginTop: 5 },
    verMasText: { fontSize: 12, fontWeight: 'bold' },
    cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 45 },
    card: { backgroundColor: '#627192', flex: 1, marginHorizontal: 5, borderRadius: 10, padding: 15, alignItems: 'center' },
    cardTitle: { color: 'white', fontSize: 14, fontWeight: 'bold', marginBottom: 5, marginTop: 8 },
    boletosCount: { color: 'yellow', fontSize: 30, fontWeight: 'bold', marginVertical: 5 },
    cardSubtitle: { color: 'white', fontSize: 12, marginBottom: 10, textAlign: 'center' },
    detailButton: { backgroundColor: 'yellow', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, marginTop: 10 },
    detailButtonText: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
    modalContainer: { backgroundColor: '#ffffff', padding: 20, borderRadius: 10, alignItems: 'center'},
    modalImage: { width: '100%', height: 135, resizeMode: 'contain', borderRadius: 10, marginBottom: 10 },
    modalTitle: { color: '#000000', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
    modalDescription: { color: '#000000', fontSize: 14, textAlign: 'center', marginBottom: 15 },
    rifaInfo: { fontSize: 16, fontWeight: 'bold', marginTop: 10, color: '#000000' },
    rifaDetails: { color: '#000000', fontSize: 14 },
    closeButton: { position: 'absolute', top: 10, right: 4, padding: 5 },
});
