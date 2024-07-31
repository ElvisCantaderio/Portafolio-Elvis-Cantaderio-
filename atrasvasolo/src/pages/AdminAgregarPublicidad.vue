
<template>
  <div class="scrollable-content">
  <q-banner inline-actions class="text-white bg-red text-center mobile-only">
    {{ $t('nomovile') }}

  </q-banner>


  <div class="bg-dark q-py-lg q-px-xl q-mx-xl  desktop-only">
    <div class="q-px-xl q-mx-xl ">
      <q-toolbar class="bg-accent text-white shadow-5  rounded-borders" style="z-index:3;">
        <q-icon name="sell" size="30px" color="primary" dense flat class="q-ma-sm" />
        <q-toolbar-title>{{ $t('aggpubli') }}</q-toolbar-title>

      </q-toolbar>
      <q-card class="bg-accent ">
        <q-card-section style="color: white" class="q-pb-none">
          <div class="q-gutter-sm" style="max-width: 455px; color: white">
            <q-file bg-color="white" v-model="fotos" :label="$t('Subir Banner')" multiple accept=".jpg, image/*"
              @update:model-value="obtenerURL" rounded dense outlined bottom-slots>
              <template v-slot:before>
                <q-icon name="folder_open" style="color: white" />
              </template>

              <template v-slot:append>
                <q-btn round dense flat icon="add" @click.stop.prevent style="color: black" />
              </template>
            </q-file>
          </div>
        </q-card-section>
        <q-card-section class="q-py-none q-ma-none">
          <q-input :label="$t('anuncio.nombre')" v-model="nuevo.nombre"
            :rules="[val => !!val || 'Campo requerido!!!']" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" />
        </q-card-section>
        <q-card-section class="q-py-none q-ma-none">
          <q-input :label="$t('anuncio.proveedor')" v-model="nuevo.proveedor"
            :rules="[val => !!val || 'Campo requerido!!!']" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" />
        </q-card-section>
        <div class=" q-px-sm q-py-md  flex justify-center">
          <q-responsive :ratio="4 / 3" style="width: 750px; max-width: 100%; height: 200px"
            class="shadow-2 rounded-borders">
            <q-carousel animated v-model="slide" arrows navigation unelevated infinite control-color="primary"
              class="shadow-3 rounded-borders bg-accent">
              <q-carousel-slide v-for="(img, id) in fotosURL" :key="id" :name="id + 1" :img-src="img" />
            </q-carousel>
          </q-responsive>
        </div>
        <q-card-section class="q-pt-none">
          <div class="row justify-center ">
            <q-btn @click="sendData()" class="q-mx-sm" color="primary" size="md" :label="$t('anuncio.guardar')"
              icon="save" />
            <q-btn to="/" color="dark" class="text-white q-mx-sm" size="md" :label="$t('anuncio.cancelar')"
              icon="close" />
          </div>
        </q-card-section>

      </q-card>
    </div>

  </div>
