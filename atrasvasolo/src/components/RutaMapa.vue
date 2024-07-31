<template>
  <div id="map" style="width: 100%; min-height: calc(100vh - 120px)"></div>
</template>
<script setup>
import { onMounted, onUpdated, watch, computed } from "vue";
import { useCounterStore } from "src/stores/dataGlobal";
import L, { point } from "leaflet";
import "leaflet/dist/leaflet.css";
let store = useCounterStore()
let ruta = store.rutaRenderizada.vuelta.paradas
// let ruta = []
let rutai = store.rutaRenderizada.ida.paradas
let global
let points = [
];
let poinstsi = [

]
const cambio = computed(() => {
  return store.rutaRenderizada
})
watch(cambio, () => {
  global.remove()
  points = []
  poinstsi = []
  let ruta = store.rutaRenderizada.vuelta.paradas
  let rutai = store.rutaRenderizada.ida.paradas
  for (let i = 0; i < ruta.length; i++) {
    points.push([ruta[i].gps.value._latitude, ruta[i].gps.value._longitude, ruta[i].nombre])

  }
  for (let i = 0; i < rutai.length; i++) {
    poinstsi.push([rutai[i].gps.value._latitude, rutai[i].gps.value._longitude, rutai[i].nombre])

  }
  mapa()

})
for (let i = 0; i < ruta.length; i++) {
  points.push([ruta[i].gps.value._latitude, ruta[i].gps.value._longitude, ruta[i].nombre])

}
for (let i = 0; i < rutai.length; i++) {
  poinstsi.push([rutai[i].gps.value._latitude, rutai[i].gps.value._longitude, rutai[i].nombre])

}
function mapa() {
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
  // var map = L.map("map").setView([13.9837927, -89.5803739], 14);
  // L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //   maxZoom: 19,
  //   attribution:
  //     '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  // }).addTo(map);
  // for (let i = 0; i < points.length; i++) {
  //   const [lat, lng, popupText] = points[i];
  //   let marker = L.marker([lat, lng], {
  //     icon: funny,
  //   }).bindPopup(popupText).addTo(map);
  // }
  // for (let j = 0; j < poinstsi.length; j++) {
  //   const [lat, lng, popupText] = poinstsi[j];
  //   let marker1 = L.marker([lat, lng], {
  //     icon: funny,
  //   }).bindPopup(popupText).addTo(map);
  // }
  // var polyline = L.polyline(points, { color: "#262626", weight: 8 }).addTo(map);
  // var polyline1 = L.polyline(poinstsi, { color: "red", weight: 8 }).addTo(map);
  // global = map
  const map = L.map("map", config).setView([13.9837927, -89.5803739], 14);

  // Used to load and display tile layers on the map
  // Most tile servers require attribution, which you can set under `Layer`
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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

  // Extended `LayerGroup` that makes it easy
  // to do the same for all layers of its members
  const pA = new L.FeatureGroup();
  const pB = new L.FeatureGroup();
  const linea1 = new L.FeatureGroup();
  const linea2 = new L.FeatureGroup();
  const allMarkers = new L.FeatureGroup();

  // adding markers to the layer pointsA
  for (let i = 0; i < points.length; i++) {
    if (i === 0) {
      let marker = L.marker([points[i][0], points[i][1]], {
        icon: init,
      }).bindPopup(points[i][2]);
      pA.addLayer(marker);
    } else if (i === (points.length - 1)) {
      let marker = L.marker([points[i][0], points[i][1]], {
        icon: end,
      }).bindPopup(points[i][2]);
      pA.addLayer(marker);
    } else {
      let marker = L.marker([points[i][0], points[i][1]], {
        icon: funny,
      }).bindPopup(points[i][2]);
      pA.addLayer(marker);
    }

  }

  // adding markers to the layer pointsB
  for (let i = 0; i < poinstsi.length; i++) {
    if (i === 0) {
      let marker1 = L.marker([poinstsi[i][0], poinstsi[i][1]], {
        icon: init,
      }).bindPopup(poinstsi[i][2]);
      pB.addLayer(marker1);
    } else if (i === (poinstsi.length - 1)) {
      let marker1 = L.marker([poinstsi[i][0], poinstsi[i][1]], {
        icon: end,
      }).bindPopup(poinstsi[i][2]);
      pB.addLayer(marker1);
    } else {
      let marker1 = L.marker([poinstsi[i][0], poinstsi[i][1]], {
        icon: funny,
      }).bindPopup(poinstsi[i][2]);
      pB.addLayer(marker1);
    }

  }
  var polyline = L.polyline(points, { color: "#262626", weight: 8 })
  var polyline1 = L.polyline(poinstsi, { color: "#262626", weight: 8 })
  pA.addLayer(polyline)
  pB.addLayer(polyline1)
  // object with layers
  const overlayMaps = {
    "Vuelta": pA,
    "Ida": pB,

  };

  // centering a group of markers
  map.on("layeradd layerremove", function () {
    // Create new empty bounds
    let bounds = new L.LatLngBounds();
    // Iterate the map's layers
    map.eachLayer(function (layer) {
      // Check if layer is a featuregroup
      if (layer instanceof L.FeatureGroup) {
        // Extend bounds with group's bounds
        bounds.extend(layer.getBounds());
      }
    });

    // Check if bounds are valid (could be empty)
    // if (bounds.isValid()) {
    //   // Valid, fit bounds
    //   map.flyToBounds(bounds);
    // } else {
    //   // Invalid, fit world
    //   // map.fitWorld();
    // }
  });

  let element2
  let element3
  let element4
  L.Control.CustomButtons = L.Control.Layers.extend({
    onAdd: function () {
      this._initLayout();
      this._addMarker();
      this._removeMarker();
      this._update();
      return this._container;
    },
    _addMarker: function () {
      this.createButton("Marcar", "add-button");
    },
    _removeMarker: function () {
      this.createButton("Desmarcar", "remove-button");
    },
    createButton: function (type, className) {
      const elements = this._container.getElementsByClassName(
        "leaflet-control-layers-list"
      );

      const button = L.DomUtil.create(
        "button",
        `btn-markers ${className}`,
        elements[0]
      );
      button.textContent = `${type} todos`;

      L.DomEvent.on(button, "click", function (e) {
        const checkbox = document.querySelectorAll(
          ".leaflet-control-layers-overlays input[type=checkbox]"
        );

        // Remove/add all layer from map when click on button
        [].slice.call(checkbox).map((el) => {
          el.checked = type === "Marcar" ? false : true;
          el.click();
        });
      });
    },

  });

  let custombotton = new L.Control.CustomButtons(null, overlayMaps, { collapsed: false }).addTo(map);
  global = map
  const legend = L.control({ position: "topright" });

  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "description");
    L.DomEvent.disableClickPropagation(div);
    const text = store.rutaRenderizada._id == undefined ?
      `

`: `
      <div class="row" style="max-width: 25vw; margin-right:10px; background-color: #fff; border-radius:3px; display:flex; flex-direction:column;">
        <div style="background-color:#303030;  border-radius:5px;"><h6 style="font-size:15px; margin:5px;text-align:center; color:#ffffff;"><b>Ruta ${store.rutaRenderizada.nombre}</b></h6></div>
        <button style="margin-top:2px; border:1px #ff5709   solid; border-radius:5px;  background-color: #303030 ; "><a style="color:#ff5709 ;" href=/#/detalleRuta/${store.rutaRenderizada._id}>Detalles de la ruta</a></button>
       </div>
`
    div.insertAdjacentHTML("beforeend", text);
    return div;
  };

  legend.addTo(map);
  element4 = document.getElementsByClassName("leaflet-control-layers leaflet-control-layers-expanded leaflet-control")

  for (var i = 0; i < element4.length; i++) {
    element4[i].setAttribute("style", "max-width: 25vw; margin-right:10px; background-color: #fff; border-radius:3px; display:flex; flex-direction:column;");
  }

  element2 = document.getElementsByClassName("add-button")
  for (var i = 0; i < element2.length; i++) {
    element2[i].className += " hidden";
  }
  element3 = document.getElementsByClassName("remove-button")
  for (var i = 0; i < element3.length; i++) {
    element3[i].className += " hidden";
  }
  document.querySelector(".add-button").click()
}
onMounted(() => {
  mapa();
});
</script>
