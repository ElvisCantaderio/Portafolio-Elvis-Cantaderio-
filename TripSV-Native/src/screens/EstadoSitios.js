import React, { useState, useEffect, useContext } from "react";

import {View, Text, StyleSheet, Image, TouchableOpacity, ToastAndroid} from "react-native";
import SinData from "../components/FlashList/SinData";

import { FlashList } from "@shopify/flash-list";
import { SitesServices } from "../services/FireStorage/SitesServices";
import { ContextoUser } from "../context/ContextoUser";
import { useNavigation } from "@react-navigation/native";
import { PantallaEstadoSitioLenguaje } from "../services/idiomas/PantallaEstadoSitioLenguaje";
import { Idioma } from "../context/ContextoLogin";
import { getAllSitesByEmail,deleteSiteAndImages } from "../services/CouchDb/database_sitios";
const EstadoSitios = () => {
    const navigation = useNavigation();
    const { idioma, setIdioma } = useContext(Idioma);
    const { user, setUser } = React.useContext(ContextoUser);
    const [estadoSitio, setEstadoSitio] = useState([PantallaEstadoSitioLenguaje["revision"][idioma], PantallaEstadoSitioLenguaje["aprobado"][idioma], PantallaEstadoSitioLenguaje["denegado"][idioma]])
    const [datos, setDatos] = useState([]);
    const [traerDatos, setTraerDatos] = useState(true)
    useEffect(() => {

        async function fetchMisSitios() {
            const sitios = await getAllSitesByEmail(user.email);
            if (sitios !== null && sitios !== undefined) {
                setDatos(sitios);
            }
        }
        if (traerDatos) {
            fetchMisSitios()
        }
        setTraerDatos(false);
    }, [traerDatos])

    function recargarPantalla() {
        setTraerDatos(true)
    }

    async function eliminarSitio(id, rev) {

        const eliminarSitio = await deleteSiteAndImages(id, rev);
        if(eliminarSitio){
            ToastAndroid.show("Sitio eliminado con exito!!!", ToastAndroid.SHORT);
            setTraerDatos(true)
        }else{
            ToastAndroid.show("Error al eliminar el sitio!!!", ToastAndroid.SHORT);
        }

    }

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <View style={{ width: "100%", padding: 10 }}>
                <Text style={{ fontWeight: "bold", fontSize: 25 }}>{PantallaEstadoSitioLenguaje["miSitios"][idioma]}</Text>
                <Text style={{ fontSize: 20 }}>{PantallaEstadoSitioLenguaje["cantidadSitios"][idioma]}: {datos.length}</Text>
            </View>

            <FlashList
                horizontal={false}
                data={datos}
                refreshing={false}
                onRefresh={() => recargarPantalla()}
                ListEmptyComponent={<SinData mensaje={PantallaEstadoSitioLenguaje["mensajeSinSitio"][idioma]} />}
                showsVerticalScrollIndicator={false}
                estimatedItemSize={20}
                renderItem={({ item, index }) => {
                    const data = item;
                    return <View
                        style={{
                            backgroundColor: "white",
                            padding: 10,
                            marginBottom: 10,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderRadius: 10
                        }}>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={{ fontWeight: "bold" }}>{PantallaEstadoSitioLenguaje["nombre"][idioma]}</Text>
                            <Text>{item.titulo[idioma]}</Text>
                            <Text style={{ fontWeight: "bold" }}>{PantallaEstadoSitioLenguaje["estado"][idioma]}</Text>
                            <Text>{estadoSitio[item.estado]}</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => {
                                eliminarSitio(item._id, item._rev)
                            }} style={{ ...styles.boton, backgroundColor: "#b12237" }}>
                                <Text style={{ textAlign: "center", color: "white" }}>{PantallaEstadoSitioLenguaje["eliminar"][idioma]}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Vista Sitio', { data })}
                                style={{ ...styles.boton, backgroundColor: "#5bb122" }}>
                                <Text style={{ textAlign: "center", color: "white" }}>{PantallaEstadoSitioLenguaje["verSitio"][idioma]}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }}
            />
        </View>
    );
}

export default EstadoSitios;

const styles = StyleSheet.create({
    boton: {
        padding: 10,
        marginBottom: 5,
        borderRadius: 10

    }
});