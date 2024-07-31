import React, { useState, useEffect, useCallback, useContext } from "react";
import { Text, View, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity, VirtualizedList } from "react-native";
import { FlashList } from "@shopify/flash-list";
import * as ImagePicker from "expo-image-picker";
import { ToastAndroid } from "react-native";

import { ImagePickerExpoLenguaje } from "../../services/idiomas/ImagePickerExpoLenguaje";
import { Idioma } from "../../context/ContextoLogin";

const TamanioPantalla = Dimensions.get("window").width - 40;
const colors = {
    0: "#0D0B26",
    1: "#6bf561",
    2: "#f56161",
}
export const PickerMultipleImages = ({ image, setImage, maxImages = 3, aspectImage = [4, 3], base64=false }) => {

    const { idioma, setIdioma } = useContext(Idioma);
    const [permisogaleria, setPermisogaleria] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [valid, setValid] = useState(0);
    // Solicitar Permiso de la galeria
    const permiso = async () => {
        return await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    useEffect(() => {
        // Validamos el campo
        setValid(0)
        if (image.length === maxImages) {
            setValid(1);
        } else if (image.length > 0 && image.length < 3) {
            setValid(2);
        }
        permiso().then(x => {
            if (x.granted) {
                setPermisogaleria(true);
            }
        })
    }, [permisogaleria, image])

    // Funcion para el scroll
    const handleScroll = useCallback((event) => {
        const { contentOffset } = event.nativeEvent;
        const index = Math.floor(contentOffset.x / TamanioPantalla); // altura de cada item
        setCurrentIndex(index);
    }, []);
    // Funcion para seleccionar la imagen
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, //permite la edicion de la imagen
            allowsMultipleSelection: false, //para agregar multiples imagenes
            selectionLimit: maxImages, //el limite de imagenes que se pueden agregar
            aspect: aspectImage, //aspecto de la imagen
            quality: 1, //calidad de la imagen desde 0.0 hasta 1
            base64: base64,
        });

        if (!result.canceled) {
            return result.assets[0];
        } else {
            ToastAndroid.show(ImagePickerExpoLenguaje['alertNoSeleccionoImagen'][idioma], 3);
            throw new Error("No se selecciono ninguna imagen");
        }
    }
    // Funcion para solicitar el permiso
    function solicitarPermiso() {
        permiso().then(x => {
            if (x.granted) {
                setPermisogaleria(true);
            } else {
                setPermisogaleria(false);
            }
        }).catch(err => {
            throw new Error("No se pudo solicitar el permiso: " + err);
        })
    }

    const getItemCount = _data => image.length;
    const getItem = (_data, index) => (
        {
            id: Math.random().toString(12).substring(0),
            title: `Item ${index + 1}`,
            data: _data
        });
    // Funcion para eliminar la imagen
    function handleDelete(index) {
        const imagenes = [...image]
        imagenes.splice(index, 1)
        setImage(imagenes)
    }
    // Funcion para subir la imagen al array
    function handleUpload() {
        if (permisogaleria !== true) {
            solicitarPermiso();
        } else {
            if (image.length < maxImages) {
                pickImage().then(x => {
                    const imagenes = [...image]
                    imagenes.push(x)
                    setImage(imagenes)
                }).catch(err => {
                    console.log("No se que hace este error")
                })
            } else {
                ToastAndroid.show(ImagePickerExpoLenguaje['mensajeToastAndroid'][idioma] + maxImages, 3);
            }
        }
    }

    return (
        // Contenedor principal
        <View style={{
            paddingVertical: 15,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: colors[valid],
            borderRadius: 10,
            marginTop: 10,
            width: "100%",
            height: 225,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
        }}>
            {/*Componente de que no se han subido imagenes muestra mensaje y con una imagen subida muestra la FlashList*/}
            {
                (image.length < 1) ? (
                    <View style={{
                        width: "100%",
                        height: 150,
                        backgroundColor: "white",
                        borderRadius: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 10
                    }}>
                        <Text style={{ fontWeight: "bold" }}>{ImagePickerExpoLenguaje['pareceNoHasSubidoImagenes'][idioma]}</Text>
                        <Text style={{ color: "gray" }}>{ImagePickerExpoLenguaje['subeImagenesAqui'][idioma]}</Text>
                    </View>
                ) : (
                    <FlashList
                        data={image}
                        estimatedItemSize={100}
                        horizontal={true}
                        keyExtractor={(item, index) => index.toString()}
                        onScroll={handleScroll}
                        showsHorizontalScrollIndicator={false}
                        drawDistance={10}
                        renderItem={({ item, index }) => {
                            // Este es el componente que se renderiza en el FlatList
                            return <View key={index}
                                style={{
                                    alignContent: "center",
                                    width: TamanioPantalla / 2,
                                    height: 150,
                                    justifyContent: "space-around",
                                    flexDirection: "column",
                                    marginHorizontal: 5,
                                }}>
                                <Image
                                    key={item.id}
                                    source={{ uri: item.uri }}
                                    resizeMode="cover"
                                    style={{ width: "100%", height: 100, borderRadius: 4 }}
                                />
                                <TouchableOpacity style={{
                                    width: "100%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }} onPress={_ => handleDelete(index)}>
                                    <Text style={{
                                        backgroundColor: "#0D0B26",
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        borderRadius: 10,
                                        color: "white"
                                    }}>{ImagePickerExpoLenguaje['eliminarImagen'][idioma]}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        }
                    />
                )
            }
            {/*Boton para subir la imagen*/}
            <TouchableOpacity style={{
                backgroundColor: "#0D0B26",
                width: "90%",
                height: 35,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 10
            }} onPress={_ => handleUpload()}><Text
                style={{ color: "white" }}>{(image.length < maxImages) ? ImagePickerExpoLenguaje['subirImagenes'][idioma]
                    : ImagePickerExpoLenguaje['fotosCompletas'][idioma]} {image.length + "/" + maxImages}
                </Text>
            </TouchableOpacity>
        </View>
    )

};

const style = StyleSheet.create({
    contenedor: {
        backgroundColor: "black"
    }
});
