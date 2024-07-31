import React, { useEffect, useState, useContext } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../services/Authentication/FirebaseAuthentication";

import { MiContexto } from "../../context/ContextoLogin";
import {MenuLenguaje} from "../../services/idiomas/MenuLenguaje";
import {Idioma} from "../../context/ContextoLogin";

const LoginButtom = ({ Logeado }) => {
    const { signIn, signOut } = useAuth();
    const {idioma, setIdioma} = useContext(Idioma);
    useEffect(() => {
        // console.log("Cambiando desde Modal");
    }, [Logeado]);

    const handleLogout = () => {
        signOut();
    };

    const handleLogin = () => {
        signIn();
    }

    if (Logeado) {
        return (
            <View style={{ alignItems: "center" }}>
                {/* Componente personalizado */}
                <TouchableOpacity onPress={handleLogout}
                    style={{ ...style.btnDrawer, ...style.btnLoginOut, marginBottom: 10 }}>
                    <Text style={{ ...style.btnDrawerText }}>{MenuLenguaje["cerrarSesion"][idioma]}</Text>
                    <Ionicons name="md-exit-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{ alignItems: "center" }}>
            {/* Componente personalizado */}
            <TouchableOpacity onPress={handleLogin}
                style={{ ...style.btnDrawer, ...style.btnLoginIn, marginBottom: 10 }}>

                <Ionicons name="logo-google" size={20} color="white" />
                <Text style={{ ...style.btnDrawerText }}>{MenuLenguaje["iniciarSesion"][idioma]}</Text>
            </TouchableOpacity>
        </View>)
}

export default LoginButtom;

const style = StyleSheet.create({
    btnDrawer: {
        width: "90%",
        borderRadius: 8,
        backgroundColor: "#0D0B26",
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    btnLoginIn: {
        justifyContent: "center",
    },
    btnLoginOut: {
        justifyContent: "space-between"
    },
    btnDrawerText: {
        color: "white"
    },
});

