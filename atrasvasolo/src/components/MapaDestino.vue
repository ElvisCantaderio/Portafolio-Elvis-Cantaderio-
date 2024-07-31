<template>
  <div id="map" style="width: 100%; min-height: calc(100vh - 120px)"></div>
</template>
<script setup>
import { onMounted, computed, watch } from "vue";
import L, { point } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCounterStore } from "src/stores/dataGlobal";
let store = useCounterStore()
let origen = store.origen
let destino = store.destino
let global
const cambioO = computed(() => {
  return store.destinoARenderizar
})
const cambioD = computed(() => {
  return store.destino
})

watch(cambioO, () => {
  global.remove()
  points = []
  origen = store.origen
  destino = store.destino
  if (store.destinoARenderizar[1].sentido === "ida") {

    for (let i = 0; i < store.destinoARenderizar[0].ida.paradas.length; i++) {
      points.push([store.destinoARenderizar[0].ida.paradas[i].gps.value._latitude, store.destinoARenderizar[0].ida.paradas[i].gps.value._longitude, store.destinoARenderizar[0].ida.paradas[i].nombre])
    }
  }
  if (store.destinoARenderizar[1].sentido === "vuelta") {
    for (let i = 0; i < store.destinoARenderizar[0].vuelta.paradas.length; i++) {
      points.push([store.destinoARenderizar[0].vuelta.paradas[i].gps.value._latitude, store.destinoARenderizar[0].vuelta.paradas[i].gps.value._longitude, store.destinoARenderizar[0].vuelta.paradas[i].nombre])
    }
  }

  mapa()
})
let points = [
  // [13.9812669, -89.5617997, "point 1"],
  // [13.979489, -89.564599, "point 2"],
  // [13.978004, -89.567559, "point 3"],
  // [52.23040500771883, 21.012146472930908, "point 4"],

];
if (store.destinoARenderizar[1].sentido === undefined) {

} else {
  if (store.destinoARenderizar[1].sentido === "ida") {
    for (let i = 0; i < store.destinoARenderizar[0].ida.paradas.length; i++) {
      points.push([store.destinoARenderizar[0].ida.paradas[i].gps.value._latitude, store.destinoARenderizar[0].ida.paradas[i].gps.value._longitude, store.destinoARenderizar[0].ida.paradas[i].nombre])
    }
  }
  if (store.destinoARenderizar[1].sentido === "vuelta") {
    for (let i = 0; i < store.destinoARenderizar[0].ida.paradas.length; i++) {
      points.push([store.destinoARenderizar[0].vuelta.paradas[i].gps.value._latitude, store.destinoARenderizar[0].vuelta.paradas[i].gps.value._longitude, store.destinoARenderizar[0].vuelta.paradas[i].nombre])
    }
  }
}
let base = props.pointsD



function mapa() {
  // console.log(points)
  // console.log(destino.nombre)
  const funny = L.icon({
    iconUrl: "imagenes/icons8-autobús-64.png",
    iconSize: [32, 32], // size of the icon
    iconAnchor: [10, 38], // changed marker icon position
    popupAnchor: [10, -30], // changed popup position
  });
  const init = L.icon({
    iconUrl: "imagenes/boton-de-inicio.png",
    iconSize: [38, 42], // size of the icon
    iconAnchor: [10, 38], // changed marker icon position
    popupAnchor: [10, -30], // changed popup position
  });
  const end = L.icon({
    iconUrl: "imagenes/fin.png",
    iconSize: [38, 42], // size of the icon
    iconAnchor: [10, 38], // changed marker icon position
    popupAnchor: [10, -30], // changed popup position
  });
  const destino = L.icon({
    iconUrl: "imagenes/icons8-get-off-bus-64.png",
    iconSize: [42, 48], // size of the icon
    iconAnchor: [10, 38], // changed marker icon position
    popupAnchor: [10, -30], // changed popup position
  });
  const origen = L.icon({
    iconUrl: "imagenes/icons8-get-on-bus-64.png",
    iconSize: [42, 48], // size of the icon
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

  var map = L.map("map").setView([13.9837927, -89.5803739], 14);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  map
    .locate({
      // https://leafletjs.com/reference-1.7.1.html#locate-options-option
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

  for (let i = 0; i < points.length; i++) {
    const [lat, lng, popupText] = points[i];
    if (popupText === store.origen.nombre) {
      let marker = L.marker([lat, lng], { icon: origen }).bindPopup(popupText).addTo(map);
    } else if (popupText === store.destino.nombre) {
      let marker = L.marker([lat, lng], { icon: destino }).bindPopup(popupText).addTo(map);
    } else {
      if (i === 0) {
        let marker = L.marker([lat, lng], { icon: init }).bindPopup(popupText).addTo(map);
      } else if (i === (points.length - 1)) {
        let marker = L.marker([lat, lng], { icon: end }).bindPopup(popupText).addTo(map);
      } else {
        let marker = L.marker([lat, lng], { icon: funny }).bindPopup(popupText).addTo(map);
      }
    }


  }
  var polyline = L.polyline(points, { color: "#262626", weight: 8 }).addTo(map)

  global = map
  const legend = L.control({ position: "topright" });

  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "description");
    L.DomEvent.disableClickPropagation(div);
    const text = store.destinoARenderizar[1].sentido == undefined ?
      `
      <div class="row" style=" width:25vw; max-width:  200px; margin-right:15px; background-color: #fff; border-radius:3px; display:flex; flex-direction:column; margin-bottom:10px">
        <div style="background-color:#303030;  border-radius:5px;"><p style="margin:20px;text-align:left; color:#fff;">Presiona la flecha de la parte<br> superior para poder<br> introducir los datos.</p></div>
       </div>

`: `
      <div class="row" style="width:25vw; max-width: 200px; margin-right:15px; background-color: #fff; border-radius:3px; display:flex; flex-direction:column; margin-bottom:10px">
        <div style="background-color:#303030;  border-radius:5px;"><h6 style="font-size:15px; margin:5px;text-align:center; color:#ffffff;"><b>Ruta ${store.destinoARenderizar[0].nombre}</b></h6><p style="margin:0;text-align:center; color:#fff;">Recorrido de ${store.destinoARenderizar[1].sentido}</p></div>


       </div>
`
    div.insertAdjacentHTML("beforeend", text);
    return div;
  };

  legend.addTo(map);
}
onMounted(() => {
  mapa();
});

const props = defineProps({
  pointsD: {
    type: Array,
    default: () => []
  }
})


</script>
