import React, {useState, useEffect, useCallback, useContext} from "react";
import {Text, View, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity, VirtualizedList} from "react-native";

import * as ImagePicker from "expo-image-picker";
import {ToastAndroid} from "react-native";

import { ImagePickerExpoLenguaje } from "../../services/idiomas/ImagePickerExpoLenguaje";
import { Idioma } from "../../context/ContextoLogin";

const TamanioPantalla = Dimensions.get("window").width - 40;

export const ImagePickerExpo = ({image, setImage, cantImagenes= 3, aspect = [4,3]}) => {

    const {idioma, setIdioma} = useContext(Idioma);

    const [permisogaleria, setPermisogaleria] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    // Solicitar Permiso de la galeria
    const permiso = async () => {
        return await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    useEffect(() => {
        // Checkeo del permiso
        permiso().then(x => {
            if (x.granted) {
                setPermisogaleria(true);
            }
        })
    }, [permisogaleria, image])


    // Funcion para el scroll
    const handleScroll = useCallback((event) => {
        const {contentOffset} = event.nativeEvent;
        const index = Math.floor(contentOffset.x / TamanioPantalla); // altura de cada item
        setCurrentIndex(index);
    }, []);
    // Funcion para seleccionar la imagen
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, //permite la edicion de la imagen
            allowsMultipleSelection: false, //para agregar multiples imagenes
            selectionLimit: cantImagenes, //el limite de imagenes que se pueden agregar
            aspect: aspect, //aspecto de la imagen
            quality: 1, //calidad de la imagen desde 0.0 hasta 1
            base64: true,

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
            if (image.length < cantImagenes) {
                pickImage().then(x => {
                    const imagenes = [...image]
                    imagenes.push([x])
                    setImage(imagenes)
                }).catch(err => {
                    console.log("No se que hace este error")
                })
            } else {
                ToastAndroid.show(ImagePickerExpoLenguaje['mensajeToastAndroid'][idioma], 3);
            }
        }
    }

    if (image.length === 0) {
        return (
            <View style={{
                width: "100%",
                height: 200,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
                padding: 4
            }}>
                {/*Mensaje de que no se han subido imagenes*/}
                <View style={{
                    width: "100%",
                    height: 100,
                    backgroundColor: "white",
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Text style={{fontWeight: "bold"}}>{ImagePickerExpoLenguaje['pareceNoHasSubidoImagenes'][idioma]}</Text>
                    <Text style={{color: "gray"}}>{ImagePickerExpoLenguaje['subeImagenesAqui'][idioma]}</Text>
                </View>
                {/*Boton para subir imagenes*/}
                <TouchableOpacity style={{
                    backgroundColor: "#0D0B26",
                    width: "100%",
                    height: 40,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center"
                }} onPress={_ => handleUpload()}>
                    <Text
                    style={{color: "white"}}>{ImagePickerExpoLenguaje['subirImagenes'][idioma]}</Text>
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <View style={{
                width: "100%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
            }}>

                <VirtualizedList
                    style={{width: "100%", backgroundColor: "white", paddingVertical: 5, borderRadius: 10}}
                    data={image}
                    getItemCount={getItemCount}
                    horizontal={true}
                    getItem={getItem}
                    keyExtractor={(item, index) => index}
                    renderItem={({item, index}) => {
                        return <View key={index}
                                     style={{
                                         alignContent: "center",
                                         width: TamanioPantalla / 2,
                                         height: 150,
                                         justifyContent: "space-around",
                                         flexDirection: "column",
                                         marginHorizontal: 5
                                     }}>

                            <Image
                                key={item.id}
                                source={{uri: item.data[index][0].uri}}
                                resizeMode="cover"
                                style={{width: "100%", height: 100, borderRadius: 4}}
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
                                }}>{ImagePickerExpoLenguaje['eliminarImagen'][idioma]}{/**Eliminar Imagen*/}</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    }
                />
                <TouchableOpacity style={{
                    backgroundColor: "#0D0B26",
                    width: "90%",
                    height: 35,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    marginVertical: 10
                }} onPress={_ => handleUpload()}><Text
                    style={{color: "white"}}>{(image.length < cantImagenes) ? ImagePickerExpoLenguaje['subirImagenes'][idioma]
                     : ImagePickerExpoLenguaje['fotosCompletas'][idioma]} {image.length + "/"+ cantImagenes}
                </Text>
                </TouchableOpacity>
            </View>
        )
    }
};

const style = StyleSheet.create({
    contenedor: {
        backgroundColor: "black"
    }
});
