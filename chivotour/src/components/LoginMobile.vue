<template>
    <q-item style="padding: 0;" clickable @click="signInWithGoogle">
        <li class="drawer__item" @click="inception = true">
            <div class="drawer__item--icon drawer__item--icon-7">
                <q-icon name="fa-solid fa-right-to-bracket" />
            </div>
            <div class="drawer__item--text">{{ $t('index.iniciarSesion') }}</div>
        </li>
    </q-item>
</template>
<script>
import { ref } from 'vue';
import { auth, provider, db} from 'src/boot/database';
import { signInWithPopup } from 'firebase/auth';
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

export default {
    data() {
        return {
            inception: ref(false)
        }
    },
    methods: {
        signInWithGoogle() {
            signInWithPopup(auth, provider)
                .then((result) => {
                    // El usuario ha iniciado sesión correctamente
                    const info = result.user.providerData[0].email; // email del usuario
                    const user = result.user;
                    this.$emit('login', {
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        email: info, // email del usuario
                    });
                    this.saveUserData(user);
                })
                .catch((error) => {
                    // Ocurrió un error durante el inicio de sesión
                    console.error(error);
                });
        },
        async saveUserData(user) {
      try {
        if (!user) {
          console.error('Usuario no autenticado.');
          return;
        }

        const uid = user.uid; // Obtiene el UID del usuario autenticado

        // Verifica si ya existe un documento con el mismo UID en la colección "usuarios"
        const userRef = collection (db, "usuarios");
        const docRef = doc(userRef, uid);
        const userDoc = await getDoc(docRef);
        if (!userDoc.exists) {
          console.warn('Los datos del usuario ya existen.');
          return;
        }

        // Crea un documento en la colección "usuarios" utilizando el UID como ID del documento
        //await db.collection('usuarios').doc(uid).set({
          await setDoc(doc(db, "usuarios", uid), {
          nombre: user.displayName,
          email: user.email
});

        console.log('Datos del usuario guardados correctamente.');
      } catch (error) {
        console.error('Error al guardar los datos del usuario:', error);
      }
    }
    }
}
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Hind+Madurai:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap');


// Variables
$bg-body: #E8FFF4;
$bg-orange: #F27405;
$bg-yellow: #FFC107;
$bg-red: #ED1515;

$green-light: #03A678;
$green-medium: #02735E;
$green-dark: #014040;

$gray-1: #828282;
$gray-2: #969696;
$gray-3: #AFAFAF;
$gray-4: #CACACA;

$white: #FFFF;
$black: #000;

.drawer {
    &__list {
        padding: 0;
        margin: 0;
        list-style: none;
    }

    &__item {
        display: flex;
        align-items: center;
        padding: 10px 20px;

        &--icon {
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            font-size: 20px;
            color: $white;

            &-1 {
                background-color: #50E7C5;
            }

            &-2 {
                background-color: $bg-yellow;
            }

            &-3 {
                background-color: $bg-orange;
            }

            &-4 {
                background-color: #ED1515;
            }

            &-5 {
                background-color: $green-light;
            }

            &-6 {
                background-color: #664CE3;
            }

            &-7 {
                background-color: #75e3e5;
            }

            &-8 {
                background-color: #E075E5;
            }

            &-9 {
                background-color: #023535;
            }
        }

        &--text {
            font-size: 16px;
            font-weight: 500;
            margin-left: 18px;
        }
    }
}

.q-item.q-router-link--active,
.q-item--active {
    color: #000;
}
</style>
