import React, { StrictMode } from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthProvider, useAuth } from "./app/context/AuthContext";
import Home from './app/screens/Home';
import Login from './app/screens/Login';
import Register from './app/screens/Register';


import type { RootStackParamList } from './app/screens/navigation';


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <StrictMode>
            <AuthProvider>
                <Layout />
            </AuthProvider>
        </StrictMode>
    );
}

export const Layout = () => {
    const { authState, onLogout } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {authState?.authenticated ? (
                    <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{ /* ... */ }}
                    />
                ) : (
                    <>
                        <Stack.Screen
                            name="Login"
                            component={Login}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Register"
                            component={Register}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
