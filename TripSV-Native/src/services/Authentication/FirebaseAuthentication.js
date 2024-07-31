import React, { useEffect, useState } from "react";
import 'expo-dev-client';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from '@react-native-firebase/auth';
import { MiContexto } from "../../context/ContextoLogin";
import { ContextoUser } from "../../context/ContextoUser";
import { UserServices } from "../FireStorage/UserServices";
import * as SecureStore from 'expo-secure-store';
import { userCouchInfo } from "../CouchDb/database_roles";
//Acceso
GoogleSignin.configure({
    webClientId: '677864174054-1aoivbu9esieum9t1k4tnqdubt4o2bog.apps.googleusercontent.com'
});

async function save(key, value) {
    try {
        return await SecureStore.setItemAsync(key, value);
    } catch (err) {
        throw new Error("Error al guardar la clave")
    }
}

async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
        return result
    } else {
        throw new Error("No estaba la clave")
    }
}

async function deleteValue(key) {
    try {
        await SecureStore.deleteItemAsync(key)
    } catch (err) {
        throw new Error("Error the current key cannot be delete.")
    }
}

export const useAuth = () => {
    // Traigo el servicio de firebase para la verificacion de rol para cuando el usuario se autentique
    const { manageRoleUser } = UserServices();

    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);

    const { miEstado, setMiEstado } = React.useContext(MiContexto);
    const { user, setUser } = React.useContext(ContextoUser);


    useEffect(() => {
        // unsubscribe on unmount
        const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged);
        return unsubscribe
    }, [miEstado]);

    function onAuthStateChanged(authUser) {
        setUser(authUser);
        if (initializing) setInitializing(false);
    }




    function relogearAlAbrir() {
        try {
            const loge = GoogleSignin.isSignedIn();
            if (loge) {
                getValueFor('role').then(x => {
                    setMiEstado({
                        logeado: true,
                        role: x
                    })
                }).catch(err => {
                    signOut()
                    setMiEstado({
                        logeado: false,
                        role: "usuario"
                    })
                })
            }
        } catch (err) {
            console.log("No hay usuario logueado")
        }

    }


    /**
     * Funcion para iniciar sesion no es accesible desde afuera
     * solo es para realizar la promesa iniciar sesion
     * @returns {Promise<UserCredential>}
     */
    const signIn = async () => {
        try {
            const logeado = await GoogleSignin.isSignedIn()

            if (logeado) {
                await getValueFor('role').then(x => {
                    setMiEstado({
                        logeado: true,
                        role: x
                    })
                }).catch(err => {
                    signOut()
                })
                throw new Error("El usuario ya esta autenticado");
            }



            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            const userInfo = await auth().signInWithCredential(googleCredential);

            console.log("El usuario es: ", userInfo)
            // Objeto de creacion de usuario basico para nuevo usuario
            const usuario = {
                email: userInfo.user.email,
                role: "usuario"
            }
            const response = await userCouchInfo(userInfo.user.uid, usuario);
            console.log(response)
            //Si se creo con exito se guarda en el dispositivo
            const guardar = await save('role', response.role).then(x => {
                setMiEstado({
                    logeado: true,
                    role: response.role
                })
            }).catch(console.log)


            console.log("Esto se guardo en el dispositivo: " + guardar)

        } catch (error) {
            throw new Error(error)
        }

    }




    /**
     * Funcion que no es accesible desde afuera pero es la promesa de cerrar sesion
     * @returns {Promise<null>}
     */
    const cerrandoSesion = async () => {
        if (await GoogleSignin.isSignedIn()) {
            return await GoogleSignin.signOut();
        } else {
            throw new Error("No hay cuentas para cerrar");
        }
    }


    //Funcion que permite quitar la cuenta si ya hay una cuenta no permite otra
    function signOut() {
        cerrandoSesion().then(x => {
            setMiEstado({
                logeado: false,
                role: "usuario"
            })
            //Hay un valor almacenado de rol y cuando el usuario cierra sesion se borra
            deleteValue('role').then(console.log).catch(console.log)
            setUser(null);
        }).catch(err => {
            console.log(err)
        })
    }


    async function getGoogleSignInSessions() {
        try {
            return await GoogleSignin.getCurrentUser();
        } catch (error) {
            throw new Error("Ocurrio un error al obtener las sesiones de google")
        }
    }


    return {
        initializing,
        signIn,
        signOut,
        relogearAlAbrir
    };
};






