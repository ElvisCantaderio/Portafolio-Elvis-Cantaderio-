import React, { useState, useEffect, useContext } from "react";
import {View, Text,  ImageBackground, TouchableOpacity, ToastAndroid} from "react-native";
import { uploadImage} from "../services/CouchDb/database_publicidad";
import { AdministracionAnuncioLenguaje } from "../services/idiomas/AdministracionAnuncioLenguaje";
import { Idioma } from "../context/ContextoLogin";
import {PickerMultipleImages} from "../components/Utils/PickerMultipleImages";
import {Icon} from "@rneui/themed";
import {getPublicidad,deleteImage} from "../services/CouchDb/database_publicidad";
import {FlashList} from "@shopify/flash-list";
import { Ionicons } from '@expo/vector-icons';

const AdministracionAnuncio = () => {

    const { idioma, setIdioma } = useContext(Idioma);
    const [images, setImages] = useState([]);
    const [cargoImagenes, setCargoImagenes] = useState(true);

    //para la subida de imagenes
    const [image, setImage] = useState([]);
    useEffect(() => {

        async function obtenerImagenes() {
            const imagenes = await getPublicidad();
            if(imagenes){
                setImages(imagenes);
            }
        }

        if (cargoImagenes) {
            console.log("Obteniendo las imagenes");
            obtenerImagenes();
        }
        setCargoImagenes(false);
    }, [cargoImagenes]);


    function recargar() {
        setCargoImagenes(true)
    }
    async function handleImageUpload() {
        console.log("subiendo imagen");
        if(image.length > 0){
            const enviandoImage  = await  uploadImage(image);
            console.log(enviandoImage);
            recargar();
        }else{
            ToastAndroid.show(AdministracionAnuncioLenguaje["seleccionarImagen"][idioma], ToastAndroid.SHORT)
        }

    }

    async function borrarImagenes(id,rev) {
        console.log("item: " + rev + " rev: " + rev)
        const eliminar = await deleteImage(id, rev);
        if(eliminar){
            ToastAndroid.show(AdministracionAnuncioLenguaje["imagenEliminada"][idioma], ToastAndroid.SHORT)
        }
        recargar();
    }

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <PickerMultipleImages image={image} setImage={setImage} base64={true} maxImages={1} aspectImage={[24,5]} />
            {
                (images.length < 3) ? (
                    <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>

                        <TouchableOpacity  onPress={()=>handleImageUpload()} style={{paddingHorizontal: 10, paddingVertical:15, backgroundColor: "#0D0B26", width: "50%", marginVertical: 10,borderRadius: 10}} >
                            <Text style={{color: "white", textAlign: "center"}}>{AdministracionAnuncioLenguaje["subirBannerButton"][idioma]}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{ backgroundColor: "white", padding: 10, borderRadius: 10, marginVertical: 10 }}>
                        <Text>{AdministracionAnuncioLenguaje["mensajeMaxImagenes"][idioma]}</Text>
                    </View>
                )
            }


            <FlashList
                data={images}
                refreshing={false}
                onRefresh={() => recargar()}
                showsVerticalScrollIndicator={false}
                estimatedItemSize={80}
                renderItem={({ item, index }) => {
                    // console.log(JSON.stringify(item, null, 2))
                   return <ImageBackground key={index} resizeMode="contain"
                        style={{
                            marginTop: 10,
                            width: "100%",
                            height: 80,
                            flexDirection: "row",
                            backgroundColor: "white",
                            justifyContent: "center",
                            alignItems: 'center'
                        }}
                        borderRadius={10}
                        source={{ uri: item.imagenes[0]}} >
                       <TouchableOpacity style={{flexDirection: "row",alignItems: "center", borderRadius: 100, borderColor: "white", borderWidth: 4, backgroundColor: "red",padding: 10}} onPress={() => borrarImagenes(item._id,item._rev)}><Ionicons name="trash" size={22} color="white" />
                           <Text style={{color: "white", fontWeight: "bold"}}>{AdministracionAnuncioLenguaje["eliminar"][idioma]}</Text>
                       </TouchableOpacity>
                    </ImageBackground>
                }}/>
        </View>
    )
}

export default AdministracionAnuncio;