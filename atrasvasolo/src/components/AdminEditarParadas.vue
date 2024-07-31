
<template>
  <q-banner inline-actions class="text-white bg-red text-center mobile-only">
    {{ $t('nomovile') }}
  </q-banner>
  <div class="bg-dark q-py-lg q-px-xl q-mx-xl  desktop-only">
    <div class="q-px-xl q-mx-xl">
      <q-toolbar class="bg-accent text-white shadow-5  rounded-borders" style="z-index:3;">
        <q-icon name="edit_location_alt" size="30px" color="primary" dense flat />

        <!-- Baneer inicial del titulo -->
        <q-toolbar-title>{{ $t('adminEditarParadas.editarParada') }}</q-toolbar-title>
      </q-toolbar>
      <!-- <q-item class=" flex q-my-sm justify-center bg-accent">
        <q-item-section avatar>
          <br>
          <q-icon name="location_on" color="info" size="35px" />
        </q-item-section>

        <q-item-section v-for="(paradas, key) in   paradas  " :key="'para' + key" class="text-white col-7">
          <q-item-label><strong>{{ $t('adminEditarParadas.nombre') }} </strong> {{ paradas.nombre }}</q-item-label>
          <q-item-label class="text-grey" caption lines="1"><strong>{{ $t('adminEditarParadas.referencia') }} </strong>{{
            paradas.referencia
          }}</q-item-label>
          <q-item-label class="text-grey" caption lines="1"><strong>{{ $t('adminEditarParadas.departamento') }} </strong>
            {{ paradas.ciudad
            }}</q-item-label>
          <q-item-label class="text-grey" caption lines="1"><strong>{{ $t('adminEditarParadas.lugaresCercanos') }}
            </strong>{{ paradas.lugaresCercanos
            }}</q-item-label>
          <q-item-label class="text-grey" caption lines="1"><strong>{{ $t('adminEditarParadas.latitud') }} </strong>{{
            paradas.gps._lat }}</q-item-label>
          <q-item-label class="text-grey" caption lines="1"><strong>{{ $t('adminEditarParadas.longitud') }} </strong>{{
            paradas.gps._long }}</q-item-label>

        </q-item-section>

      </q-item>
        -->
      <q-card class="col-sm-11 col-md-11 col-lg-11 bg-accent  row justify-center" style="z-index:1;">
        <q-card-section class="col-xs-10 col-sm-8 col-md-6">
          <q-card-section>

            <!-- Se obtinen los datos extraidos de la base de datos y se muestran en los input-->
            <q-input :label="$t('adminEditarParadas.nombreLabel')" rounded ref="controlesA" outlined dense clearable
              clear-icon="close" v-model="para.nombre" @clear="para.nombre = ''"
              :rules="[val => !!val || 'Campo requerido!!!']" color="primary" bg-color="white" class="q-my-md" />


            <!-- Se obtinen los datos extraidos de la base de datos y se muestran en los input-->
            <q-input :label="$t('adminEditarParadas.referenciaLabel')" ref="controlesB" outlined dense clearable
              clear-icon="close" v-model="para.referencia" @clear="para.referencia = ''"
              :rules="[val => !!val || 'Campo requerido!!!']" color="primary" bg-color="white" rounded class="q-my-md" />


            <!-- Se obtinen los datos extraidos de la base de datos y se muestran en los input-->
            <q-input :label="$t('adminEditarParadas.departamentoLabel')" ref="controlesC" outlined dense clearable
              clear-icon="close" v-model="para.ciudad" @clear="para.ciudad = ''"
              :rules="[val => !!val || 'Campo requerido!!!']" color="primary" bg-color="white" rounded class="q-my-md" />


            <!-- Se obtinen los datos extraidos de la base de datos y se muestran en los input-->
            <q-input :label="$t('adminEditarParadas.lugaresCercanosLabel')" ref="controlesD" outlined dense clearable
              clear-icon="close" v-model="para.lugaresCercanos" @clear="para.lugaresCercanos = ''"
              :rules="[val => !!val || 'Campo requerido!!!']" color="primary" bg-color="white" rounded autogrow
              class="q-my-md" />


            <!-- Se obtinen los datos extraidos de la base de datos y se muestran en los input-->
            <div class="row justify-center">
              <div class="col-6 ">
                <q-input type="number" class="q-my-sm" ref="controlesE" :label="$t('adminEditarParadas.latitudLabel')"
                  outlined dense clearable clear-icon="close" v-model="para.gps.value._latitude"
                  @clear="para.gps.value_latitude = ''"
                  :rules="[val => (val >= -90 && val <= 90) || 'Valor debe ser mayor que -90 y menor de 90!!!']" rounded
                  bg-color="white" color="primary" style="max-width: 200px" />
              </div>


              <!-- Se obtinen los datos extraidos de la base de datos y se muestran en los input-->
              <div class="col-6 ">
                <q-input type="number" class="q-my-sm " ref="controlesF" :label="$t('adminEditarParadas.longitudLabel')"
                  outlined dense clearable clear-icon="close" v-model="para.gps.value._longitude"
                  @clear="para.gps.value._longitude = ''"
                  :rules="[val => (val >= -180 && val <= 180) || 'Valor debe ser mayor que -180 y menor de 180!!!']"
                  rounded bg-color="white" color="primary" style="max-width: 200px" />
              </div>
            </div>
          </q-card-section>


          <!-- Boton para guardar la actualización-->
          <div class="row justify-center ">
            <q-btn color="primary" icon="save" @click="ActualizarParada" :label="$t('adminEditarParadas.guardar')"
              class="q-mx-sm" to="/Administracion/Paradas" />


            <!-- Boton para cancelar y volver al menu de administracion de paradas-->
            <q-btn color="dark" to="/Administracion/Paradas" icon="close" :label="$t('adminEditarParadas.cancelar')"
              class="text-white q-mx-sm" />
          </div>

        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script setup>

