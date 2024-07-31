import {ActivityIndicator, Image, Text, View} from "react-native";
import React, {useEffect} from "react";


const ModalRegistro = ({mensajeModal = "Cargando Sitio"})=> {
    useEffect(() => {

    }, [mensajeModal]);

    return (
        <View style={{width: "100%",padding: 20, backgroundColor: "white", flex: 1, flexDirection: "column",justifyContent: "space-around", alignItems: "center"}}>

            <Image resizeMethod={"auto"} style={{width: "90%", height: "40%", padding: 10}} source={require("../../../assets/map.gif") } />
            <View style={{flexDirection: "column",alignItems: "center",justifyContent: "center"}}>
                <Text style={{fontSize: 20,fontWeight: "bold", marginVertical: 10}}>
                    {mensajeModal}
                </Text>
                <ActivityIndicator size="large" color="black"/>
            </View>
        </View>
    )
}

export default ModalRegistro;