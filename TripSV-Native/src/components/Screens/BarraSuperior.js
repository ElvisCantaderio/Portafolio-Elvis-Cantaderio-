import React from "react";
import {View, Text, StyleSheet} from "react-native";
import {Dimensions} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {useFonts} from "expo-font";

const TamanioPantalla = Dimensions.get("window").height;
let tamanioBarra = TamanioPantalla * 0.13;

export function BarraSuperior({tituloPantalla = "No asignado", btnRegresar = true}) {
    let activarBack = btnRegresar;
    const navegacion = useNavigation();
    //Importamos las fuentes

    return (
        <View style={{...styles.base}}>

            <Text style={{...styles.titulo, ...styles.shadowTitle}}> {tituloPantalla} </Text>
        </View>
    );
}

export default BarraSuperior;

const styles = StyleSheet.create({
    base: {
        flexDirection: "row",
        paddingTop: 30,
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: "gray",
    },
    btnBack: {
        backgroundColor: "#00293C",
        borderRadius: 100,
        width: 25,
        height: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    titulo: {
        fontSize: 20,
        textAlign: "center",
        color: "#00293C",

    },

    shadowTitle: {
        textShadowOffset: {width: 1, height: 2},
        textShadowRadius: 3.6,
        textShadowColor: "rgba(0, 0, 0, 0.15)",
    }
})