<template>
  <q-banner inline-actions class="text-white bg-red text-center mobile-only">
    {{ $t('nomovile') }}
  </q-banner>

  <div class="bg-dark q-py-lg q-px-xl q-mx-xl  desktop-only">

    <div class="q-px-xl q-mx-xl">


      <!-- Banner inicial del titulo -->
      <q-toolbar class="bg-accent text-white shadow-5  rounded-borders" style="z-index:3;">
        <q-icon name="delete" size="30px" color="primary" dense flat />
        <q-toolbar-title>{{ $t('adminEliminarP.eliminarP') }}</q-toolbar-title>
      </q-toolbar>

      <q-card class="col-sm-11 col-md-11 col-lg-11 bg-accent  row justify-center" style="z-index:1;">


        <!-- Obteniendo el nombre de la parada y su id-->
        <q-item v-for="(para, key) in paradas" :key="'parada' + key" class=" flex q-my-sm justify-center">


          <q-item-section avatar>
            <br>
            <q-icon name="location_on" color="info" size="35px" />

          </q-item-section>
          <q-item-section class="text-white col-7">

            <!-- Nombre de la parada-->
            <q-item-label>{{ para.name }}</q-item-label>

            <!-- Descripción de la parada-->
            <q-item-label class="text-grey" caption lines="1">{{ para.descripcion }}</q-item-label>

            <!-- ID de la parada-->
            <br> <strong>{{ $t('adminEliminarP.idParada') }}</strong> {{ para.id }}

            <!-- Rev de la parada-->
            <br> <strong>{{ $t('adminEliminarP.rev') }}</strong> {{ para.rev }}

          </q-item-section>

        </q-item>

        <q-card-section class="col-xs-10 col-sm-8 col-md-6">


          <!-- Campo para ingresar ID y corrborar que si quiere eliminar la parada-->
          <q-input :label="$t('adminEliminarP.id')" ref="controlesA" v-model="validacion.texto"
            :rules="[val => !!val || 'Campo requerido!!!']" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" />

          <!-- Campo para ingresar la rev y corrborar que si quiere eliminar la parada-->
          <q-input :label="$t('adminEliminarP.revParada')" ref="controlesB" v-model="validacion.texto1"
            :rules="[val => !!val || 'Campo requerido!!!']" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" />
          <div class="row justify-center">

          </div>

          <div class="row justify-center ">

            <!-- Boton para eliminar la parada-->
            <q-btn color="primary" icon="delete" @click="eliminarParada" :label="$t('adminEliminarP.eliminar')"
              class="q-mx-sm" />

            <!-- Cancelar y volver a pagina principal de administraion de pardas-->
            <q-btn color="dark" to="/Administracion/Paradas" icon="close" :label="$t('adminEliminarP.cancelar')"
              class="text-white q-mx-sm" />

          </div>


        </q-card-section>

      </q-card>

    </div>
  </div>
</template>
<script setup>

import { db, collection, getDocs, doc, query, limit, deleteDoc } from "../boot/firebase"
import { onMounted } from "vue"
import { ref } from 'vue'
import useQuasar from 'quasar/src/composables/use-quasar.js'
import { useRoute } from 'vue-router';
import { api } from 'boot/axios';
const route = useRoute();
//const currentPath = window.location.hash;
//const id = currentPath.split('/').pop();
const paradas = ref([])

const $q = useQuasar()

//Se usa para la validación
const validacion = ref({
  texto: '',
  texto1: ''
})

console.log('Lo que viene en el campo es: ', validacion.value.texto)

const controlesA = ref(null)
const controlesB = ref(null)

