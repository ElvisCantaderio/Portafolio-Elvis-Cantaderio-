import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useState, useContext } from "react";
import { Ionicons } from '@expo/vector-icons';
import { PantallaAgregarNuevoSitio } from '../../services/idiomas/PantallaAgregarNuevo';
import { Idioma } from '../../context/ContextoLogin';


const SelectDepartamento = ({ options, onSelect , select}) => {
        const { idioma, setIdioma } = useContext(Idioma);
        const [isVisible, setIsVisible] = useState(false);
        const [selectedOption, setSelectedOption] = useState(null);

        const toggleDropdown = () => {
                setIsVisible(!isVisible);
        };

        const handleOptionSelect = (option) => {
                setSelectedOption(option);
                onSelect(option);
                toggleDropdown();
        };

        return (
                <View style={{}}>
                        <Text style={styles.titulo}>{PantallaAgregarNuevoSitio["departamento"][idioma]}</Text>
                        <Text style={{ color: "gray" }}>{PantallaAgregarNuevoSitio["elegirdepartamento"][idioma]}</Text>
                        <TouchableOpacity style={{ margin: 12, borderWidth: 1, borderColor: "black", borderRadius: 10, padding: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} onPress={toggleDropdown}>
                                <Text>{PantallaAgregarNuevoSitio["selecciondepa"][idioma]}</Text>
                                <Ionicons name="md-open-outline" size={22} color="black" />
                        </TouchableOpacity>
                        <Modal
                                animationType="slide"
                                transparent={true}
                                visible={isVisible}
                                onRequestClose={toggleDropdown}
                        >
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "white" }}>
                                        {options.map((option, index) => (
                                                <TouchableOpacity
                                                        key={index}
                                                        onPress={() => handleOptionSelect(option)}
                                                        style={{ padding: 10, width: "90%", paddingHorizontal: 10, paddingVertical: 10, borderWidth: 1, borderColor: "black", marginBottom: 10 }}
                                                >
                                                        <Text style={{ textAlign: "center", fontSize: 14 }}>{option}</Text>
                                                </TouchableOpacity>
                                        ))}
                                        <TouchableOpacity
                                                style={{ width: "50%", paddingHorizontal: 10, paddingVertical: 15, borderRadius: 10, backgroundColor: "black" }}
                                                onPress={toggleDropdown}>
                                                <Text style={{ color: "white" }}>Cancelar</Text>
                                        </TouchableOpacity>
                                </View>
                        </Modal>
                        {select && <Text>Opción seleccionada: {select}</Text>}
                </View>
        );
}

export default SelectDepartamento;

const styles = StyleSheet.create({
        titulo: {
                fontSize: 20,
                fontWeight: "bold",
                color: "#0D0B26",
                marginVertical: 5
        }
});