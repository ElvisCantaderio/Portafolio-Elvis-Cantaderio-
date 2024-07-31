import React, { useContext, useEffect, useState } from 'react';
import { ImageBackground, Platform, StyleSheet, ToastAndroid, TouchableOpacity } from "react-native";

import { Text, useSx, View } from "dripsy";
import SelectDropdown from 'react-native-select-dropdown'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { CardLugares } from "../components/PantallaInicio/CardLugares";
import { FlashList } from "@shopify/flash-list";
import SinData from "../components/FlashList/SinData";
import { Recomendados } from "../components/PantallaInicio/Recomendados";
import ServicesCategoriesPriceIdiom from "../services/idiomas/ServicesCategoriesPriceIdiom";
// IMPORTO FIREBASE
import { useAuth } from "../services/Authentication/FirebaseAuthentication";
import { PantallaInicioLenguaje } from "../services/idiomas/PantallaInicioLenguaje";
// IMPORTO EL IDIOMA
import { Idioma } from "../context/ContextoLogin";
// IMPORT ASYNCSTORAGE
import { SecureStorageIdioma } from "../services/LocalStorage/SecureStorageIdioma";
// IMPORTO SERVICIOS DE COUCHDB
import { getAllSites } from "../services/CouchDb/database_sitios";
// IMPORTO SERVICIOS DE RED
import estoyConectado from '../services/Network/RedInfo';
// IMPORTO SERVICIOS DE SQLITE
import { cantDocumento, insertarSitios, limpiarDb, obtenerSitios } from '../services/SQLite/SqliteSitios';
import { shuffle } from '../utils/DesordenarArray';
const Inicio = () => {
    //La navegacion
    const navigation = useNavigation();
    //Esta parte de dripsy para el responsive
    const sx = useSx();
    const { CategoriesIdiom } = ServicesCategoriesPriceIdiom()
    const { save, getValueFor } = SecureStorageIdioma();
    const { idioma, setIdioma } = useContext(Idioma);
    const { relogearAlAbrir } = useAuth();


    //Traemos los datos
    const [sitios, setSitios] = useState([])
    const [sitiosShuffle, setSitiosShuffle] = useState([]);
    const [traer, setTraer] = useState(true)
    const [siteSql, setSiteSql] = useState([]);
    // Estado para el filtro del menu
    const [filtro, setFiltro] = useState(false);
    // Filtros de categorias y departamentos valores
    const [filtro1, setFiltro1] = useState('Todos')
    const [filtro2, setFiltro2] = useState('Todos')
    const [estadoLogin, setEstadoLogin] = useState(0)
    const [cargando, setCargando] = useState(true)
    //Guardo la red
    const [conectado, setConectado] = useState(true);
    //Categorias
    const categorias = [
        {
            value: "Todos",
            label: PantallaInicioLenguaje["Todos"][idioma],
        },
        {
            value: 1,
            label: CategoriesIdiom[1][idioma],
        },
        {
            value: 2,
            label: CategoriesIdiom[2][idioma],
        },
        {
            value: 3,
            label: CategoriesIdiom[3][idioma],
        },
        {
            value: 4,
            label: CategoriesIdiom[4][idioma],
        },
        {
            value: 5,
            label: CategoriesIdiom[5][idioma],
        },
        {
            value: 6,
            label: CategoriesIdiom[6][idioma],
        },
        {
            value: 7,
            label: CategoriesIdiom[7][idioma],
        }
    ]

    const departamentos = [
        {
            value: "Todos",
            label: PantallaInicioLenguaje["Todos"][idioma],
        },
        {
            value: "Ahuachapán",
            label: "Ahuachapán"
        },
        {
            value: "Cabañas",
            label: "Cabañas"
        },
        {
            value: "Chalatenango",
            label: "Chalatenango"
        },
        {
            value: "Cuscatlán",
            label: "Cuscatlán"
        },
        {
            value: "La Libertad",
            label: "La Libertad"
        },
        {
            value: "La Paz",
            label: "La Paz"
        },
        {
            value: "La Unión",
            label: "La Unión"
        },
        {
            value: "Morazán",
            label: "Morazán"
        },
        {
            value: "San Miguel",
            label: "San Miguel"
        },
        {
            value: "San Salvador",
            label: "San Salvador"
        },
        {
            value: "San Vicente",
            label: "San Vicente"
        },
        {
            value: "Santa Ana",
            label: "Santa Ana"
        },
        {
            value: "Sonsonate",
            label: "Sonsonate"
        },
        {
            value: "Usulután",
            label: "Usulután"
        }
    ]

    useEffect(() => {

        //Verifico la conexion a internet
        estoyConectado().then(x => {
            setConectado(x)
        })

        // Verificamos el estado de inicio de sesion si hay usuario se reloguea
        if (estadoLogin < 1) {
            relogearAlAbrir();
        }
        // Busca si hay un idioma guardado
        const fetchIdioma = async () => {
            try {
                const idioma = await getValueFor('idioma');
                setIdioma(idioma);
            } catch (err) {
                console.log(err);
            }
        }
        fetchIdioma();
        const sitiosLocalDb = null
        // Tre los sitios en cada refresco y lo hace tambien por primera ves


        if (traer) {
            setTraer(false);
            fetchSitios();
        }
        setEstadoLogin(1);
        setFiltro(false);
        setCargando(false);

    }, [traer, cargando, idioma, sitios, sitiosShuffle, conectado, siteSql])

    function handleRefresh() {
        setTraer(true)
    }

    const fetchSitios = async () => {

        // Recuperamos la cantidad de sitios de la base de datos local
        let cantDocsLocales = 0;
        cantDocumento((count) => {
            cantDocsLocales = count;
        });

        // Traigo los sitios de la base de datos remota
        const fetchSitios = await getAllSites(1);
        const sitiosTraidos = [];
        console.log("cantidad de sitios en db remota: ", fetchSitios.length)
        console.log("cantidad de sitios en db local: ", cantDocsLocales)
        console.log("Estado de la conexion: ", conectado)
        /* Revisamos si la cantidad de sitios coinsiden con la cantidad de sitios en la sqlite
         y revisamos lo que es conexion a internet */
        if (fetchSitios.length !== cantDocsLocales && conectado === true) {
            console.log("Hubo un cambio en la base de datos remota")
            //Eliminando sitios anteriores
            limpiarDb()
            insertarSitios(fetchSitios);
            setTraer(true)
        } else {
            console.log("La base de datos esta actualizada")
            console.log("Trayendo de la base de datos local...")
            //Traemos los sitios en caso que si exista

            obtenerSitios((site) => {
                setSiteSql(site)
            })
        }


        console.log("[Verificando los filtros]")
        console.log("cantidad de datos que vamos a ver:", siteSql.length)
        if (siteSql.length === 0) {
            handleRefresh()
        }
        if (filtro === true) {
            let datosFiltro = siteSql
            // Aplica el filtro sobre los datos traido
            if (filtro1 !== "Todos") {
                console.log(`Filtro 1: ${filtro1}`)
                datosFiltro = siteSql.filter(x => {
                    console.log(`buscando: ${filtro1} en: ${x.categorias}`)
                    return x.categorias.includes(filtro1)
                })
            }

            if (filtro2 !== "Todos") {
                console.log(`Filtro 2: ${filtro2}`)
                datosFiltro = datosFiltro.filter(x => {
                    console.log(`buscando: ${filtro2} en:  ${x.departamento}}`)
                    return x.departamento === filtro2
                })
            }

            const sitiosFiltro = shuffle(datosFiltro);
            setSitiosShuffle(sitiosFiltro)
            setSitios(datosFiltro)
            setTraer(false);
        } else {
            console.log("No aplique filtro!!!")
            console.log("Sitios recuperados de la db = ", siteSql.length)
            const data = shuffle(siteSql)
            setSitios(siteSql)
            setSitiosShuffle(data)
        }

    }

    return (

        <View style={styles.container}>

            <View style={styles.imagen}>

                <ImageBackground source={require("../../assets/volcano.jpg")}
                    style={{
                        width: "100%",
                        height: 120,
                        opacity: 0.85,
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>

                    {/*Menu de hamburguesa*/}
                    <TouchableOpacity onPress={() => navigation.openDrawer()}
                        style={{ position: "absolute", left: 20, top: 40 }}>
                        <Ionicons name="menu" size={35} color="white"
                            style={{ backgroundColor: "rgba(0,0,0,1)", borderRadius: 7 }} />

                    </TouchableOpacity>

                    <Text style={{ ...styles.titulo }}>TripSv
                        <Ionicons name="location-outline" size={35} color="white" /></Text>
                </ImageBackground>
                {/* Mensaje de no conexion a internet */}
                {
                    (conectado !== true || conectado == null) && (
                        <View style={{ backgroundColor: "white", width: "100%", padding: 5, justifyContent: "center", alignItems: "center" }}>
                            <Text>{PantallaInicioLenguaje['noConexionInternet'][idioma]}</Text>
                        </View>
                    )
                }
            </View>
            {/*Filtros*/}
            <View style={{
                width: "100%",
                paddingHorizontal: 10,
                paddingVertical: 10,
                flexDirection: "row",
                justifyContent: "space-around"
            }}>

                {/*/!*Filtro categorias*!/*/}
                <SelectDropdown
                    data={categorias}
                    defaultButtonText={PantallaInicioLenguaje['categorias'][idioma]}
                    rowTextForSelection={(item) => {
                        return item.label; // Aquí puedes personalizar el texto de las filas
                    }}
                    buttonTextAfterSelection={(selectedItem) => {
                        return selectedItem.label;
                    }}
                    buttonStyle={{ ...styles.dropdownBtn, ...sx({ height: [40, 45, 50] }) }}
                    buttonTextStyle={{ ...styles.dropdownTextoBoton, ...sx({ fontSize: [14, 16, 24] }) }}
                    renderDropdownIcon={_ => {
                        return (
                            <Ionicons name="caret-down" size={20} color="white" />
                        )
                    }}
                    dropdownIconPosition={"right"}
                    dropdownStyle={styles.dropdownCuerpo}
                    rowStyle={styles.dropdownFila}
                    rowTextStyle={{ ...styles.dropdownFilaTexto, ...sx({ fontSize: [14, 16, 24] }) }}
                    onSelect={(selectedItem) => {
                        setFiltro1(selectedItem.value);
                        setFiltro(true);
                        setTraer(true);
                    }}
                />
                {/* Filtro de departamentos */}
                <SelectDropdown
                    data={departamentos}
                    defaultButtonText={PantallaInicioLenguaje['departamentos'][idioma]}
                    rowTextForSelection={(item) => {
                        return item.label; // Aquí puedes personalizar el texto de las filas
                    }}
                    buttonTextAfterSelection={(selectedItem) => {
                        return selectedItem.label;
                    }}
                    buttonStyle={{ ...styles.dropdownBtn, ...sx({ height: [40, 45, 50] }) }}
                    buttonTextStyle={{ ...styles.dropdownTextoBoton, ...sx({ fontSize: [14, 16, 24] }) }}
                    renderDropdownIcon={_ => {
                        return (
                            <Ionicons name="caret-down" size={20} color="white" />
                        )
                    }}
                    dropdownIconPosition={"right"}
                    dropdownStyle={styles.dropdownCuerpo}
                    rowStyle={styles.dropdownFila}
                    rowTextStyle={{ ...styles.dropdownFilaTexto, ...sx({ fontSize: [14, 16, 24] }) }}
                    onSelect={(selectedItem) => {

                        setFiltro2(selectedItem.value);
                        setFiltro(true);
                        setTraer(true);
                    }}

                />


            </View>

            {/*Traigo datos con flashList metodo super optimizado para renderizar los datos*/}
            <View style={{
                flex: 1,
                paddingHorizontal: 20,

            }}>
                <Recomendados sitios={sitios} actualizarCompo={traer} />
                <FlashList
                    horizontal={false}
                    refreshing={cargando}
                    onRefresh={() => handleRefresh()}
                    data={sitiosShuffle}
                    ListEmptyComponent={<SinData mensaje={PantallaInicioLenguaje["mensajeSinSitio"][idioma]} />}
                    showsVerticalScrollIndicator={false}
                    estimatedItemSize={100}
                    renderItem={({ item, index }) => {
                        return <CardLugares key={item.id} nombreLugar={item.titulo[idioma]}
                            detalle={item.departamento}
                            imageUri={item.imagenes[0]}
                            data={item} />
                    }}
                />
            </View>

        </View>


    );

}

export default Inicio;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        flexDirection: 'column',
        position: "relative",
    },
    dropdownBtn: {
        width: '45%',
        backgroundColor: '#0D0B26',
        borderRadius: 10,
    },
    dropdownCuerpo: {
        borderRadius: 10,
    },
    dropdownTextoBoton: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    dropdownFila: {
        backgroundColor: '#1a154b',
    },
    dropdownFilaTexto: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        borderRadius: 10,
    },
    deslis: {
        position: "relative"
    },
    detalle: {
        position: "absolute",
        fontWeight: 700,
        fontSize: 18,
        color: "#34383f",
        top: "10%",
        marginLeft: 23,
    },
    detalle1: {
        top: "50%",
        position: "absolute",
        marginTop: 3,
        marginLeft: 23,
        fontSize: 13,
        color: "#212225",
    },
    buscador: {
        width: "100%",
        opacity: 0.66,
        marginTop: 10,
        paddingHorizontal: 20,


    },
    buscadorHijo: {
        borderRadius: 10,
        backgroundColor: '#EEFAFF',
    },
    imagen: {
        width: '100%',
        display: 'flex',
        backgroundColor: "rgba(0,0,0,.72)",
        alignItems: "center",
        position: "relative"
    },
    titulo: {
        textAlign: "center",
        fontSize: 50,
        color: 'white',
        marginTop: 3,
        justifyContent: "center",
        textShadowOffset: { width: 3, height: 1 },
        textShadowRadius: 3.6,
        textShadowColor: "rgba(0, 0, 0, 1)",
        fontWeight: "500"

    },
});


