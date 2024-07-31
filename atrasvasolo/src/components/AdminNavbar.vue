<template>
  <q-header class="bg-dark shadow-4">
    <q-toolbar>
      <q-btn flat dense round icon="menu" aria-label="Menu" @click="drawer = !drawer" class="q-ma-sm" />
      <q-space />
      <h6 class="q-ma-md">{{ $t('admin') }}</h6>
    </q-toolbar>
  </q-header>
  <q-drawer v-model="drawer" overlay :width="250" :breakpoint="700" elevated class="bg-dark text-white">
    <q-scroll-area class="fit">
      <div class="q-pa-sm">
        <img src="../assets/logo_atrasvasolo.png" alt="Logo" width="70" height="40" />
        <q-btn @click="drawer = !drawer" icon="close" class="dere" flat></q-btn>
      </div>
      <div class="q-pa-sm q-gutter-md">
        <div align="center">
          <q-avatar size="85px" class="user">
            <img :src=store.foto />

          </q-avatar>

          <div class="text-subtitle2">{{ store.nombre }}</div>
          <div>{{ store.correosecionactiva }}</div>
          <div align="center">
            <!--boton de cerrar sesion-->
            <q-btn v-if="store.correosecionactiva !== 'User@User.com'" @click="LogOut()" :label="$t('login.Csesion')"
              style="background-color: red; color: white">

            </q-btn>
          </div>
        </div>


        <div class="q-pa-md" style="max-width: 350px">


          <q-list class="desktop-only">
            <q-item-label header>{{ $t('admin') }}</q-item-label>
            <q-item clickable v-ripple to="/Administracion/Paradas" exact>
              <q-item-section avatar>
                <q-icon color="primary" name="place" />
              </q-item-section>

              <q-item-section>{{ $t('btn.paradas') }}</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/Administracion/Rutas">
              <q-item-section avatar>
                <q-icon color="primary" name="directions_bus" />
              </q-item-section>

              <q-item-section>{{ $t('btn.rutas') }}</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/administracion/Usuario" exact>
              <q-item-section avatar>
                <q-icon color="primary" name="people" />
              </q-item-section>

              <q-item-section>{{ $t('btn.usuarios') }}</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/Administracion/Publicidad" exact>
              <q-item-section avatar>
                <q-icon color="primary" name="local_offer" />
              </q-item-section>

              <q-item-section>{{ $t('btn.publicidad') }}</q-item-section>
            </q-item>
          </q-list>
          <q-separator spaced></q-separator>

          <q-list>
            <q-item clickable v-ripple to="/">
              <q-item-section avatar>
                <q-icon name="home" color="primary" />
              </q-item-section>

              <q-item-section>{{ $t('btn.inicio') }}</q-item-section>
            </q-item>

          </q-list>
          <q-separator spaced></q-separator>
        </div>
      </div>
    </q-scroll-area>
  </q-drawer>
</template>

<script>

import { defineComponent, ref } from "vue";
import { useCounterStore } from 'stores/dataGlobal';
import {
  auth, GoogleAuthProvider,
  signInWithPopup, getAuth, browserLocalPersistence, collection, getDocs, db

} from "../boot/firebase";
import { api } from 'boot/axios';
export default defineComponent({
  name: "AdminNavbar",
  components: {},

  setup(props) {
    const store = useCounterStore();

    async function verificacionAdmin(emailUsuarioActivo) {

      const response = await api.get("/atrasvasolo-administradores/_all_docs?include_docs=true");
      if (response.status === 200) {
        const rutas = response.data.rows
        for (const ruta of rutas) {
          if (emailUsuarioActivo == ruta.doc.email) {
            store.admin = ruta.doc.tipo
          }
        }
      } else {
        console.log("Error al obtener las paradas");
      }

    }
    function LogOut() {
      auth.signOut();
      store.correosecionactiva = "User@User.com"
      store.nombre = "User"
      store.foto = "public/imagenes/perfil.png"
      store.admin = undefined
      localStorage.clear();
      window.location.href = "/#/"
    }
    function logIn() {

      const provider = new GoogleAuthProvider();
      const authInstance = getAuth(); // Obtén la instancia de autenticación de Firebase
      // Configura la persistencia de sesión en Firebase
      authInstance.setPersistence(browserLocalPersistence)
        .then(() => {
          // Inicia sesión con Google utilizando la persistencia configurada
          signInWithPopup(authInstance, provider)
            .then((result) => {
              const credential = GoogleAuthProvider.credentialFromResult(result);
              const token = credential.accessToken;
              if (result.user) {

                store.correosecionactiva = result.user.email;
                store.nombre = result.user.displayName;
                store.foto = result.user.photoURL;

              }
            })
            .catch((error) => {
              // Maneja los errores aquí
              const errorCode = error.code;
              const errorMessage = error.message;
              const credential = GoogleAuthProvider.credentialFromError(error);
              // ...
            });
        })
        .catch((error) => {
          // Maneja los errores de configuración de la persistencia
          console.error(error);
        });
    }
    return {
      drawer: ref(false),
      store,
      logIn,
      LogOut,
      verificacionAdmin
    };
  }, methods: {
    obtenerUsuario() {
      const authInstance = getAuth(); // Obtén la instancia de autenticación de Firebase
      authInstance.setPersistence(browserLocalPersistence)
        .then(() => {
          // Comprueba si hay un usuario autenticado
          if (authInstance.currentUser) {
            const currentUser = authInstance.currentUser;

            this.store.correosecionactiva = currentUser.email;
            this.store.nombre = currentUser.displayName;
            this.store.foto = currentUser.photoURL;
            this.verificacionAdmin(currentUser.email)

            // Utiliza los datos del usuario según sea necesario

          } else {
            // No hay un usuario autenticado en el `localStorage`

          }
        })
    },
  }, mounted() {
    this.obtenerUsuario()
  }
});
</script>

<style>
a {
  color: white;
  text-decoration: none;
}

.dere {
  float: right;
  /* Utilizamos la propiedad float con valor right */
}

.q-header {
  border-radius: 0 0 10px 10px;
}
</style>
