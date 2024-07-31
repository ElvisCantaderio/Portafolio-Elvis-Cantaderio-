
<template>
  <q-banner inline-actions class="text-white bg-red text-center mobile-only">
    {{ $t('nomovile') }}

  </q-banner>
  <div class="bg-dark q-mx-xl q-px-xl desktop-only">

    <div class="q-px-xl q-mx-xl q-py-lg ">

      <q-toolbar class="bg-accent text-white shadow-5 q-pa-sm rounded-borders">

        <q-icon name="post_add" color="primary" size="md"></q-icon>

        <!-- Banner inicial del titulo -->
        <q-toolbar-title>{{ $t('adminParada.admin') }}</q-toolbar-title>

        <q-space></q-space>

        <!-- Boton de Agregar nueva parada -->
        <q-btn color="primary" icon="add" no-caps class="q-ma-sm" to="/Administracion/Paradas/Agregar">{{
          $t('adminParada.nueva') }}</q-btn>
      </q-toolbar>

      <q-list bordered class="bg-accent">

        <q-card-section class="row flex-center">


          <!-- Buscador de paradas por nombre -->
          <q-input :label="$t('adminParada.buscar')" v-model="searchQuery" dense color="primary" bg-color="white" rounded
            outlined class="q-my-none col-md-6 col-8 ">
            <template v-slot:append>

              <q-icon name="search" color="primary"></q-icon>
            </template>
          </q-input>

        </q-card-section>

        <!-- Mostrando los items de todas las paradas -->
        <q-item v-for="para in filteredItems" :key="para.id" class=" flex q-my-sm justify-center">
          <q-item-section avatar>
            <q-icon name="location_on" color="info" size="35px" />
          </q-item-section>

          <q-item-section class="text-white col-7">

            <!-- Nombre de la parada -->
            <q-item-label>{{ para.name }}</q-item-label>

            <!-- Descripcion de la parada-->
            <q-item-label class="text-grey" caption lines="1">{{ para.descripcion }}</q-item-label>

            <!-- Boton para ver el detalle de una parada -->
            <q-item-label>
              <q-btn :to="'/DetalleParada/' + para.id" :label="$t('adminParada.verParada')" outline color="info" />
            </q-item-label>

          </q-item-section>
          <q-btn color="white" dense flat text-color="white" icon="more_vert">
            <q-menu>

              <q-list dense style="min-width: 100px">

                <!-- Boton para editar parada -->
                <q-item clickable :to="'/Administracion/Paradas/Editar/' + para.id" v-close-popup>
                  <q-item-section>{{ $t('adminParada.editar') }}</q-item-section>
                </q-item>

                <!-- Boton que redirecciona a eliminar una parada -->
                <q-item clickable v-close-popup :to="'/Administracion/Paradas/Eliminar/' + para.id">
                  <q-item-section>{{ $t('adminParada.eliminar') }}</q-item-section>
                </q-item>

                <!-- Redirecciona a detalle de parada -->
                <q-item clickable v-close-popup :to="'/DetalleParada/' + para.id">
                  <q-item-section>{{ $t('adminParada.ver') }}</q-item-section>
                </q-item>

              </q-list>
            </q-menu>
          </q-btn>

        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup>

import { db, collection, getDocs, doc, query, limit, deleteDoc } from "../boot/firebase"
import { api } from 'boot/axios';
import { onMounted } from "vue"
import { computed, ref } from 'vue'
import useQuasar from 'quasar/src/composables/use-quasar.js'


//const borrarParada = async function () {


//await deleteDoc(doc(db, "paradas", paradas.value.id));
//$q.notify({
// message: 'Entro ',
//color: 'primary',
//icon: 'save'
//})
//const paradas1 = doc(collection(db, 'paradas'))
//nuevo.value.id = paradas1.id
//await setDoc(paradas1, nuevo.value)
//const docRef = await addDoc(collection(db, 'paradas'), nuevo.value)
//console.log('Document written whit ID: ', docRef.id)
//idParada.value = docRef.id

//subir()

//}


//acá se obtienen todas las paradas para luego mostrarlas
const paradas = ref([])
const $q = useQuasar()


// funcion asincrona para obtener paradas
async function obtenerParadas() {
  /* const first = query(collection(db, "paradas"))


   //Se obtinen todas las paradas para luego pasarlas a const paradas
   const querySnapshot = await getDocs(first);

   querySnapshot.forEach((doc) => {

     let parada = doc.data();
     parada.id = doc.id;

     //pasando todos los valores que vienen de la base de datos para luego ser mostrados
     paradas.value.push({ id: doc.data().id, name: doc.data().nombre, descripcion: doc.data().referencia })
   });
 */

  //URL para la consulta GET
  const response = await api.get("/atrasvasolo-paradas/_all_docs?include_docs=true");

  //Validando la respuesta recibida
  if (response.status === 200) {

    //Se obtienen todos las paradas con todos sus campos
    const docs = response.data.rows.map(row => row.doc)

    docs.forEach(doc => {

      //Se seleccionan los datos que se necesitan para mostrar el listado general de todas las paradas
      paradas.value.push({ id: doc._id, name: doc.nombre, descripcion: doc.referencia })

    })

  }
  else {

    console.log("Error al obtener las paradas");

  }

}

//Utilizada para hacer funcionar el buscador de paradas
const searchQuery = ref('');


