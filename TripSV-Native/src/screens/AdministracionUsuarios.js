import React, { useState, useEffect, useContext } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";

import { FlashList } from "@shopify/flash-list";

import { Idioma } from "../context/ContextoLogin";
import { PantallaAdministrarUsuarioLenguaje } from "../services/idiomas/PantallaAdministrarUsuarioLenguaje";

import { userCouchInfo, getUsersByRole, getUsersByEmail, changeRoleUsers } from "../services/CouchDb/database_roles";

const AdministracionUsuarios = () => {
    // const { searchRoleByEmail, changeRoleUser, getUsersByRol } = UserServices()
    const { idioma, setIdioma } = useContext(Idioma);
    //BuscarUsuario
    const [usuarioBuscar, setUsuarioBuscar] = useState([]);
    const [roles, setRoles] = useState([["usuario"], ["administrador"]]);
    const [administradores, setAdministradores] = useState([]);

    const [recargar, setRecargar] = useState(true);
    const [mensaje, setMensaje] = useState(PantallaAdministrarUsuarioLenguaje["mensajeUsuario"][idioma]);
    //Usuario
    const [userInput, onChangeText] = useState('')

    const [administradoresCouch, setAdministradoresCouch] = useState([]);
    const [usuarioBuscarCouch, setUsuarioBuscarCouch] = useState([]);

    useEffect(() => {
        if (recargar) {

            //Cargamos todos los Usuarios con rol de administrador
            getUsersByRole().then(x => {
                setAdministradoresCouch(x);
            }).catch(console.log());

        }
        setRecargar(false)
    }, [recargar, usuarioBuscarCouch])

    console.log(usuarioBuscarCouch)

    //Obteniendo un usuario en especifico por medio del email
    function searchUserByEmail(email) {
        console.log("Buscando: " + email);
        getUsersByEmail(email).then(x => {
            console.log("AQUI ESTAN LOS USERS ");
            console.log(x);
            if (x.length > 0) {
                setUsuarioBuscarCouch(x);
            } else {
                console.log("No se encontro")
                setUsuarioBuscarCouch([])
                setMensaje(PantallaAdministrarUsuarioLenguaje["usuarioNoEncotrado"][idioma])
                actualizar();
            }
        }).catch(console.log("ESTE ES EL CATCH DEL ROLE USER"));
        onChangeText('');

    }



    function actualizar() {
        setRecargar(true)
    }


    //Agrega y Quita Rol
    function cambiarRolCouch(email, rev, id, role) {
        (role === "administrador") ? console.log("Quitando Rol") : console.log("Agregando Rol");
        changeRoleUsers(email, rev, id, role).then(x => {
            console.log("Rol cambiado con exito");
        }).catch(err => {
            console.log(err)
        })
        setUsuarioBuscarCouch([]);
        setMensaje('El usuario aparecera aqui');
        actualizar();
    }



    return (
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
            <View style={{
                width: "100%",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: 10,
                padding: 15,
                paddingBottom: 19
            }}>
                <Text style={{ padding: 10, fontWeight: "bold", fontSize: 25 }}>{PantallaAdministrarUsuarioLenguaje["busquedaUsuario"][idioma]}</Text>
                <TextInput placeholder={"usuario@gmail.com"}
                    value={userInput}
                    onChangeText={onChangeText}
                    style={{
                        borderWidth: 1,
                        borderColor: "#ecebeb",
                        backgroundColor: "white",
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        width: "100%",
                        borderRadius: 10
                    }} />
                <TouchableOpacity style={{
                    backgroundColor: "#273746",
                    marginTop: 10,
                    paddingVertical: 10,
                    width: "50%",
                    borderRadius: 10,
                }} onPress={() => searchUserByEmail(userInput)}>

                    <Text style={{ color: "white", textAlign: "center" }}>{PantallaAdministrarUsuarioLenguaje["buscarUsuario"][idioma]}</Text>
                </TouchableOpacity>

                <View
                    style={{
                        width: "100%",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "#F8F9F9",
                        borderRadius: 10,
                        padding: 20,
                        marginTop: 15,
                    }}>
                    {
                        (usuarioBuscarCouch.length < 1) ? (
                            <Text style={{ textAlign: "center", fontSize: 18, color: "gray" }}>
                                {mensaje}
                            </Text>
                        ) : (
                            <View style={{ width: "100%" }}>
                                <Text style={{ fontWeight: "bold", fontSize: 17, textAlign: "center" }}>{PantallaAdministrarUsuarioLenguaje["usuarioEncontrado"][idioma]}</Text>
                                <Text style={{ marginTop: 10 }}>Usuario: {usuarioBuscarCouch[0].email} </Text>
                                <Text>Rol: {usuarioBuscarCouch[0].role}</Text>
                                <TouchableOpacity
                                    onPress={() => cambiarRolCouch(usuarioBuscarCouch[0].email, usuarioBuscarCouch[0]._rev, usuarioBuscarCouch[0].id, usuarioBuscarCouch[0].role)}
                                    style={{
                                        padding: 10,
                                        backgroundColor: "#273746",
                                        width: "50%",
                                        borderRadius: 10,
                                        alignSelf: "flex-end"
                                    }}>
                                    <Text style={{ color: "white", textAlign: "center" }}>{PantallaAdministrarUsuarioLenguaje["asignarAdmin"][idioma]}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </View>
            </View>

            <Text style={{ width: "100%", paddingVertical: 10, fontSize: 22, fontWeight: "bold" }}>{PantallaAdministrarUsuarioLenguaje['titulo2'][idioma]}</Text>
            {/* Mostrar usuarios*/}
            <View style={{ flex: 1, paddingHorizontal: 10, borderRadius: 2 }}>
                {/*Agregar la flatlist*/}
                <FlashList
                    horizontal={false}
                    refreshing={false}
                    onRefresh={() => actualizar()}

                    data={administradoresCouch}
                    showsVerticalScrollIndicator={true}
                    estimatedItemSize={20}
                    renderItem={({ item, index }) => {
                        return <View style={{
                            width: "100%",
                            backgroundColor: "white",
                            padding: 10,
                            marginBottom: 10,
                            borderRadius: 4,
                        }}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ fontWeight: "bold" }}>Email: </Text>
                                <Text>{item.email}</Text>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ fontWeight: "bold" }}>Rol: </Text>
                                <Text>{item.role}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => cambiarRolCouch(item.email, item._rev, item.id, item.role)}
                                style={{
                                    padding: 10,
                                    backgroundColor: "#273746",
                                    width: "50%",
                                    borderRadius: 10,
                                    alignSelf: "flex-end"
                                }}>
                                <Text style={{ color: "white", textAlign: "center" }}>{PantallaAdministrarUsuarioLenguaje["quitarAdmin"][idioma]}</Text>
                            </TouchableOpacity>
                        </View>
                    }}

                />

            </View>
        </View>

    )
}

export default AdministracionUsuarios;