//funcion asincrona para eliminar paradas
async function eliminarParada() {

  //se obtiene el ID con el que se va a comparar, validar y eliminar
  const id = route.params.id;

  const ide = id;
  const rev = validacion.value.texto1;

  //validando que el texto ingresado en el input sea igual que el ID de la parada
  if (validacion.value.texto === ide) {

    //si todo esta valido se elimina la parada
    try {

      //Se realiza la eliminacion del documento, se necesita pasar el ID y la rev correspondiente a ese documento
      await api.delete(`/atrasvasolo-paradas/${ide}?rev=${rev}`)
      console.log(`Documento con ID ${ide} eliminado exitosamente.`)

      //Se muestra un mensaje de exito al eliminar el documento
      $q.notify({
        message: 'Parada eliminada con exito',
        color: 'primary'
      })

      //Redirecciona a la pagina principal de admin paradas
      window.location.href = "/Administracion/Paradas#/Administracion/Paradas"
    } catch (error) {

      //Se muestra un error si no se puede eliminar el documento
      console.error(`Error al eliminar documento con ID ${ide}`)

      //Se muestra un error si no se puede eliminar el documento
      $q.notify({
        message: 'ERROR, Falló!',
        color: 'primary'

      })

      //redireccina a administracion paradas eliminar
      window.location.href = "/Administracion/Paradas#/Administracion/Paradas/Eliminar/" + ide
    }
    //const id = route.params.idParada;
    //console.log('Document written whit ID: ', id)

    //se muestra una notificacion de que se elimino correctamente


    //Regresa a la pagina principal de administracion de paradas
    //window.location.href = "/Administracion/Paradas#/Administracion/Paradas"

    //const id = route.params.idParada;
    //console.log('Document written whit ID: ', id)

  } else {

    //Notificacion de Error, cuando los ID no coinciden
    $q.notify({
      message: 'ERROR, ingrese el ID',
      color: 'primary'

    })
  }

}


//const id = route.params.idParada;
//console.log('Document written whit ID: ', id)

//funcion asincrona para obtener la parada que se quiere eliminar
async function obtenerParadas(id) {

  //obteniendo el ID
  const ide = id;
  //const first = query(collection(db, "paradas", id), limit(1))

  //URL para la consulta GET
  const response = await api.get("/atrasvasolo-paradas/_all_docs?include_docs=true");

  //Validando la respuesta recibida
  if (response.status === 200) {

    //Se obtienen todos las paradas con todos sus campos
    const docs = response.data.rows.map(row => row.doc)


    //se recorren los datos haciendo uso de foreach
    docs.forEach(doc => {

      //Validando que los datos obtenidos tengan el mismo id que el de la parada que necesitamos ver
      if (doc._id === ide) {


        //pasando el valor obtenido de la base de datos para mostrarlo en pantalla al usuario
        paradas.value.push({ id: doc._id, name: doc.nombre, descripcion: doc.referencia, rev: doc._rev })
        console.log('Valor de l' + paradas.value.name)
        //paradas.value.id = doc._id;
        //paradas.value.name = doc.nombre;
        //paradas.value.descripcion = doc.referencia;
        //paradas.value.rev = doc._rev;
      }

    })

  }
  else {
    // si no se pueden obtener las paradas se muestra un console log indicand que hubo un error
    console.log("Error al obtener las paradas");

  }

  /*
    try {

      //obteniendo datos de la base de datos
      const q = query(collection(db, 'paradas'));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {

        if (doc.data().id === ide) {


          //pasando el valor obtenido de la base de datos para mostrarlo en pantalla al usuario
          paradas.value.push({ id: doc.data().id, name: doc.data().nombre, descripcion: doc.data().referencia })
          console.log('Valor de l' + paradas.value.name)

        }
      });


    } catch (error) {


    }
    */
  //const querySnapshot = await getDocs(first);
  //querySnapshot.forEach((doc) => {
  //paradas.value.push({ id: doc.data().id, name: doc.data().nombre, descripcion: doc.data().referencia })
  //});
}



//const borrarParada = async function () {


//await deleteDoc(doc(db, "paradas", paradas.value.id));
//$q.notify({
//  message: 'Entro ',
//  color: 'primary',
//  icon: 'save'
//})
//const paradas1 = doc(collection(db, 'paradas'))
//nuevo.value.id = paradas1.id
//await setDoc(paradas1, nuevo.value)
//const docRef = await addDoc(collection(db, 'paradas'), nuevo.value)
//console.log('Document written whit ID: ', docRef.id)
//idParada.value = docRef.id

//subir()

//}

onMounted(() => {
  //Obteniendo el ID
  const id = route.params.id;
  obtenerParadas(id)
})
//return {
//  paradas, validacion,
//  showNotif() {
//    $q.notify({
//      message: 'Se guardo',
//      color: 'primary'
//    })
//  }
//}



</script>
