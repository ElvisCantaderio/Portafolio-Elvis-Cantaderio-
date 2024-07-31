import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from '@expo/vector-icons';
import { CardLugares } from "../components/PantallaInicio/CardLugares";
import { SitesServices } from "../services/FireStorage/SitesServices";
import { getAllSites, updateFieldDocumentStateCouch } from "../services/CouchDb/database_sitios";
const widthPantalla = Dimensions.get("window").width;
const heightPantalla = Dimensions.get("window").height;
import { PantallaAdministrarUsuarioLenguaje } from "../services/idiomas/PantallaAdministrarUsuarioLenguaje";
import { Idioma } from "../context/ContextoLogin";
import { PantallaAdministrarSitioLenguaje } from "../services/idiomas/PantallaAdministrarSitioLenguaje";
import ServicesCategoriesPriceIdiom from "../services/idiomas/ServicesCategoriesPriceIdiom";
const AdministracionSitios = () => {
    const { idioma, setIdioma } = useContext(Idioma);
    const { getSitesByStateWhere, updateFieldDocumentState } = SitesServices();
    const [traerDatos, setTraerDatos] = useState(true);
    const [sitios, setSitios] = useState([])
    const { CategoriesIdiom, ServiciosIdiom, PriceIdiom } = ServicesCategoriesPriceIdiom();


    useEffect(() => {
        if (traerDatos) {
            console.log("actualizando")
            getAllSites(0).then(x => {
                setSitios(x)
            }).catch(err => {
                console.log(err)
                setSitios([])
            })
        }
        setTraerDatos(false)
    }, [traerDatos, sitios])


    function recargar() {
        setTraerDatos(true)
    }

    //Funcion que sirve para poder aprobar o denegar sitios
    function cambiarEstadoSitioCouch(item, newState) {
        const id = item._id;
        const rev = item._rev;
        let datos = item;

        datos.estado = newState;
        delete datos.imagenes;
        delete datos._id;
        delete datos._rev;

        updateFieldDocumentStateCouch(datos, id, rev).then(x => {
            console.log("Se logro modificar el estado");
        }).catch(err => {
            console.log("Fallo la promesa");
            console.log(err);
        })

        setTraerDatos(true);
    }
    function aprobarSitio(id) {
        console.log(id)
        updateFieldDocumentState("sitios", id, 1).then(x => {
            console.log("Se logro actualizar")
        }).catch(err => {
            console.log("Fallo la promesa")
        })
        setTraerDatos(true);
    }

    function denegarSitio(id) {
        console.log("Denegando Sitio" + id)
        console.log(id)
        updateFieldDocumentState("sitios", id, 2).then(x => {
            console.log("Se logro actualizar")
        }).catch(err => {
            console.log("Fallo la promesa")
        })
        setTraerDatos(true);
    }

    return (
        <View style={style.contentStyle}>
            {/*Estadisticas de los sitios*/}
            <View style={{
                width: "100%",
                flexDirection: "column",
                alignItems: "center",
                padding: 15,
                backgroundColor: "white",
                marginBottom: 10,
                borderRadius: 10,
                borderColor: "#c5c4c4"
            }}>
                <Text style={{ fontSize: 30, padding: 10, fontWeight: "bold" }}>{PantallaAdministrarSitioLenguaje["estadisticaSitios"][idioma]}</Text>
                <View style={{ width: "100%", flexDirection: "row" }}>
                    {/*<View style={{width: "45%", flexDirection: "column"}}>*/}
                    {/*    <Text style={{width: "100%", textAlign: "center"}}>Aprobados</Text>*/}
                    {/*    <Text style={{width: "100%", textAlign: "center", fontSize: 30, fontWeight: "bold"}}>10</Text>*/}
                    {/*</View>*/}
                    <View style={{ width: "45%", flexDirection: "column" }}>
                        <Text style={{ width: "100%", textAlign: "center" }}>{PantallaAdministrarSitioLenguaje["sinAprobar"][idioma]}</Text>
                        <Text style={{
                            width: "100%",
                            textAlign: "center",
                            fontSize: 30,
                            fontWeight: "bold"
                        }}>{sitios.length}</Text>
                    </View>
                </View>
            </View>
            <FlashList
                horizontal={false}
                refreshing={false}
                data={sitios}
                onRefresh={() => {
                    recargar();
                }}
                showsVerticalScrollIndicator={false}
                estimatedItemSize={100}
                renderItem={({ item, index }) => {
                    return <View style={{
                        backgroundColor: "white",
                        padding: 30,
                        borderRadius: 10,
                        borderColor: "#c5c4c4",
                        marginBottom: 15
                    }}>
                        <View style={{
                            width: "100%",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-around",
                            borderRadius: 8
                        }}>
                            {/*Imagenes*/}
                            {(item.imagenes.length <= 0) && (
                                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{PantallaAdministrarSitioLenguaje["noSeEncontroImagenes"][idioma]}</Text>
                            )}
                            {
                                item.imagenes.map((x, index) => {
                                    return <Image
                                        key={index}
                                        source={{ uri: x }}
                                        style={{
                                            width: "49%",
                                            height: heightPantalla * 0.15,
                                            borderRadius: 8,
                                            marginBottom: 10
                                        }} />
                                })
                            }
                        </View>

                        {/*Titulo*/}
                        <Text style={style.textTitulo}>{PantallaAdministrarSitioLenguaje["titulo"][idioma]}</Text>
                        <Text style={style.textInfo}>{item.titulo.es}</Text>
                        <Text style={style.textTitulo}>Titulo en Ingles</Text>
                        <Text style={style.textInfo}>{item.titulo.en}</Text>
                        <Text style={style.textTitulo}>Titulo en Chino</Text>
                        <Text style={style.textInfo}>{item.titulo.ch}</Text>
                        <Text style={style.textTitulo}>Titulo en Hindi</Text>
                        <Text style={style.textInfo}>{item.titulo.hindi}</Text>
                        <Text style={style.textTitulo}>Titulo en Frances</Text>
                        <Text style={style.textInfo}>{item.titulo.fr}</Text>
                        <Text style={style.textTitulo}>Titulo en Arabe</Text>
                        <Text style={style.textInfo}>{item.titulo.ara}</Text>
                        <Text style={style.textTitulo}>Titulo en Bengali</Text>
                        <Text style={style.textInfo}>{item.titulo.beng}</Text>
                        <Text style={style.textTitulo}>Titulo en Ruso</Text>
                        <Text style={style.textInfo}>{item.titulo.rus}</Text>
                        <Text style={style.textTitulo}>Titulo en Portugues</Text>
                        <Text style={style.textInfo}>{item.titulo.port}</Text>
                        <Text style={style.textTitulo}>Titulo en Urdu</Text>
                        <Text style={style.textInfo}>{item.titulo.urd}</Text>
                        <Text style={style.textTitulo}>Titulo en Aleman</Text>
                        <Text style={style.textInfo}>{item.titulo.de}</Text>

                        {/*Descripcion*/}
                        <Text style={style.textTitulo}>{PantallaAdministrarSitioLenguaje["descripcion"][idioma]}</Text>
                        <Text style={style.textInfo}>{item.descripcionLugar.es}</Text>
                        <Text style={style.textTitulo}>Descripcion en Ingles</Text>
                        <Text style={style.textInfo}>{item.descripcionLugar.en}</Text>
                        <Text style={style.textTitulo}>Descripcion en Chino</Text>
                        <Text style={style.textInfo}>{item.descripcionLugar.ch}</Text>
                        <Text style={style.textTitulo}>Descripcion en Hindi</Text>
                        <Text style={style.textInfo}>{item.descripcionLugar.hindi}</Text>
                        <Text style={style.textTitulo}>Descripcion en Frances</Text>
                        <Text style={style.textInfo}>{item.descripcionLugar.fr}</Text>
                        <Text style={style.textTitulo}>Descripcion en Arabe</Text>
                        <Text style={style.textInfo}>{item.descripcionLugar.ara}</Text>
                        <Text style={style.textTitulo}>Descripcion en Bengali</Text>
                        <Text style={style.textInfo}>{item.descripcionLugar.beng}</Text>
                        <Text style={style.textTitulo}>Descripcion en Ruso</Text>
                        <Text style={style.textInfo}>{item.descripcionLugar.rus}</Text>
                        <Text style={style.textTitulo}>Descripcion en Portugues</Text>
                        <Text style={style.textInfo}>{item.descripcionLugar.port}</Text>
                        <Text style={style.textTitulo}>Descripcion en Urdu</Text>
                        <Text style={style.textInfo}>{item.descripcionLugar.urd}</Text>
                        <Text style={style.textTitulo}>Descripcion en Aleman</Text>
                        <Text style={style.textInfo}>{item.descripcionLugar.de}</Text>
                        {/*Correo*/}
                        <Text style={style.textTitulo}>{PantallaAdministrarSitioLenguaje["correo"][idioma]}</Text>
                        <Text style={style.textInfo}>{item.email}</Text>
                        {/*Numero de Telefono*/}
                        <Text style={style.textTitulo}>Tel:</Text>
                        <Text style={style.textInfo}>{item.telefono || "Telefono no disponible"}</Text>

                        {/*Departamento*/}
                        <Text style={style.textTitulo}>{PantallaAdministrarSitioLenguaje["departamento"][idioma]}</Text>
                        <Text style={style.textInfo}>{item.departamento}</Text>

                        {/*Horario*/}
                        <Text style={style.textTitulo}>{PantallaAdministrarSitioLenguaje["horario"][idioma]}</Text>
                        {
                            item.horario.length > 0 ? (
                                item.horario.map((x, index) => (
                                    <View key={index} style={{
                                        width: "100%",
                                        flexDirection: "row",
                                        justifyContent: "space-between"
                                    }}>
                                        <Text style={style.textInfo}>{x.dia}</Text>
                                        <Text>{x.horario}</Text>
                                    </View>
                                ))
                            ) : (
                               <Text style={style.textInfo}>Horarios no disponibles</Text>
                            )
                        }
                        <Text style={style.textTitulo}>GPS</Text>
                        <Text style={style.textInfo}>{
                            (item.ubicacion !== null) ?(
                                <Text>{item.ubicacion.latitude} {item.ubicacion.longitude}</Text>
                            ):(
                                <Text>Ubicacion no disponible</Text>
                            )
                        } </Text>
                        {/*Servicios*/}
                        <Text style={style.textTitulo}>{PantallaAdministrarSitioLenguaje["servicio"][idioma]}</Text>
                        <View style={{ width: "100%" }}>
                            {
                                item.servicios.map((x, index) => {
                                    return <Text key={index} style={style.textInfo}> *{ServiciosIdiom[x][idioma]}</Text>
                                })
                            }
                        </View>

                        {/*Categorias*/}
                        <Text style={style.textTitulo}>{PantallaAdministrarSitioLenguaje["categorias"][idioma]}</Text>
                        <View style={{ width: "100%" }}>
                            {item.categorias.map((x, index) => {
                                return <Text key={index} style={style.textInfo}>* {CategoriesIdiom[x][idioma]}</Text>
                            })}
                        </View>
                        {/*Precios*/}
                        <Text style={style.textTitulo}>{PantallaAdministrarSitioLenguaje["precio"][idioma]}</Text>
                        <View>
                            {Object.keys(item.precio || {}).length === 0 ? (
                                <Text style={style.textInfo}>No hay precios</Text>
                            ) : (
                                Object.keys(item.precio).map((x, index) => {
                                    if (item.precio[x] !== "") {
                                        return (
                                            <View
                                                style={{
                                                    width: "100%",
                                                    flexDirection: "row",
                                                    justifyContent: "space-around"
                                                }}
                                                key={index}
                                            >
                                                <Text style={style.textTitulo}>{PriceIdiom[x][idioma]}</Text>
                                                <Text style={style.textInfo}>{item.precio[x]}</Text>
                                            </View>
                                        );
                                    }
                                })
                            )}
                        </View>

                        <View
                            style={{ width: "100%", padding: 20, justifyContent: "space-around", flexDirection: "row" }}>
                            <TouchableOpacity onPress={() => cambiarEstadoSitioCouch(item, 1)} //ESTE ES EL DE APROBAR SITIO
                                style={{
                                    ...style.buttomStyle,
                                    backgroundColor: "#5bb122",
                                    borderColor: "#3c7716"
                                }}>
                                <Text style={{
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: 18,
                                    flex: 1,
                                    textAlign: "center",
                                    padding: 1
                                }}>{PantallaAdministrarSitioLenguaje["botonAprobar"][idioma]}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => cambiarEstadoSitioCouch(item, 2)} //ESTE ES EL DE DENEGAR SITIO
                                style={{ ...style.buttomStyle, backgroundColor: "#b12237", borderColor: "#77162d" }}>
                                <Text style={{
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: 18,
                                    flex: 1,
                                    textAlign: "center",
                                    padding: 1
                                }}>{PantallaAdministrarSitioLenguaje["botonDenegar"][idioma]}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }}
            />
        </View>
    )
}

export default AdministracionSitios;

const style = StyleSheet.create({
    contentStyle: {
        flex: 1,
        padding: 10
    },
    textTitulo: {
        fontWeight: "bold",
        fontSize: 20,
        paddingVertical: 10
    },
    textInfo: {
        color: "gray",
        fontSize: 18
    },
    buttomStyle: {
        borderRadius: 50,
        width: "45%",
        paddingVertical: 5,
        paddingHorizontal: 5,
        flexDirection: "row",
        alignItems: "center"

    }
})