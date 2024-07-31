import React, { useContext, useEffect } from 'react';
import { View } from "react-native";
import { StyleSheet } from "react-native";
import UserInfoAccount from "./UserInfoAccount";
import LoginButtom from "./LoginButtom";
import MenuButtoms from "./MenuButtoms";
import { useAuth } from "../../services/Authentication/FirebaseAuthentication";
import { MiContexto } from "../../context/ContextoLogin";
import { ContextoUser } from "../../context/ContextoUser";

const CustomDrawer = () => {
    const { miEstado, setMiEstado } = React.useContext(MiContexto);
    const { user, setUser } = React.useContext(ContextoUser);

    useEffect(() => {
        // console.log("Actualizando todo")
    }, [miEstado.logeado, user]);
    console.log(miEstado)

    // console.log("Drawer: " + miEstado)
    // console.log(user)

    return (
        <View style={{
            flex: 1,
            width: "100%",
            flexDirection: "column",
            justifyContent: "space-between"
        }}>
            <UserInfoAccount user={(miEstado.logeado) ? user : null} />
            <MenuButtoms />
            <LoginButtom Logeado={miEstado.logeado} />
        </View>

    )
}

export default CustomDrawer;

