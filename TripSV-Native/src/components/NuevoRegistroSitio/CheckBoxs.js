import { View, StyleSheet } from "react-native";
import Checkbox from 'expo-checkbox';
import { useEffect, useCallback } from "react";
import { Text } from "react-native";

const CheckBoxs = ({ titulo = "Titulo", checkValue, setCheckValue, values = [] }) => {

        // console.log("value"     )
        // console.log(checkValue)
        const handleInputChange = useCallback((name, value) => {
                console.log("Value: " + value)
                let updatedValues = [...checkValue];
                if (!value) {
                        updatedValues = updatedValues.filter((item) => item !== name);
                } else if (!updatedValues.includes(name)) {
                        updatedValues.push(name);
                }
                setCheckValue(updatedValues);
        }, [checkValue, setCheckValue]);

        return (
            <View style={styles.container}>
                    <Text style={styles.titulo}>{titulo}</Text>
                    <Text style={{ color: "gray" }}>* Elije multiples opciones</Text>
                    <View style={styles.section}>
                            {values.map((x, index) => {
                                    return (
                                        <View key={x.id} style={{ flexDirection: "row", alignItems: "center", width: "50%" }}>
                                                        <Checkbox
                                                            style={styles.checkbox}
                                                            value={checkValue.includes(x.id)}
                                                            onValueChange={(value) => handleInputChange(x.id, value)}
                                                            color={'black'}
                                                        />
                                                        <Text style={styles.paragraph}>{x.name}</Text>
                                        </View>
                                    )
                            })}
                    </View>
            </View>
        )
}

export default CheckBoxs;

const styles = StyleSheet.create({
        container: {
                flex: 1,
        },
        titulo: {
                fontSize: 20,
                fontWeight: "bold",
                color: "#0D0B26",
                marginVertical: 5
        },
        section: {
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
                borderColor: 'black',
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                margin: 16,
        },
        paragraph: {
                fontSize: 15,
        },
        checkbox: {
                margin: 8,
        },
})