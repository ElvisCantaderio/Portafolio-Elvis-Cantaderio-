import React, { useContext } from "react";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import {
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Linking, ToastAndroid,
} from "react-native";

import { View, Text } from "dripsy";
import { CarruselFotos } from "../components/VistaSitio/CarruselFotos";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";
import openMap from 'react-native-open-maps';
import ImagenBanner from "../components/Banner/ImagenBanner";
import { PantallaVerSitioLenguaje } from "../services/idiomas/PantallaVerSitioLenguaje";
import { Idioma } from "../context/ContextoLogin";
import ServicesCategoriesPriceIdiom from "../services/idiomas/ServicesCategoriesPriceIdiom";
import { ContextoUser } from "../context/ContextoUser";
import { obtenerFavorito, insertarFavorito } from "../services/SQLite/SqliteFavoritos";
import { PantallaDetalleSitio } from "../services/idiomas/componentes/screen/detallesSitio/PantallaDetalleSitio";
const TamanioPantalla = Dimensions.get("window").width;

const DetallesSitio = ({ route }) => {
    const { CategoriesIdiom, ServiciosIdiom, PriceIdiom } = ServicesCategoriesPriceIdiom()
    const { idioma, setIdioma } = useContext(Idioma);
    const { user, setUser } = useContext(ContextoUser);
    const navigation = useNavigation();
    // obtengo los datos del sitio
    const { imagenes, estado, email, titulo, descripcionLugar, telefono, ubicacion, departamento, precio, servicios, categorias, horario } = route.params.data;
    const data = route.params.data;
    // Abre en el mapa la ubicacion del sitio
    const openMaps = () => {
        if (ubicacion === undefined || ubicacion === null) {
            ToastAndroid.show(PantallaDetalleSitio["noUbicacion"][idioma], ToastAndroid.SHORT)
        } else {
            openMap({
                latitude: ubicacion.latitude,
                longitude: ubicacion.longitude,
                zoom: 15,
                mapType: "hybrid",
                query: "Lugar",
                provider: "google",
                navigate: true
            });
        }
    }

    const pressCall = () => {
        if (telefono === undefined || telefono === null || telefono === "") {
            ToastAndroid.show(PantallaDetalleSitio["nohayNumero"][idioma], ToastAndroid.SHORT)
        } else {
            const url = 'tel://' + telefono
            Linking.openURL(url).then(r => {
                console.log(r)
            }).catch(err => {
                console.log(err)
            })
        }
    }

    const saveFavorito = async (sitio) => {
        //Preparo el archivo
        let id = sitio._id;
        obtenerFavorito((site) => {

            if (site === 0) {
                insertarFavorito(sitio, sitio._id)
                ToastAndroid.show(PantallaDetalleSitio["guardarFavorito"][idioma], ToastAndroid.SHORT)
            } else {
                ToastAndroid.show(PantallaDetalleSitio["estaGuardado"][idioma], ToastAndroid.SHORT)
            }
        }, id)


    }
    console.log("telefono: " + telefono)
    console.log("ubicacion: " + ubicacion)
    return (
        <SafeAreaView style={style.base}>
            {
                (user && user.email === email) && (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Editar Sitio', { data })}
                        style={{ padding: 15, borderRadius: 100, position: "absolute", zIndex: 10, backgroundColor: "white", bottom: 15, right: 15, borderColor: "gray" }}>
                        <Ionicons name="brush" size={25} color="#0D0B26" />
                    </TouchableOpacity>
                )
            }
            <ScrollView style={style.base} decelerationRate={0.998}>

                {/*Carrusel de fotos*/}
                <CarruselFotos nombreLugar={titulo[idioma] || "sin asignar"} departamento={departamento} nota={0} imagenes={imagenes} totalFotos={imagenes.length} />
                {/* Botones de opciones */}
                <View style={style.btnsOpciones}>


                    {/* Ubicacion */}
                    <TouchableOpacity onPress={openMaps} style={{
                        width: "auto",
                        borderRadius: 5,
                        backgroundColor: "#CFE1F6",
                        paddingHorizontal: 15,
                        paddingVertical: 5,
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <MaterialIcons name="location-on" size={15} color="#136C96" />
                        <Text sx={{ fontSize: [14, 16, 18] }} style={{ color: "#136C96", fontWeight: "bold" }}>{PantallaVerSitioLenguaje["ubicacion"][idioma]}</Text>
                    </TouchableOpacity>
                    {/* Favorito */}
                    {
                        estado === 1 && <TouchableOpacity onPress={() => saveFavorito(route.params.data)} style={{
                            width: "auto",
                            borderRadius: 5,
                            backgroundColor: "#F6F5CF",
                            paddingHorizontal: 15,
                            paddingVertical: 5,
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <MaterialIcons name="favorite" size={15} color="#BFA519" />
                            <Text sx={{ fontSize: [14, 16, 18] }} style={{ color: "#BFA519", fontWeight: "bold", paddingHorizontal: 1 }}>{PantallaVerSitioLenguaje["favorito"][idioma]}</Text>
                        </TouchableOpacity>
                    }
                    {/* Llamar */}
                    <TouchableOpacity onPress={() => pressCall()} style={{
                        width: "auto",
                        borderRadius: 5,
                        backgroundColor: "#E3F6CF",
                        paddingHorizontal: 15,
                        paddingVertical: 5,
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <MaterialIcons name="call" size={15} color="#1E7C49" />

                        <Text sx={{ fontSize: [14, 16, 18] }} style={{
                            color: "#1E7C49",
                            fontWeight: "bold",
                            paddingHorizontal: 1
                        }}>{PantallaVerSitioLenguaje["llamar"][idioma]}
                        </Text>

                    </TouchableOpacity>
                </View>
                <ImagenBanner />


                {/* Descripcion */}
                <View style={{ width: "100%", flexDirection: "column", paddingVertical: 10, paddingHorizontal: 20 }}>
                    <Text sx={{ fontSize: [14, 18, 24] }} style={{ fontWeight: "bold", paddingVertical: 7 }}>{PantallaVerSitioLenguaje["Descripcion"][idioma]}</Text>
                    <View style={{
                        width: "100%",
                        backgroundColor: "white",
                        borderRadius: 8,
                        padding: 10,
                        alignSelf: "center"
                    }}>
                        <Text sx={{ fontSize: [14, 16, 18] }} style={{ color: "#454545", textAlign: "justify" }}>
                            {descripcionLugar[idioma]}
                        </Text>
                    </View>
                </View>
                {/* Horario */}
                <View style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                    paddingVertical: 10
                }}>
                    <Text sx={{ fontSize: [14, 18, 24] }} style={{ color: "#232020", fontWeight: "bold" }}>{PantallaVerSitioLenguaje["Horario"][idioma]}</Text>
                    {/*<Text style={{color: "#136C96", fontWeight: "bold"}}>26 Resenas</Text>*/}
                </View>

                {/* Horarios */}
                <View style={{ width: "100%" }}>
                    {/* Aqui va a recorrer un array con los horarios */}
                    <View style={{
                        width: "100%",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        paddingHorizontal: 20
                    }}>
                        {horario.length > 0 ? (horario.map((x, index) => {
                            return <View key={index}
                                style={{ width: "100%", justifyContent: "space-between", flexDirection: "row" }}>
                                <Text sx={{ fontSize: [14, 16, 18] }} style={{ color: "gray" }}>{x.dia}</Text>
                                <Text sx={{ fontSize: [14, 16, 18] }} style={{ color: "gray" }}>{x.horario}</Text>
                            </View>
                        })) : (<Text>* No hay horarios</Text>)}
                    </View>
                </View>
                {/* Precios de Entrada */}
                <View style={{ width: "100%", flexDirection: "row", paddingHorizontal: 20, paddingVertical: 10 }}>
                    <Text sx={{ fontSize: [14, 18, 24] }} style={{ color: "#232020", fontWeight: "bold" }}>{PantallaVerSitioLenguaje["Precio"][idioma]}</Text>
                </View>

                {/* Aqui va a recorrer un array con los precios */}
                <View style={{ width: "100%" }}>
                    <View style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        paddingHorizontal: 20,
                        flexWrap: "wrap",
                        gap: 4
                    }}>
                        {
                            Object.keys(precio || {}).map((x, index) => {
                                if (precio[x] !== "") {
                                    return <View style={{ backgroundColor: "black", width: "32%", borderRadius: 10 }} key={index}>
                                        <Text style={{ color: "white", textAlign: "center", paddingVertical: 10 }}>{PriceIdiom[x][idioma]}</Text>
                                        <Text style={{ backgroundColor: "white", textAlign: "center", paddingVertical: 10 }}>{precio[x]}</Text>
                                    </View>
                                }

                            })
                        }
                    </View>
                </View>

                {/* Servicios y Categorias */}
                <View style={{ width: "100%", flexDirection: "row" }}>
                    <View style={{ width: "50%", flexDirection: "column", paddingHorizontal: 20, paddingVertical: 10 }}>
                        <Text sx={{ fontSize: [14, 18, 24] }} style={{ color: "#232020", fontWeight: "bold" }}>{PantallaVerSitioLenguaje["Servicio"][idioma]}</Text>
                        <View style={{ width: "100%", paddingHorizontal: 20, paddingVertical: 10 }}>
                            {servicios.map((x, index) => {
                                return <Text sx={{ fontSize: [14, 16, 18] }} key={index} style={{ color: "#4A4A4A", fontWeight: "bold" }}>* {ServiciosIdiom[x][idioma]}</Text>
                            })}
                        </View>
                    </View>

                    <View style={{ width: "50%", flexDirection: "column", paddingHorizontal: 20, paddingVertical: 10 }}>
                        <Text sx={{ fontSize: [14, 18, 24] }} style={{ color: "#232020", fontWeight: "bold" }}>{PantallaVerSitioLenguaje["Categoria"][idioma]}</Text>
                        <View style={{ width: "100%", paddingHorizontal: 20, paddingVertical: 10 }}>
                            {
                                categorias.map((x, index) => {
                                    return <Text sx={{ fontSize: [14, 16, 18] }} key={index} style={{ color: "#4A4A4A", fontWeight: "bold" }}>* {CategoriesIdiom[x][idioma]}</Text>
                                })}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default DetallesSitio;

const style = StyleSheet.create({
    base: {
        flex: 1,
        backgroundColor: "#ECEEF0",
        position: "relative"
    },

    scrolliable: {
        flex: 1,
        backgroundColor: "green"
    },

    imgContenedor: {
        width: TamanioPantalla,
        height: 300,

    },

    btnsOpciones: {
        width: TamanioPantalla,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
    },


})