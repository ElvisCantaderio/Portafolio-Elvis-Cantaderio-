<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'
import { useCardStore } from 'src/stores/CardStore'
import { useAdmiStore } from 'src/stores/AdmiStore'

export default defineComponent({
  name: 'App',
  created() {
    const cardStore = useCardStore()
    cardStore.fetchApprovedCards()
    cardStore.fetchUnapprovedCards()
    const admiStore = useAdmiStore()
    admiStore.fetchAdminis()
  },
  mounted() {
    const storedPosition = localStorage.getItem('position');
    if (!storedPosition) {
      //Si el usuario aun no proporciona su posicion
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const obj = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          localStorage.setItem('position', JSON.stringify(obj));
        })
      }
      else {
        console.log("Geolocation is Not Available");
      }
    }
  }
})
</script>
