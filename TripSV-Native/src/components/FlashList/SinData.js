import React from "react";
import {View, Image, Text} from "react-native";

const SinData = ({imagen = "../../assets/travelLost.gif", mensaje}) => {
    return (
        <View style={{
            borderRadius: 10,
            padding: 10,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Image resizeMethod={"auto"} style={{width: 100, height: 150}}
                   source={require("../../../assets/travelLost.gif")}/>
            <Text style={{fontWeight: "bold", fontSize: 30, textAlign: "center"}}>{mensaje}</Text>
        </View>
    )
}

export default SinData;