<template>
  <q-header class="bg-dark shadow-4">
    <q-toolbar>
      <q-btn flat dense round icon="menu" aria-label="Menu" @click="drawer = !drawer" class="q-ma-sm" />
      <q-space />
      <q-select v-if="view == 'paradas-view'" dense rounded outlined color="primary" bg-color="white"
        class="search-parada q-mx-md q-my-xs" use-input :label="$t('buscar.parada')" v-model="searchParada"
        popup-content-style="background-color: #fff; color:black;" name="searchParada" hide-dropdown-icon
        transition-show="jump-up" transition-hide="jump-up" :options="optionsParadas" input-debounce="0"
        @filter="filtrarParadas">
        <template v-slot:append>
          <q-icon name="search" color="grey-7" />
        </template>

        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps"
            style="height: 100px; max-width: 400px; min-width: 100%;background-color: #303030;" clickable
            @click="mandarParada(scope.opt._id)">
            <q-item-section avatar>
              <q-icon color="primary" name="place" />
            </q-item-section>
            <q-item-section style="color: white">
              <q-item-label>
                <strong>{{ scope.opt.nombre }}</strong></q-item-label>
              <q-item-label class="ellipsis-2-lines">
                {{ scope.opt.referencia }}</q-item-label>

            </q-item-section>
          </q-item>

        </template>
        <template v-slot:no-option>
          <q-item style="background-color: #303030; color: white; height: 50px">
            <q-item-section class="text-italic text-grey">
              {{ $t('sinR') }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select v-if="view == 'rutas-view'" dense rounded outlined color="primary" bg-color="white"
        :label="$t('buscar.ruta')" class="search-ruta q-mx-md q-my-xs" use-input v-model="searchRuta"
        popup-content-style="background-color: #fff; color:black;" name="searchRuta" hide-dropdown-icon
        transition-show="jump-up" transition-hide="jump-up" :options="optionsRutas" input-debounce="0"
        @filter="filtrarRutas">
        <template v-slot:append>
          <q-icon name="search" color="grey-7" />
        </template>
        <template v-slot:option="scope1">
          <q-item v-bind="scope1.itemProps"
            style="height: 100px; max-width: 400px; min-width: 100%; background-color: #303030;" clickable
            @click="mandarRuta(scope1.opt._id)">
            <q-item-section avatar>
              <q-icon color="primary" name="directions_bus" />
            </q-item-section>
            <q-item-section style="color: white">
              <q-item-label>
                <strong>{{ scope1.opt.nombre }}</strong></q-item-label>
              <q-item-label class="ellipsis-2-lines">
                {{ scope1.opt.ida.nombre }}</q-item-label>

            </q-item-section>

          </q-item>
        </template>
        <template v-slot:no-option>
          <q-item style="background-color: #303030; color: white; height: 50px">
            <q-item-section class="text-italic text-grey">
              {{ $t('sinR') }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>

    </q-toolbar>
    <q-toolbar inset class="row">

      <q-expansion-item @after-hide="cerrarDesplegable" v-model="expanded" @click="abrirDesplegable" dense
        class="q-mx-auto no-border" expand-icon-class="text-white">


        <MainNavbarContentParadas v-if="view == 'paradas-view'" :paradasFavoritas="paradasFavoritas"
          :paradasfavoritasfiltrada="paradasfavoritasfiltrada"
          @actualizarParadasFavoritasUsuario="FuncionParaActualizarParadasdeUsuario"
          @agregarParadasFavoritasUsuario="FuncionParaAgregarParadadeUsuario">
        </MainNavbarContentParadas>

        <MainNavbarContentRutas v-if="view == 'rutas-view'" :rutasFavoritas="rutasFavoritas"
          :rutasfavoritasfiltrada="rutasfavoritasfiltrada"
          @actualizarRutasFavoritasUsuario="FuncionParaActualizarRutadeUsuario"
          @agregarRutasFavoritasUsuario="FuncionParaAgregarRutadeUsuario"></MainNavbarContentRutas>

        <MainNavbarContentDestinos v-if="view == 'destinos-view'" :paradasFavoritas="paradasFavoritas"
          :rutasFavoritas="rutasFavoritas"></MainNavbarContentDestinos>


        <q-btn @click="expanded = !expanded" flat class="col-12 collapse-btn" icon="expand_less">

        </q-btn>
      </q-expansion-item>
    </q-toolbar>
  </q-header>

  <q-drawer v-model="drawer" overlay :width="300" :breakpoint="700" elevated class="bg-dark text-white">

    <q-scroll-area class="fit">

      <div class="absolute  absolute-full">
        <div class="q-pa-sm">
          <img src="../assets/logo_atrasvasolo.png" alt="Logo" width="70" height="40" />
          <q-btn @click="drawer = !drawer" icon="close" class="dere" flat></q-btn>
        </div>
        <div class="q-pa-sm q-gutter-md">
          <div align="center" class="native-mobile-hide">
            <q-avatar size="85px" class="user">
              <img :src=store.foto />

            </q-avatar>

            <div class="text-subtitle2">{{ store.nombre }}</div>
            <div>{{ store.correosecionactiva }}</div>
          </div>
          <div align="center" class="native-mobile-hide">
            <!--boton de cerrar sesion-->
            <q-btn v-if="store.correosecionactiva !== 'User@User.com'" @click="LogOut()" :label="$t('login.Csesion')"
              style="background-color: red; color: white">

            </q-btn>

            <!--boton de iniciar sesion google-->
            <q-btn v-if="store.correosecionactiva === 'User@User.com'" class="btn-google cordova-hide" @click="logIn()"
              :label="$t('login.Isesion')" icon="img:imagenes\google.png">
            </q-btn>
            <q-btn v-if="store.correosecionactiva === 'User@User.com'" class="btn-google cordova-only"
              onclick="window.open('http://atrasvasolo.com/#/', '_blank')" :label="$t('login.Isesion')"
              icon="img:imagenes\google.png">

            </q-btn>
          </div>

          <div class="q-pa-md" style="max-width: 350px">


            <q-list class="desktop-only" v-if="store.admin == 'COLABORADOR' || store.admin == 'ADMINISTRADOR'">
              <q-item-label header>{{ $t('admin') }}</q-item-label>
              <q-item clickable class="my-item" v-ripple to="/Administracion/Paradas" exact>
                <q-item-section avatar>
                  <q-icon color="primary" name="place" />
                </q-item-section>

                <q-item-section>{{ $t('btn.paradas') }}</q-item-section>
              </q-item>

              <q-item clickable class="my-item" v-ripple to="/Administracion/Rutas">
                <q-item-section avatar>
                  <q-icon color="primary" name="directions_bus" />
                </q-item-section>

                <q-item-section>{{ $t('btn.rutas') }}</q-item-section>
              </q-item>
              <q-item clickable class="my-item" v-ripple to="/administracion/Usuario" exact>
                <q-item-section avatar>
                  <q-icon color="primary" name="people" />
                </q-item-section>

                <q-item-section>{{ $t('btn.usuarios') }}</q-item-section>
              </q-item>
              <q-item clickable class="my-item" v-ripple to="/Administracion/Publicidad" exact>
                <q-item-section avatar>
                  <q-icon color="primary" name="local_offer" />
                </q-item-section>

                <q-item-section>{{ $t('btn.publicidad') }}</q-item-section>
              </q-item>
            </q-list>
            <q-separator spaced></q-separator>

            <q-list>
              <q-item clickable class="my-item" v-ripple to="/">
                <q-item-section avatar>
                  <q-icon name="home" color="primary" />
                </q-item-section>
                <q-item-section>{{ $t('btn.inicio') }}</q-item-section>
              </q-item>

              <q-item clickable class="my-item" v-ripple>
                <q-item-section avatar>
                  <q-icon name="translate" style="color: #fd842b" />
                </q-item-section>
                <span class="q-pt-sm">{{ $t('btn.idioma') }}</span>


                <q-item-section>
                  <div class="q-gutter-y-sm q-pl-lg" style="max-width: 200px">
                    <q-select outlined v-model="model" dense dark>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section>
                            <q-btn flat label="English"
                              @click="model = 'en'; $i18n.locale = 'en-US'; $q.notify('Language Changed');" />
                            <q-btn flat label="Español"
                              @click=" model = 'es'; $i18n.locale = 'es'; $q.notify('Language Changed');" />
                            <q-btn flat label="Français"
                              @click=" model = 'fr-FR'; $i18n.locale = 'fr-FR'; $q.notify('Language Changed');" />
                            <q-btn flat label="Русский"
                              @click=" model = 'ru-RU'; $i18n.locale = 'ru-RU'; $q.notify('Language Changed');" />
                            <q-btn flat label="Deutsch"
                              @click=" model = 'de-DE'; $i18n.locale = 'de-DE'; $q.notify('Language Changed');" />
                            <q-btn flat label="português"
                              @click=" model = 'pt-PT'; $i18n.locale = 'pt-PT'; $q.notify('Language Changed');" />
                            <q-btn flat label="中國人"
                              @click=" model = 'zh-Hans'; $i18n.locale = 'zh-Hans'; $q.notify('Language Changed');" />
                            <q-btn flat label="italiano"
                              @click=" model = 'it-IT'; $i18n.locale = 'it-IT'; $q.notify('Language Changed');" />
                            <q-btn flat label="日本語"
                              @click=" model = 'ja-JA'; $i18n.locale = 'ja-JA'; $q.notify('Language Changed');" />
                            <q-btn flat label="Afrikaans"
                              @click=" model = 'af-AF'; $i18n.locale = 'af-AF'; $q.notify('Language Changed');" />
                            <q-btn flat label="عرب"
                              @click=" model = 'ar-AR'; $i18n.locale = 'ar-AR'; $q.notify('Language Changed');" />
                            <q-btn flat label="Türkçe"
                              @click=" model = 'tr-TR'; $i18n.locale = 'tr-TR'; $q.notify('Language Changed');" />
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </q-item-section>
              </q-item>
              <!--boton de compartir -->
              <q-item clickable class="my-item" v-ripple @click="mostrarDialogo1">
                <q-item-section avatar>
                  <q-icon name="share" style="color: #1e96c8" />
                </q-item-section>

                <q-item-section>{{ $t('btn.comparte') }}
                  <div>
                    <q-dialog v-model="tuVariableVisible1">
                      <q-card style="background-color: #303030;border-radius: 10px;">
                        <q-card-section>
                          <div class="text-h6" style="color: white">{{ $t('btnNavbar.compartir') }}</div>
                          <br>

                          <q-btn color="blue" icon="img:imagenes/social-media/facebook.png">

                            <s-facebook :window-features="windowFeatures" :share-options="shareOptions"
                              :use-native-behavior="useNativeBehavior" @popup-focus="onFocus"> </s-facebook>
                          </q-btn>
                          <q-btn style="background-color: #B2FFFF;" class="q-ml-sm"
                            icon="img:imagenes/social-media/twitter-sign.png">

                            <s-twitter :window-features="windowFeatures1" :share-options="shareOptions1"
                              :use-native-behavior="useNativeBehavior" @popup-close="onClose" @popup-open="onOpen"
                              @popup-block="onBlock" @popup-focus="onFocus"> </s-twitter>
                          </q-btn>

                          <q-btn style="background-color: #12ce76;" icon="img:imagenes/social-media/whatsapp.png"
                            class="q-ml-sm" @click="shareWhatsApp"> </q-btn>
                          <q-btn class="q-ml-sm" @click="copyLink" color="black" icon="link"> </q-btn>
                        </q-card-section>
                        <q-card-actions align="center">
                          <q-btn :label="$t('btn.cerrar')" color="primary" @click="cerrarDialogo1" />
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
                  </div>

                </q-item-section>
              </q-item>
              <q-item clickable class="my-item" v-ripple>
                <q-item-section avatar @click="mostrarDialogo">
                  <q-icon name="star" style="color: #bd254e" />
                </q-item-section>
                <!--boton de  valorar-->
                <q-item-section @click="mostrarDialogo">
                  <span>{{ $t('btn.valora') }}</span>
                  <div class="q-flex">
                    <q-dialog v-model="tuVariableVisible">
                      <q-card style="background-color: #303030;border-radius: 10px;">
                        <q-card-section>

                          <img class="absolute-top-left" src="../assets/logo_atrasvasolo.png" alt="Logo" width="70"
                            height="40" />
                          <div class="flex justify-center">
                            <h3 class="text-weight-bolder text-center" style="color: #fd842b;">
                              {{ $t('btnNavbar.teGustaLaAplicacion') }}
                            </h3>
                            <h5 class="text-weight-bolder text-center q-mt-lg" style="color: white;"> {{
                              $t('btnNavbar.estrellas') }}</h5>
                            <div class="flex-inline q-px-md">
                              <q-btn :label="$t('btn.cerrar')" color="primary" @click="cerrarDialogo" />
                              <q-btn class="q-ml-md" color="primary" @click="enviarValoracion">{{ $t('btn.Enval')
                                }}</q-btn>
                            </div>
                          </div>
                        </q-card-section>
                        <q-card-actions align="center">
                          <span class="fa-bold q-pb-sm" style="color: white;">{{ $t('btnNavbar.gracias') }}</span>
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
                  </div>
                </q-item-section>
              </q-item>
              <!--boton de  politicas de seguridad-->
              <q-item clickable class="my-item" v-ripple>
                <q-item-section avatar @click="showDialog">
                  <q-icon name="lock" style="color: #12ce76" />
                </q-item-section>
                <q-item-section @click="showDialog">
                  <span>{{ $t('btn.politicas') }}</span>
                  <div class="q-pr-md ">
                    <q-dialog v-model="dialogVisible">
                      <q-card style="background-color: #303030;border-radius: 10px;" class="q-py-none my-card ">
                        <q-card-section class="q-px-lg">
                          <h3 class="text-weight-bolder text-center" style="color: #fd842b;">{{ $t('btn.politicas') }}
                          </h3>

                          <span style="color: white;">
                            <div>
                              <p>{{ $t('privacy_policy') }}</p>
                              <p>{{ $t('personal_information') }}</p>
                              <p>{{ $t('general_category') }}</p>
                              <p>{{ $t('create_account') }}</p>
                              <p>{{ $t('note') }}</p>
                              <p>{{ $t('additional_content') }}</p>
                              <p>{{ $t('additional_content') }}</p>
                            </div>


                          </span>

                        </q-card-section>

                        <q-card-actions align="right">
                          <q-btn :label="$t('btn.cerrar')" color="primary" @click="closeDialog" />
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
                  </div>
                </q-item-section>
              </q-item>
              <q-item clickable class="my-item" v-ripple href="https://website.atrasvasolo.com">
                <q-item-section avatar>
                  <q-icon name="help" style="color: #4d3ba7" />
                </q-item-section>

                <q-item-section href="https://website.atrasvasolo.com">{{ $t('btn.ayuda') }}



                </q-item-section>
              </q-item>
            </q-list>
            <q-separator spaced></q-separator>
          </div>
        </div>
      </div>
    </q-scroll-area>

  </q-drawer>
</template>

<script>
//instagra y  whassap
import 'web-social-share';
//script de vue-social facebook
import { SFacebook } from 'vue-socials'
//script de vue-social twitter
import { STwitter } from 'vue-socials'
import { defineComponent, ref, watch, reactive, onMounted } from "vue";
import MainNavbarContentDestinos from "src/components/MainNavbarContentDestinos.vue";
import MainNavbarContentParadas from "src/components/MainNavbarContentParadas.vue";
import MainNavbarContentRutas from "src/components/MainNavbarContentRutas.vue";

import {

  db, collection, getDocs, doc, query, limit, auth, GoogleAuthProvider, getRedirectResult,
  signInWithPopup, signInWithRedirect, getAuth, browserLocalPersistence, updateDoc, addDoc

} from "../boot/firebase";
import { useCounterStore } from 'stores/dataGlobal';
import { async } from "@firebase/util";
import { api } from 'boot/axios';
import { dbParada, dbRuta } from "src/boot/pouchdb";




export default defineComponent({

  name: "MainNavbar",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    SFacebook,
    // eslint-disable-next-line vue/no-unused-components
    STwitter,
    MainNavbarContentRutas,
    MainNavbarContentDestinos,
    MainNavbarContentParadas,
  },
  props: ["view"],

  setup(props) {
    const searchRuta = ref("")
    const searchParada = ref("")
    const rutasFavoritas = ref([]);
    const rutasFavoritasdeUsuarios = ref([]); //Este contiene todos los datos de usuarios
    const rutasFavoritasdeUsuario = ref([]); //Este contiene solo los datos del usuario Especifico
    const paradasFavoritas = ref([]);
    const optionsParadas = ref();
    const optionsRutas = ref();
    const datosdeUsuario = ref();
    const rutasfavoritasfiltrada = ref([]); //este contiene solo las rutasfavoritas de un usuario
    const paradasfavoritasfiltrada = ref([]);
    const posicion = ref();
    const store = useCounterStore();
    const userLoaded = ref(false)
    var expanded = ref(true);
    function abrirDesplegable() {
      expanded.value = true;
      const expansionItem = document.querySelector(".q-item");
      expansionItem.classList.add("invisible");
    }
    async function obtenerRutas() {
      dbRuta.allDocs({
        include_docs: true
      }).then(function (result) {
        const rutas = result.rows
        rutas.forEach((ruta) => {
          rutasFavoritas.value.push(ruta.doc)
        })
      }).catch(function (err) {
        console.log(err)
      })



    }
    async function obtenerParadas() {
      dbParada.allDocs({
        include_docs: true
      }).then(function (result) {
        const paradas = result.rows
        paradas.forEach((parada) => {
          paradasFavoritas.value.push(parada.doc)
        })
      }).catch(function (err) {
        console.log(err)
      })



    }
    function mandarRuta(id) {
      rutasFavoritas.value.forEach((ruta) => {
        if (ruta._id == id) {
          store.rutaRenderizada = ruta
          searchRuta.value = ruta.nombre
        }
      })
    }
    function mandarParada(id) {
      paradasFavoritas.value.forEach((parada) => {
        if (parada._id == id) {

          store.paradaActiva = parada
          searchParada.value = parada.nombre

        }
      })
    }
    function cerrarDesplegable() {
      expanded.value = false;
      const expansionItem = document.querySelector(".q-item");
      expansionItem.classList.remove("invisible");
    }
    function LogOut() {
      auth.signOut();
      store.correosecionactiva = "User@User.com"
      store.nombre = "User"
      store.foto = "public/imagenes/perfil.png"
      this.rutasfavoritasfiltrada = [];
      this.rutasFavoritasdeUsuario = [];
      this.paradasfavoritasfiltrada = [];
      store.admin = undefined
      localStorage.clear();
    }
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
    function logIn() {
      const provider = new GoogleAuthProvider();
      const authInstance = getAuth(); // Obtén la instancia de autenticación de Firebase

      // Configura la persistencia de sesión en Firebase

      // Inicia sesión con Google utilizando la persistencia configurada
      signInWithRedirect(authInstance, provider)
        .then(() => {
          return authInstance.getRedirectResult();
        })
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;

          if (result.user) {
            store.correosecionactiva = result.user.email;
            store.nombre = result.user.displayName;
            store.foto = result.user.photoURL;
            verificacionAdmin(result.user.email)
          }
        })
        .catch((error) => {
          // Maneja los errores aquí
          const errorCode = error.code;
          const errorMessage = error.message;
          const credential = firebase.auth.GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    }

    const FuncionParaAgregarRutadeUsuario = (ruta) => { //Esta funcion recibe la ruta del emit de MainNavbarContentRutas y envia los valores a los arrays
      rutasfavoritasfiltrada.value.push(ruta);
      rutasFavoritasdeUsuario.value[0].rutasFavoritas.push(ruta.id)
      actualizarusuario()
    }

    const FuncionParaAgregarParadadeUsuario = (parada) => { //Esta funcion recibe la ruta del emit de MainNavbarContentRutas y envia los valores a los arrays
      paradasfavoritasfiltrada.value.push(parada);
      rutasFavoritasdeUsuario.value[0].paradasFavoritas.push(parada.id)
      actualizarusuario()
    }

    const FuncionParaActualizarRutadeUsuario = (ruta) => { //Esta Funcion es para eliminar una ruta favorita
      let lista = rutasFavoritasdeUsuario.value[0].rutasFavoritas;
      rutasFavoritasdeUsuario.value[0].rutasFavoritas = lista.filter(rutas => rutas != ruta);
      rutasfavoritasfiltrada.value = [];
      rutasFavoritasdeUsuario.value[0].rutasFavoritas.forEach(doc => {
        let idruta = doc;
        rutasFavoritas.value.forEach((document) => {
          let coincidencia = document;
          if (coincidencia.id == idruta) {
            rutasfavoritasfiltrada.value.push(coincidencia);
          }
        });
      });
      actualizarusuario()
    }
    async function actualizarusuario() {
      const docRef = doc(db, 'usuarios', store.datosdeUsuario.id);
      await updateDoc(docRef, {
        paradasFavoritas: rutasFavoritasdeUsuario.value[0].paradasFavoritas,
        rutasFavoritas: rutasFavoritasdeUsuario.value[0].rutasFavoritas
      });

    }
    const FuncionParaActualizarParadasdeUsuario = (parada) => { //Esta Funcion es para eliminar una ruta favorita
      let lista = rutasFavoritasdeUsuario.value[0].paradasFavoritas;
      rutasFavoritasdeUsuario.value[0].paradasFavoritas = lista.filter(paradas => paradas != parada);
      paradasfavoritasfiltrada.value = [];
      rutasFavoritasdeUsuario.value[0].paradasFavoritas.forEach(doc => {
        let idparada = doc;
        paradasFavoritas.value.forEach((document) => {
          let coincidencia = document;
          if (coincidencia.id == idparada) {
            paradasfavoritasfiltrada.value.push(coincidencia);
          }
        });
      });
      actualizarusuario()
    }

    return {
      obtenerRutas,
      obtenerParadas,
      verificacionAdmin,
      searchParada,
      searchRuta,
      drawer: ref(false),
      abrirDesplegable,
      cerrarDesplegable,
      expanded,
      logIn,
      LogOut,
      datosdeUsuario,
      store,
      rutasFavoritas,
      rutasfavoritasfiltrada,
      paradasFavoritas,
      optionsParadas,
      optionsRutas,
      rutasFavoritasdeUsuarios,
      rutasFavoritasdeUsuario,
      paradasfavoritasfiltrada,
      mandarRuta,
      mandarParada,
      FuncionParaActualizarRutadeUsuario,
      FuncionParaAgregarRutadeUsuario,
      FuncionParaActualizarParadasdeUsuario,
      FuncionParaAgregarParadadeUsuario,
      filtrarParadas(val, update, abort) {
        if (val.length < 1) {
          abort()
          return
        }

        update(() => {
          const respaldo = JSON.parse(JSON.stringify(paradasFavoritas.value));
          const valorBuscado = val.toLowerCase();
          var paradasFiltradas = [];
          respaldo.forEach((parada) => {
            var valores = [parada.referencia, parada.nombre];
            for (var i = 0; i < valores.length; i++) {
              var valoresFiltrados = valores[i]
                .toLowerCase()
                .includes(valorBuscado);
            }
            if (valoresFiltrados == true) {

              paradasFiltradas.push(parada);
            }
          });
          optionsParadas.value = paradasFiltradas;
        });
      },
      filtrarRutas(val, update, abort) {
        if (val.length < 1) {
          abort()
          return
        }

        update(() => {
          const respaldo = JSON.parse(JSON.stringify(rutasFavoritas.value));
          const valorBuscado = val.toLowerCase();
          var rutasFiltradas = [];
          respaldo.forEach((ruta) => {
            var valores = [ruta.nombre];
            for (var i = 0; i < valores.length; i++) {
              var valoresFiltrados = valores[i]
                .toLowerCase()
                .includes(valorBuscado);
            }
            if (valoresFiltrados == true) {

              rutasFiltradas.push(ruta);


            }
          });
          optionsRutas.value = rutasFiltradas;

        });
      }

    };
  },
  methods: {

    shareInstagram() {
      const url = 'https://www.instagram.com/?url=' + encodeURIComponent('https://play.google.com/store/apps/details?id=com.atrasvasolo&hl=es_419&gl=US');
      window.open(url, '_blank');
    },
    shareWhatsApp() {
      const message = 'Echa un vistazo a esta increíble aplicación: ';
      const url = 'https://play.google.com/store/apps/details?id=com.atrasvasolo&hl=es_419&gl=US';
      const fullMessage = message + url;
      const encodedMessage = encodeURIComponent(fullMessage);
      const whatsappUrl = 'https://api.whatsapp.com/send?text=' + encodedMessage;
      window.open(whatsappUrl, '_blank');
    }, getPageUrl() {
      return window.location.href;
    },
    copyLink() {
      const link = "https://play.google.com/store/apps/details?id=com.atrasvasolo&hl=es_419&gl=US";
      navigator.clipboard.writeText(link)
        .then(() => {
          alert('¡Enlace copiado!');
        })
        .catch((error) => {
          console.error('Error al copiar el enlace:', error);
        });
    },
    enviarValoracion() {
      const packageName = 'com.atrasvasolo';
      const playStoreUrl = `https://play.google.com/store/apps/details?id=com.atrasvasolo&reviewId=1 `;
      window.open(playStoreUrl, '_blank');
    },
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
          if (this.store.correosecionactiva != "User@User.com") {
            this.obtenerUsuariodeFirebase();
          }
        })
    },
    async obtenerUsuariodeFirebase() {
      const first = collection(db, "usuarios")
      const querySnapshot = await getDocs(first);
      querySnapshot.forEach((doc) => {
        let usuarioFirebase = doc.data();
        usuarioFirebase.correo = doc.email;
        usuarioFirebase.id = doc.id;
        this.rutasFavoritasdeUsuarios.push(usuarioFirebase);
      });


      this.verificaciondeEmail()


    },
    verificaciondeEmail() {
      var emaildeUsuarioe = ""
      this.rutasFavoritasdeUsuarios.forEach((doc) => {
        emaildeUsuarioe = doc;
        emaildeUsuarioe.correo = doc.correo;
        emaildeUsuarioe.id = doc.id;
        if (emaildeUsuarioe.email == this.store.correosecionactiva) {
          this.rutasFavoritasdeUsuario.push(emaildeUsuarioe);
          this.store.datosdeUsuario = emaildeUsuarioe;
          this.datosdeUsuario = emaildeUsuarioe;
          var objetoJSON = JSON.stringify(this.datosdeUsuario);
          localStorage.setItem("miObjeto", objetoJSON);

        }
      });
      if (this.rutasFavoritasdeUsuario.length == 0) {
        const usuario = {
          destinosFavoritos: [], paradasFavoritas: [], rutasFavoritas: [], email: this.store.correosecionactiva
        }
        const collectionRef = collection(db, 'usuarios');
        const docRef = addDoc(collectionRef, usuario);

      }
      this.filtrarRutasFavoritas();
      this.filtrarParadasFavoritas();
    }
    ,
    filtrarRutasFavoritas() {
      this.rutasfavoritasfiltrada = [];
      this.rutasFavoritasdeUsuario[0].rutasFavoritas.forEach(doc => {
        let idruta = doc;
        this.rutasFavoritas.forEach((document) => {
          let coincidencia = document;
          if (coincidencia.id == idruta) {
            this.rutasfavoritasfiltrada.push(coincidencia);
          }
        });
      });

    },
    filtrarParadasFavoritas() {
      this.rutasFavoritasdeUsuario[0].paradasFavoritas.forEach(doc => {
        let idparada = doc;
        this.paradasFavoritas.forEach((document) => {
          let coincidencia = document;
          if (coincidencia.id == idparada) {
            this.paradasfavoritasfiltrada.push(coincidencia);
          }
        })
      })
    }
    ,
    showDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    }, mostrarDialogo() {
      this.tuVariableVisible = true;
    },
    cerrarDialogo() {
      this.tuVariableVisible = false;
    }, mostrarDialogo1() {
      this.tuVariableVisible1 = true;
    },
    cerrarDialogo1() {
      this.tuVariableVisible1 = false;
    },
    //metodos de compartir facebook
    onClose() { },
    onOpen() { },
    onBlock() { },
    onFocus() { },
  },

  mounted() {
    const expansionItem = document.querySelector(".q-item");

    expansionItem.classList.add("invisible");


    this.obtenerParadas()

    this.obtenerRutas();


    this.obtenerUsuario()

  },
  data() {
    return {
      model: 'en',  // Idioma predeterminado (español)
      dialogVisible: false,
      rateValue: 0,
      tuVariableVisible: false,
      tuVariableVisible1: false,
      tuVariableRateValue: 0,
      ///variables de compartir facebook
      windowFeatures: {},
      shareOptions: {
        url: 'https://play.google.com/store/apps/details?id=com.atrasvasolo&hl=es_419&gl=US',
        quote: 'Quote',
        hashtag: '#atrasvasolo',
      },
      //twitter
      windowFeatures1: {},
      shareOptions1: {
        url: 'https://play.google.com/store/apps/details?id=com.atrasvasolo&hl=es_419&gl=US',
        text: 'Prueba esta app ',
        hashtags: ['#atrasvasolo', 'app'],
        via: 'twitterdev',
      },
      useNativeBehavior: true,
    }
  },
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

.q-expansion-item {
  padding: 0 !important;
  width: 100%;
}

.q-expansion-item--popup>.q-expansion-item__container {
  border: 0 !important;
}

.q-item__section--main~.q-item__section--side {
  padding-left: 0;
}

.q-toolbar--inset {
  padding-left: 0;
}

.q-toolbar {
  min-height: 30px;
  padding-right: 0;
}

.q-expansion-item__container>.q-item>.q-item__section--main {
  display: none;
}

.q-item {
  justify-content: center;
}

.collapse-btn {
  width: 100%;
}

.search-parada,
.search-ruta {
  width: 250px;
}
</style>
