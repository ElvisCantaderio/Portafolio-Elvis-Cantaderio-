import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { NavigationContainer } from "@react-navigation/native";
import { Ionicons, Octicons, MaterialIcons } from '@expo/vector-icons';

//Pantallas
import Inicio from "../screens/Inicio";
import Favoritos from "../screens/Favoritos";
import EstadosSitios from "../screens/EstadoSitios"
import DetallesSitio from '../screens/DetallesSitio';
import Autenticacion from '../screens/Autenticacion';
import AdministracionSitios from "../screens/AdministracionSitios";
import AdministracionUsuarios from "../screens/AdministracionUsuarios";
import AdministracionAnuncio from "../screens/AdministracionAnuncio";
import NuevoRegistroSitio from "../screens/NuevoRegistroSitio";
import EditarSitio from "../screens/EditarSitio";
//Drawer Personalizado
import CustomDrawer from "../components/Drawer/CustomDrawer";

//Idioma
// Autenticacion
import React from "react";
import { Idioma, MiContexto } from "../context/ContextoLogin";
import { StacksNavigationIdioma } from "../services/idiomas/StacksNavigationIdioma";
import { useWindowDimensions } from "react-native";
import {PantallaEditarSitios} from "../services/idiomas/PantallaEditarSitios";



/* Este stack de pantalla de utiliza para que se pueden llamar desde cualquier parte de la aplicacion son pantallas
 Independientes de algun flujo de navigation*/
function MyStack() {
    const HomeStackNavigator = createNativeStackNavigator();
    const { idioma } = React.useContext(Idioma);
    return (
        <HomeStackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="InicioScreen">
            <HomeStackNavigator.Screen
                options={{ headerShown: true, title: StacksNavigationIdioma["vistaDeSitio"][idioma] }}
                name="Vista Sitio"
                component={DetallesSitio}
            />
            <HomeStackNavigator.Screen
                name="InicioScreen"
                component={Inicio}
            />

            <HomeStackNavigator.Screen
                options={{ headerShown: true, title: StacksNavigationIdioma["estadoDeSitio"][idioma] }}
                name="Estado Sitio"
                component={EstadosSitios}
            />
            <HomeStackNavigator.Screen
                name={"Administracion Usuario"}
                component={AdministracionUsuarios}
                options={{ headerShown: true, title: StacksNavigationIdioma["administracionDeUsuarios"][idioma] }}
            />
            <HomeStackNavigator.Screen
                name={"Administracion Sitios"}
                component={AdministracionSitios}
                options={{ headerShown: true, title: StacksNavigationIdioma["administradorDeSitios"][idioma] }}
            />
            <HomeStackNavigator.Screen
                name={"Administracion Anuncio"}
                component={AdministracionAnuncio}
                options={{ headerShown: true, title: StacksNavigationIdioma["administradorDeAnuncios"][idioma] }}
            />
            <HomeStackNavigator.Screen
                name={"Editar Sitio"}
                component={EditarSitio}
                options={{headerShown: true, title: PantallaEditarSitios["editarSitio"][idioma]}}
            />
        </HomeStackNavigator.Navigator>
    );
}

/* Esta stack es de los botones de la parte inferior en este caso este stack sera el hijo de un drawer 
pero tambien tendra como hijo al MyStack*/
function ButtomTabsStack() {
    const Tab = createBottomTabNavigator();
    //Manejaremos la autenticacion
    const { miEstado } = React.useContext(MiContexto);
    const { idioma } = React.useContext(Idioma);
    console.log("Este es el idioma para el stack", idioma)
    
    
    return (

        <Tab.Navigator
            initialRouteName="Inicio"
            backBehavior={"initialRoute"}
            freezeOnBlur={true}
            unmountOnBlur={true}
            screenOptions={{
                tabBarActiveTintColor: '#0a090c',
              
                tabBarInactiveTintColor: '#afafaf',
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarLabelStyle: {
                    fontWeight: "bold",
                    fontSize: 12,
                },
                tabBarStyle: {
                    // width: "96%",
                    // marginHorizontal: "2%",
                    // marginVertical: "1%",
                    // borderRadius: 100,
                    height: 60,
                    

                },
                tabBarItemStyle: {
                    height: 60,
                    padding: 10,
             
                },
                lazy: true,
                headerTransparent: false,
                unmountOnBlur: false,
                tabBarAllowFontScaling: true,
                tabBarVisibilityAnimationConfig: {
                    delay: 0,
                    duration: 300,
                    useNativeDriver: true,
                },
            }}
        >
            <Tab.Screen name="Inicio" component={MyStack}
                options={{
                    title: StacksNavigationIdioma["inicio"][idioma],
                    tabBarIcon: ({ color }) => (
                        // <Ionicons name="home" size={20} color={color}/>
                        <Octicons name="home" size={21} color={color} />
                    ),

                }} />


            <Tab.Screen name="Favoritos" component={Favoritos}
                options={{
                    title: StacksNavigationIdioma["favoritos"][idioma],
                    headerShown: true,
                    tabBarIcon: ({ color }) => (
                        // <Ionicons name="md-star" size={20} color={color}/>
                        <MaterialIcons name="favorite-outline" size={25} color={color} />
                    )
                }} />

            {/*Verificamos el inicio se sesion si el usuario no esta logiado no le aparecera para poder agregar Sitios*/}
            {
                (miEstado.logeado) ? (
                    <Tab.Screen name="Nuevo Sitio" component={NuevoRegistroSitio} options={{
                        title: StacksNavigationIdioma["nuevoSitio"][idioma],
                        headerShown: true,
                        freezeOnBlur: true,
                        tabBarIcon: ({ color }) => (
                            // <MaterialIcons name="add-circle-outline" size={25} color={color} />
                            // <Ionicons name="create" size={20} color={color}/>
                            <Octicons name="diff-added" size={22} color={color} />
                        )
                    }} />
                ) :
                    (
                        <Tab.Screen name="Inicia Sesion" component={Autenticacion}
                            options={{
                                title: StacksNavigationIdioma["iniciarSesion"][idioma],
                                tabBarIcon: ({ color }) => (
                                    // <Ionicons name="logo-google" size={20} color={color}/>
                                    <Octicons name="person" size={24} color={color} />
                                ),


                            }}
                        />
                    )
            }
        </Tab.Navigator>
    );

}


export default function NavigationControl() {
    const Drawer = createDrawerNavigator();
    const dimensions = useWindowDimensions();
    /*Este Drawer sera el principal del flujo cubrira a toda la aplicacion tendra principalmente como hijo al ButtomTabsStack */
    function DrawerControlStack() {
        return (
            <Drawer.Navigator it status useLegacyImplementation
                drawerContent={() => <CustomDrawer />}

            >
                <Drawer.Screen name="Inicio " component={ButtomTabsStack}
                    options={{
                        headerShown: false, // <-- aquí se oculta la cabecera
                    }}
                />
                <Drawer.Screen name="EstadoSitios" component={EstadosSitios}
                    options={{
                        // headerShown: false, // <-- aquí se oculta la cabecera
                    }}
                />
            </Drawer.Navigator>
        );
    }

    return (
        <NavigationContainer>
            <DrawerControlStack />
        </NavigationContainer>
    );
}

