import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';


/**
 * Definimos la interfaz que describe las propiedades
 * y métodos que tendrá nuestro AuthContext.
 */
interface AuthContextProps {
    /**
     * Representa el estado de autenticación actual.
     * - token: el token JWT (o null si no existe)
     * - authenticated: booleano para indicar si el usuario
     */
    authState?: {
        token: string | null;
        authenticated: boolean | null
    };

    /**
     * Función asíncrona para registrar un usuario nuevo.
     * Recibe un email y un password, y retorna una promesa.
     */
    onRegister?: (email: string, password: string) => Promise<any>;

    /**
     * Función asíncrona para iniciar sesión.
     * Recibe un email y un password, y retorna una promesa.
     */
    onLogin?: (email: string, password: string) => Promise<any>;

    /**
     * Función asíncrona para cerrar sesión.
     * Retorna una promesa.
     */
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "token";
export const API_URL = "http://localhost:8000/api";
const AuthContext = createContext<AuthContextProps>({})

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}: any) => {
    const [authState, setAuthState] = useState<{ token: string | null; authenticated: boolean | null }>({
        token: null,
        authenticated: null,
    });

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await SecureStore.getItemAsync(TOKEN_KEY);
                console.log("El token", token);
                if (token) {
                    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                    setAuthState({
                        token: token,
                        authenticated: true,
                    });
                }
            } catch (error) {
                console.log("No se :", error);
            }
        }
        loadToken();
    }, []);


    const register = async (email: string, password: string) => {
        try {
            // Se envían los datos al endpoint de registro en el backend
            return await axios.post(`${API_URL}/customers`, { email, password });
        } catch (error) {
            console.error("Error en registro:", error);
            return { error: true, msg: (error as any).response?.data?.message || "Error desconocido" };
        }
    }


    const login = async (email: string, password: string) => {
        try {
            const loginUrl = `${API_URL}/login_check`;
            console.log("Iniciando login, URL:", loginUrl);

            const result = await axios.post(loginUrl, { email, password });
            console.log("El resultado", result);
            setAuthState({
                token: result.data.token,
                authenticated: true,
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

            return result;

        } catch (error) {
            console.log("Error en login:", error);
            return { error: true, msg: (error as any).response?.data?.message || "Error desconocido" };
        }
    };


    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            axios.defaults.headers.common['Authorization'] = '';
            setAuthState({
                token: null,
                authenticated: false
            });
        } catch (error) {
            console.log("Error en logout:", error);
        }
    };


    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}



