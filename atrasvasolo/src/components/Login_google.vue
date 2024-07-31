<template>
  <!--logo superior-->
  <q-badge>
    <q-img src="../assets/logo_atrasvasolo.png" class="icon-atrasvas" alt="logo_atrasvasolo"></q-img>
  </q-badge>
  <!--boton de cerrar Drawer-->
  <q-btn class="absolute-top-right q-mx-lg q-mt-sm" icon="close" square size="sm"
    style="width: 1rem; background-color: #5f6368" @click="cerrarDrawer"></q-btn>

  <div class="row">
    <div class="col-10">
      <div class="mb-5 q-px-md q-pb-lg text-center q-gutter-x-md">
        <div class="q-pa-md q-gutter-md q-pl-lg q-pt-md" style="height: 175px; width: 200px">
          <!--imagen de usuario con avatar-->
          <q-avatar size="85px" class="user">
            <img :src="user.photo" />
          </q-avatar>
          <!--se muestra el user name-->
          <div class="q-mt-md">
            <span class="q-pa-md q-pl-lg q-pb-lg text-weight-bold" style="color: white">{{ user.name }}</span>
          </div>
        </div>

        <div class="q-gutter-md q-pl-md">
          <!--boton de cerrar secion-->
          <button v-if="user.email !== 'vacio'" @click="logOut" style="background-color: red; color: white">
            {{ $t('Csesion') }}
          </button>
          <!--boton de iniciar seccion google-->
          <button v-if="user.email == 'vacio'" class="btn-google" @click="logIn()" aria-label="">
            <!-- <q-img :src="url" class="icon-google" alt="logo-google" /> -->
            <!--texto label de inicio de seccion-->
            <i style="color: black" class="text-weight-bold">{{ $t('Isesion') }}</i>
          </button>
        </div>
      </div>
      <div class="items-start q-gutter-md">
        <!--inicio de las cards-->
        <q-card class="my-card" style="
                    background-color: #3c3b3b;
                    border-top: 1px solid rgb(255, 255, 255);
                    border-bottom: 1px solid rgb(255, 255, 255);
                    width: 275px;
                  ">
          <!--apartado de idiomas-->
          <q-card-section>
            <div class="flex inline">
              <div class="q-my-auto">
                <q-btn dense color="yellow" round icon="public" class="fix-left">
                  <!--boton-->
                </q-btn>
                <span class="q-pl-lg">Idioma</span>
              </div>
              <!--seleccion de idioma-->
              <div class="q-gutter-y-sm q-pl-lg" style="width: 140px">
                <q-select outlined v-model="model" :options="options" dense :options-dense="denseOpts" dark>
                </q-select>
              </div>
            </div>
          </q-card-section>
          <!--apartado de valoranos-->
          <q-card-section>
            <div class="q-my-auto">
              <q-btn dense color="blue" round icon="share" class="fix-left">
              </q-btn>
              <span class="q-pl-lg">Valoranos</span>
            </div>
          </q-card-section>
          <!--apartado de comparte-->
          <q-card-section>
            <div class="q-my-auto">
              <q-btn dense color="red" round icon="star" class="fix-left">
              </q-btn>
              <span class="q-pl-lg">Comparte</span>
            </div>
          </q-card-section>
          <!--apartado de politicas de privacidad-->
          <q-card-section>
            <div class="q-my-auto">
              <q-btn dense color="green" round icon="star" class="fix-left">
              </q-btn>
              <span class="q-pl-lg">Politicas de Privacidad</span>
            </div>
          </q-card-section>
          <!--apartado de ayuda-->
          <q-card-section>
            <div class="q-my-auto">
              <q-btn dense color="gray" round icon="help" class="fix-left">
              </q-btn>
              <span class="q-pl-lg">Ayuda</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
  <!--pie de pagina de el drawer-->
  <footer><q-badge class="fixed-bottom-right">V 1.0.0</q-badge></footer>
</template>
<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap");

span {
  color: white;
}

#app {
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  font-size: 0.938rem;
  color: #b7b9bd;
}

a {
  color: #e0e2e8;
  text-decoration: none;
}

.text-muted {
  color: #ffffff !important;
}

button {
  border: none;
  border-radius: 0.625rem;
  width: 11rem;
}

.btn-google {
  background-color: white;
  color: #545c74;
  border: 1px solid rgb(255, 255, 255);
}

.btn-google:hover,
.btn-google:active {
  background-color: #fcfcfc;
}

.icon-google {
  width: 2rem;
  right: 0.75rem;
}

.user {
  color: #545c74;
  border: 1px solid rgb(255, 255, 255);
}

.icon-atrasvas {
  width: 3rem;
  right: 0.5rem;
}

.q-badge {
  background-color: transparent;
}

.q-select {
  color: black;
}
</style>
<script setup>
import { defineComponent } from "vue";
import { reactive } from "vue";
import {
  auth,
  signInWithRedirect,
  GoogleAuthProvider,
  getRedirectResult,
  getAuth,
} from "../boot/firebase.js";
const url = ref('imagenes/google.png')
const user = reactive({
  name: "Iniciar Seccion",
  email: "vacio",
  photo: "https://cdn.quasar.dev/img/avatar.png",
});

const logIn = async () => {
  const provider = new GoogleAuthProvider();

  await signInWithRedirect(getAuth(), provider);
};
const logOut = async () => {
  await auth.signOut();
  user.photo = "https://cdn.quasar.dev/img/avatar.png";
  user.email = "vacio";
  user.name = "Iniciar Seccion";
};
onMounted(() => {
  // Listen for redirects
  getRedirectResult(getAuth())
    .then((result) => {
      if (result.user) {
        (user.name = result.user.displayName),
          (user.email = result.user.email),
          (user.photo = result.user.photoURL);

        // User is signed in
      } else {
        // User is signed out
        console.log("No user signed in");
      }
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });
});
const leftDrawerOpen = ref(true);

const model = ref("Español");
const options = ["Español", "Ingles", "Italiano", "Aleman", "Chino"];
</script>
<script>
import { ref, onMounted } from "vue";

export default defineComponent({
  name: "Login_google",
  methods: {
    cerrarDrawer() {
      this.$emit("cerrarDrawer");
    },
  },
});
</script>
