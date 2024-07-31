import React, {useContext, useEffect, useState} from "react";
import {View,Text} from "dripsy";
import {Modal, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, TouchableOpacity} from "react-native";
import {ContextoUser} from "../context/ContextoUser";
import {Idioma} from "../context/ContextoLogin";
import {useNavigation} from "@react-navigation/native";
import ServicesCategoriesPriceIdiom from "../services/idiomas/ServicesCategoriesPriceIdiom";
import {formatoFecha} from "../components/NuevoSitio/ObtenerFechaActual";
import {MensajeModal} from "../services/idiomas/componentes/screen/nuevoRegistroSitio/MensajeModal";
import traducir from "../services/LibreTranslate/Traducir";
import {updateFieldDocumentStateCouch} from "../services/CouchDb/database_sitios";
import ModalRegistro from "../components/NuevoRegistroSitio/ModalRegistro";
import {PickerMultipleImages} from "../components/Utils/PickerMultipleImages";
import MultipleInputs from "../components/Utils/MultipleInputs";
import {LocaltionInfo} from "../components/NuevoRegistroSitio/LocationInfo";
import SelectDepartamento from "../components/NuevoRegistroSitio/SelectDepartamento";
import {departamentoList} from "../filters/Departamentos";
import Precios from "../components/NuevoRegistroSitio/Precios";
import CheckBoxs from "../components/NuevoRegistroSitio/CheckBoxs";
import HorarioPicker from "../components/NuevoRegistroSitio/HorarioPicker";