import { db, collection, getDocs, doc, getDoc, query, limit, deleteDoc, GeoPoint, updateDoc } from "../boot/firebase"

import { onMounted } from "vue"

import { ref } from 'vue'

import useQuasar from 'quasar/src/composables/use-quasar.js'

import { useRoute } from 'vue-router';

import { api } from 'boot/axios';

//Declaracion de variables a utilizar

const route = useRoute();

const $q = useQuasar()
//const paradas = ref([

//])
//const currentPath = window.location.hash;
//const id = currentPath.split('/').pop();
//console.log('Document written whit ID: ', id)
//Prueba Conf
//Parte de la validacion
const controlesA = ref(null)
const controlesB = ref(null)
const controlesC = ref(null)
const controlesD = ref(null)
const controlesE = ref(null)
const controlesF = ref(null)


//Aca se obtienen los valores que se muestran en los input y los que se procesan al escribir en los input
/*const para = ref({
  nombre: '',
  referencia: '',
  ciudad: '',
  lugaresCercanos: '',
  gps: new GeoPoint(0, 0),
  fotos: [],
})
*/

//datos a actualizar segun el formato que requiere couchDB
const para = ref({
  "_rev": "",
  "lugaresCercanos": "",
  "ciudad": "",
  "referencia": "",
  "nombre": "",
  "gps": {
    "__datatype__": "geopoint",
    "value": {
      "_latitude": "",
      "_longitude": ""
    }
  }
})




//Validacion para resetear todos los campos de los input
const resetearValidacion = function () {

  controlesA.value.resetValidation()
  controlesB.value.resetValidation()
  controlesC.value.resetValidation()
  controlesD.value.resetValidation()
  controlesE.value.resetValidation()
  controlesF.value.resetValidation()

}



// funcion de actualizar parada y validacion para ver que todos los campos esten llenos
const ActualizarParada = function () {

  console.log('el valor es de: ' + para.value.nombre)

  controlesA.value.validate()
  controlesB.value.validate()
  controlesC.value.validate()
  controlesD.value.validate()
  controlesE.value.validate()
  controlesF.value.validate()



  //Aca se valida que ningun campo este vacio
  if (!controlesA.value.hasError && !controlesB.value.hasError && !controlesC.value.hasError && !controlesD.value.hasError &&
    !controlesE.value.hasError && !controlesF.value.hasError) {

    console.log('Todo está valido')

    //se llama la funcion para actualizar parada
    UpdateParada()


    //se muestra una notificacion de que el proceso se realizo con exito
    /*$q.notify({
      message: 'Se actualizo la parada',
      color: 'primary',
      icon: 'save'
    })
*/




  }



}



