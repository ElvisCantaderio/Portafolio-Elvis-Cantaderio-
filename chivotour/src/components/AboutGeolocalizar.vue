<template>
  <div style="position: relative;">
    <div id="mapContainer">
    </div>
    <div style="position:absolute" class="row button-container justify-center">
      <q-btn v-if="locationUrl" rounded style="color: #ffff; background-color: #f27405;" size="12px" icon="location_on"
        class="text-capitalize" :href="locationUrl" target="_blank">
        {{ $t('about.verEnGoogleMaps') }}
      </q-btn>
      <q-btn v-else rounded style="color: #ffff; background-color: #f27405;" size="12px" icon="location_on"
        class="text-capitalize" :href="'https://www.google.com/maps/search/?api=1&query=' + latitude1 + ',' + longitude1"
        target="_blank">
        {{ $t('about.verEnGoogleMaps') }}
      </q-btn>
    </div>
  </div>
</template>
<script>

import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import logoIcon from 'src/assets/logo.png';

export default {
  data() {
    return {
      map: null,
    }
  },
  mounted() {
    this.mapa();
  },
  methods: {
    mapa() {
      // personalizar el icono del marcador
      const iconPersonalizado = L.icon({
        iconUrl: logoIcon,
        iconSize: [35, 35]
      });
      // crear el mapa
      const { latitude1, longitude1 } = this;
      this.map = L.map("mapContainer").setView([latitude1, longitude1], 13);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(this.map);
      L.marker([latitude1, longitude1], { icon: iconPersonalizado }).addTo(this.map);
    }
  },
  props: {
    latitude1: {
      type: Number,
      required: true
    },
    longitude1: {
      type: Number,
      required: true
    },
    locationUrl: {
      type: String,
      required: false
    }
  }
}
</script>
<style lang="scss">
#mapContainer {
  position: relative;
  height: calc(50vh - 10px);
  width: 100%;
  z-index: 1;
}

.button-container {
  position: absolute;
  bottom: 13%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}
</style>
