<template>
  <q-page>
    <div id="map" style="width: 100%; min-height: calc(100vh - 120px)"></div>
  </q-page>
</template>

<script setup>
import { onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { db, collection, getDocs, doc, query, limit } from "../boot/firebase"
let points = prop.arraycompleto
// [13.9812669, -89.5617997, "point 1"],
// [13.979489, -89.564599, "point 2"],
// [13.978004, -89.567559, "point 3"],
// [52.23040500771883, 21.012146472930908, "point 4"],
// [13.71125, -89.105744, "point 1"],
// [13.71125, -89.115644, "point 2"],
// [13.709232, -89.137443, "point 3"],
// [13.712755, -89.13799, "point 4"],
const prop = defineProps({
  arraycompleto: {
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
  console.log(screen.width)
  console.log(points)
  const funny = L.icon({
    iconUrl: "imagenes/icons8-autobús-64.png",
    iconSize: [32, 32], // size of the icon
    iconAnchor: [10, 38], // changed marker icon position
    popupAnchor: [10, -30], // changed popup position
  });
  let config = {
    minZoom: 7,
    maxZoom: 18,
  };
  // magnification with which the map will start
  const zoom = 6;
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
      console.log(e);
      // marker
      const marker = L.marker([e.latitude, e.longitude]).bindPopup(
        "Your are here :)"
      );
      // circle
      const circle = L.circle([e.latitude, e.longitude], e.accuracy / 2, {
        weight: 2,
        color: "#45B4E3",
        fillColor: "#45B4E3",
        fillOpacity: 0.1,
      });
      // prueba
      const poinr = L.latLng([13.9812669, -89.5617997]);
      pointinit = L.latLng([e.latitude, e.longitude]);
      console.log(points[0])
      // for (let index = 0; index < points[0].vuelta.paradas.length; index++) {
      //   console.log(points[0].vuelta.paradas[index])

      // }
      for (let i = 0; i < points.length; i++) {
        // const [lat, lng, popupText, id] = points[i];
        // let poinx = L.latLng([lat, lng]);
        // if (pointinit.distanceTo([lat, lng]) <= circle.getRadius()) {
        //   let marker = L.marker(poinx, {
        //     icon: funny,
        //   })
        //     .bindPopup(popupText)
        //     .addTo(map);
        // }
        // while (points[i].vuelta.paradas.length > 0) {
        //   console.log(points[i].vuelta.parada[posicion])
        //   posicion = posicion + 1
        // }
        let agregar = []
        let encontrado = false
        for (let index = 0; index < points[i].vuelta.paradas.length; index++) {
          // console.log(points[i].vuelta.paradas[index].gps._lat)
          let lat = points[i].vuelta.paradas[index].gps._lat
          let lng = points[i].vuelta.paradas[index].gps._long
          let nombre = points[i].vuelta.paradas[index].nombre
          agregar.push([lat, lng, nombre])
          if (pointinit.distanceTo([lat, lng]) <= circle.getRadius()) {
            encontrado = true
          }
        }
        if (encontrado) {
          for (let j = 0; j < agregar.length; j++) {
            const [lat, lng, popupText] = agregar[j];
            let poinx = L.latLng([lat, lng])
            let marker = L.marker(poinx, {
              icon: funny,
            })
              .bindPopup(popupText)
              .addTo(map);
          }
          var polyline = L.polyline(agregar, { color: "#262626", weight: 8 }).addTo(map);
        }
      }
      //let tamano = poinr.distanceTo([latitudeM, longitudeM]);
      console.log(circle.getRadius());

      // add marker
      map.addLayer(marker);
      // add circle
      map.addLayer(circle);
    }).setZoom(18)
    // if error show alert
    .on("locationerror", (e) => {
      console.log(e);
      alert("Location access denied.");
    });

}
onMounted(() => {
  // obtenerParadas();
  mapa();
});
</script>
