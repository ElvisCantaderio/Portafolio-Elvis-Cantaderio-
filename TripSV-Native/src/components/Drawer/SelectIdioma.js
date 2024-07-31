import {ToastAndroid, View} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import {Ionicons} from "@expo/vector-icons";
import React, {useContext, useEffect,useState} from "react";
import {SecureStorageIdioma} from "../../services/LocalStorage/SecureStorageIdioma";
import {Idioma} from "../../context/ContextoLogin";
import { SeleccionIdioma } from "../../services/idiomas/componentes/drawer/SeleccionIdioma";

const SelectIdioma = () =>{
    const {getValueFor,save} = SecureStorageIdioma();
    const {idioma,setIdioma} = useContext(Idioma);
    const idiomas = [
        {
            idioma: "Español",
            clave: "es"
            
        },
        {
            idioma: "English",
            clave: "en"
        },
        {

            idioma: "português",
            clave: "port"
            
        },
        {
            idioma: "Français",
            clave: "fr"
            
        },
        {
            idioma: "हिंदी",
            clave: "hindi"
        }, {
            idioma: "عرب",
            clave: "ara"
        },{
            idioma: "বাংলা",
            clave: "beng"
        },{
            idioma: "Русский",
            clave: "rus"
        },{
            idioma: "普通话 中文",
            clave: "ch"
        },{
            idioma: "اردو",
            clave: "urd"
        },
        {
            idioma: "Deutsch",
            clave: "de"
        }

    ]

    useEffect(()=>{

    },[])

    const showToast = (mensaje) => {
        ToastAndroid.show(mensaje, ToastAndroid.SHORT)
    }
    function cambiarIdioma(idioma){
            setIdioma(idioma)
            save("idioma",idioma).then(x=>{
                showToast(SeleccionIdioma["cambioIdioma"][idioma])
            }).catch(err=>{
                console.log("Ocurrio un Error cambiando el idioma")
            })
    }


    return (
        <View style={{paddingVertical: 10, width: "100%"}}>
            <SelectDropdown
                disabled={false}
                data={idiomas}
                defaultButtonText={"Elejir Idioma"}
                buttonTextAfterSelection={(selectedItem) => {
                    return selectedItem.idioma
                }}
                rowTextForSelection={(item) => item.idioma}
                buttonStyle={{backgroundColor: "#0D0B26",borderRadius: 8, width: "100%"}}
                buttonTextStyle={{color: "white",fontWeight : "bold",fontSize: 14}}
                renderDropdownIcon={_ => {
                    return (
                        <Ionicons name="earth-outline" size={22} color="white" />
                    )
                }}
                showsVerticalScrollIndicator={true}
                dropdownIconPosition={"right"}
                dropdownStyle={{backgroundColor: "#0D0B26"}}
                rowStyle={{}}
                rowTextStyle={{color: "white", fontSize: 14}}
                onSelect={(selectedItem) => {
                    // console.log(selectedItem.clave)
                    cambiarIdioma(selectedItem.clave);
                }}
            />
        </View>
    )
}
export default SelectIdioma;