</div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { api } from "../boot/axios";
import {
  storage,
  storageRef,
  updateDoc,
  db,
  doc,
  collection,
  getDocs,
  addDoc,
  setDoc,
  limit, query
} from "../boot/firebase";
import { getStorage, ref as ref2, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Result } from "postcss";
import { useQuasar } from 'quasar'
import axios from 'axios'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router';
``
export default defineComponent({
  name: "AdminAgregarPublicidad",
  setup() {

    const nuevo = ref({
      "proveedor": "",
      "nombre": "",
      "fotos": [],
    })
    const idDoc = ref(null);
    const serverURL = ref('https://couchdbbackend.esaapp.com');
    const databaseName = ref('atrasvasolo-imagenes');
    const revDocPhoto = ref(null);
    const revDoc = ref(null);
    const data = ref(null)
    const fotosURL = ref([])
    const router = useRouter()
    const fotos = ref(null)
    const recorridoIda = ref([])
    const recorridoVuelta = ref([])
    const rutaid = ref(null)
    const $q = useQuasar()
    const slide = ref(1)
    const paradas = ref([]);
    const searchQuery = ref("");

    async function loadData() {
      const response = await api.get("/atrasvasolo-anuncios/_all_docs?include_docs=true");
      if (response.status === 200) {
        const AnunciosObtener = response.data.rows

      } else {
        console.log("Error al obtener los anuncios");
      }
    }
    async function sendData() {
      try {
        const response = await api.post("/atrasvasolo-anuncios/", this.nuevo);
        if (response.data.ok === true) {
          this.idDoc = response.data.id;
          this.revDoc = response.data.rev;
          console.log("La solicitud POST fue exitosa.", response.data, idDoc.value, revDoc.value);
          this.sendPhoto();
          // Puedes imprimir la respuesta del servidor si es necesario.
        } else {
          console.log("Error en la solicitud POST.");
        }
      } catch (error) {
        console.error("Error en la solicitud POST:", error);
      }
    }
    async function sendPhoto() {
      const ojbPhotos = {
        _id: this.idDoc

      }
      try {
        await api.post("/atrasvasolo-imagenes/", ojbPhotos)

        await this.updateDoc();

        await this.updateRutaURL();
      } catch (error) {

      }
    }
    async function updateDoc() {

      for (const foto of this.fotos) {
        const currentRev = await getDocumentRevision();
        if (currentRev) {

          const imageBuffer = await readFileAsync(foto);

          const attachmentName = foto.name;

          const attachmentURL = `https://couchdbbackend.esaapp.com/${databaseName.value}/${idDoc.value}/${attachmentName}`;
          nuevo.value.fotos.push(attachmentURL)
          const uploadURL = `${serverURL.value}/${databaseName.value}/${idDoc.value}/${attachmentName}?rev=${currentRev}`;
          const headers = {
            'Content-Type': foto.type,
          };
          await axios
            .put(uploadURL, imageBuffer, { headers })
            .then((response) => {
              console.log('Imagen subida con éxito:', response.data);
              showNotif();
            })
            .catch((error) => {
              console.error('Error al subir la imagen:', error);
            });
        }
      }
    }
    async function updateRutaURL() {
      try {
        const response = await api.put(`/atrasvasolo-anuncios/${idDoc.value}?rev=${revDoc.value}`, nuevo.value);
        console.log(response)
      } catch (error) {
        console.error("Error en la solicitud PUT:", error);
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

    async function getDocumentRevision() {
      try {
        const response = await axios.get(`${serverURL.value}/${databaseName.value}/${idDoc.value}`);
        return response.data._rev; // Devuelve la revisión actual
      } catch (error) {
        console.error('Error al obtener la revisión actual:', error);
        return null;
      }
    }




    function showNotif() {
        const notif = $q.notify({
          group: false, // required to be updatable
          timeout: 0, // we want to be in control when it gets dismissed
          spinner: true,
          message: 'Subiendo anuncio...',
          caption: '0%',
          color: 'grey-10',
        })

        // we simulate some progress here...
        let percentage = 0
        const interval = setInterval(() => {
          percentage = Math.min(100, percentage + Math.floor(Math.random() * 22))

          // we update the dialog
          notif({
            caption: `${percentage}%`
          })

          // if we are done...
          if (percentage === 100) {
            notif({
              progress: true, // we enable the progress bar
              icon: 'done', // we add an icon
              spinner: false, // we reset the spinner setting so the icon can be displayed
              message: 'Se agregó el anuncio!',
              timeout: 2500, // we will timeout it in 2.5s
              color: 'grey-10',
            })
            router.push('/Administracion/Publicidad')
            clearInterval(interval)
          }
        }, 500)

    }

    return {
      searchQuery,
      getDocumentRevision,
      readFileAsync,
      updateRutaURL,
      data,
      serverURL,
      databaseName,
      updateDoc,
      idDoc,
      revDocPhoto,
      revDoc,
      loadData,
      alert: ref(false),
      paradas,
      recorridoIda,
      recorridoVuelta,
      nuevo,
      sendData,
      sendPhoto,
      fotosURL,
      fotos,
      slide,
      showNotif() {
        $q.notify({
          message: 'Se guardo',
          color: 'primary'
        })
      },
      showEliminar() {
        $q.notify({
          message: 'Se Cancelo',
          color: 'primary'
        })
      }
    };
  }, methods: {


    obtenerURL() {
      this.fotosURL = []
      if (this.fotos) {
        this.fotos.forEach(element => {
          this.fotosURL.push(URL.createObjectURL(element))
        })
      }
    },
  }, mounted() {
    this.loadData()
  }, onSubmit() {
    this.subirRuta()
  },
});
</script>
<style>
body {
  background: #303030;
}
.scrollable-content {
  max-height: 550px; /* Establece la altura máxima que deseas para el contenido. */
  overflow-y: auto; /* Agrega una barra de desplazamiento vertical cuando sea necesario. */
}

.editarRutaTab {
  max-height: 800px;
}
</style>
