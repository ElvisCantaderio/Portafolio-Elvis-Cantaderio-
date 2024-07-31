import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ToastAndroid } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import EstablecerUbicacion from "../Utils/EstablecerUbicacion";
import { PantallaAgregarNuevoSitio } from '../../services/idiomas/PantallaAgregarNuevo';
import { Idioma } from '../../context/ContextoLogin';


export const LocaltionInfo = ({ ubicacion, setUbicacion }) => {
    useEffect(() => {
        console.log(ubicacion)
    },[ubicacion])
    const { idioma, setIdioma } = useContext(Idioma);
    const verificarPermiso = async () => {
        try {
            console.log("Verificando permiso");
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                throw new Error('Permission to access location was denied');
            }

            console.log("Vamos a obtener la ubicación");

            return new Promise(async (resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('No se pudo obtener la ubicación dentro de 2 segundos'));
                }, 2000);

                try {
                    const location = await Location.getCurrentPositionAsync({});
                    clearTimeout(timeout); // Cancelar el temporizador si se obtiene la ubicación
                    console.log("Ubicación obtenida:");
                    console.log(location);
                    resolve(location);
                } catch (error) {
                    clearTimeout(timeout); // Cancelar el temporizador si se produce un error
                    console.error(error.message);
                    ToastAndroid.show("No se pudo obtener el permiso de ubicación", ToastAndroid.LONG);
                    resolve(null); // Resuelve con null en caso de error
                }
            });
        } catch (error) {
            console.error(error.message);
            ToastAndroid.show("No se pudo obtener el permiso de ubicación", ToastAndroid.LONG);
            return null;
        }
    };

    
    const handleDelete = () => {
        if (ubicacion === null) {
            ToastAndroid.show("No hay ubicación que eliminar", ToastAndroid.LONG);
        } else {
            setUbicacion(null);
        }
    };

    const handleLocation = async () => {
        
        const ubi = await verificarPermiso();
        console.log("ubi: ")
        console.log(ubi)
        if (ubi) {
            setUbicacion([
                {
                    latitude: ubi.coords.latitude,
                    longitude: ubi.coords.longitude
                }
            ]);
            ToastAndroid.show("Ubicación obtenida con éxito", ToastAndroid.LONG)
        }
    };

    return (
        <View style={{ width: "100%" }}>
            <Text style={styles.titulo}>{PantallaAgregarNuevoSitio["ubicacion"][idioma]}</Text>
            <Text style={{ color: "gray" }}>{PantallaAgregarNuevoSitio["ubicacionactual"][idioma]}</Text>
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                    disabled={(ubicacion !== null)}
                    style={{ padding: 5, borderRadius: 10, alignItems: "center", flexDirection: "row", borderColor: "black", borderWidth: 1, margin: 12, justifyContent: "space-between", width: "75%" }}
                    onPress={_ => handleLocation()}>
                    <Text style={{ color: "black", padding: 10 }}>{PantallaAgregarNuevoSitio["boton1"][idioma]}</Text>
                    <Ionicons name="location" size={24} color={(ubicacion === null) ? "black" : "green"} />
                </TouchableOpacity>
                {/* Boton eliminar la locacion */}
                <TouchableOpacity onPress={_ => handleDelete()} style={{ padding: 5, borderRadius: 10, alignItems: "center", flexDirection: "row", borderColor: "black", borderWidth: 1, margin: 12, justifyContent: "space-between", }}>
                    <Ionicons style={{ paddingHorizontal: 10 }} name="trash" size={24} color={"black"} />
                </TouchableOpacity>
            </View>
            {/*Punto en el mapa*/}
            <EstablecerUbicacion setUbicacion={setUbicacion} ubicacion={ubicacion}/>
            <View style={{ width: "100%", padding: 10, backgroundColor: "white", borderRadius: 10 }}>
                {
                    (ubicacion !== null) ? (
                        <Text>{PantallaAgregarNuevoSitio["siubicacion"][idioma]}</Text>
                    ) : (
                        <Text>{PantallaAgregarNuevoSitio["noubicacion"][idioma]}</Text>
                    )
                }
            </View>
        </View>

    );

}

const styles = StyleSheet.create({
    titulo: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0D0B26",
        marginVertical: 5
    },
    input: {

        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10
    },
});