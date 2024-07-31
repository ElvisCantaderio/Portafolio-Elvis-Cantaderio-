import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useContext } from "react";
import { Idioma } from "../../context/ContextoLogin";
import { ContactosEmergencia } from "../../services/idiomas/ContactosEmergencia";
const alturaPantalla = Dimensions.get("window").height
const ModalEmergencia = ({ estilos, estiloTexto, colorIcon = "white", textoBtn }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { idioma, setIdioma } = useContext(Idioma);

    return (
        <View style={{ width: "100%" }}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={style.modalContent}>
                    <Text style={{ fontSize: 30, fontWeight: "bold" }}>{ContactosEmergencia["numerosEmergencia"][idioma]}</Text>
                    <View style={style.estiloNumeroInfo}>
                        <Image source={require('../../../assets/pnc.png')} />
                        <View style={style.contentText}>
                            <Text style={{ fontWeight: "bold" }}>911</Text>
                            <Text>
                                {ContactosEmergencia["numero911"][idioma]}</Text>
                        </View>
                    </View>
                    <View style={{ ...style.estiloNumeroInfo, backgroundColor: "#f1f1f1" }}>
                        <Image source={require('../../../assets/cruzRoja.png')} />
                        <View style={style.contentText}>
                            <Text style={{ fontWeight: "bold" }}>2222-5155</Text>
                            <Text>{ContactosEmergencia["cruzRoja"][idioma]}</Text>
                        </View>
                    </View>
                    <View style={style.estiloNumeroInfo}>
                        <Image source={require('../../../assets/bomberos.png')} />
                        <View style={style.contentText}>
                            <Text style={{ fontWeight: "bold" }}>2441-1223</Text>
                            <Text>{ContactosEmergencia["bomberos"][idioma]}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={_ => setModalVisible(false)}
                        style={{ width: "50%", backgroundColor: "#0D0B26", paddingVertical: 10, borderRadius: 10 }}>
                        <Text style={{ color: "white", textAlign: "center" }}>{ContactosEmergencia["cerrar"][idioma]}</Text>
                    </TouchableOpacity>
                </View>

            </Modal>
            <TouchableOpacity style={estilos} onPress={_ => setModalVisible(true)}>
                <Text style={estiloTexto}>{textoBtn}</Text>
                <Ionicons name="help-buoy-outline" size={20} color={colorIcon} />
            </TouchableOpacity>
        </View>

    )
}

export default ModalEmergencia;

const style = StyleSheet.create({
    modalContent: {
        width: "90%",
        height: alturaPantalla / 2,
        backgroundColor: 'white',
        borderRadius: 10,
        marginHorizontal: "5%",
        marginVertical: alturaPantalla / 4,
        borderColor: "#dadada",
        borderWidth: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around"
    },
    estiloNumeroInfo: {
        width: "100%",
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    contentText: {
        width: "70%",
        flexDirection: "column",
        paddingHorizontal: 10
    },
});
