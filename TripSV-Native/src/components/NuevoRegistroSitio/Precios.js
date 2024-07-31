import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { PantallaAgregarNuevoSitio } from "../../services/idiomas/PantallaAgregarNuevo";
import { Idioma } from "../../context/ContextoLogin";

const Precios = ({ precios, precio, setPrecio, precioRegex }) => {
        const { idioma, setIdioma } = useContext(Idioma);

        useEffect(() => {

                if (precio !== null) {

                        setPrecio((prevState) => {
                                const newState = { ...prevState };
                                precios.forEach((x) => {

                                        if (!newState[x.id]) {
                                                newState[x.id] = "";
                                        }
                                });
                                return newState;
                        });
                }
        }, []);
        const handleInputChange = (name, value) => {

                if (precioRegex.test(value) || value === "") {
                        // Actualizar el estado 'precio' directamente
                        setPrecio((prevState) => ({ ...prevState, [name]: value }));
                }

        };

        return (
            <View>
                    <Text style={styles.titulo}>{PantallaAgregarNuevoSitio["preciosdellugar"][idioma]}</Text>
                    <Text style={{ color: "gray" }}>
                    {PantallaAgregarNuevoSitio["precios"][idioma]}
                    </Text>
                    {precios.map((x, index) => {
                            return <View key={index} style={styles.inputContainer}>
                                    <Text style={styles.label}>{x.name}</Text>
                                    <TextInput
                                        value={(precio)? precio[x.id]: ""}
                                        keyboardType={"numeric"}
                                        onChangeText={(value) => handleInputChange(x.id, value)}
                                        style={{
                                                ...styles.input,
                                                borderColor: "black"
                                        }}
                                        placeholder="0.00"
                                    />
                            </View>
                    })}
            </View>
        );
};

export default Precios;

const styles = StyleSheet.create({
        titulo: {
                fontSize: 20,
                fontWeight: "bold",
                color: "#0D0B26",
                marginVertical: 5,
        },
        inputContainer: {
                margin: 12,
                flexDirection: "row",
                alignItems: "center",
        },
        label: {
                width: "30%",
                borderTopStartRadius: 10,
        },
        input: {
                flex: 1,
                borderWidth: 1,
                padding: 5,
                borderRadius: 10,
        },
});
