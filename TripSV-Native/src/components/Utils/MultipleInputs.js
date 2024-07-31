import React from 'react';
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
const colors = {
    0: "#0D0B26",
    1: "#6bf561",
    2: "#f56161",
}

/**
 * Componente para crear multiples inputs
 * @param valueInput valor del input
 * @param setValueInput funcion para cambiar el valor del input
 * @param infoMensaje mensaje de ayuda para 
 * @param keyboard tipo de teclado numeric, email-address, phone-pad, number-pad, ascii-capable by default
 * @param title titulo del input
 * @param placeHolder placeholder del input
 * @param regExr expresion regular para validar el input
 * @param multiline si el input es multilinea por defecto falso
 * @param maxLength maximo de caracteres por defecto 100
 * @returns {JSX.Element}
 * @constructor
 */
const MultipleInputs = ({ valueInput, setValueInput, infoMensaje = "Info mensaje", multiline = false, keyboard = "ascii-capable", title = "Title Example", placeHolder = "Placer Holder example", regExr, maxLength = 100 }) => {


    const [valid, setValid] = useState(0);

    useEffect(() => {
        setValid(0)
        if (valueInput.length > 0 && valueInput.match(regExr)) {
            setValid(1);
        } else if (valueInput.length > 0 && !valueInput.match(regExr)) {
            setValid(2);
        }
        setValueInput(valueInput.replace(/\+/g, ''))

    }, [valueInput]);

    console.log(valueInput)
    return (
        <View>
            <Text style={styles.titulo}>{title}</Text>
            <Text style={{ color: "gray" }}>* {infoMensaje}</Text>
            <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
               <View  style={{ ...styles.input, width: "85%", borderWidth: 1, flexDirection: "row",alignItems: "center"}}>
                   <TextInput style={{flex: 1}} maxLength={maxLength} multiline={multiline} editable={true} keyboardType={keyboard} onChangeText={setValueInput} value={valueInput}
                              placeholder={placeHolder} />
                   <Text style={{paddingHorizontal: 2}}>{`${valueInput.length}/${maxLength}`}</Text>
               </View>
                <Ionicons name="checkmark-circle-outline" size={24} color={colors[valid]} />

            </View>

        </View>
    )
}

export default MultipleInputs;

const styles = StyleSheet.create({
    titulo: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0D0B26",
        marginVertical: 5
    },
    input: {

        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10
    },
});