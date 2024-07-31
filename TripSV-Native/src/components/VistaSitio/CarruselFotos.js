import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ImageBackground, FlatList, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Dimensions } from "react-native";


const TamanioPantalla = Dimensions.get("screen").width;


export function CarruselFotos({ totalFotos = 0, nota = 0, imagenes, nombreLugar = "Sin Asignar", departamento = "Departamento" }) {

    // Seteamos el valor en el cual se encuentra nuestra imagen
    const [currentIndex, setCurrentIndex] = useState(0);
    //Hacemos el calculo para obtener en que imagen estamos
    //El calculo solo divide la cantidad de scroll realizada en el FlatList entre el tamanio de la pantalla
    const handleScroll = useCallback(event => {
        const { contentOffset } = event.nativeEvent;
        const index = Math.floor(contentOffset.x) / Math.floor(TamanioPantalla); // altura de cada item
        setCurrentIndex(Math.floor(index));
    }, []);
    // Genera las  estrellas segun la valoracion que tiene
    const estrellas = []
    for (let i = 0; i < 5; i++) {
        if (i < nota) {
            estrellas.push(<MaterialIcons key={i} name="star" size={15} color="#FFDD27" />);
        } else {
            estrellas.push(<MaterialIcons key={i} name="star" size={15} color="#BFA519" />);
        }
    }

    return (
        <View style={{ ...style.contenedor }}>
            {/* Crea el carusel de fotografias atraves de la colleccio de fotos */}
            <FlatList
                data={imagenes}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                decelerationRate={0}
                snapToInterval={TamanioPantalla}
                scrollEventThrottle={32}
                onScroll={handleScroll}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) => {
                    return <View>
                        <ImageBackground source={{ uri: item }} resizeMode="cover"
                            style={{ width: TamanioPantalla, height: 360 }}>
                            {
                                (currentIndex < 1 && totalFotos > 1) && (

                                    <ImageBackground backgroundColor="transparent"
                                        source={require("../../../assets/flick-to-left.png")} style={{
                                            width: 50, height: 50, position: "absolute", right: 10, top: "40 %"
                                        }} />

                                )
                            }
                        </ImageBackground>
                    </View>
                }
                }

            />

            {/* Titulo del lugar y Estrellas de calificacion */}
            <View style={{ ...style.infoLugar }}>
                <Text style={style.imgContenedor_text}>{nombreLugar}</Text>
                <Text style={style.imgContenedor_textSub}>{departamento}</Text>
            </View>
            {/* Cantidad y indicador de imagen actual en el carrusel */}
            <View style={{ ...style.indicadorFoto }}>
                <Text style={{
                    color: "#fff", textShadowColor: 'black',
                    textShadowOffset: { width: 2, height: 2 },
                    textShadowRadius: 5,
                }}>{currentIndex + 1}/{totalFotos}</Text>
            </View>
        </View>
    );

}


const style = StyleSheet.create({
    contenedor: {
        width: TamanioPantalla,
        height: 360,
        position: "relative"
        // // flexDirection: "column",
        // justifyContent: "flex-end"
    },
    imgContenedor_text: {
        color: "white",
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
        fontWeight: "bold",
        fontSize: 25,
    },
    imgContenedor_textSub: {
        color: "#ffff00",
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
        fontWeight: "bold",
        fontSize: 25,
    },
    infoLugar: {
        position: "absolute",
        bottom: 0,
        padding: 5
    },
    indicadorFoto: {
        width: 30,
        backgroundColor: "rgba(1,1,1,.7)",
        position: "absolute",
        top: 20,
        left: (TamanioPantalla / 2) - 15,
        alignItems: "center",
        borderRadius: 2,
    }
});