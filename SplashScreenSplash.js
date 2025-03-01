import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';


import ImageGroup from './assets/Optimo.png';

const CustomSplash = () => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#124DDE', '#124DDE']}
                style={StyleSheet.absoluteFill}
            />

            <Animatable.View
                animation="pulse"
                duration={1700}
                iterationCount="infinite"
                style={styles.imageContainer}
            >
                <Image source={ImageGroup} style={styles.image} />
            </Animatable.View>
        </View>
    );
};

export default CustomSplash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});
