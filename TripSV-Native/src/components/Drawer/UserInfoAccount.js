import React, { useContext } from 'react';
import { ImageBackground, Text } from "react-native";
import { MenuLenguaje } from '../../services/idiomas/MenuLenguaje';
import { Idioma } from '../../context/ContextoLogin';
const UserInfoAccount = ({ user }) => {
    let usuario, correo, foto;
    const { idioma, setIdioma } = useContext(Idioma);
    // console.log("Me vino: " + user)
    if (user !== null) {
        usuario = user.displayName;
        correo = user.email;
        foto = { uri: user.photoURL }
    } else {
        usuario = MenuLenguaje["invitado"][idioma];
        correo = MenuLenguaje["iniciaSesionParaObtenerBeneficios"][idioma];
        foto = require("../../../assets/profile.png");
    }
    return (

        <ImageBackground
            style={{
                width: "100%",
                height: 110,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
            source={{ uri: "https://images.ctfassets.net/hrltx12pl8hq/5KiKmVEsCQPMNrbOE6w0Ot/341c573752bf35cb969e21fcd279d3f9/hero-img_copy.jpg?fit=fill&w=600&h=400" }}>

            <ImageBackground resizeMode="cover" backgroundColor="white"
                borderRadius={100}
                style={{
                    width: 50,
                    height: 50,
                }}
                source={foto}></ImageBackground>
            <Text numberOfLines={1} ellipsizeMode="tail"
                style={{
                    color: "white",
                    fontSize: 22,
                    fontWeight: "bold"

                }}>{usuario}</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: "white", fontSize: 12 }}>{correo}</Text>
        </ImageBackground>
    )
}

export default UserInfoAccount;