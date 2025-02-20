import {View, Text} from 'react-native';
import React, {useEffect} from 'react'
import axios from "axios";
import {API_URL} from "../context/AuthContext";

const Home = () => {

    useEffect(() => {
        const testCall = async () => {
            const result = await axios.get(`${API_URL}/customers`);
            console.log("Lenoncini",result);
        }
        testCall();
    },[])

    return (
        <View>
            <Text>
                HOME
            </Text>
        </View>
    )
}
export default Home;
