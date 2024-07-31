<!-- eslint-disable vue/no-export-in-script-setup -->
<template>
  <div class="q-px-none q-py-sm row flex justify-center" style="max-width: 100vw">

    <div class="col-10 col-md-6">
      <q-banner rounded class="bg-accent q-pa-none text-white text-center">
        <div class="row q-pa-none q-ma-none flex items-center">
          <div class="col-xs-3 col-sm-2 col-md-2 " style="font-size: medium; color: white" >
            <q-icon name="directions_bus" color="orange-10" size="30px" class="q-mr-lg" /> 
          </div >
          <div class="col-xs-6 col-sm-8 col-md-8">
            {{ $t('ruta') }}
            {{ nombre }}
          </div>
          <div v-if="this.datosdeUsuario.email != null" class="col-xs-2 col-sm-2 col-md-2">
            <q-btn  size="12px" icon="favorite" color="accent" text-color="info" unelevated
              v-if="this.datosdeUsuario.rutasFavoritas.includes(id)" @click="FuncionParaActualizarRutadeUsuario(id)" />
            <q-btn size="12px" icon="favorite_border" color="accent" text-color="info"
              unelevated v-else @click="FuncionParaAgregarRutadeUsuario(id)" />
          </div>

        </div>
      </q-banner>
    </div>
  </div>
  <div>
    <q-card class="bg-dark">
      <q-tabs v-model="tab" dense class="text-grey q-mx-md bg-accent" active-color="white" indicator-color="primary"
        align="justify">
        <q-tab name="general" :label="$t('general')" />
        <q-tab name="trayectoria" :label="$t('trayectoria')" />
      </q-tabs>


      <q-tab-panels v-model="tab" animated class="bg-dark">
        <q-tab-panel name="general" class="text-white" style="min-height: 80vh;">
          <div class="row justify-center q-mt-sm">
            <div class="col-12 col-md-5 q-mx-sm">
              <div class="q-px-sm q-pb-sm q-pt-none flex justify-center" style="max-width: 100vw">
                <q-responsive :ratio="4 / 3" style="width: 450px; max-width: 100%; "
                  class="shadow-2 rounded-borders">
                  <q-carousel animated v-model="slide" arrows navigation unelevated infinite control-color="white"
                    class="shadow-3 rounded-borders bg-accent">
                    <q-carousel-slide v-for="(foto, index) in fotos" :key="index" :name="index + 1" :img-src="foto" />

                  </q-carousel>
                </q-responsive>
              </div>
            </div>
            <div class="col-12 col-md-6 q-mx-sm">
              <!-- Car de los precios -->
              <div class="q-pa-xs flex justify-center row items-start q-gutter-md">
                <q-card class="bg-accent my-card" style="width: 450px">
                  <q-card-section class="q-pb-none">
                    <div class="row">
                      <div class="col-2 text-center">
                        <q-icon name="monetization_on" size="39px" color="accent" class="bg-info"
                          style="border-radius: 100%;" />
                      </div>
                      <div class="col-8">
                        <div class="text-h7">{{ $t('precio.normal') }}</div>
                        <div class="text-subtitle2" style="color: grey;font-size: 13px;">$ {{ precioNormal }}</div>
                      </div>
                    </div>
                  </q-card-section>

                  <q-card-section class="q-pb-none">
                    <div class="row">
                      <div class="col-2 text-center">
                        <q-icon name="monetization_on" size="39px" color="accent" class="bg-info"
                          style="border-radius: 100%;" />
                      </div>
                      <div class="col-8">
                        <div class="text-h7">{{ $t('precio.especial') }}</div>
                        <div class="text-subtitle2" style="color: grey;font-size: 13px">$ {{ precioEspecial }}</div>
                      </div>
                    </div>
                  </q-card-section>
                  <q-card-section>
                    <div class="row">
                      <div class="col-2 text-center">
                        <q-icon name="hourglass_empty" size="40px" color="info" />
                      </div>
                      <div class="col-8">
                        <div class="text-h7">{{ $t('tiempoEspera') }}</div>
                        <div class="text-subtitle2" style="color: grey;font-size: 13px">{{ tiempoEspera }}
                          {{ $t('tiempo') }}</div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
                <!--Card de anuncios-->
                <anuncios-rutas></anuncios-rutas>
              </div>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="trayectoria" class="text-white" style="min-height: 80vh;">
          <div class="row justify-center q-mt-sm">
            <div class="col-12 col-md-6 q-mx-sm q-mt-md">
              <div class="text-h7 " style="text-align: center;">{{ $t('sentido') }}</div>
              <div class="q-pa-xs flex justify-center row  q-gutter-md " style="max-width: 100vw">

                <div class="col-4 justify-center ">
                  <div class="text-h7 " style="text-align: center;">{{ $t('inicio') }}</div>
                  <div class="">
                    <q-field bg-color="white" color="primary" rounded outlined dense v-model="inicio"><template
                        v-slot:control>
                        <div class="self-center full-width no-outline" tabindex="0">{{ sentidoIda ?
                          ida.nombre.split("-")[0] : ida.nombre.split("-")[1] }}</div>
                      </template></q-field>
                  </div>
                </div>
                <div class="text-primary column self-center q-mt-lg">
                  <div>
                    <q-btn class="bg-accent" dense icon="sync_alt" @click="sentidoIda = !sentidoIda"></q-btn>
                  </div>
                </div>
                <div class="col-4 bg">
                  <div class="text-h7 " style="text-align: center;">{{ $t('final') }}</div>
                  <q-field bg-color="white" color="primary" rounded outlined dense v-model="final"><template
                      v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">{{ sentidoIda ?
                        ida.nombre.split("-")[1] : ida.nombre.split("-")[0] }}</div>
                    </template></q-field>
                </div>
              </div>
              <br>

              <div class="q-pa-xs flex justify-center row items-start q-gutter-md" style="max-width: 100vw">
                <q-card class="bg-accent my-card" style="width: 350px; max-width: 100%;">
                  <q-card-section class="q-pb-none">
                    <div class="row">
                      <div class="col-2 text-center">
                        <q-icon name="schedule" size="40px" color="info" />
                      </div>
                      <div class="col-8 bg">
                        <div class="text-h7">{{ $t('tiempoRecorrido') }}</div>
                        <div class="text-subtitle2" style="color: grey;font-size: 13px">{{ sentidoIda ? ida.tiempo :
                          vuelta.tiempo }} {{ $t('tiempo') }}</div>
                      </div>
                    </div>
                  </q-card-section>

                  <q-card-section class="q-pb-none">
                    <div class="row">
                      <div class="col-2 text-center">
                        <link rel="stylesheet"
                          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
                        <span class="material-symbols-outlined" style="font-size: 40px;color: #CDEFDF;">
                          timer
                        </span>
                      </div>
                      <div class="col-8">
                        <div class="text-h7">{{ $t('Hsalida') }}</div>
                        <div class="text-subtitle2" style="color: grey;font-size: 13px">{{ sentidoIda ? ida.primerviaje :
                          vuelta.primerviaje }}</div>
                      </div>
                    </div>
                  </q-card-section>
                  <q-card-section>
                    <div class="row">
                      <div class="col-2 text-center">
                        <link rel="stylesheet"
                          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
                        <span class="material-symbols-outlined" style="font-size: 40px;color: #CDEFDF;">
                          timer
                        </span>

                      </div>
                      <div class="col-8">
                        <div class="text-h7">{{ $t('Htermina') }}</div>
                        <div class="text-subtitle2" style="color: grey;font-size: 13px">{{ sentidoIda ? ida.ultimoviaje
                          : vuelta.ultimoviaje }}</div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div><br><br></div>
              <div class=" justify-center flex row items-start col-7 ">
                <div class="text-subtitle2 col-12 text-center">{{ $t('recorre') }}</div>
                <q-expansion-item class="bg-accent rounded-borders" style="width: 450px; max-width: 100%; ">


                  <q-list v-if="sentidoIda == true" style="max-height: 20px;">
                    <div class="row justify-between items-center bg-accent" v-for="(parada, index) in ida.paradas "
                      :key="index" :id="parada.id">
                      <q-item clickable v-close-popup class="col-xs-11 col-sm-12 col-md-13 items-center"
                        >
                        <q-item-section side top>
                          <q-icon name="place" color="info" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ parada.nombre }}</q-item-label>
                          <q-item-label style="color: grey" caption lines="2">{{ parada.referencia }}</q-item-label>
                        </q-item-section>

                      </q-item>
                    </div>
                  </q-list>
                  <q-list v-if="sentidoIda == false">
                    <div class="row justify-between items-center bg-accent" v-for="(parada, index) in vuelta.paradas "
                      :key="index" :id="parada.id">
                      <q-item clickable v-close-popup class="col-xs-11 col-sm-12 col-md-13 items-center"
                        >
                        <q-item-section side top>
                          <q-icon name="place" color="info" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ parada.nombre }}</q-item-label>
                          <q-item-label style="color: grey" caption lines="2">{{ parada.referencia }}</q-item-label>
                        </q-item-section>

                      </q-item>
                    </div>
                  </q-list>

                </q-expansion-item>
              </div>

            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";
