import {
    ActivityIndicator,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View
} from "react-native";
import React, {useEffect, useState, useContext} from "react";
import {PickerMultipleImages} from "../components/Utils/PickerMultipleImages";
import MultipleInputs from "../components/Utils/MultipleInputs";
import {LocaltionInfo} from "../components/NuevoRegistroSitio/LocationInfo";
import SelectDepartamento from "../components/NuevoRegistroSitio/SelectDepartamento";
import Precios from "../components/NuevoRegistroSitio/Precios";
import CheckBoxs from "../components/NuevoRegistroSitio/CheckBoxs";
import HorarioPicker from "../components/NuevoRegistroSitio/HorarioPicker";
import {sendImages, sendSite} from "../services/CouchDb/database_sitios";
import ServicesCategoriesPriceIdiom from "../services/idiomas/ServicesCategoriesPriceIdiom";
import {formatoFecha} from "../components/NuevoSitio/ObtenerFechaActual";
import {useNavigation} from "@react-navigation/native";
import {ContextoUser} from "../context/ContextoUser";
import ModalRegistro from "../components/NuevoRegistroSitio/ModalRegistro";
import traducir from "../services/LibreTranslate/Traducir";
import {departamentoList} from "../filters/Departamentos";
import {MensajeModal} from "../services/idiomas/componentes/screen/nuevoRegistroSitio/MensajeModal";
import { PantallaAgregarNuevoSitio } from "../services/idiomas/PantallaAgregarNuevo";
import { Idioma } from "../context/ContextoLogin"
const NuevoRegistroSitio = () => {
    const { user, setUser } = React.useContext(ContextoUser);
    const { idioma, setIdioma } = useContext(Idioma);
    const navigation = useNavigation();
    const {categoriesList,servicesList,priceList} = ServicesCategoriesPriceIdiom();
    const [dehabilitar, setDeshabilitar] = useState(false);
    const [modal, setModal] = useState(false);
    const [mensajeModal, setMensajeModal] = useState("Iniciando Carga de sitio!!!");
    // Estado de los datos para la obtencion de los mismos
    const [image, setImage] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [telefono, setTelefono] = useState("");
    const [ubicacion, setUbicacion] = useState(null);
    const [departamento, setDepartamento] = useState(null);
    const [precio, setPrecio] = useState(null)
    const [horarios, setHorario] = useState([])
    const [categorias, setCategorias] = useState([])
    const [servicios, setServicios] = useState([])
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

        console.log("Verificando")
        if (image.length < 3) {
            ToastAndroid.show("Imagenes Faltante", 1);
            return false;
        }
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
        console.log(JSON.stringify(sitio, null, 2))
        console.log("a subir sitio")
        const subida  = await sendSite(sitio)
        console.log("Sitio subido")
        console.log(subida)
        //Verificar si se subio el sitio
        if(!subida){
            // ToastAndroid.show("Error al subir el sitio", ToastAndroid.SHORT);
            setMensajeModal(MensajeModal["mensajeError"][idioma]);
            return false;
        }else{
            // ToastAndroid.show("Sitio subido", ToastAndroid.SHORT);
            setMensajeModal(MensajeModal["sitioSubido"][idioma])
        }
        // ToastAndroid.show("Subiendo imagenes espere un momento", ToastAndroid.SHORT);
        setMensajeModal(MensajeModal["mensajeEspera"][idioma])
        let id = subida.id;
        // Envio de las imagenes
        const subidaImagenes = await sendImages(image, id);
        //Verificar si se subio la imagen
        if(!subidaImagenes){
            // ToastAndroid.show("Error al subir la imagen", ToastAndroid.SHORT);
            setMensajeModal(MensajeModal["errorImagen"][idioma]);
            return false;
        }
        setMensajeModal(MensajeModal["imagenLista"][idioma]);// imagenes subidas
        setMensajeModal(MensajeModal["revision"][idioma]); //sitio enviado correctamente para revision
        // ToastAndroid.show("Sitio enviado correctamente para revision!!!", ToastAndroid.SHORT);
        setModal(false);
        return true;
    }

    const enviar = async () => {
        setMensajeModal(MensajeModal["cargando"][idioma]);//iniciando carga de sitio
        const enviado = await validacion();
        if(enviado){
            await resetear();
            ToastAndroid.show(MensajeModal["sitioEnviado"][idioma], ToastAndroid.SHORT);
            navigation.navigate('InicioScreen');
        }
    }

    // Resetear el formulario
    const resetear = () => {
        return new Promise((resolve, reject) => {
            setDeshabilitar(true);
            setImage([]);
            setName("");
            setDescription("");
            setTelefono("");
            setUbicacion(null);
            setDepartamento(null);
            setPrecio({});
            setCategorias([]);
            setServicios([]);
            setDeshabilitar(false);
            resolve();
        });
    }

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

                {/*    Imagenes*/}
                <PickerMultipleImages image={image} setImage={setImage} maxImages={3} base64={true} />
                {/*Informacion del sitio esta sera la informacion mas basica como texto*/}
                {/*    Titulo*/}
                <MultipleInputs infoMensaje={PantallaAgregarNuevoSitio["titulo"][idioma]} valueInput={name} setValueInput={setName} title={PantallaAgregarNuevoSitio["titulodelsitio"][idioma]} placeHolder={PantallaAgregarNuevoSitio["titulo2"][idioma]} regExr={paterns.name} maxLength={50} />
                {/*    Descripcion*/}
                <MultipleInputs infoMensaje={PantallaAgregarNuevoSitio["descripcion"][idioma]} valueInput={description} setValueInput={setDescription} title={PantallaAgregarNuevoSitio["descripciondelsitio"][idioma]} multiline={true} placeHolder={PantallaAgregarNuevoSitio["descripcion2"][idioma]} maxLength={400} regExr={paterns.name} />
                {/*    Numero de telefono*/}
                <MultipleInputs infoMensaje={PantallaAgregarNuevoSitio["telefono"][idioma]} valueInput={telefono} setValueInput={setTelefono} title={PantallaAgregarNuevoSitio["telefono2"][idioma]} keyboard="numeric" placeHolder={"0000-0000"} maxLength={8} regExr={paterns.telefono} />

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
                        style={{ width: "30%", backgroundColor: "#0D0B26", height: "100%", borderRadius: 10, justifyContent: "space-around", alignItems: "center" }}>
                        <Text style={{ color: "white" }}>Enviar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        touchSoundDisabled={true}
                        onPress={_ => resetear()}
                        style={{ width: "30%", backgroundColor: "#0D0B26", height: "100%", borderRadius: 10, justifyContent: "space-around", alignItems: "center" }}>
                        <Text style={{ color: "white" }}>Resetear</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default NuevoRegistroSitio;

const style = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        position: "relative"
    },
})