import React, {useEffect, useRef, useState, useContext} from "react";
import {View, StyleSheet, Text, Modal, TouchableOpacity, ToastAndroid} from "react-native";
import WebView from "react-native-webview";
import { Ionicons } from '@expo/vector-icons';
import { PantallaAgregarNuevoSitio } from "../../services/idiomas/PantallaAgregarNuevo";
import { Idioma } from "../../context/ContextoLogin";

const EstablecerUbicacion = ({ubicacion,setUbicacion}) => {
    const { idioma, setIdioma } = useContext(Idioma);
    const webViewRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [ubi, setUbi] = useState(null)

    useEffect(() => {
    console.log(ubicacion)
    }, [ubi]);
    const handleWebViewMessage = (event) => {
        const message = JSON.parse(event.nativeEvent.data);
        const {lat, lng} = message["datos"];
        setUbi({
            latitude: lat,
            longitude: lng
        })
    };

    const injectedJS = `window.addEventListener("message", (event) => {
            const mensaje = event.data;
            window.ReactNativeWebView.postMessage(mensaje);
    });
    `;
    const handleLocation = () => {
        if(ubi === null){
            ToastAndroid.show("Elije un punto en mapa", ToastAndroid.LONG);
        }else{
            setUbicacion(ubi);
            modal();
            ToastAndroid.show("Ubicación establecida", ToastAndroid.LONG);
        }

    }
    const modal = () => {
        if(ubicacion !== null){
            ToastAndroid.show("Elimine la ubicacion actual para establecer una nueva", ToastAndroid.LONG);
        }else{
            setModalVisible(!modalVisible)
        }
    }

    return (
        <View>
            <TouchableOpacity onPress={()=> modal()} style={style.botonModal}>
                <Text style={{color: "black", padding: 10}}>{PantallaAgregarNuevoSitio["boton2"][idioma]}</Text>
                <Ionicons name="map" size={24} color="black" />
            </TouchableOpacity>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                console.log("Modal cerrado");
                }}
            >
                <View style={style.modal}>
                    <WebView ref={webViewRef}
                             source={{uri: 'https://tripsv.xyz/mapa/nativo'}}
                             onMessage={handleWebViewMessage}
                             injectedJavaScript={injectedJS}
                             javaScriptEnabled={true}
                    />
                   <View style={{flexDirection: "row", padding: 10,justifyContent:"space-around"}}>
                       <TouchableOpacity onPress={()=> modal()} style={style.boton}>
                           <Text>Cancelar</Text>
                       </TouchableOpacity>

                       <TouchableOpacity onPress={()=> handleLocation()} style={style.boton}>
                           <Text>Guardar Ubicacion</Text>
                       </TouchableOpacity>
                   </View>
                </View>
            </Modal>
        </View>
    )
}

export default EstablecerUbicacion;

const style = StyleSheet.create({
    botonModal: {
        padding: 5, borderRadius: 10, alignItems: "center", flexDirection: "row", borderColor: "black", borderWidth: 1, margin: 12, justifyContent: "space-between", width: "75%"
    },
    modal: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        width: "90%",
        height: "80%",
        marginHorizontal: "5%",
        marginVertical: "20%"
    },
    boton: {
        width: "45%",
        backgroundColor: "white",
        borderColor : "black",
        borderWidth :1,
        borderRadius: 10,
        padding: 10,
    }
});


