<template>
    <div id="mapContainer"></div>
</template>
<script>

import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import logoIcon from 'src/assets/logo.png';
import { useCardStore } from "src/stores/CardStore";

export default {
    data() {
        return {
            map: null,
        }
    },
    mounted() {
        const cardStore = useCardStore();
        const personalizadox = L.icon({
            iconUrl: logoIcon,
            iconSize: [50, 50]
        });
        this.map = L.map("mapContainer").setView([13.997551438114352, -89.55356513973135], 10);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(this.map);
        cardStore.approvedCards.forEach((card) => {
            L.marker([card.location.latitude, card.location.longitude], { icon: personalizadox }).addTo(this.map);
        })
    }
}
</script>
<style lang="scss">
#mapContainer {
    height: calc(100vh - 65px);
    width: 100%;
}
</style>
