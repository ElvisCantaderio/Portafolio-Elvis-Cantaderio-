import React, { useContext, useEffect } from "react";
import { TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { View, Text } from "dripsy";
import { Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";
import { CardInicioLenguaje } from "../../services/idiomas/CardInicioLenguaje";
import { Idioma } from "../../context/ContextoLogin";

export function CardLugares({ imageUri, nombreLugar = "Sin asignar", detalle = "Sin asignar", valoracionSitio, data }) {

    const { idioma, setIdioma } = useContext(Idioma);

    const estrellas = []
    for (let i = 0; i < 5; i++) {
        if (i < valoracionSitio) {
            estrellas.push(<MaterialIcons name="star" size={15} key={i} color="#FFDD27" />);
        } else {
            estrellas.push(<MaterialIcons name="star" size={15} key={i} color="#BFA519" />);
        }
    }
    const navigation = useNavigation();
    return (
        <View sx={{ height: [200, 250, 300] }} style={styles.cardContenedor}>
            <Card style={styles.card}>
                <ImageBackground resizeMode="cover" backgroundColor="transparent" borderRadius={10}
                    source={{ uri: imageUri }} style={styles.cardImagen}>
                    <View sx={{ height: [54, 65, 75] }} style={styles.infoContenedor}>
                        {/* Aqui va el Titulo del lugar y el departamento */}
                        <View style={{ height: "100%", flexDirection: "column", width: "65%" }}>
                            <Text sx={{ fontSize: [14, 16, 22] }} numberOfLines={1} ellipsizeMode="tail" style={{ ...styles.infoNombre }}>{nombreLugar}</Text>
                            <Text sx={{ fontSize: [14, 16, 18] }} style={{ ...styles.infoDepartamento }}>{detalle}</Text>
                        </View>
                        {/* Boton que nos lleva a la pantalla de Vista de Sitio para visualizar el lugar */}
                        <TouchableOpacity onPress={() => navigation.navigate('Vista Sitio', { data })}
                            style={{ ...styles.verMasBtn }}>
                            <Text sx={{ fontSize: [14, 16, 18] }} numberOfLines={1} ellipsizeMode="tail" style={{ color: "white" }}> {CardInicioLenguaje["verMas"][idioma]}</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>

            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContenedor: {
        marginVertical: 10,
        width: '100%',
        display: 'flex',
        position: "relative",
        backgroundColor: "rgba(0,0,0,0)",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        height: "100%",
    },
    cardImagen: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    infoContenedor: {
        display: 'flex',
        flexDirection: "row",
        gap: 10,
        width: '90%',
        marginBottom: 8,
        borderRadius: 10,
        paddingVertical: 10,
        backgroundColor: "rgba(255,255,255,0.9)",
    },
    infoNombre: {
        fontSize: 17,
        color: "#34383f",
        marginLeft: 15,
    },
    infoDepartamento: {
        marginLeft: 15,
        fontSize: 12,
        color: "#212225",
    },
    verMasBtn: {
        width: "30%",
        height: "100%",
        borderRadius: 10,
        backgroundColor: "#0D0B26",
        color: "white",
        alignItems: "center",
        justifyContent: "center"
    },
});