//funcion asincrona de actualizar parada
async function UpdateParada() {

  //se obtiene el id de la parada
  const id = route.params.id;
  const ide = id;

  try {

    //se pasa el URL de la base de datos junto al id y el cumulo de datos que se van actualizar
    const response = await api.put(`/atrasvasolo-paradas/${ide}`, para.value);

    //Se muestra un mensaje de confirmacion de parada actualizada
    $q.notify({
      message: 'Se actualizo la parada',
      color: 'primary',
      icon: 'save'
    })
    //regresamos al menu de admin paradas
    window.location.href = "/Administracion/Paradas#/Administracion/Paradas"

  } catch (error) {

    //Si no es posible actualizar la parada se muestra un mensaje de error

    $q.notify({
      message: 'No se actualizo la parada',
      color: 'primary',
      icon: 'save'
    })
  }

  /*
    //se modifica la parada segun el id que se le pasa
    const modificar = doc(db, "paradas", id);
    await updateDoc(modificar, para.value);

    //{
    //  nombre: para.value.nombre,
    //  referencia: para.value.referencia,
    //  ciudad: para.value.ciudad,
    //  lugaresCercanos: para.value.lugaresCercanos


    //}
  */
}



//Funcion asincrona para obtener las paradas y asi mostrarlas en los input
async function obtenerParadas(id) {

  //se obtiene el id
  const ide = id;
  // state.querySnapshoteUser();
  /*

    try {


      //se obtiene los datos de la parada segun el id que se le pasa
      const docRef = doc(db, "paradas", ide);
      //console.log(docRef);
      //const data = [];

      const docSnap = await getDoc(docRef);
      //console.log(docSnap.data());

      const data = docSnap.data();

      //validacion para ver si trae datos
      if (docSnap.exists()) {
        //console.log("Document data:", docSnap.data());
        // data.push(docSnap.data());

        //se pasa el valor que viene en el campo nombre
        para.value.nombre = data.nombre;

        //se pasa el valor que viene en el campo referencia
        para.value.referencia = data.referencia;

        //se pasa el valor que viene en el campo ciudad o departamento
        para.value.ciudad = data.ciudad;

        //se pasa el valor que viene en el campo lugares cercanos
        para.value.lugaresCercanos = data.lugaresCercanos;

        //se pasa el valor que viene en el campo gps.latitud
        para.value.gps._lat = data.gps._lat;

        //se pasa el valor que viene en el campo gps.longitud
        para.value.gps._long = data.gps._long;

        console.log(para.value);

        //paradas.value.push({
        //id: data.id, nombre: data.nombre, referencia: data.referencia,
        //ciudad: data.ciudad, lugaresCercanos: data.lugaresCercanos, gps: { _lat: data.gps._lat, _long: data.gps._long }



        //})
      } else {
        // docSnap.data() will be undefined in this case

        console.log("No such document!");

      }
      //model.value = data;

    } catch (error) {

      console.error('Error al cargar los datos:', error);

    }
  */


  //URL para la consulta GET
  const response = await api.get("/atrasvasolo-paradas/_all_docs?include_docs=true");

  //Validando la respuesta recibida
  if (response.status === 200) {

    //Se obtienen todos las paradas con todos sus campos
    const docs = response.data.rows.map(row => row.doc)

    docs.forEach(doc => {

      if (doc._id === ide) {


        //pasando el valor obtenido de la base de datos para mostrarlo en pantalla al usuario
        //paradas.value.push({ id: doc._id, name: doc.nombre, descripcion: doc.referencia, rev: doc._rev })
        //console.log('Valor de l' + paradas.value.name)
        para.value._rev = doc._rev;

        para.value.nombre = doc.nombre;

        //se pasa el valor que viene en el campo referencia
        para.value.referencia = doc.referencia;

        //se pasa el valor que viene en el campo ciudad o departamento
        para.value.ciudad = doc.ciudad;

        //se pasa el valor que viene en el campo lugares cercanos
        para.value.lugaresCercanos = doc.lugaresCercanos;

        //se pasa el valor que viene en el campo gps.latitud
        para.value.gps.value._latitude = doc.gps.value._latitude;


        //se pasa el valor que viene en el campo gps.longitud
        para.value.gps.value._longitude = doc.gps.value._longitude;
        //paradas.value.id = doc._id;
        //paradas.value.name = doc.nombre;
        //paradas.value.descripcion = doc.referencia;
        //paradas.value.rev = doc._rev;
      }

    })

  }
  else {

    console.log("Error al obtener las paradas");

  }

}


onMounted(() => {
  //Se obtiene el id
  const id = route.params.id;

  obtenerParadas(id)

})


</script>
