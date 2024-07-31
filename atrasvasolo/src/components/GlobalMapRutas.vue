<template>
  <q-page>
    <div id="map" style="width: 100%; min-height: calc(100vh - 120px)"></div>
  </q-page>
</template>

<script setup>
import { onMounted, watch, computed } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { useCounterStore } from "src/stores/dataGlobal";
import { db, collection, getDocs, doc, query, limit } from "../boot/firebase"
let points = prop.arrayt
let store = useCounterStore()
let global
let puntos
let encontrado
const cambio = computed(() => {
  return store.paradaActiva
})
watch(cambio, () => {
  console.log(store.paradaActiva)
  let flyToRealizado = false;
  //global.flyTo([store.paradaActiva.gps.value._latitude, store.paradaActiva.gps.value._longitude], 18)
  let arrayt = puntos.getLayers();
  for (let index = 0; index < arrayt.length; index++) {
    if (arrayt[index]._latlng.lat !== undefined && arrayt[index]._latlng.lng !== undefined) {

      if (arrayt[index]._latlng.lat === store.paradaActiva.gps.value._latitude && arrayt[index]._latlng.lng === store.paradaActiva.gps.value._longitude) {
        encontrado = arrayt[index]


      }
    }

  }

  global.flyTo(encontrado.getLatLng(), 18)
  global.on('moveend', function () {
    // Abrir el popup cuando termine la animación de flyTo
    if (!flyToRealizado) {
      encontrado.openPopup()
    }
    flyToRealizado = true;
  });
  encontrado.on('popupopen', function () {
    flyToRealizado = false;
    // Esto permitirá abrir el popup nuevamente si es necesario
  })

  console.log(encontrado)

  // console.log(global._events.zoom[1].ctx._popup._content)
})
// [13.9812669, -89.5617997, "point 1"],
// [13.979489, -89.564599, "point 2"],
// [13.978004, -89.567559, "point 3"],
// [52.23040500771883, 21.012146472930908, "point 4"],
// [13.71125, -89.105744, "point 1"],
// [13.71125, -89.115644, "point 2"],
// [13.709232, -89.137443, "point 3"],
// [13.712755, -89.13799, "point 4"],
const prop = defineProps({
  arrayt: {
    type: Array,
    default: () => []
  },
});
let pruebra = [];
// async function obtenerParadas() {
//   const first = query(collection(db, "paradas"),limit(5))

//   const querySnapshot = await getDocs(first);
//   querySnapshot.forEach((doc) => {
//     let parada = doc.data();
//     parada.id = doc.id;
//     points.push([parada.gps._lat, parada.gps._long, parada.nombre, parada.id]);
//   });
//   // pruebra.map((x) => {
//   //   console.log(x.gps);
//   // })

// }
let pointinit;

function mapa() {
  /* eslint-disable no-undef */
  /**
   * location
   */

  // config map
  //console.log(screen.width)
  const funny = L.icon({
    iconUrl: "imagenes/icons8-autobús-32.png",
    iconSize: [32, 32], // size of the icon
    iconAnchor: [10, 38], // changed marker icon position
    popupAnchor: [10, -30], // changed popup position
  });
  const punto1 = L.icon({
    iconUrl: "imagenes/marcador-de-ubicacion.png",
    iconSize: [32, 32], // size of the icon
    iconAnchor: [10, 38], // changed marker icon position
    popupAnchor: [10, -30], // changed popup position
  });
  let config = {
    minZoom: 7,
    maxZoom: 18,
  };
  // magnification with which the map will start
  const zoom = 2;
  // co-ordinates
  const lat = 13.9837927;
  const lng = -89.5803739;

  // calling map
  const map = L.map("map", config).setView([lat, lng], zoom);

  // Used to load and display tile layers on the map
  // Most tile servers require attribution, which you can set under `Layer`
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  map
    .locate({
      // https://leafletjs.com/reference-1.7.1.html#locate-options-option
      setView: true,
      enableHighAccuracy: true,
    })
    // if location found show marker and circle
    .on("locationfound", (e) => {
      // marker
      const marker = L.marker([e.latitude, e.longitude], {
        icon: punto1,
      }).bindPopup(
        "Tu ubicacion"
      );
      // circle
      const circle = L.circle([e.latitude, e.longitude], 600, {
        weight: 2,
        color: "#45B4E3",
        fillColor: "#45B4E3",
        fillOpacity: 0.2,
      });
      // prueba
      //const poinr = L.latLng([13.9812669, -89.5617997]);
      //pointinit = L.latLng([e.latitude, e.longitude]);

      //let tamano = poinr.distanceTo([latitudeM, longitudeM]);


      // add marker
      map.addLayer(marker);
      // add circle
      map.addLayer(circle);
    })
    // if error show alert
    .on("locationerror", (e) => {

      alert("Location access denied.");
    });
  let markers = L.markerClusterGroup({ disableClusteringAtZoom: 18 });
  for (let i = 0; i < points.length; i++) {
    const [lat, lng, popupText, id] = points[i];
    let poinx = L.latLng([lat, lng]);
    // if (pointinit.distanceTo([lat, lng]) <= circle.getRadius()) {
    const customPopup =
      `<div class="customPopup"><a href="#/DetalleParada/${id}">${popupText}</a></div>`;
    const customOptions = {
      // set max-width
      keepInView: false, // Set it to true if you want to prevent users from panning the popup off of the screen while it is open.
    };
    let marker = L.marker(poinx, {
      icon: funny,
    })
      .bindPopup(customPopup, customOptions)
    markers.addLayer(marker);
    // }
  }
  map.addLayer(markers);
  puntos = markers
  global = map
}
onMounted(() => {
  // obtenerParadas();
  mapa();
});
</script>
