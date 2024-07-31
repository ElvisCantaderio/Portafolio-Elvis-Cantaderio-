<template>
  <q-banner inline-actions class="text-white bg-red text-center mobile-only">
    {{ $t('nomovile') }}

  </q-banner>
  <div class="desktop-only q-py-lg q-px-xl q-mx-xl">
    <div class="q-px-xl q-mx-xl">
      <q-toolbar class="bg-accent text-white shadow-5  rounded-borders" style="z-index:3;">
        <q-icon name="directions_bus" size="30px" color="primary" dense flat />
        <q-toolbar-title>{{ $t('adminAgregarRuta.agregarRuta') }}</q-toolbar-title>
      </q-toolbar>
      <q-card class="my-card col-sm-11 col-md-11 col-lg-11 bg-accent row justify-center">
        <q-card-section class="col-xs-10 col-sm-8 col-md-6">
          <q-carousel animated v-model="slide" arrows navigation unelevated infinite control-color="primary"
            class="shadow-3 rounded-borders bg-accent">
            <q-carousel-slide v-for="(img, id) in fotosURL" :key="id" :name="id + 1" :img-src="img" />
          </q-carousel>
          <q-btn icon="delete" class="q-mx-sm q-mt-sm" color="red" @click="borrarImagenCarrusel(slide)"
            v-show="fotosURL.length"></q-btn>
          <q-file bg-color="white" append="" class="q-mt-md" v-model="fotosFile" :label="$t('adminAgregarRuta.fotos')"
            multiple accept=".jpg, image/*" @update:model-value="obtenerURL()" rounded dense outlined bottom-slots>
            <template v-slot:before>
              <q-icon name="folder_open" style="color: white" />
            </template>

            <template v-slot:append>
              <q-btn round dense flat icon="add" @click.stop.prevent style="color: black" />
            </template>
          </q-file>
          <q-input :label="$t('adminAgregarRuta.nombreDeLaRuta')" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" v-model="nuevaRuta.nombre" />
          <q-input :label="$t('adminAgregarRuta.precio')" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" v-model="nuevaRuta.precios.normal" />
          <q-input :label="$t('adminAgregarRuta.precioEspecial')" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" v-model="nuevaRuta.precios.especial" />
          <q-input :label="$t('adminAgregarRuta.tiempoEstimado')" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" v-model="nuevaRuta.frecuencia" />
          <q-input :label="$t('adminAgregarRuta.tiempoida')" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" v-model="nuevaRuta.ida.tiempo" />
          <q-input :label="$t('adminAgregarRuta.tiempovuelta')" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" v-model="nuevaRuta.vuelta.tiempo" />
          <q-input :label="$t('adminAgregarRuta.primerbusida')" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" v-model="nuevaRuta.ida.primerviaje" />
          <q-input :label="$t('adminAgregarRuta.ultimobusida')" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" v-model="nuevaRuta.ida.ultimoviaje" />
          <q-input :label="$t('adminAgregarRuta.primerbusvuelta')" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" v-model="nuevaRuta.vuelta.primerviaje" />
          <q-input :label="$t('adminAgregarRuta.ultimobusvuelta')" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" v-model="nuevaRuta.vuelta.ultimoviaje" />
          <q-input :label="$t('adminAgregarRuta.ida')" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" v-model="nuevaRuta.ida.nombre" />
          <q-input :label="$t('adminAgregarRuta.vuelta')" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" v-model="nuevaRuta.vuelta.nombre" />
        </q-card-section>

        <q-card-section class="col-sm-10 col-md-6">
          <q-tabs v-model="tabEditarRecorridos" dense class="bg-accent text-grey-7 q-ma-md col-6" active-color="white"
            indicator-color="primary">
            <q-tab name="recorridoIda" :label="$t('adminAgregarRuta.recorridoIda')" />
            <q-tab name="recorridoVuelta" :label="$t('adminAgregarRuta.recorridoVuelta')" />
          </q-tabs>
          <q-tab-panels v-model="tabEditarRecorridos" animated class="bg-dark text-white">
            <q-tab-panel name="recorridoIda" class="editarRutaTab">
              <q-list>
                <div class="row justify-between items-center" v-for="parada in recorridoIda" :key="parada.id"
                  :id="parada.id">
                  <q-item clickable v-ripple class="col-xs-9 col-sm-10 col-md-10 items-center">
                    <q-item-section side top>
                      <q-icon name="place" color="info" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ parada.nombre }}</q-item-label>
                      <q-item-label style="color: grey" caption lines="2">{{ parada.referencia }}</q-item-label>
                    </q-item-section>
                    <q-item-section side top> </q-item-section>
                  </q-item>
                  <div class="col-xs-9 col-sm-10 col-md-10 items-center">
                    <q-btn flat class="col-sm-2 col-md-1" icon="delete" color="accent" text-color="negative" unelevated
                      @click="eliminarParadaDelRecorrido(parada.nombre, tabEditarRecorridos)" />
                    <q-btn flat class="col-sm-2 col-md-1" icon="arrow_upward" color="accent" text-color="negative"
                      unelevated @click="subirValor(recorridoIda, parada)" />
                    <q-btn flat class="col-sm-2 col-md-1" icon="south" color="accent" text-color="negative" unelevated
                      @click="bajarValor(recorridoIda, parada)" />
                  </div>
                  <q-separator spaced inset />
                </div>
                <div class="text-subtitle2" v-if="recorridoIda.length == 0">{{ $t('adminAgregarRuta.descripsion') }}</div>

              </q-list>

            </q-tab-panel>
            <q-tab-panel name="recorridoVuelta" class="editarRutaTab">
              <q-list>
                <div class="row justify-between items-center" v-for="parada in recorridoVuelta" :key="parada.id"
                  :id="parada.id">
                  <q-item clickable v-ripple class="col-xs-9 col-sm-10 col-md-10 items-center">
                    <q-item-section side top>
                      <q-icon name="place" color="info" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ parada.nombre }}</q-item-label>
                      <q-item-label style="color: grey" caption lines="2">{{ parada.referencia }}</q-item-label>
                    </q-item-section>
                    <q-item-section side top> </q-item-section>
                  </q-item>
                  <div class="col-xs-9 col-sm-10 col-md-10 items-center">
                    <q-btn flat class="col-sm-2 col-md-1" icon="delete" color="accent" text-color="negative" unelevated
                      @click="eliminarParadaDelRecorrido(parada.nombre, tabEditarRecorridos)" />
                    <q-btn flat class="col-sm-2 col-md-1" icon="arrow_upward" color="accent" text-color="negative"
                      unelevated @click="subirValor(recorridoVuelta, parada)" />
                    <q-btn flat class="col-sm-2 col-md-1" icon="south" color="accent" text-color="negative" unelevated
                      @click="bajarValor(recorridoVuelta, parada)" />

                  </div>
                  <q-separator spaced inset />
                </div>
                <div class="text-subtitle2" v-if="recorridoVuelta.length == 0">{{ $t('adminAgregarRuta.descripsion') }}
                </div>

              </q-list>

            </q-tab-panel>

          </q-tab-panels>

          <q-dialog v-model="alert" class="">
            <q-card class="bg-accent text-white" style="width: 400px;">
              <q-card-section>
                <div class="text-h6">{{ $t('adminAgregarRuta.agregarParadaRecorrido') }}</div>
              </q-card-section>
              <q-card-section>
                <q-input :label="$t('adminEditarRutas.buscar')" dense color="primary" bg-color="white" rounded outlined
                  class="q-my-sm" v-model="searchQuery">
                  <template v-slot:append>
                    <q-icon name="search" color="primary"></q-icon>
                  </template>
                </q-input>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <q-list>
                  <div class="row justify-between items-center" v-for="parada in filteredItems" :key="parada.id"
                    :id="parada.id">
                    <q-item clickable v-ripple class="col-xs-9 col-sm-10 col-md-10 items-center"
                      @click="agregarARecorrido(parada, tabEditarRecorridos)">
                      <q-item-section side top>
                        <q-icon name="place" color="info" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ parada.nombre }}</q-item-label>
                        <q-item-label style="color: grey" caption lines="2">{{ parada.referencia }}</q-item-label>
                      </q-item-section>
                      <q-item-section side top> </q-item-section>
                    </q-item>
                    <q-separator spaced inset />
                  </div>
                </q-list>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat :label="$t('adminEditarRutas.ok')" color="primary" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <div class="col-md-6 text-center"><q-btn icon="add" no-caps color="accent" class="q-my-sm"
              @click="alert = true">{{ $t('adminAgregarRuta.agregarParada') }}</q-btn></div>

        </q-card-section>



        <q-card-section class="col-xs-6 col-sm-6 col-md-6 row justify-around q-pa-none">
          <q-btn class="q-ma-sm" color="primary" icon="save" :label="$t('adminAgregarRuta.guardar')"
            @click="updateDoc()" to="/Administracion/Rutas#"/>
          <q-btn class="q-ma-sm" color="dark" icon="close" :label="$t('adminAgregarRuta.cancelar')" @click="showEliminar"
            to="/Administracion/Rutas#"/>
        </q-card-section>

      </q-card>
    </div>

  </div>
