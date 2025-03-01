import React, { useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import axios from 'axios';
import { API_URL, useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import {LogOut} from "lucide-react-native";
import {useNavigation} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import type {RootStackParamList} from "./navigation";
// @ts-ignore
import ImageGroup from "../../assets/Group.png";
// @ts-ignore
import ImageRifa from "../../assets/rifa.jpg";
// @ts-ignore
import OptimoOpticas from "../../assets/OptimoOpticas.png";
const Home = () => {
    const { onLogout } = useAuth();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();


    useEffect(() => {
        const testCall = async () => {
            try {
                const result = await axios.get(`${API_URL}/me`);
                console.log('Lenoncini', result.data);
            } catch (error) {
                console.error('Error en la API:', error);
            }
        };
        testCall();
    }, []);


    const renderInfo = ({ item }: { item: Venta }) => {
        // 📌 Manejar la conversión de fecha
        let fechaStr = "Fecha no disponible";
        if (typeof item.fecha === "string") {
            fechaStr = item.fecha;
        } else if (item.fecha && typeof item.fecha === "object" && "date" in item.fecha) {
            fechaStr = item.fecha.date;
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
        <View style={styles.container}>
            <LinearGradient colors={['#124DDE', '#128CDE']} style={styles.gradient}>
                <Text style={styles.cliente}>Cliente: {item.cliente}</Text>
                <Image source={OptimoOpticas} style={styles.logoImage} />
                <LogOut size={20} style={styles.icon} onPress={onLogout}/>
                <Image source={ImageRifa} style={styles.logoRifa} />
            </LinearGradient>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        color: '#fff',
        fontSize: 24,
        marginBottom: 20,
    },
    logoutButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    logoutText: {
        color: '#000',
        fontSize: 16,
    },
    icon:{
        paddingLeft:200,
        color: '#fff',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoImage: {
        width: 150,
        height: 100,
        resizeMode: 'contain',
        paddingBottom:150,
    },
    logoRifa:{
        width: 400,
        height: 400,
        resizeMode: 'contain',
    }
});
