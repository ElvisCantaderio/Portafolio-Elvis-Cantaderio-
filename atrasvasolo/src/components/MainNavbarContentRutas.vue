<template>
  <q-card class="bg-dark row justify-center borders-rounded">
    <q-card-section class="col-xs-12 col-sm-12 col-md-12">
      <q-tabs v-model="tab" dense class="bg-accent text-grey-7  rounded-borders" active-color="white"
        indicator-color="primary" align="justify" no-caps outside-arrows mobile-arrows>
        <q-tab name="rutasCercanas" :label="$t('rcerca')" />
        <!--  <q-tab name="rutasFavoritas" :label="$t('rfav')" />   -->
        <q-tab name="rutasTodas" :label="$t('rtodos')" />
      </q-tabs>
    </q-card-section>

    <q-card-section class="col-xs-12 col-sm-8 col-md-8">
      <q-tab-panels v-model="tab" animated class="bg-accent text-white  rounded-borders">
        <q-tab-panel name="rutasCercanas" class="my-panel">
          <p class="row justify-center items-center" v-if="rutasCercanas.length == 0">{{ $t('nopasa') }}</p>
          <q-list>
            <div class="row justify-between items-center" v-for="(ruta, index) in rutasCercanas" :key="index"
              :id="ruta._id">
              <q-item clickable v-ripple class="col-xs-9 col-sm-10 col-md-10 items-center"
                @click="store.rutaRenderizada = ruta">
                <q-item-section side top>
                  <q-icon name="directions_bus" color="info" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('ruta') }} {{ ruta.nombre }} </q-item-label>
                  <q-item-label style="color: grey" caption lines="2">{{ ruta.ida.nombre }}</q-item-label>
                </q-item-section>

              </q-item>
              <div v-if="store.correosecionactiva != 'User@User.com'">
                <q-btn class="col-sm-2 col-md-1" icon="favorite" color="accent" text-color="info" unelevated v-if="rutasfavoritasfiltrada.some(function (objeto) {
                  return objeto.id === ruta.id
                })" @click="$emit('actualizarRutasFavoritasUsuario', ruta.id)" />

                <q-btn class="col-sm-2 col-md-1" icon="favorite_border" color="accent" text-color="info" unelevated
                  v-else @click="$emit('agregarRutasFavoritasUsuario', ruta)" />
              </div>
              <q-separator spaced inset />
            </div>


          </q-list>
        </q-tab-panel>

        <q-tab-panel name="rutasFavoritas" class="my-panel">
          <p class="row justify-center items-center" v-if="rutasfavoritasfiltrada.length == 0">{{ $t('rnohay') }}</p>
          <q-list v-else>
            <div class="row justify-between items-center" v-for="(ruta, index) in rutasfavoritasfiltrada" :key="index"
              :id="ruta.id">
              <q-item clickable v-ripple class="col-xs-9 col-sm-10 col-md-10 items-center"
                @click="store.rutaRenderizada = ruta">
                <q-item-section side top>
                  <q-icon name="directions_bus" color="info" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('ruta') }} {{ ruta.nombre }}</q-item-label>
                  <q-item-label style="color: grey" caption lines="2">{{ ruta.ida.nombre }}</q-item-label>
                </q-item-section>

              </q-item>
              <q-btn class="col-sm-2 col-md-1" icon="favorite" color="accent"
                @click="$emit('actualizarRutasFavoritasUsuario', ruta.id)" text-color="info" unelevated>
              </q-btn>
              <q-separator spaced inset />
            </div>


          </q-list>
        </q-tab-panel>
        <q-tab-panel name="rutasTodas" class="my-panel">
          <p class="row justify-center items-center" v-if="rutasFavoritas.length == 0">{{ $t('rnohay') }}</p>
          <q-list>
            <div class="row justify-between items-center" v-for="(ruta, index) in rutasFavoritas" :key="index"
              :id="ruta.id">
              <q-item clickable v-ripple class="col-xs-12 col-sm-12 col-md-12 items-center"
                @click="store.rutaRenderizada = ruta">
                <q-item-section side top>
                  <q-icon name="directions_bus" color="info" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('ruta') }} {{ ruta.nombre }}</q-item-label>
                  <q-item-label style="color: grey" caption lines="2">{{ ruta.ida.nombre }}</q-item-label>
                </q-item-section>

              </q-item>

            </div>


          </q-list>
        </q-tab-panel>

      </q-tab-panels>
      <div v-show="rutasFavoritas.length < 5" class="row justify-center">
        <div class="col-1">
          <q-spinner-hourglass color="white" size="6em" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import { defineComponent, ref, watch } from "vue";
import { useCounterStore } from 'stores/dataGlobal';
export default defineComponent({
  name: "MainNavbarContentRutas",
  props: ["rutasFavoritas", "rutasfavoritasfiltrada"],
  emits: ["actualizarRutasFavoritasUsuario"],

  setup(props, { emit }) {
    const current = ref(1)
    const store = useCounterStore();
    const listadeFavoritos = ref(props.rutasfavoritasfiltrada);
    const rutasCercanas = ref([]);

    function encontrarRutasCercanas() {
      if (store.rutasCercanas.length == 0) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            var distanciaIda = 0
            var distanciaVuelta = 0
            props.rutasFavoritas.forEach((ruta) => {

              var agregada = false
              ruta.ida.paradas.forEach((parada) => {
                distanciaIda = calcularDistancia(
                  position.coords.latitude,
                  position.coords.longitude,
                  parada.gps.value._latitude,
                  parada.gps.value._longitude
                );
                if (distanciaIda <= 0.006 && agregada == false) {
                  agregada = true
                  rutasCercanas.value.push(ruta)
                }
              });


              ruta.vuelta.paradas.forEach((parada) => {
                distanciaVuelta = calcularDistancia(
                  position.coords.latitude,
                  position.coords.longitude,
                  parada.gps.value._latitude,
                  parada.gps.value._longitude
                );
                if (distanciaVuelta <= 0.006 && agregada == false) {
                  agregada = true
                  rutasCercanas.value.push(ruta)
                }
              });


            });

            // for (var ruta of props.rutasFavoritas) {


            //   const distancia = calcularDistancia(
            //     position.coords.latitude,
            //     position.coords.longitude,
            //     parada.gps._lat,
            //     parada.gps._long
            //   );

            //   // Verificar si la distancia es menor o igual a 100 metros
            //   if (distancia <= 0.003) { // 0.001 representa los 100 metros en grados (la conversión depende de la proyección del mapa)
            //     rutasCercanas.value.push(ruta);
            //   }
            // }
          },
            function (error) {
              console.log("Error al obtener la ubicación del usuario:", error);
            }

          )
          store.rutasCercanas = rutasCercanas.value

        } else {
          console.log("Geolocalización no es soportada por el navegador.");
        }

      } else {
        rutasCercanas.value = store.rutasCercanas
      }

    }
    function calcularDistancia(x1, y1, x2, y2) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      return Math.sqrt(dx * dx + dy * dy);
    }


    return {
      //tab: ref("rutasCercanas", "rutasfavoritasfiltrada"),
      tab: ref("rutasTodas"),
      store,
      listadeFavoritos,
      encontrarRutasCercanas,
      rutasCercanas,

    };
  }, mounted() {
    this.encontrarRutasCercanas()
    setTimeout(() => {

      if (this.rutasFavoritas.length < 3) {
        location.reload()
      }
    }, 3000);

  },


});
</script>
<style>
.my-panel {
  max-height: 30vh;
}
</style>