</template>

<script>
import { api } from "../boot/axios";
import axios from 'axios'
import { defineComponent, ref, computed } from "vue";
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: "AdminEditarRutas",
  setup() {
    const nuevaRuta = ref({
      "nombre": "",
      "fotos": [],
      "ida": {
        "ultimoviaje": "",
        "tiempo": "",
        "paradas": [],
        "primerviaje": "",
        "nombre": ""
      },
      "vuelta": {
        "ultimoviaje": "",
        "tiempo": "",
        "paradas": [],
        "primerviaje": "",
        "nombre": ""
      },
      "precios": {
        "especial": "",
        "normal": ""
      },
      "frecuencia": ""
    })
    const route = useRoute();
    const contador = ref(0)
    const serverURL = ref('https://couchdbbackend.esaapp.com');
    const databaseName = ref('atrasvasolo-imagenes');
    const router = useRouter();
    const fotosURL = ref([])
    const idDoc = ref(null)
    const revDoc = ref(null)
    const fotosFile = ref()
    const slide = ref(1)
    const $q = useQuasar()
    const paradas = ref([]);
    const searchQuery = ref("");
    const filteredItems = computed(() => {
      return paradas.value.filter((item) =>
        item.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });
    async function loadData(id) {
      const response = await api.get(`/atrasvasolo-rutas/${id}`);
      if (response.status === 200) {
        const ruta = response.data
        nuevaRuta.value = ruta
        this.idDoc = ruta._id
        this.revDoc = ruta._rev
        fotosURL.value = ruta.fotos;
        console.log(nuevaRuta.value)
        this.recorridoIda = nuevaRuta.value.ida.paradas;
        this.recorridoVuelta = nuevaRuta.value.vuelta.paradas;
      } else {
        console.log("Error al obtener las paradas");
      }
    }

    async function updateDoc() {
      if (this.fotosFile) {
        for (const foto of this.fotosFile) {
          const currentRev = await getDocumentRevision();
          console.log(currentRev, foto, idDoc.value, databaseName.value)
          if (currentRev) {

            const imageBuffer = await readFileAsync(foto);

            const attachmentName = foto.name;

            const attachmentURL = `https://couchdbbackend.esaapp.com/${databaseName.value}/${idDoc.value}/${attachmentName}`;
            nuevaRuta.value.fotos.push(attachmentURL)
            const uploadURL = `${serverURL.value}/${databaseName.value}/${idDoc.value}/${attachmentName}?rev=${currentRev}`;
            const headers = {
              'Content-Type': foto.type,
            };
            await axios.put(uploadURL, imageBuffer, { headers })
              .then((response) => {
                console.log('Imagen subida con éxito:', response.data);
              })
              .catch((error) => {
                console.error('Error al subir la imagen:', error);
              });
            nuevaRuta.value.ida.paradas = this.recorridoIda;
            nuevaRuta.value.vuelta.paradas = this.recorridoVuelta;
            const response = await api.put(`/atrasvasolo-rutas/${this.$route.params.id}`, nuevaRuta.value);
            console.log(response)
            // window.location.href = "/Administracion/Rutas#/Administracion/Rutas"

          }
        }

      } else {
        nuevaRuta.value.ida.paradas = this.recorridoIda;
        nuevaRuta.value.vuelta.paradas = this.recorridoVuelta;
        const response = await api.put(`/atrasvasolo-rutas/${this.$route.params.id}`, nuevaRuta.value);
        console.log(response)
        // window.location.href = "/Administracion/Rutas#/Administracion/Rutas"
      }

    }
    async function getDocumentRevision() {
      try {
        const response = await axios.get(`${serverURL.value}/${databaseName.value}/${idDoc.value}`);
        return response.data._rev; // Devuelve la revisión actual
      } catch (error) {
        console.error('Error al obtener la revisión actual:', error);
        return null;
      }
    }
    function readFileAsync(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    }

    function borrarImagenCarrusel(posicion) {
      posicion = posicion - 1; //posicion +1 es el maximo que puedo eliminar de nueva ruta
      const tamanio = nuevaRuta.value.fotos.length;
      const elementToDelete = this.fotosURL[posicion]
      if (elementToDelete.startsWith("blob:")) {
        console.log("Es blob")
        this.fotosURL.splice(posicion, 1)
        if (posicion + 1 > tamanio) {
          console.log("eliminare de file")
          const indexDelete = (posicion + 1) - tamanio;
          console.log("Eliminare el archivo:", indexDelete)
          this.fotosFile.splice(posicion - 1, 1)
        }

      } else {
        this.fotosURL.splice(posicion, 1);
        nuevaRuta.value.fotos.splice(posicion, 1)
      }
      slide.value = 1;
    }

    function bajarValor(array, valor) {
      const indiceValor = array.indexOf(valor);
      if (indiceValor > -1 && indiceValor < array.length - 1) {
        const elemento = array.splice(indiceValor, 1)[0];
        array.splice(indiceValor + 1, 0, elemento);
      }
      return array;
    }

    function subirValor(array, valor) {
      const indiceValor = array.indexOf(valor);
      if (indiceValor > 0) {
        const elemento = array.splice(indiceValor, 1)[0];
        array.splice(indiceValor - 1, 0, elemento);
      }
      return array;
    }


    return {
      searchQuery,
      updateDoc,
      loadData,
      databaseName,
      serverURL,
      revDoc,
      readFileAsync,
      getDocumentRevision,
      idDoc,
      contador,
      nuevaRuta,
      filteredItems,
      recorridoIda: ref([]),
      recorridoVuelta: ref([]),
      alert: ref(false),
      tabEditarRecorridos: ref("recorridoIda"),
      paradas,
      subirValor,
      bajarValor,
      borrarImagenCarrusel,
      fotosURL,
      fotosFile,
      slide,
      showNotif() {

      },
      showEliminar() {
        $q.notify({
          message: 'Se Cancelo',
          color: 'primary'
        })
      },
      route,
      router
    };
  }, methods: {
    agregarARecorrido(parada, recorrido) {

      if (recorrido == "recorridoIda") {
        this.recorridoIda.push(parada)
        this.nuevaRuta.ida.paradas = this.recorridoIda
      } else if (recorrido == "recorridoVuelta") {
        this.recorridoVuelta.push(parada)
        this.nuevaRuta.vuelta.paradas = this.recorridoVuelta
      }
    },

    eliminarParadaDelRecorrido(paradaNombre, recorrido) {
      if (recorrido == "recorridoIda") {
        console.log("Eliminar Parada Ida")
        const recorridoFiltro = this.recorridoIda.filter((item) => item.nombre !== paradaNombre)
        console.log(recorridoFiltro)
        this.recorridoIda = recorridoFiltro
        console.log(this.recorridoIda)
      } else if (recorrido == "recorridoVuelta") {
        console.log("Eliminar Parada Vuelta")
        const recorridoFiltro = this.recorridoVuelta.filter((item) => item.nombre !== paradaNombre)
        console.log(recorridoFiltro)
        this.recorridoVuelta = recorridoFiltro
        console.log(this.recorridoVuelta)
      }

    }, async loadDataParadas() {
      const response = await api.get("/atrasvasolo-paradas/_all_docs?include_docs=true");
      if (response.status === 200) {
        const rutas = response.data.rows
        for (const ruta of rutas) {
          this.paradas.push(ruta.doc);
        }
      } else {
        console.log("Error al obtener las paradas");
      }
    }
    ,
    obtenerURL() {
      this.fotosURL = []
      const fotosURLCopy = []
      if (this.fotosFile) {
        this.fotosFile.forEach(element => {
          fotosURLCopy.push(URL.createObjectURL(element))
        })
        this.fotosURL = this.nuevaRuta.fotos.concat(fotosURLCopy)
      }

    },
  }, mounted() {
    this.loadDataParadas()
    this.loadData(this.$route.params.id)
    console.log(this.$route.params.id)
  }
});
</script>
<style>
body {
  background: #303030;
}

.editarRutaTab {
  max-height: 800px;
}
</style>
