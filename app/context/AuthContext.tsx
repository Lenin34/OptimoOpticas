import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';


/**
 * 📌 Interfaz que describe las propiedades y métodos del AuthContext.
 */
interface AuthContextProps {
    authState?: {
        token: string | null;
        authenticated: boolean | null;
        user?: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<void>;
    onRegister?: (payload: RegisterPayload) => Promise<any>;
}

interface RegisterPayload {
    name: string;
    email: string | null;
    number: string;
    password: string;
    company?: string;
    employeeNumber?: string;
}

const TOKEN_KEY = "token";
const USER_KEY = "user";
export const API_URL = "https://sistema.optimoopticas.mx/cliente-api";


const AuthContext = createContext<AuthContextProps>({});

/**
 *  Hook personalizado para acceder al contexto de autenticación.
 */
export const useAuth = () => {
    return useContext(AuthContext);
};

/**
 *  Proveedor de autenticación que gestiona el estado global del usuario.
 */
export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{ token: string | null; authenticated: boolean | null; user: any | null }>({
        token: null,
        authenticated: null,
        user: null,
    });


    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await SecureStore.getItemAsync(TOKEN_KEY);
                const user = await SecureStore.getItemAsync(USER_KEY);

                console.log("Token almacenado:", token);
                console.log("Usuario almacenado:", user);

                if (token && user) {
                    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                    setAuthState({
                        token: token,
                        authenticated: true,
                        user: JSON.parse(user),
                    });
                } else {
                    setAuthState({ token: null, authenticated: false, user: null });
                }
            } catch (error) {
                console.log("Error al cargar el token:", error);
                setAuthState({ token: null, authenticated: false, user: null });
            }
        };
        loadToken();
    }, []);

    /**
     *  Registrar usuario.
     */
    const register = async (payload: RegisterPayload) => {
        try {
            return await axios.post(`${API_URL}/me`, payload);
        } catch (error) {
            console.error("Error en registro:", error);
            return { error: true, msg: (error as any).response?.data?.message };
        }
    };



    const login = async (email: string, password: string) => {
        try {
            console.log("Iniciando login con:", { email, password });
            console.log("URL", `${API_URL}/login_check`);

            // 1) Petición de login para obtener el token
            const loginResponse = await axios.post(`${API_URL}/login_check`, { email, password });
            console.log("Respuesta de login_check:", loginResponse.data);

            let { token } = loginResponse.data;
            if (!token) {
                console.log("No se recibió token en la respuesta de login_check");
                return { error: true, msg: "No se pudo iniciar sesión (sin token)" };
            }
            console.log("Token recibido:", token);


            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;


            const config = {
                method: "GET",
                maxBodyLength: Infinity,
                url: `${API_URL}/me`,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json; charset=UTF-8",
                },
            };


            let user;
            try {
                const meResponse = await axios.request(config);
                console.log('Lenon de la ruta  /me:', meResponse.data);
                user = meResponse.data;
            } catch (error) {
                // @ts-ignore
                console.log("Error al obtener el usuario en /me:", error.response?.data || error.message);
                return { error: true, msg: "Error al obtener datos del usuario" };
            }


            setAuthState({
                token,
                authenticated: true,
                user,
            });

            await SecureStore.setItemAsync(TOKEN_KEY, token);
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

            return { token, user };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error en login:", error.response?.data || error.message);
            } else {
                console.error("Error desconocido en login:", error);
            }
            return { error: true, msg: "Error en el login" };
        }
    };



    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(USER_KEY);
            axios.defaults.headers.common['Authorization'] = '';

            setAuthState({
                token: null,
                authenticated: false,
                user: null,
            });
        } catch (error) {
            console.log("Error en logout:", error);
        }
    };

    /**
     * 📌 Proveer valores al contexto de autenticación.
     */
    const value: AuthContextProps = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
