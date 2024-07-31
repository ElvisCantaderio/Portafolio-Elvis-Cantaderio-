import React, {useContext, useEffect, useState} from "react";
import { ImageBackground, TouchableOpacity, Animated } from "react-native";
import { Text, View } from "dripsy";
import { PantallaInicioLenguaje } from "../../services/idiomas/PantallaInicioLenguaje";
import { useNavigation } from "@react-navigation/native";
import {Idioma} from "../../context/ContextoLogin";


function generarListaNumerosAleatoriosSinRepeticiones(min, max, cantidad) {
    // Crea una matriz con todos los números en el rango
    const numerosPosibles = Array.from({ length: max - min + 1 }, (_, index) => min + index);

    // Mezcla la matriz aleatoriamente
    for (let i = numerosPosibles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numerosPosibles[i], numerosPosibles[j]] = [numerosPosibles[j], numerosPosibles[i]];
    }

    // Toma los primeros 'cantidad' elementos de la matriz para obtener la lista aleatoria sin repeticiones
    return numerosPosibles.slice(0, cantidad);
}
export function Recomendados({ sitios, actualizarCompo = false }) {
    const {idioma,setIdioma} = useContext(Idioma)
    const navigation = useNavigation();
    const [datosRamdons, setDatosRamdons] = useState([]);
    const [primeraCarga, setPrimeraCarga] = useState(true);
    const [tiempoCarga, setTiempoCarga] = useState(5000);
    useEffect(() => {
        const intervalId = setInterval(() => {
            const listaAleatoria = generarListaNumerosAleatoriosSinRepeticiones(0, sitios.length - 1, 3);
            // console.log(listaAleatoria)
            if (sitios.length > 0) {
                const sitioSeleccionados = sitios.filter((sitio, index) => {
                    return listaAleatoria.includes(index)
                })
                setDatosRamdons(sitioSeleccionados)
            }
            setPrimeraCarga(false)

        }, tiempoCarga)

        return () => {
            clearInterval(intervalId)
        }

    }, [sitios])



    return (
        <View>
            {/*Mensaje*/}
            <View sx={{ width: "100%", paddingVertical: 10 }}>
                <Text sx={{ fontSize: [16, 18, 22], color: "gray", fontWeight: "bold" }}>{PantallaInicioLenguaje["lugaresRecomendados"][idioma]}</Text>
            </View>
            <View sx={{ width: "100%", height: 100, flexDirection: "row", gap: 4, justifyContent: "space-between" }}>
                {
                    (!primeraCarga && sitios.length > 0) ? datosRamdons.map((data, index) => {
                        const { imagenes, departamento } = data;
                        return <TouchableOpacity key={index} style={{ width: "32%", height: "100%" }} onPress={() => navigation.navigate('Vista Sitio', { data })}>
                            <ImageBackground borderRadius={10} resizeMode="cover" source={{ uri: imagenes[0] || null }}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",

                                    overlayColor: "rgba(0, 0, 0, 0.9)"

                                }} key={index}>

                                <Text sx={{
                                    fontSize: [18, 22, 28], textAlign: "center", fontWeight: "bold", color: "white", textShadowOffset: { width: 2.5, height: 1 },
                                    textShadowRadius: 5.5,
                                    textShadowColor: "rgba(0, 0, 0, 1)"

                                }}>{departamento}</Text>
                            </ImageBackground>

                        </TouchableOpacity>
                    }) : <View sx={{ width: "100%", height: "100%" }} style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
                        <Text sx={{ fontSize: [18, 22, 28], textAlign: "center", fontWeight: "bold", color: "gray", textShadowOffset: { width: 3, height: 1 } }}>{PantallaInicioLenguaje["buscandoSitios"][idioma]}</Text>
                    </View>
                }
            </View>

            <View sx={{ width: "100%", paddingVertical: 10 }}>
                <Text sx={{ fontSize: [16, 18, 22], color: "gray", fontWeight: "bold" }}>{PantallaInicioLenguaje["sitiosTuristicos"][idioma]}</Text>
            </View>
        </View>
    )
}