import AnunciosRutas from "src/components/AnunciosRutas.vue";
import { useCounterStore } from 'stores/dataGlobal';
import { db, collection, getDocs, doc, query, limit, updateDoc } from "../boot/firebase";
import { api } from 'boot/axios';
import { dbParada, dbRuta } from "src/boot/pouchdb";
export default {
  setup(props) {
    const nombre = ref()
    const fotos = ref()
    const precioEspecial = ref()
    const precioNormal = ref()
    const tiempoEspera = ref()
    const ida = ref({})
    const vuelta = ref({})
    const currentPath = window.location.hash;
    const id = currentPath.split("/").pop();
    const store = useCounterStore();
    const datosdeUsuario = ref({
      destinosFavoritos: [],
      rutasFavoritas: [],
      paradasFavoritas: [],
      email: null
    })
    const FuncionParaAgregarRutadeUsuario = (id) => { //Esta funcion recibe la ruta del emit de MainNavbarContentRutas y envia los valores a los arrays
      datosdeUsuario.value.rutasFavoritas.push(id)
      actualizarusuario()
    }
    const FuncionParaActualizarRutadeUsuario = (ruta) => { //Esta Funcion es para eliminar una ruta favorita
      let lista = datosdeUsuario.value.rutasFavoritas;
      datosdeUsuario.value.rutasFavoritas = lista.filter(rutas => rutas != ruta);
      actualizarusuario()
    }
    async function actualizarusuario() {
      if (datosdeUsuario.value) {
        const docRef = doc(db, 'usuarios', datosdeUsuario.value.id);
        await updateDoc(docRef, { rutasFavoritas: datosdeUsuario.value.rutasFavoritas });
        var objetoJSON = JSON.stringify(datosdeUsuario.value);
        localStorage.setItem("miObjeto", objetoJSON);
      }

    }
    async function obtenerRuta() {


      dbRuta.get(this.id).then(function (result) {
        const ruta = result
        nombre.value = ruta.nombre
        fotos.value = ruta.fotos

        precioNormal.value = ruta.precios.normal
        precioEspecial.value = ruta.precios.especial
        tiempoEspera.value = ruta.frecuencia
        ida.value = ruta.ida
        vuelta.value = ruta.vuelta

        if (vuelta.value.paradas.length === 0) {
          vuelta.value = ruta.ida
          vuelta.value.paradas = ruta.ida.paradas.reverse()
        }

      }).catch(function (err) {
        console.log(err)
      })

      // const response = await api.get("/atrasvasolo-rutas/" + this.id);
      // if (response.status === 200) {
      //   const ruta = response.data
      //   this.nombre = ruta.nombre
      //   this.fotos = ruta.fotos
      //   this.precioNormal = ruta.precios.normal
      //   this.precioEspecial = ruta.precios.especial
      //   this.tiempoEspera = ruta.frecuencia
      //   this.ida = ruta.ida
      //   this.vuelta = ruta.vuelta

      //   if (this.vuelta.paradas.length === 0) {
      //     this.vuelta = ruta.ida
      //     this.vuelta.paradas = ruta.ida.paradas.reverse()
      //   }


      // } else {
      //   console.log("Error al obtener las paradas");
      // }

    }
    return {
      obtenerRuta,
      FuncionParaAgregarRutadeUsuario,
      FuncionParaActualizarRutadeUsuario,
      actualizarusuario,
      sentidoIda: ref(true),
      datosdeUsuario,
      inicio: ref(),
      final: ref(),
      tab: ref("general"),
      slide: ref(1),
      id,
      nombre,
      fotos,
      precioEspecial,
      precioNormal,
      tiempoEspera,
      ida,
      vuelta

    };
  }, methods: {

    async obtenerDatosdeUsuario() {
      var objetoGuardadoJSON = localStorage.getItem("miObjeto");
      if (objetoGuardadoJSON) {
        this.datosdeUsuario = JSON.parse(objetoGuardadoJSON);
      }
    },

  }, mounted() {

    this.obtenerRuta()
    this.obtenerDatosdeUsuario()

  },
  components: { AnunciosRutas }
};
</script>


<style lang="sass" scoped>

.my-card
  width: 80vw


</style>
