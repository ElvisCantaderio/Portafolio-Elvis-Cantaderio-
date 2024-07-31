<template>
  <div class="row justify-center">
    <q-card class="bg-dark row justify-center col-12" flat>
      <q-card-section class="col-xs-3 col-sm-2 col-md-1 column self-center">
        <q-icon name="img:imagenes\destinos.svg" size="75px"></q-icon>
      </q-card-section>

      <q-card-section class="col-xs-6 col-sm-5 col-md-4">
        <q-input dense rounded outlined color="primary" bg-color="white" class="origen q-my-xs" v-model="origen"
          :label="$t('origen')">
          <template v-slot:append>

            <q-btn v-if="ubicacion != null" round dense flat :color="btnUbicacion" size="md" icon="gps_fixed"
              @click="origen = 'Mi ubicacion'">
              <q-tooltip class="bg-primary">{{ $t("ubicacionO") }}</q-tooltip>
            </q-btn>
          </template></q-input>

        <q-input dense rounded outlined color="primary" bg-color="white" class="origen q-my-xs" use-input
          :label="$t('destino')" v-model="destino"></q-input>
      </q-card-section>
      <q-card-section class="col-xs-2 col-sm-1 col-md-1 column self-center">
        <q-btn color="primary" no-caps class="q-ma-sm" size="md" @click="buscarRecorrido()" icon="search"></q-btn>
      </q-card-section>

    </q-card>

    <q-tab-panels v-model="tab" animated class="bg-accent text-white col-xs-11 col-sm-8 col-md-8 rounded-borders">
      <q-tab-panel name="paradasCercanas" class="my-panel">

        <q-list>

          <div class="text-subtitle2 ">{{ $t('posRuta') }}</div>
          <div class="justify-center items-center text-subtitle2" style="color:#f2c037;"
            v-if="recorridoEncontrado.length == 0">{{ textDestinos }}</div>
          <div class="row justify-between items-center " v-for="(destino, index) in recorridoEncontrado" :key="index"
            :id="destino.index">
            <q-item clickable v-ripple class="col-12 items-center " @click="imprimir(destino)">
              <q-item-section side top>
                <q-icon name="route" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label><strong>{{ $t('ruta') }} {{ destino[0].nombre }}
                  </strong></q-item-label>

              </q-item-section>

              <q-item-section class="gt-md">
                <q-item-label>{{ $t('precioBus') }} </q-item-label>
                <q-item-label style="color:grey; " caption lines="1">{{ destino[0].precios.normal }}</q-item-label>
              </q-item-section>

              <q-item-section class="gt-md">
                <q-item-label>{{ $t('tiempoEspera') }} </q-item-label>
                <q-item-label style="color:grey; " caption lines="1">{{ destino[0].frecuencia }} {{ $t('tiempo')
                }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ destino[2][0].nombre}}</q-item-label>
                <q-item-label style="color:grey; " caption lines="1">{{ $t('origen')  }} </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ destino[2][1].nombre }}</q-item-label>
                <q-item-label style="color:grey; " caption lines="1">{{ $t('destinoParada') }}</q-item-label>
              </q-item-section>


            </q-item>
            <q-separator spaced inset />
          </div>

        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import { defineComponent, ref, watch } from "vue";
