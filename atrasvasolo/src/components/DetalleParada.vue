<template>
  <div class="q-px-none q-py-sm row flex justify-center" style="max-width: 100vw">

    <div class="col-10 col-md-6">
      <q-banner rounded class="bg-accent q-pa-none text-white text-center ">
        <div class="row q-pa-none q-ma-none flex  items-center">
          <div class="col-xs-3 col-sm-2 col-md-2 " style="font-size: medium; color: white">
            <q-icon name="place" color="orange-10" size="30px" />
            
          </div>
          <div class="col-xs-6 col-sm-8 col-md-8">
            {{ parada.nombre }}
          </div>
          <div v-if="datosdeUsuario.email != null" class="col-xs-2 col-sm-2 col-md-2">
            <q-btn size="12px" icon="favorite" color="accent" text-color="info" unelevated
              v-if="datosdeUsuario.paradasFavoritas.includes(route.params.idParada)"
              @click="FuncionParaActualizarRutadeUsuario(route.params.idParada)" />
            <q-btn size="12px" icon="favorite_border" color="accent" text-color="info"
              unelevated v-else @click="FuncionParaAgregarRutadeUsuario(route.params.idParada)" />
          </div>

        </div>
      </q-banner>
    </div>
  </div>
  <br>
  <div class="row justify-around" style="max-width: 100vw">

    <div class="col-sm-12 col-md-5 row justify-center">
      <div class="text-subtitle2 col-12 text-center q-mt-sm" style="color: white">
        {{ $t('lugares') }}


      </div>
      <q-card class="bg-accent row justify-center col-xs-8 col-sm-8 col-md-6 q-mb-md" rounded flat>
        <q-card-section class="" style="color: white">
          {{ parada.lugaresCercanos }}
        </q-card-section>
      </q-card>
      <div class="text-subtitle2 col-12 text-center" style="color: white">
        {{ $t('rutasCer') }}
      </div>

      <!-- Lista de rutas  -->
      <q-card class="bg-accent col-xs-11 col-sm-8 col-md-10 q-mb-xl" rounded flat>
        <q-card-section>

          <q-tab-panel name="paradasCercanas" v-for="ruta in rutas" :key="ruta.id">
            <q-list>
              <div class="row justify-between">
                <q-item clickable v-ripple class="col-xs-9 col-sm-8 col-md-12 items-center"
                  :to="'/DetalleRuta/' + ruta._id">
                  <q-item-section side top>
                    <q-icon name="directions_bus" color="info" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label style="color:white;">{{ ruta.nombre }}</q-item-label>
                    <q-item-label style="color: grey" caption lines="2">{{ ruta.ida.nombre }}</q-item-label>
                    <q-item-label style="color: grey" caption lines="2">{{ $t("departamento") }} {{ ruta.ciudad
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

              </div>


            </q-list>
          </q-tab-panel>
        </q-card-section>
      </q-card>
      <!--Anuncios paradas-->

    </div>
    <div class=" col-sm-12 col-md-6 " style="width: 585px; max-width: 100%; height: 300px" v-if="termino">
      <!-- Renderizar el componente -->
      <div>
        <GlobalMap :point="puntos"></GlobalMap>
      </div>
      <component :is="dynamicComponent" />

    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { doc, getDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../boot/firebase';
import { useRoute } from 'vue-router';
import { shallowRef } from 'vue';
import AnunciosParadas from 'src/components/AnunciosParadas.vue';
import L from "leaflet";
import GlobalMap from './GlobalMap.vue';
import { api } from 'boot/axios';
import { dbParada, dbRuta } from "src/boot/pouchdb";

// Define una variable reactiva para el componente dinámico
const dynamicComponent = shallowRef(AnunciosParadas);
const route = useRoute();
const parada = ref({ lugaresCercanos: '', rutas: [] });
const rutas = ref([]);
const puntos = []
const termino = ref(false)
// Variable reactiva para almacenar la ubicación actual
const ubicacionActual = ref(null);
const datosdeUsuario = ref({
  destinosFavoritos: [],
  rutasFavoritas: [],
  paradasFavoritas: [],
  email: null
})
const FuncionParaAgregarRutadeUsuario = (id) => { //Esta funcion recibe la ruta del emit de MainNavbarContentRutas y envia los valores a los arrays
  datosdeUsuario.value.paradasFavoritas.push(id)
  actualizarusuario()
}
const FuncionParaActualizarRutadeUsuario = (ruta) => { //Esta Funcion es para eliminar una ruta favorita
  let lista = datosdeUsuario.value.paradasFavoritas;
  datosdeUsuario.value.paradasFavoritas = lista.filter(rutas => rutas != ruta);
  actualizarusuario()
}
async function actualizarusuario() {
  if (datosdeUsuario.value) {
    const docRef = doc(db, 'usuarios', datosdeUsuario.value.id);
    await updateDoc(docRef, { paradasFavoritas: datosdeUsuario.value.paradasFavoritas });
    var objetoJSON = JSON.stringify(datosdeUsuario.value);
    localStorage.setItem("miObjeto", objetoJSON);
  }

}
async function obtenerDatosdeUsuario() {
  var objetoGuardadoJSON = localStorage.getItem("miObjeto");
  if (objetoGuardadoJSON) {
    datosdeUsuario.value = JSON.parse(objetoGuardadoJSON);
  }

}
async function dataQuery(id) {

  dbParada.get(id).then(function (result) {
    puntos.push([result.gps.value._latitude, result.gps.value._longitude, result.nombre])
    dataQueryRoute(result.lugaresCercanos, result.nombre)
    termino.value = true;
    parada.value = result;
  }).catch(function (err) {
    console.log(err)
  })

  // const ide = id;

  // const response = await api.get(`/atrasvasolo-paradas/${ide}`);

  // puntos.push([response.data.gps.value._latitude, response.data.gps.value._longitude, response.data.nombre])
  // dataQueryRoute(response.data.lugaresCercanos, response.data.nombre)
  // termino.value = true;
  // parada.value = response.data;


}

async function dataQueryRoute(lugares, nombreParada) {
  const nombrePa = nombreParada;

  try {
    
    dbRuta.allDocs({
      include_docs: true
    }).then(function (result) {
      const rutasData = [];
      const allrutas = result.rows
      allrutas.forEach((doc) => {
        const ruta = doc.doc
        const ObjRutas = ruta.ida.paradas;
        const ObjRutaVuelta = ruta.vuelta.paradas;
        var encontrado = false

        ObjRutas.filter(item => {
          const busqueda = item.nombre.includes(nombrePa)
          if (busqueda && encontrado == false) {
            rutasData.push(ruta)
            encontrado = true
          }
        })
        ObjRutaVuelta.filter(item => {
          const busquedaVuelta = item.nombre.includes(nombrePa)
          if (busquedaVuelta && encontrado == false) {
            rutasData.push(ruta)
            encontrado = true
          }
        })
      })
      rutas.value = rutasData;
    }).catch(function (err) {
      console.log(err)
    })



  } catch (error) {
    console.error('Error al cargar los datos:', error);
  }

}






onMounted(() => {
  const id = route.params.idParada;
  dataQuery(id)
  obtenerDatosdeUsuario()


  // Asigna el componente dinámico
  dynamicComponent.value = AnunciosParadas;
})

const props = defineProps({
  point: {
    type: Array,
    default: () => []
  }
})
</script>

<style>
#id {
  width: 25px;
}
</style>
