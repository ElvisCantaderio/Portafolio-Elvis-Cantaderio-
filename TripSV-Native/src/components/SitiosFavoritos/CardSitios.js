import React from "react";
import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "dripsy";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
export function CardSitios({ titulo = "Card Titulo", imagen = "#", textoBtn = "Ver sitio", eliminarFuncion, data }) {

    const navigation = useNavigation();

    return (
        <View sx={{ height: [200, 250, 300] }} style={styles.cardContenedor} >
            <View style={styles.card} >
                <ImageBackground resizeMode="cover" backgroundColor="transparent" borderRadius={10} source={{ uri: imagen }} style={styles.cardImagen} >
                    {/*Titulo del sitio*/}
                    <View style={{ width: "80%", height: "100%", padding: 10, flexDirection: "column", alignItems: "center", justifyContent: "center" }} >
                        <Text sx={{ fontSize: [24, 30, 36] }} style={styles.cardTitulo}>{titulo}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Vista Sitio', { data })}
                            style={styles.cardButton}>
                            <Text sx={{ fontSize: [14, 16, 18] }} style={{ color: "white" }}>{textoBtn}</Text>
                        </TouchableOpacity>
                    </View>
                    {/*Boton de quitar de favoritos*/}
                    <View style={{ width: "20%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                        <TouchableOpacity >
                            <IconButton
                                style={{ backgroundColor: "rgba(255,255,255,0.5)", borderRadius: 100 }}
                                icon="star"
                                iconColor={"yellow"}
                                size={25}
                                onPress={() => eliminarFuncion()} />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    cardContenedor: {
        width: "100%",
        display: 'flex',
        position: "relative",
        backgroundColor: "rgba(0,0,0,0)",
        marginTop: 20,
        padding: 10
    },
    card: {
        backgroundColor: "rgba(0,0,0,1)",
        borderRadius: 20,
        marginBottom: 20,
        height: "100%",
    },
    cardImagen: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        flexDirection: "row"
    },
    cardTitulo: {
        color: "white",
        marginVertical: 10,
        justifyContent: 'center',

    },
    cardButton: {
        width: "50%",
        alignItems: 'center',
        backgroundColor: '#0D0B26',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10
    }
});

