import {useEffect, useState, useContext} from "react";
import {Modal, ScrollView, Text, TextInput, TouchableOpacity, View, Dimensions} from "react-native";
import {Ionicons} from '@expo/vector-icons';
import { Idioma } from "../../context/ContextoLogin";
import { PantallaAgregarNuevoSitio } from "../../services/idiomas/PantallaAgregarNuevo"; 

const HorarioPicker = ({time, setTime}) => {
    const { idioma, setIdioma } = useContext(Idioma);
    const [aperturam, setAperturam] = useState('');
    const [cierrem, setCierrem] = useState('');
    const [aperturat, setAperturat] = useState('');
    const [cierret, setCierret] = useState('');


    const [horario, setHorario] = useState(false);
    const [modal, setModal] = useState(false);
    const [recargar, setRecargar] = useState(false);
    const [elejidos, setElejidos] = useState([]);


    const [dias, setDias] = useState([
        {name: 'Lunes', inicial: 'L', seleccionado: false, aperturaM: "-", cierreM: "-", aperturaT: "-", cierreT: "-"},
        {name: 'Martes', inicial: 'M', seleccionado: false, aperturaM: "-", cierreM: "-", aperturaT: "-", cierreT: "-"},
        {
            name: 'Miercoles',
            inicial: 'X',
            seleccionado: false,
            aperturaM: "-",
            cierreM: "-",
            aperturaT: "-",
            cierreT: "-"
        },
        {name: 'Jueves', inicial: 'J', seleccionado: false, aperturaM: "-", cierreM: "-", aperturaT: "-", cierreT: "-"},
        {
            name: 'Viernes',
            inicial: 'V',
            seleccionado: false,
            aperturaM: "-",
            cierreM: "-",
            aperturaT: "-",
            cierreT: "-"
        },
        {name: 'Sabado', inicial: 'S', seleccionado: false, aperturaM: "-", cierreM: "-", aperturaT: "-", cierreT: "-"},
        {name: 'Domingo', inicial: 'D', seleccionado: false, aperturaM: "-", cierreM: "-", aperturaT: "-", cierreT: "-"}
    ]);

    useEffect(() => {
        setRecargar(false)
        console.log("TIME: " , time.length)

    }, [recargar,time]);

    const horarioVistaPrevia = () => {
        return (
            <View style={{flexDirection: "column"}}>
                {dias.map((dia, index) => {
                    return <View key={index} style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        backgroundColor: (index % 2) ? "#e1e1e1" : "white",
                        paddingVertical: 4
                    }}>
                        <Text style={{width: "30%", textAlign: "center"}}>{dia.name}</Text>
                        {(dia.seleccionado && dia.aperturaM !== "-") && (
                            <Text style={{
                                width: "30%",

                            }}>{dia.aperturaM}am a {dia.cierreM}am</Text>
                        )}
                        {(dia.seleccionado && dia.aperturaT !== "-") && (
                            <Text style={{
                                width: "30%",

                            }}>{dia.aperturaT}pm a {dia.cierreT}pm</Text>
                        )}
                    </View>
                })}
            </View>
        )
    }

    function seleccionados(index) {
        setRecargar(true)
        const copia = elejidos;
        copia.push(index)
        setElejidos(copia);
    }

    function manejoHorario() {
        console.log("Manejando resultado")
        return dias.map((x, index) => {
            const hora = x.aperturaM + "AM a " + x.cierreM + "AM - " + x.aperturaT + "PM a " + x.cierreT + "PM";
            return {
                dia: x.name,
                horario: (x.seleccionado) ? hora : "----"
            }
        });

    }

    function establecerHorarios() {
        if (elejidos.length >= 1) {
            setHorario(true)
            // console.log("Estableciendo horario")
            elejidos.forEach((x) => {
                dias[x].aperturaM = aperturam;
                dias[x].cierreM = cierrem;
                dias[x].aperturaT = aperturat;
                dias[x].cierreT = cierret;
            })
            // console.log(JSON.stringify(manejoHorario(), null, 2));
            setTime(manejoHorario())
            setElejidos([])
            // console.log(JSON.stringify(dias, null, 2));
        } else {
            console.log("No ha elejido un horario")
        }


    }

    function handleSeleccion(index) {

        if (dias[index].seleccionado === false) {
            dias[index].seleccionado = true;
            seleccionados(index)
        } else {
            dias[index].seleccionado = false;
            seleccionados(index)
        }
    }

    function handleModal() {
        if (modal) {
            setModal(false)
        } else {
            setModal(true)
        }
    }

    function restablecer() {
        setHorario(false)
        dias.forEach((x, index) => {
            if (x.seleccionado) {
                dias[index].seleccionado = false;
                dias[index].aperturaM = "-";
                dias[index].cierreM = "-";
                dias[index].aperturaT = "-";
                dias[index].cierreT = "-";
            }
        })
        setTime([])
        setElejidos([])
        // setRecargar(true)
    }

    /** ------ REESTABLECE LOS VALORES DE HORARIO EN NUEVO ANUNCIO AL PRESIONAR CANCELAR ----- */
    useEffect(() => {
        if (time[0] === 'reseteo') {
            restablecer();
            setTime([]);
        }
    }, [time[0]]);

    /** ----- FIN DE REESTABLECER VALORES ------ */

    return (
        <View style={{flexDirection: "column", padding: 10, alignItems: "center"}}>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modal}

                onRequestClose={_ => {
                    console.log("Se ha cerrado el modal")
                    setModal(!modal)
                }}
            >
                <ScrollView style={{backgroundColor: "white", padding: 20}}>

                    <TouchableOpacity onPress={handleModal}
                                      style={{flexDirection: "row", alignItems: "center", alignSelf: "flex-end"}}>
                        <Ionicons name="close" size={24} color="black"/>
                        <Text>Cerrar</Text>
                    </TouchableOpacity>

                    <Text style={{fontWeight: "bold", fontSize: 25}}>Configuracion de horario</Text>

                    <Text>Elejir los horarios ayuda a tus visitantes {"\n"}Te recomendamos los siguientes
                        pasos:</Text>
                    <Text style={{color: "black"}}>1.Elije los dias que desea establecer el horario</Text>
                    <View style={{
                        width: "100%",
                        height: 50,
                        flexDirection: "row",
                        justifyContent: "space-around",
                        paddingVertical: 5
                    }}>
                        {dias.map((x, index) => {
                            const color = (!x.seleccionado) ? "white" : "black";

                            return <TouchableOpacity disabled={x.seleccionado} key={index}
                                                     onPress={_ => handleSeleccion(index)}
                                                     style={{
                                                         backgroundColor: color,
                                                         width: 45,
                                                         height: 45,
                                                         justifyContent: "center",
                                                         alignItems: "center",
                                                         borderRadius: 50,
                                                         borderWidth: 1,
                                                         borderColor: "black"
                                                     }}>
                                <Text
                                    style={{fontWeight: "bold", color: (!x.seleccionado) ? "black" : "white"}}>
                                    {x.inicial}
                                </Text></TouchableOpacity>

                        })}
                    </View>
                    <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 22}}>Establece
                        horario</Text>
                    <Text style={{color: "black"}}>2.Dijita los horario de apertura y cierre para los dias
                        seleccionados</Text>
                    <Text>Manana:</Text>
                    <View style={{flexDirection: "row", paddingVertical: 5}}>
                        <View style={{width: "50%", alignItems: "center"}}>
                            <Text style={{fontSize: 14}}>Apertura:</Text>
                            <TextInput placeholder="00:00" value={aperturam} onChangeText={setAperturam}
                                       keyboardType="numeric"/>
                        </View>
                        <View style={{width: "50%", alignItems: "center"}}>
                            <Text style={{fontSize: 14}}>Cierre:</Text>
                            <TextInput value={cierrem} onChangeText={setCierrem} placeholder="00:00"
                                       keyboardType="numeric"/>
                        </View>
                    </View>

                    <Text>Tarde:</Text>
                    <View style={{flexDirection: "row", paddingVertical: 5}}>
                        <View style={{width: "50%", alignItems: "center"}}>
                            <Text style={{fontSize: 14}}>Apertura:</Text>
                            <TextInput placeholder="00:00" keyboardType="numeric" value={aperturat}
                                       onChangeText={setAperturat}/>
                        </View>
                        <View style={{width: "50%", alignItems: "center"}}>
                            <Text style={{fontSize: 14}}>Cierre:</Text>
                            <TextInput placeholder="00:00" keyboardType="numeric" value={cierret}
                                       onChangeText={setCierret}/>
                        </View>
                    </View>
                    <Text style={{color: "black"}}>3.Guarda el horario</Text>
                    <TouchableOpacity
                        onPress={_ => establecerHorarios()}
                        style={{
                            backgroundColor: "black",
                            padding: 10,
                            width: "50%",
                            borderRadius: 12,
                            alignSelf: "center",
                            alignItems: "center",
                            marginVertical: 10
                        }}>
                        <Text style={{color: "white"}}>Establecer Horarios</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={_ => restablecer()}
                        style={{
                            backgroundColor: "black",
                            padding: 10,
                            width: "50%",
                            borderRadius: 12,
                            alignSelf: "center",
                            alignItems: "center",
                            marginVertical: 10
                        }}>
                        <Text style={{color: "white"}}>Restablecer Horarios</Text>
                    </TouchableOpacity>
                    <Text>Vista previa:</Text>
                    <View>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor: "black",
                            paddingVertical: 5,
                            borderTopRightRadius: 5,
                            borderTopLeftRadius: 5,
                        }}>
                            <Text style={{width: "30%", textAlign: "center", color: "white"}}>Dia</Text>
                            <Text style={{width: "30%", textAlign: "center", color: "white"}}>Manana</Text>
                            <Text style={{width: "30%", textAlign: "center", color: "white"}}>Tarde</Text>
                        </View>
                        {/*    Aquiiiiiiiiiiiiiiii*/}
                        {horarioVistaPrevia()}
                    </View>

                </ScrollView>
            </Modal>
            <TouchableOpacity
                style={{
                    backgroundColor: "black",
                    width: "50%",
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 10,
                    margin: 10,
                }} onPress={() => handleModal()}>
                <Text style={{color: "white"}}>{PantallaAgregarNuevoSitio["agregarhorarios"][idioma]}</Text>
            </TouchableOpacity>
            <Text style={{alignSelf: "flex-start"}}>Horarios Establecidos:</Text>
            <View style={{width: "100%", paddingVertical: 10}}>
                {(!horario) && (<Text>"Aun no se han agregado horarios"</Text>)}
                {horario && (
                    <View style={{width: "100%"}}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor: "black",
                            paddingVertical: 5,
                            borderTopRightRadius: 5,
                            borderTopLeftRadius: 5,
                        }}>
                            <Text style={{width: "30%", textAlign: "center", color: "white"}}>Dia</Text>
                            <Text style={{width: "30%", textAlign: "center", color: "white"}}>Manana</Text>
                            <Text style={{width: "30%", textAlign: "center", color: "white"}}>Tarde</Text>
                        </View>
                        {horarioVistaPrevia()}
                    </View>
                )}
            </View>
        </View>
    );
}

export default HorarioPicker;