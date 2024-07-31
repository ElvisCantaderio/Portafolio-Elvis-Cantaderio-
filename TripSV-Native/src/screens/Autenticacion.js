import React, {useState, useEffect, useContext} from "react";
import { StatusBar } from 'expo-status-bar';
import {View, Text, Button, TouchableOpacity, ImageBackground, Image, StyleSheet} from "react-native";
import 'expo-dev-client';
import {SimpleLineIcons} from '@expo/vector-icons';
import {useAuth} from '../services/Authentication/FirebaseAuthentication.js'
import {Idioma, MiContexto} from "../context/ContextoLogin.js";
import {Login} from "../services/idiomas/componentes/screen/Login.js"
import { Ionicons } from '@expo/vector-icons';
//import { LinearGradient } from 'expo-linear-gradient';


const Autenticacion = () => {
    const { idioma, setIdioma } = useContext(Idioma);
    const {miEstado, setMiEstado} = React.useContext(MiContexto);
    //Manejaremos la autenticacion
    const {signIn, signOut} = useAuth();

    useEffect(() => {
        console.log("Cambiando desde Inicio!!!")
    }, [miEstado.logeado]);


    const handleSignOut = () => {
        signOut();

    };
    const handleSignIn = () => {
        signIn();
    }

    return (

        <ImageBackground source={require('../../assets/fondo2.jpg')} style={{
            flex: 1,
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "column",}}
            
        >
        {/*  <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.80)',
            'rgba(21, 21, 21, 0.80)',
            'rgba(64, 64, 64, 0.67)',
          ]}
          locations={[0, 0.01, 0.3437, 0.7083, 1]}
          style={styles.gradient}
            />
        */}
        <View style={styles.textContainer}>
          <Text style={styles.text_title_secundario}>{Login["bienvenida"][idioma]}</Text>
          <Text style={styles.text_title_primario}>TripSV</Text>
        </View>
        <View style={styles.container_saludo}>
          <Text style={styles.text_saludo}>
            {Login["inicioSesion"][idioma]}
          </Text>
          <Text style={styles.text_saludo}>
          {Login["aventura"][idioma]}
          </Text>
        </View>

        <View style={{ marginTop: 1}}>
          <View style={styles.list}>
           
          <Ionicons name="checkmark" size={24} color="white"/>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
            {Login["favoritos"][idioma]}
            </Text>
            
          </View>
          <View style={styles.list}>
            
          <Ionicons name="checkmark" size={24} color="white"/>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
            {Login["filtros"][idioma]}
            </Text>
          </View>
          <View style={styles.list}>
            
              
          <Ionicons name="checkmark" size={24} color="white"/>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
            {Login["nuevos"][idioma]}
            </Text>
          </View>
        </View>


            <TouchableOpacity
                onPress={handleSignIn}
                style={{
                    width: "50%",
                    borderWidth: 1,
                    borderColor: "gray",
                    borderRadius: 8,
                    paddingVertical: 5,
                    paddingHorizontal: 30,
                    backgroundColor: "white",
                    opacity: 20,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginBottom: 45,
                    marginTop: 25
                }}>
                <Image source={require('../../assets/googleIcon.png')}
                    style={{backgroundColor: "transparent", width: 30, height: 30, alignContent: 'center'}}/>
                <Text style={{color: "black", alignItems: 'center'}}>
                {Login["iniciarSesion"][idioma]}
                </Text>
            </TouchableOpacity>
            <StatusBar style='auto' />
        </ImageBackground>
    )

}
export default Autenticacion;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      resizeMode: 'cover',
      flexDirection: 'column',
      alignItems: 'center',
    },
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '100%',
    },
  
    textContainer: {
      marginTop: 25,
      alignItems: 'center'
    },
  
    text_title_secundario: {
      color: 'white',
      fontSize: 40,
      fontWeight: 'regular',
    },
  
    text_title_primario: {
      color: '#FFF',
      fontSize: 60,
      color: 'white',
      fontWeight: 'bold',
    },
  
    text_saludo: {
      color: 'white',
      fontSize: 22,
      lineHeight: 28,
      fontWeight: 'regular',
    },
  
    container_saludo: {
      marginTop: 5,
      alignItems: "center",
    },
  
    list: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