//filtrando los datos que vienen de la base de datos para que coincida con la busqueda
const filteredItems = computed(() => {
  return paradas.value.filter(item =>

    //se muestra el dato que se esta buscando si es que existen coincidencias
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(() => {
  obtenerParadas()

})


</script>




   <!-- <template>
  <q-banner inline-actions class="text-white bg-red text-center mobile-only">
    El apartado de Administracion no esta disponible en moviles

  </q-banner>
  <div class="bg-dark q-mx-xl q-px-xl desktop-only">
    <div class="q-px-xl q-mx-xl q-py-lg ">
      <q-toolbar class="bg-accent text-white shadow-5 q-pa-sm rounded-borders">
        <q-icon name="post_add" color="primary" size="md"></q-icon>
        <q-toolbar-title>Administracion de paradas</q-toolbar-title>
        <q-space></q-space>
        <q-btn color="primary" icon="add" no-caps class="q-ma-sm" to="/Administracion/Paradas/Agregar">Nueva
          parada</q-btn>
      </q-toolbar>

      <q-list bordered class="bg-accent">

        <q-card-section class="row flex-center">
          <q-input label="Buscar" dense color="primary" bg-color="white" rounded outlined
            class="q-my-none col-md-6 col-8 ">
            <template v-slot:append>
              <q-icon name="search" color="primary"></q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-item v-for="(para, key) in paradas" :key="'parada' + key" class=" flex q-my-sm justify-center">
          <q-item-section avatar>
            <q-icon name="location_on" color="info" size="35px" />
          </q-item-section>
          <q-item-section class="text-white col-7">
            <q-item-label>{{ para.name }}</q-item-label>
            <q-item-label class="text-grey" caption lines="1">{{ para.descripcion }}</q-item-label>
            <q-item-label>
              <q-btn to="/DetalleParada" label="Ver Parada" outline color="info" />
            </q-item-label>
          </q-item-section>
          <q-btn color="white" dense flat text-color="white" icon="more_vert">
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item clickable to="/Administracion/Paradas/Editar" v-close-popup>
                  <q-item-section>Editar</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>Eliminar</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>Ver</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { db, collection, getDocs, doc, query, limit } from "../boot/firebase"
import { onMounted } from "vue";
import { defineComponent, ref } from 'vue'
const paradas = ref([])

async function obtenerParadas() {
  const first = query(collection(db, "paradas"))

  const querySnapshot = await getDocs(first);
  querySnapshot.forEach((doc) => {
    let parada = doc.data();
    parada.id = doc.id;
    paradas.value.push({ id: doc.data().id, name: doc.data().nombre, descripcion: doc.data().referencia })
  });
}

export default {
  setup() {
    onMounted(() => {
      obtenerParadas()
    })
    return {
      paradas
    }
  }
}

</script>

-->

 <!-- <template>
  <q-banner inline-actions class="text-white bg-red text-center mobile-only">
    El apartado de Administracion no esta disponible en moviles

  </q-banner>
  <div class="bg-dark q-mx-xl q-px-xl desktop-only">
    <div class="q-px-xl q-mx-xl q-py-lg ">
      <q-toolbar class="bg-accent text-white shadow-5 q-pa-sm rounded-borders">
        <q-icon name="post_add" color="primary" size="md"></q-icon>
        <q-toolbar-title>Administracion de paradas</q-toolbar-title>
        <q-space></q-space>
        <q-btn color="primary" icon="add" no-caps class="q-ma-sm" to="/Administracion/Paradas/Agregar">Nueva
          parada</q-btn>
      </q-toolbar>

      <q-list bordered class="bg-accent">

        <q-card-section class="row flex-center">
          <q-input label="Buscar" dense color="primary" bg-color="white" rounded outlined
            class="q-my-none col-md-6 col-8 ">
            <template v-slot:append>
              <q-icon name="search" color="primary"></q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-item v-for="(para, key) in paradas" :key="'parada' + key" class=" flex q-my-sm justify-center">
          <q-item-section avatar>
            <q-icon name="location_on" color="info" size="35px" />
          </q-item-section>
          <q-item-section class="text-white col-7">
            <q-item-label>{{ para.name }}</q-item-label>
            <q-item-label class="text-grey" caption lines="1">{{ para.descripcion }}</q-item-label>
            <q-item-label>
              <q-btn to="/DetalleParada" label="Ver Parada" outline color="info" />
            </q-item-label>
          </q-item-section>
          <q-btn color="white" dense flat text-color="white" icon="more_vert">
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item clickable to="/Administracion/Paradas/Editar" v-close-popup>
                  <q-item-section>Editar</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>Eliminar</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>Ver</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { db, collection, getDocs, doc, query, limit } from "../boot/firebase"
import { onMounted } from "vue";
import { defineComponent, ref } from 'vue'
const paradas = ref([])

async function obtenerParadas() {
  const first = query(collection(db, "paradas"))

  const querySnapshot = await getDocs(first);
  querySnapshot.forEach((doc) => {
    let parada = doc.data();
    parada.id = doc.id;
    paradas.value.push({ id: doc.data().id, name: doc.data().nombre, descripcion: doc.data().referencia })
  });
}

export default {
  setup() {
    onMounted(() => {
      obtenerParadas()
    })
    return {
      paradas
    }
  }
}

</script>

-->
