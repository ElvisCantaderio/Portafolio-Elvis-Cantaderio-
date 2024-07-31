<template>
  <div class="loginBtn" @click="signInWithGoogle">
    <q-tooltip class="bg-orange text-body1" style="width: 280px;">
      {{ $t('index.iniciarSesionFunciones') }}
    </q-tooltip>
    <img src="../assets/1534129544.svg" alt="google" />
    <p>{{ $t('index.iniciarSesion') }}</p>
  </div>
</template>
<script>
import { auth, provider } from 'src/boot/database';
import { signInWithPopup } from 'firebase/auth';
import { Nusuarios } from "../boot/pouchdb.js";

export default {
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

        const email = user.providerData[0].email;

        //Verificar si el correo electrónico ya existe
        const emailExists = async (email) => {
          const allDocs = await Nusuarios.allDocs({ include_docs: true });
          return allDocs.rows.some((row) => row.doc.email === email);
        };

        if (await emailExists(email)) {
          //console.warn('Los datos del usuario ya existen.');
          return;
        }
        const userData = {
          nombre: user.displayName,
          email: email
        };

        // Crea un nuevo documento en la base de datos PouchDB
        await Nusuarios.post(userData);

        //console.log('Datos del usuario guardados correctamente.');
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

.loginBtn {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: $gray-3;
  padding: 8px 15px;
  border-radius: 25px;
  box-shadow: 0 3px 3px rgba(0, 0, 0, .3);
  transition: all .2s ease-in;
  cursor: default;

  & img {
    display: inline-block;
    width: 20px;
    height: 20px;
  }

  & p {
    margin: 0;
  }

  &:hover {
    background-color: $gray-2;
  }
}
</style>
