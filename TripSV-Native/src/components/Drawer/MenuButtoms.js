import React, {useContext, useEffect, useState} from "react";
import {View, TouchableOpacity, StyleSheet, Text} from "react-native";
import {Ionicons, FontAwesome5, Feather, MaterialCommunityIcons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import ModalEmergencia from "./ModalEmergencia";
import {MiContexto} from "../../context/ContextoLogin";
import {MenuLenguaje} from "../../services/idiomas/MenuLenguaje";
import {Idioma} from "../../context/ContextoLogin";
import SelectDropdown from "react-native-select-dropdown";
import {PantallaInicioLenguaje} from "../../services/idiomas/PantallaInicioLenguaje";
import SelectIdioma from "./SelectIdioma";
const MenuButtoms = () => {
    const {miEstado, setMiEstado} = React.useContext(MiContexto);
    const navigation = useNavigation();
    const {idioma, setIdioma} = useContext(Idioma)
    
    return (
        <View style={{...style.btnContainer, flex: 1}}>
            <View style={style.btnContainer}>
                <Text style={{
                    width: "100%", paddingVertical: 10, textAlign: "center",
                    borderBottomWidth: 1,
                    borderBottomColor: "gray"
                }}>{MenuLenguaje["confiBasicas"][idioma]}</Text>

                {
                    (miEstado.logeado) && (
                        <TouchableOpacity style={style.btnDrawer} onPress={() => navigation.navigate('Estado Sitio')}>
                            <Text style={style.btnDrawerText}>{MenuLenguaje["estadoSitios"][idioma]}</Text>
                            <MaterialCommunityIcons name="map-marker-radius-outline" size={20} color="white"/>
                        </TouchableOpacity>
                    )
                }
                {/*Es un modal*/}
                <ModalEmergencia textoBtn={MenuLenguaje["contactoEmergencia"][idioma]} estilos={style.btnDrawer} estiloTexto={style.btnDrawerText} colorIcon={"white"}/>

                <Text style={{
                    width: "100%", paddingVertical: 10, textAlign: "center",
                    borderBottomWidth: 1,
                    borderBottomColor: "gray"
                }}>Idioma / Language</Text>
                {/*Selector de idioma*/}
                <SelectIdioma/>




            </View>
            {/*Parde de administracion si el usuario trae el rol de administrador aqui se podra ver*/}
            {
                (miEstado.role === "administrador") && (
                    <View style={style.btnContainer}>
                        <Text style={{
                            width: "100%",
                            paddingVertical: 10,
                            textAlign: "center",
                            borderBottomWidth: 1,
                            borderBottomColor: "gray"
                        }}>{MenuLenguaje["administrar"][idioma]}</Text>
                        <TouchableOpacity style={style.btnDrawer}
                                          onPress={() => navigation.navigate('Administracion Usuario')}>
                            <Text style={style.btnDrawerText}>{MenuLenguaje["adminUsuario"][idioma]}</Text>
                            <Feather name="users" size={20} color="white"/>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.btnDrawer}
                                          onPress={() => navigation.navigate('Administracion Sitios')}>
                            <Text style={style.btnDrawerText}>{MenuLenguaje["adminSitio"][idioma]}</Text>
                            <Feather name="map" size={20} color="white"/>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.btnDrawer}
                                          onPress={() => navigation.navigate('Administracion Anuncio')}>
                            <Text style={style.btnDrawerText}>{MenuLenguaje["adminPublicidad"][idioma]}</Text>
                            <Ionicons name="megaphone-outline" size={20} color="white"/>
                        </TouchableOpacity>
                    </View>
                )
            }


        </View>
    )
}
export default MenuButtoms;

const style = StyleSheet.create({
    btnContainer: {
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        paddingHorizontal: "5%"

    },
    btnDrawer: {
        width: "100%",
        borderRadius: 8,
        backgroundColor: "#0D0B26",
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",


    },
    btnDrawerText: {
        color: "white"
    }
})