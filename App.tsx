import React, { StrictMode, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './app/context/AuthContext';
import SplashScreenSplash from './SplashScreenSplash';
import Toast from 'react-native-toast-message';

import Home from './app/screens/Home';
import Login from './app/screens/Login';
import Register from './app/screens/Register';
import Venta from './app/screens/Venta';
import Profile from './app/screens/Profile';
import VerificarCorreo from './app/screens/VerificarCorreo';


import { Ionicons } from '@expo/vector-icons';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    Venta: undefined;
    Profile: undefined;
    VerificarCorreo: { phone: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();


function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: { backgroundColor: '#FFFFFF' },
                tabBarActiveTintColor: '#000000',
                tabBarInactiveTintColor: '#000000 ',
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName = '';

                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
                    else if (route.name === 'Venta') iconName = focused ? 'cart' : 'cart-outline';

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Inicio' }} />
            <Tab.Screen name="Perfil" component={Profile} options={{ tabBarLabel: 'Perfil' }} />
            <Tab.Screen name="Venta" component={Venta} options={{ tabBarLabel: 'Ventas' }} />
        </Tab.Navigator>
    );
}

export default function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <SplashScreenSplash />;
    }

    return (
        <StrictMode>
            <AuthProvider>
                <Layout />
            </AuthProvider>
        </StrictMode>
    );
}

export const Layout = () => {
    const { authState } = useAuth();

    return (
        <>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {!authState?.authenticated ? (
                        <>
                            <Stack.Screen name="Login" component={Login} />
                            <Stack.Screen name="Register" component={Register} />
                            <Stack.Screen name="VerificarCorreo" component={VerificarCorreo} />
                        </>
                    ) : (
                        <Stack.Screen name="Home" component={BottomTabs} />
                    )}
                </Stack.Navigator>
            </NavigationContainer>

            <Toast />
        </>
    );
};
