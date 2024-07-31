<template>
  <div class="q-px-sm q-py-md flex justify-center">
    <q-card class="my-card bg-accent q-pa-none q-mb-sm" v-for="(item, key) in anuncios" :key="key">
      <q-separator class="bg-primary" />
      <q-list>
        <q-item>
          <q-item-section>
            <div class="row justify-end q-pa-sm">
              <q-btn color="dark" @click="eliminarDocumento(item.id, item.rev)" icon="delete"
                class="text-white q-mx-sm" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <!-- Utilizamos v-for para mostrar múltiples imágenes -->
      <q-img v-for="(imageUrl, index) in item.urlImagen" :key="index" class="q-pa-none q-ma-none"
        style="width: 450px; max-width: 100%; height: 200px" :src="imageUrl"></q-img>
      <q-separator class="bg-primary" />
      <q-separator class="bg-accent" />
      <q-separator />
    </q-card>
  </div>
</template>

<!-- Resto del código sin cambios -->


<script setup>

import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../boot/firebase'
import { getStorage, ref as refStorage, listAll, getDownloadURL } from 'firebase/storage'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { doc, deleteDoc } from "firebase/firestore";
import { api } from 'boot/axios';

const storage = getStorage()


const anunciosOriginal = ref([])
const anunciosConRev = ref([])
const anuncios = ref([])
const contaCargaFotos = ref(0)
const quasar = useQuasar()
const router = useRouter()

// METODOS
async function cargarDatosOriginales() {
  anuncios.value = [];
  anunciosOriginal.value = [];

  const response = await api.get('/atrasvasolo-anuncios/_all_docs?include_docs=true');

  if (response.status === 200) {
    const docs = response.data.rows.map(row => row.doc);
    anunciosOriginal.value = docs.map(doc => ({ id: doc._id, rev: doc._rev }));
    cargarImagenes();
  } else {
    console.error('Error al obtener los anuncios');
  }
}

function cargarImagenes() {
  contaCargaFotos.value = 0;

  anunciosOriginal.value.forEach((arti) => {
    // URL del documento de imagen en CouchDB (debes proporcionar la URL correcta)
    const imagenDocumentURL = `https://couchdbbackend.esaapp.com/atrasvasolo-imagenes/${arti.id}`;

    // Realiza una solicitud GET al documento de imagen en CouchDB
    fetch(imagenDocumentURL)
      .then(response => response.json())
      .then(imagenData => {
        if (imagenData._attachments) {
          // Obtiene todas las imágenes disponibles en el documento
          const imageUrls = Object.keys(imagenData._attachments).map((imageName) => {
            return `${imagenDocumentURL}/${imageName}`;
          });

          arti.urlImagen = imageUrls;
        }

        contaCargaFotos.value++;
        estanTerminadasImagenes();
      })
      .catch(error => {
        console.log('Error al obtener las imágenes:', error);
        contaCargaFotos.value++;
        estanTerminadasImagenes();
      });
  });
}



function estanTerminadasImagenes() {
  if (contaCargaFotos.value === anunciosOriginal.value.length) {
    anunciosOriginal.value.forEach(item => {
      anuncios.value.push(item)
    })
  }
}

var eliminarAnuncio = new Boolean(false);

async function eliminarDocumento(id, rev) {

  const url = `/atrasvasolo-anuncios/${id}`
  api.delete(`${url}?rev=${rev}`).then(response => {
    console.log('Anuncio eliminado de la base de datos:', response.data);
    quasar.notify({
      message: 'El anuncio se eliminó exitosamente',
      color: 'positive'
    })
    router.go();
  }).catch(error => {
    console.log("Error al Eliminar:", error)
  })

}



function seEliminoAnuncio() {
  if (eliminarAnuncio === true) {
    quasar.notify({
      message: 'Anuncio eliminado correctamente.',
      color: 'grey-10',
      icon: 'delete',
    })
    router.push('/')
  }
}

// CICLO DE VIDA
onMounted(() => {
  cargarDatosOriginales()
})
</script>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
