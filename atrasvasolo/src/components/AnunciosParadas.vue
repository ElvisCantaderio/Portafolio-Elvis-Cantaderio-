<template>
  <div class="q-px-sm q-py-md flex justify-center desktop-only">
    <q-card class="my-card bg-accent q-pa-none q-mb-sm" v-for="(item, key) in anuncios" :key="key">
      <q-separator class="bg-primary" />

      <!-- Verifica si item.urlImagen es un array y selecciona la primera URL -->
      <q-img class="q-pa-sm q-ma-sm" style="width: 550px; max-width: 100%; height: 210px"
        :src="Array.isArray(item.urlImagen) ? item.urlImagen[0] : item.urlImagen"></q-img>
      <q-separator class="bg-primary" />

      <q-separator class="bg-accent" />

      <q-separator />
    </q-card>
  </div>
  <div class="q-px-sm q-py-md flex justify-center mobile-only">
    <q-card class="my-card bg-accent q-pa-none q-mb-sm" v-for="(item, key) in anuncios" :key="key">
      <q-separator class="bg-primary" />

      <!-- Verifica si item.urlImagen es un array y selecciona la primera URL -->
      <q-img class="q-pa-sm q-ma-sm" style="width: 350px; max-width: 100%; height: 200px"
        :src="Array.isArray(item.urlImagen) ? item.urlImagen[0] : item.urlImagen"></q-img>
      <q-separator class="bg-primary" />

      <q-separator class="bg-accent" />

      <q-separator />
    </q-card>
  </div>
</template>


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
const $q = useQuasar()
const router = useRouter()

// METODOS
async function cargarDatosOriginales() {
  anuncios.value = [];
  anunciosOriginal.value = [];

  const response = await api.get('/atrasvasolo-anuncios/_all_docs?include_docs=true');

  if (response.status === 200) {
    const docs = response.data.rows.map(row => row.doc);

    // Obtiene un índice al azar dentro del rango de documentos disponibles
    const indiceAzar = Math.floor(Math.random() * docs.length);

    // Agrega el documento al azar a anunciosOriginal
    const docAzar = docs[indiceAzar];
    anunciosOriginal.value.push({ id: docAzar._id, rev: docAzar._rev });

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



// CICLO DE VIDA
onMounted(() => {
  cargarDatosOriginales()
})
</script>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
