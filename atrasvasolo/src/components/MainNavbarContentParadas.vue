<template>
  <q-card class="bg-dark row justify-center borders-rounded">
    <q-card-section class="col-xs-12 col-sm-12 col-md-12">
      <q-tabs v-model="tab" dense class="bg-accent text-grey-7  rounded-borders" active-color="white"
        indicator-color="primary" align="justify" no-caps outside-arrows mobile-arrows>
        <q-tab name="paradasCercanas" :label="$t('pcerca')" />
        <!--  <q-tab name="paradasFavoritas" :label="$t('pfav')" />      -->
        <q-tab name="paradasTodas" :label="$t('ptodas')" />
      </q-tabs>
    </q-card-section>

    <q-card-section class="col-xs-12 col-sm-8 col-md-8">
      <q-tab-panels v-model="tab" animated class="bg-accent text-white  rounded-borders">
        <q-tab-panel name="paradasCercanas" class="my-panel">
          <p class="row justify-center items-center" v-if="paradasCercanas.length == 0">{{ $t('nopasa') }}</p>
          <q-list>
            <div class="row justify-between items-center" v-for="(parada, index) in paradasCercanas" :key="index"
              :id="parada.id">
              <q-item clickable v-ripple class="col-xs-9 col-sm-10 col-md-10 items-center"
                @click="store.paradaActiva = parada">
                <q-item-section side top>
                  <q-icon name="place" color="info" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ parada.nombre }}</q-item-label>
                  <q-item-label style="color: grey" caption lines="2">{{ parada.referencia }}</q-item-label>
                </q-item-section>

              </q-item>
              <div v-if="store.correosecionactiva != 'User@User.com'">
                <q-btn class="col-sm-2 col-md-1" icon="favorite" color="accent" text-color="info" unelevated v-if="paradasfavoritasfiltrada.some(function (objeto) {
                  return objeto.id === parada.id
                })" @click="$emit('actualizarParadasFavoritasUsuario', parada.id)" />

                <q-btn class="col-sm-2 col-md-1" icon="favorite_border" color="accent" text-color="info" unelevated
                  v-else @click="$emit('agregarParadasFavoritasUsuario', parada)" />
              </div>


              <q-separator spaced inset />
            </div>


          </q-list>
        </q-tab-panel>

        <q-tab-panel name="paradasFavoritas" class="my-panel">
          <p class="row justify-center items-center" v-if="paradasfavoritasfiltrada.length == 0">{{ $t('Pnohay') }}
          </p>
          <q-list v-else>
            <div class="row justify-between items-center"
              v-for="(parada, index) in paradasfavoritasfiltrada.slice(0, 6)" :key="index" :id="parada.id">
              <q-item clickable v-ripple class="col-xs-9 col-sm-10 col-md-10 items-center"
                @click="store.paradaActiva = parada">
                <q-item-section side top>
                  <q-icon name="place" color="info" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ parada.nombre }}</q-item-label>
                  <q-item-label style="color: grey" caption lines="2">{{ parada.referencia }}</q-item-label>
                </q-item-section>

              </q-item>
              <q-btn class="col-sm-2 col-md-1" icon="favorite"
                @click="$emit('actualizarParadasFavoritasUsuario', parada.id)" color="accent" text-color="info"
                unelevated>
              </q-btn>
              <q-separator spaced inset />
            </div>


          </q-list>
        </q-tab-panel>
        <q-tab-panel name="paradasTodas" class="my-panel">
          <p class="row justify-center items-center" v-if="paradasFavoritas.length == 0">{{ $t('Pnohay') }}
          </p>
          <q-list v-else>
            <div class="q-pa-lg flex flex-center">
              <q-pagination v-model="current" color="secundary" active-color="primary" :max=max max-pages="6"
                boundary-numbers direction-links />
            </div>
            <div class="row justify-between items-center" v-for="(parada, index) in currentPageParadas" :key="index"
              :id="parada.id">

              <q-item clickable v-ripple class="col-xs-12 col-sm-12 col-md-12  items-center"
                @click="store.paradaActiva = parada">
                <q-item-section side top>
                  <q-icon name="place" color="info" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ parada.nombre }}</q-item-label>
                  <q-item-label style="color: grey" caption lines="2">{{ parada.referencia }}</q-item-label>
                </q-item-section>

              </q-item>
            </div>


          </q-list>

        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
  </q-card>
</template>
<script>
import { defineComponent, ref, watch } from "vue";
import { useCounterStore } from 'stores/dataGlobal';

export default defineComponent({
  name: "MainNavbarContentParadas",
  props: ["paradasFavoritas", "paradasfavoritasfiltrada"],

  setup(props, { emit }) {
    const current = ref(1)
    const store = useCounterStore();
    const paradasCercanas = ref([]);
    const max = ref(props.paradasFavoritas.length / 10)
    const currentPageParadas = ref(props.paradasFavoritas.slice(0, 10))

    function encontrarParadasCercanas() {
      if (store.paradasCercanas.length == 0) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            for (var parada of props.paradasFavoritas) {

              const distancia = calcularDistancia(
                position.coords.latitude,
                position.coords.longitude,
                parada.gps.value._latitude,
                parada.gps.value._longitude
              );

              // Verificar si la distancia es menor o igual a 100 metros
              if (distancia <= 0.006) { // 0.001 representa los 100 metros en grados (la conversión depende de la proyección del mapa)
                paradasCercanas.value.push(parada);
              }
            }
          },
            function (error) {
              console.log("Error al obtener la ubicación del usuario:", error);
            }

          )
          store.paradasCercanas = paradasCercanas.value
        } else {
          console.log("Geolocalización no es soportada por el navegador.");
        }
      } else {
        paradasCercanas.value = store.paradasCercanas
      }

    }
    function calcularDistancia(x1, y1, x2, y2) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      return Math.sqrt(dx * dx + dy * dy);
    }

    watch(current, (newCurrent) => {
      currentPageParadas.value = props.paradasFavoritas.slice((newCurrent - 1) * 10, (newCurrent * 10) - 1)
    })

    return {
      tab: ref("paradasCercanas", "paradasfavoritasfiltrada"),
      store,
      paradasCercanas,
      encontrarParadasCercanas,
      current,
      max,
      currentPageParadas,

    };
  }, mounted() {
    this.encontrarParadasCercanas()

  }
});
</script>
<style>
.my-panel {
  max-height: 30vh;
}
</style>
