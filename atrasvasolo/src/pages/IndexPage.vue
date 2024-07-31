<template>
  <!-- <q-page class="flex flex-center">
    <q-img
      src="/maps.jpg"
      alt="Cover Image"
      cover
    />
    <GlobalMap :point="points" />
  </q-page> -->


  <GlobalMapRutas v-if="store.view == 'paradas-view' && store.ptermino" :arrayt="points"></GlobalMapRutas>

  <!-- <GlobalMapRutas v-if="store.view == 'rutas-view'"></GlobalMapRutas>
<GlobalMapRutas v-if="store.view == 'paradas-view'"></GlobalMapRutas> -->
  <!-- <GlobalMapRutasMain v-if="store.view == 'rutas-view'" :arraycompleto="paradas"></GlobalMapRutasMain> -->
  <RutaMapa v-if="store.view == 'rutas-view'"></RutaMapa>
  <MapaDestino v-if="store.view == 'destinos-view'" :points-d="paradas"></MapaDestino>


</template>



<script setup>
import { db, collection, getDocs, query, limit } from "../boot/firebase";
import GlobalMap from "src/components/GlobalMap.vue";
import GlobalMapRutas from "src/components/GlobalMapRutas.vue";
import GlobalMapRutasMain from "src/components/GlobalMapRutasMain.vue";
import RutaMapa from "src/components/RutaMapa.vue";
import { useCounterStore } from "stores/dataGlobal";
import { watch } from "vue";
import { api } from 'boot/axios';
import MapaDestino from "src/components/MapaDestino.vue";
import { onMounted } from "vue";
import { dbParada } from "src/boot/pouchdb";
import { useQuasar, QSpinnerFacebook } from 'quasar'
const store = useCounterStore();
const $q = useQuasar()
let points = [
  // [13.9812669, -89.5617997, "point 1"],
  // [13.979489, -89.564599, "point 2"],
  // [13.978004, -89.567559, "point 3"],
  // [52.23040500771883, 21.012146472930908, "point 4"],
];
let paradas = [

]
function showLoading() {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: 'deep-orange-7',
    spinnerSize: 140,
    message: 'Cargando espere un momento.....',
    messageColor: 'black',
    backgroundColor: 'white',
  })
}
//store.ptermino = false
// async function obtenerRutas() {

//   const first = collection(db, "rutas")

//   const querySnapshot = await getDocs(first);
//   querySnapshot.forEach((doc) => {
//     let ruta = doc.data();
//     ruta.id = doc.id;
//     paradas.push(ruta)
//   });

// }
async function obtenerParadas() {

  //const first = query(collection(db, "paradas"),)
  dbParada.allDocs({
    include_docs: true
  }).then(function (result) {
    //console.log("ESTOY AQUI")
    // console.log(result.rows)
    //$q.loading.hide()
    result.rows.forEach((doc) => {

      let parada = doc
      if (parada.doc.gps.value._latitude != undefined && parada.doc.gps.value._longitude != undefined) {
        points.push([parada.doc.gps.value._latitude, parada.doc.gps.value._longitude, parada.doc.nombre, parada.doc._id]);
      }

    })
    store.ptermino = true


  }).catch(function (err) {
    //showLoading()
    console.log(err)
  })

  // const response = await api.get("/atrasvasolo-paradas/_all_docs?include_docs=true");
  // if (response.status === 200) {
  //   const ruta = response.data.rows

  //   ruta.forEach((doc) => {
  //     let parada = doc
  //     if (parada.doc.gps.value._latitude != undefined && parada.doc.gps.value._longitude != undefined) {
  //       points.push([parada.doc.gps.value._latitude, parada.doc.gps.value._longitude, parada.doc.nombre, parada.doc._id]);
  //     }


  //   });

  // } else {
  //   console.log("Error al obtener las paradas");
  // }

  // pruebra.map((x) => {
  //   console.log(x.gps);
  // })
  // store.ptermino = true
}

// },
// async obtenerParadas() {
// const first = query(collection(db, "paradas"))

// const querySnapshot = await getDocs(first);
// querySnapshot.forEach((doc) => {
//   let parada = doc.data();
//   parada.id = doc.id;
//   this.paradasFavoritas.push(parada);
// });

// },
onMounted(() => {
  //showLoading();
  obtenerParadas();

});
</script>
<style></style>
