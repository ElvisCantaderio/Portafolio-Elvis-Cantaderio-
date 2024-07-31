<template>
  <div class="row justify-center">
    <q-btn class="q-mr-sm q-mt-sm" v-for="(servicio, index) in servicios" :key="index" :icon="servicio.icon"
      :color="servicio.boolean ? 'positive' : 'primary'" rounded @click="activateButton(index)">
      <q-tooltip v-if="idioma === 'es'" anchor="top middle" self="bottom middle">
        {{ servicio.nombre }}
      </q-tooltip>
      <q-tooltip v-else anchor="top middle" self="bottom middle">
        {{ servicio.name }}
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
import { setDevtoolsHook } from 'vue';

export default {
  data() {
    var idioma = this.$i18n.locale;
    var servicios = [
      { icon: "local_dining", nombre: "Restaurante", name: "Restaurant", boolean: false },
      { icon: "hotel", nombre: "Alojamiento", name: "Accommodation", boolean: false },
      { icon: "local_parking", nombre: "Parqueo", name: "Parking", boolean: false },
      { icon: "pets", nombre: "Mascotas", name: "Pets", boolean: false },
      { icon: "store", nombre: "Tienda", name: "Store", boolean: false },
      { icon: "directions_walk", nombre: "Senderismo", name: "Hiking", boolean: false },
      { icon: "person_pin", nombre: "Servicio de guía", name: "Guided Service", boolean: false },
      { icon: "wifi", nombre: "Wi-Fi", name: "Free WIFI", boolean: false },
      { icon: "pool", nombre: "Piscina", name: "Pool", boolean: false },
      { icon: "ac_unit", nombre: "Aire acondicionado", name: "Air Conditioning", boolean: false },
      { icon: "local_police", nombre: "Seguridad", name: "Security", boolean: false },
      { icon: "directions_bus", nombre: "Transporte", name: "Transport", boolean: false },
      { icon: "medical_services", nombre: "Primeros Auxilios", name: "First aid", boolean: false }
    ];


    return { idioma, servicios };
  },
  methods: {
    activateButton(index) {
      this.servicios[index].boolean = !this.servicios[index].boolean;
    },
    getD() {
      var dato = [];
      for (let index = 0; index < this.servicios.length; index++) {
        if (this.servicios[index].boolean) {
          dato.push({
            name: this.servicios[index].nombre, icon: this.servicios[index].icon
          });
        }
      }
      return dato;
    },
    setD(dato) {
      var lista = dato;
      for (let i = 0; i < this.servicios.length; i++) {
        for (let j = 0; j < lista.length; j++) {
          if (this.servicios[i].nombre === lista[j].name) {
            this.servicios[i].boolean = true;
            lista.splice(j, 1);
            j = lista.length + 1;
          }
        }
      }
    }
  },
};
</script>

<style scoped></style>