import { useCounterStore } from 'stores/dataGlobal';
export default defineComponent({
  name: "MainNavbarContentDestinos",
  props: ['paradasFavoritas', 'rutasFavoritas'],
  setup(props, { emit }) {
    const store = useCounterStore()
    const ubicacion = ref(null)
    const recorridoEncontrado = ref([])
    const paradasCercanas = ref([])
    const destino = ref("")
    const origen = ref("")
    const btnUbicacion = ref("grey-7")
    watch(origen, (newOrigen, minPrecio) => {
      if (newOrigen == "Mi ubicacion") {
        btnUbicacion.value = "primary"
      } else {
        btnUbicacion.value = "grey-7"
      }

    })
    const textDestinos = ref("Enter an origin bus stop and a destination so we can find a route that will take you there.")
    function calcularDistancia(x1, y1, x2, y2) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      return Math.sqrt(dx * dx + dy * dy);
    }
    function obtenerUbicacion() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          ubicacion.value = true
        },
          function (error) {
            console.log("Error al obtener la ubicación del usuario:", error);
          }

        )

      } else {
        console.log("Geolocalización no es soportada por el navegador.");
      }
    }
    function buscarRecorrido() {
      if (origen.value == "" || destino.value == "") {

      } else {
        store.origenReferencia = origen.value
        store.destinoReferencia = destino.value
        store.recorridosEncontrados = []
        recorridoEncontrado.value = []
        paradasCercanas.value = []
        var posiblesOrigenes = []
        var posiblesDestinos = []
        //Si elige su ubicacion como punto de origen
        if (origen.value == "Mi ubicacion") {
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
              posiblesOrigenes = paradasCercanas.value
              if (posiblesOrigenes.length == 0) {
                textDestinos.value = "We did not find bus stops near your location"
              } else {
                props.paradasFavoritas.forEach((parada) => {

                  if (parada.lugaresCercanos.toLowerCase().includes(destino.value.toLowerCase()) == true || parada.nombre.toLowerCase().includes(destino.value.toLowerCase()) == true) {
                    posiblesDestinos.push(parada)
                  }

                })
                if (posiblesDestinos.length == 0) {
                  textDestinos.value = "We did not find bus stops near your destination"
                } else {

                  for (var i = 0; i < posiblesOrigenes.length; i++) {
                    for (var j = 0; j < posiblesDestinos.length; j++) {

                      props.rutasFavoritas.forEach((ruta) => {
                        var origenEncontrado = false
                        var destinoEncontrado = false
                        var origenDestino = []
                        ruta.ida.paradas.forEach((parada) => {
                          if (parada.nombre == posiblesOrigenes[i].nombre) {

                            origenEncontrado = true
                            origenDestino.push(parada)
                          }
                          if (parada.nombre == posiblesDestinos[j].nombre && origenEncontrado == true) {
                            destinoEncontrado = true
                            origenDestino.push(parada)
                            recorridoEncontrado.value.push([ruta, { sentido: "ida" }, origenDestino])

                          }
                        });
                        origenEncontrado = false
                        destinoEncontrado = false
                        origenDestino = []
                        ruta.vuelta.paradas.forEach((parada) => {
                          if (parada.nombre == posiblesOrigenes[i].nombre) {
                            origenEncontrado = true
                            origenDestino.push(parada)
                          }
                          if (parada.nombre == posiblesDestinos[j].nombre && origenEncontrado == true) {
                            destinoEncontrado = true
                            origenDestino.push(parada)
                            recorridoEncontrado.value.push([ruta, { sentido: "vuelta" }, origenDestino])

                          }

                        });


                      });
                    }
                  }
                  store.recorridosEncontrados = recorridoEncontrado.value
                  if (recorridoEncontrado.value.length == 0) {
                    textDestinos.value = "We did not find a route that takes you to your destination"
                  }

                }
              }
            },
              function (error) {
                console.log("Error al obtener la ubicación del usuario:", error);
              }

            )

          } else {
            console.log("Geolocalización no es soportada por el navegador.");
          }


        } else {
          //Si su punto de origen es un lugar
          props.paradasFavoritas.forEach((parada) => {

            if (parada.lugaresCercanos.toLowerCase().includes(origen.value.toLowerCase()) == true || parada.nombre.toLowerCase().includes(origen.value.toLowerCase()) == true) {

              posiblesOrigenes.push(parada)
            }

          })
          if (posiblesOrigenes.length == 0) {
            //Si no encontro
            textDestinos.value = "We did not find a bus stop near your origin"
          } else {
            //Si encontro
            props.paradasFavoritas.forEach((parada) => {

              if (parada.lugaresCercanos.toLowerCase().includes(destino.value.toLowerCase()) == true || parada.nombre.toLowerCase().includes(destino.value.toLowerCase()) == true) {
                posiblesDestinos.push(parada)
              }

            })
            //Verificar si encontro parada cerca del destino
            if (posiblesDestinos.length == 0) {
              textDestinos.value = "We did not find a bus stop near your destination"

            } else {

              for (var i = 0; i < posiblesOrigenes.length; i++) {

                for (var j = 0; j < posiblesDestinos.length; j++) {

                  props.rutasFavoritas.forEach((ruta) => {
                    var origenEncontrado = false
                    var destinoEncontrado = false
                    var origenDestino = []
                    ruta.ida.paradas.forEach((parada) => {
                      if (parada.nombre == posiblesOrigenes[i].nombre) {

                        origenEncontrado = true
                        origenDestino.push(parada)
                      }
                      if (parada.nombre == posiblesDestinos[j].nombre && origenEncontrado == true) {
                        destinoEncontrado = true
                        origenDestino.push(parada)
                        recorridoEncontrado.value.push([ruta, { sentido: "ida" }, origenDestino])

                      }
                    });
                    origenEncontrado = false
                    destinoEncontrado = false
                    origenDestino = []
                    ruta.vuelta.paradas.forEach((parada) => {
                      if (parada.nombre == posiblesOrigenes[i].nombre) {
                        origenEncontrado = true
                        origenDestino.push(parada)
                      }
                      if (parada.nombre == posiblesDestinos[j].nombre && origenEncontrado == true) {
                        destinoEncontrado = true
                        origenDestino.push(parada)
                        recorridoEncontrado.value.push([ruta, { sentido: "vuelta" }, origenDestino])

                      }

                    });


                  });
                }
              }
              store.recorridosEncontrados = recorridoEncontrado.value
              if (recorridoEncontrado.value.length == 0) {
                textDestinos.value = "We did not find a route that takes you to your destination"
              }

            }
          }


        }

      }
    }



    return {
      obtenerUbicacion,
      destinoElegido: ref([]),
      ubicacion,
      buscarRecorrido,
      tab: ref("paradasCercanas"),
      paradasCercanas,
      destino,
      origen,
      recorridoEncontrado,
      calcularDistancia,
      textDestinos,
      btnUbicacion,

      imprimir(destino) {
        this.destinoElegido = destino
        store.destinoARenderizar = destino
        store.origen = destino[2][0]
        store.destino = destino[2][1]
      },


    }
  }, mounted(props) {

    const store = useCounterStore()
    this.obtenerUbicacion()
    this.origen = store.origenReferencia
    this.destino = store.destinoReferencia
    this.recorridoEncontrado = store.recorridosEncontrados

  }

});
</script>
<style>
.my-panel {
  max-height: 30vh;
}
</style>
