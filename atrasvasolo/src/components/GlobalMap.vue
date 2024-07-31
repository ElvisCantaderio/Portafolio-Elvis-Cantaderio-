<template>
  <div id="map" style="width: 100%; height: 30em"></div>
</template>
<script setup>
import { onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// let points = [
//   [13.9812669, -89.5617997, "point 1"],
//   [13.979489, -89.564599, "point 2"],
//   [13.978004, -89.567559, "point 3"],
//   [52.23040500771883, 21.012146472930908, "point 4"],

// ];

let points = props.point
function mapa() {
  const punto1 = L.icon({
    iconUrl: "imagenes/marcador-de-ubicacion.png",
    iconSize: [32, 32], // size of the icon
    iconAnchor: [10, 38], // changed marker icon position
    popupAnchor: [10, -30], // changed popup position
  });
  var map = L.map("map").setView(points[0], 14);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  for (let i = 0; i < points.length; i++) {
    const [lat, lng, popupText] = points[i];
    let marker = L.marker([lat, lng], { icon: punto1, }).bindPopup(popupText).addTo(map);
  }
}
onMounted(() => {
  mapa();
});

const props = defineProps({
  point: {
    type: Array,
    default: () => []
  }
})
</script>