const EditarSitio =({route})=>{
    // const { imagenes, estado, email, titulo, descripcionLugar, telefono, ubicacion, departamento, precio, servicios, categorias, horario } = route.params.data;
    // console.log(JSON.stringify(route.params.data,null, 2))
    const { user, setUser } = React.useContext(ContextoUser);
    const { idioma, setIdioma } = useContext(Idioma);
    const navigation = useNavigation();
    const {categoriesList,servicesList,priceList} = ServicesCategoriesPriceIdiom();
    const [dehabilitar, setDeshabilitar] = useState(false);
    const [modal, setModal] = useState(false);
    const [mensajeModal, setMensajeModal] = useState("Iniciando Carga de sitio!!!");
    // Estado de los datos para la obtencion de los mismos
    // const [image, setImage] = useState([]);
    const [name, setName] = useState(route.params.data.titulo["es"]);
    const [description, setDescription] = useState(route.params.data.descripcionLugar["es"]);
    const [telefono, setTelefono] = useState(route.params.data.telefono);
    const [ubicacion, setUbicacion] = useState(route.params.data.ubicacion);
    const [departamento, setDepartamento] = useState(route.params.data.departamento);
    const [precio, setPrecio] = useState(route.params.data.precio);
    const [horarios, setHorario] = useState(route.params.data.horario);
    const [categorias, setCategorias] = useState(route.params.data.categorias);
    const [servicios, setServicios] = useState(route.params.data.servicios)
    const [fecha, setFecha] = useState(formatoFecha(new Date(), 'yyyy-mm-dd'));


    useEffect(() => {
        console.log(user.email)
    }, [mensajeModal]);
    // Funcion para la validacion de los datos Regex
    const paterns = {
        name: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+(?:\s+[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+){1,5}(?<!\s)/i,
        telefono: /^[0-9]+$/i,
        precio: /^\d*\.?\d{0,2}$/
    };

    // Validacion del formulario y envio de los datos
    const validacion = async () => {

        // console.log("Verificando")
        // if (image.length < 3) {
        //     ToastAndroid.show("Imagenes Faltante", 1);
        //     return false;
        // }
        if(!name.match(paterns.name)){
            ToastAndroid.show("Nombre incorrecto", 1);
            return false;
        }
        if(!description.match(paterns.name)){
            ToastAndroid.show("Descripcion incorrecta", 1);
            return false;
        }

        // if(!telefono.match(paterns.telefono)){
        //     ToastAndroid.show("Telefono incorrecto", 1);
        //     return false;
        // }

        // if(!ubicacion){
        //     ToastAndroid.show("Ubicacion incorrecta", 1);
        //     return false;
        // }

        if(!departamento){
            ToastAndroid.show("Departamento incorrecto", 1);
            return false;
        }

        // if(precio === null){
        //     ToastAndroid.show("Precio incorrecto", 1);
        //     return false;
        // }

        if(servicios.length < 1){
            ToastAndroid.show("Servicios incorrecto", 1);
            return false;
        }

        if(categorias.length < 1){
            ToastAndroid.show("Categorias incorrecto", 1);
            return false;
        }


        // if(horarios.length < 1){
        //     ToastAndroid.show("Horario incorrecto", 1);
        //     return false;
        // }
        ToastAndroid.show("Formulario Correcto", 1);
        setModal(true);
        setMensajeModal(MensajeModal["traduciendoSitio"][idioma]); //Traduciendo sitio por favor espere
        // Traducir el nombre y la descripcion
        const ingles = await traducir("es", "en", name, description);
        const chino = await traducir("es", "zh", name, description);
        const hindi = await traducir("es", "hi", name, description);
        const frances = await traducir("es", "fr", name, description);
        const arabe = await traducir("es", "ar", name, description);
        const bengali = await traducir("es", "bn", name, description);
        const ruso = await traducir("es", "ru", name, description);
        const portugues = await traducir("es", "pt", name, description);
        const urdu = await traducir("es", "ur", name, description);
        const aleman = await traducir("es", "de", name, description);
        setMensajeModal(MensajeModal["confirmacion"][idioma]) //Sitio traducido correctamente

        const sitio = {
            estado: 0,
            email: user.email,
            titulo: {
                en: ingles[0] || name,
                es: name,
                ch: chino[0] || name,
                hindi: hindi[0] || name,
                fr: frances[0] || name,
                ara: arabe[0] || name,
                beng: bengali[0] || name,
                rus: ruso[0] || name,
                port: portugues[0] || name,
                urd: urdu[0] || name,
                de: aleman[0] || name
            },
            descripcionLugar: {
                en: ingles[1] || description,
                es: description,
                ch: chino[1] || description,
                hindi: hindi[1] || description,
                fr: frances[1] || description,
                ara: arabe[1] || description,
                beng: bengali[1] || description,
                rus: ruso[1] || description,
                port: portugues[1] || description,
                urd: urdu[1] || description,
                de: aleman[1] || description,
            },
            telefono: telefono,
            ubicacion: ubicacion,
            departamento: departamento,
            precio: precio,
            servicios: servicios,
            categorias: categorias,
            horario: horarios,
            fecha: fecha
        }
        // console.log(JSON.stringify(sitio, null, 2))
        console.log("a subir sitio")
        const subida  = await updateFieldDocumentStateCouch(sitio,route.params.data._id, route.params.data._rev);
        console.log("Sitio actualizado")
        console.log(subida)
        //Verificar si se subio el sitio
        if(!subida){
            // ToastAndroid.show("Error al subir el sitio", ToastAndroid.SHORT);
            setMensajeModal(MensajeModal["mensajeError"][idioma]);
            ToastAndroid.show("Error al actualizar el sitio", ToastAndroid.SHORT);
            setModal(false);
            return false;
        }else{
            // ToastAndroid.show("Sitio subido", ToastAndroid.SHORT);
            setMensajeModal(MensajeModal["sitioSubido"][idioma])
        }
        // ToastAndroid.show("Subiendo imagenes espere un momento", ToastAndroid.SHORT);
        // setMensajeModal(MensajeModal["mensajeEspera"][idioma])


        setMensajeModal(MensajeModal["revision"][idioma]); //sitio enviado correctamente para revision
        // ToastAndroid.show("Sitio enviado correctamente para revision!!!", ToastAndroid.SHORT);
        setModal(false);
        return true;
    }

    const enviar = async () => {
        setMensajeModal(MensajeModal["cargando"][idioma]);//iniciando carga de sitio

        const enviado = await validacion();
        if(enviado){
            // await resetear();
            ToastAndroid.show("Sitio enviado correctamente para revision!!!", ToastAndroid.SHORT);
            navigation.navigate('Estado Sitio');
        }
        navigation.navigate('Estado Sitio');
    }



    // console.log(JSON.stringify(route.params.data,null,2))
    return (
        <SafeAreaView style={style.container}>
            {/*Modal que se activa al enviar un sitio*/}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modal}
                children={<ModalRegistro mensajeModal={mensajeModal}/>}
            />

            <ScrollView showsVerticalScrollIndicator={false}>

                {/*    Imagenes esta implementacion no esta disponible aun*/}
                {/*<PickerMultipleImages image={image} setImage={setImage} maxImages={3} base64={true} />*/}
                {/*Informacion del sitio esta sera la informacion mas basica como texto*/}
                {/*    Titulo*/}
                <MultipleInputs infoMensaje={"Ingrese un titulo para su sitio"} valueInput={name} setValueInput={setName} title={"Titulo del sitio"} placeHolder={"Ingresa el nombre del sitio aqui"} regExr={paterns.name} maxLength={50} />
                {/*    Descripcion*/}
                <MultipleInputs infoMensaje={"Ingrese una descripcion breve para su sitio"} valueInput={description} setValueInput={setDescription} title={"Descripcion del sitio"} multiline={true} placeHolder={"Ingresa la descripcion del sitio aqui"} maxLength={400} regExr={paterns.name} />
                {/*    Numero de telefono*/}
                <MultipleInputs infoMensaje={"Ingrese su numero sin codigo de area"} valueInput={telefono} setValueInput={setTelefono} title={"Numero de telefono"} keyboard="numeric" placeHolder={"0000-0000"} maxLength={8} regExr={paterns.telefono} />

                {/* Locacion */}
                <LocaltionInfo ubicacion={ubicacion} setUbicacion={setUbicacion} />
                {/* Departamento */}
                <SelectDepartamento options={departamentoList} onSelect={setDepartamento} select={departamento} />

                {/* Precios */}
                <Precios precio={precio} setPrecio={setPrecio} precios={priceList} precioRegex={paterns.precio}/>
                {/* Horario */}

                {/* Servicios */}
                <CheckBoxs titulo="Servicios" checkValue={servicios} setCheckValue={setServicios} values={servicesList} />
                {/* Categorias */}
                <CheckBoxs titulo="Categorias" checkValue={categorias} setCheckValue={setCategorias} values={categoriesList} />
                {/*Horario*/}
                <HorarioPicker time={horarios} setTime={setHorario}/>

                {/*    Enviar y Restear*/}
                <View style={{ width: "100%", height: 40, flexDirection: "row", alignItems: "center", justifyContent: "space-around" , marginVertical: 15}}>
                    <TouchableOpacity

                        onPress={_ => enviar()}
                        style={{ width: "40%", backgroundColor: "#0D0B26", height: "100%", borderRadius: 10, justifyContent: "space-around", alignItems: "center" }}>
                        <Text style={{ color: "white" }}>Actualizar Sitio</Text>
                    </TouchableOpacity>

                    {/*<TouchableOpacity*/}
                    {/*    touchSoundDisabled={true}*/}
                    {/*    onPress={_ => resetear()}*/}
                    {/*    style={{ width: "30%", backgroundColor: "#0D0B26", height: "100%", borderRadius: 10, justifyContent: "space-around", alignItems: "center" }}>*/}
                    {/*    <Text style={{ color: "white" }}>Resetear</Text>*/}
                    {/*</TouchableOpacity>*/}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


export default EditarSitio;

const style = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        position: "relative"
    },
})