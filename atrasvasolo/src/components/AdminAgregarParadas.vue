<template>
  <q-banner inline-actions class="text-white bg-red text-center mobile-only">
    {{ $t('nomovile') }}
  </q-banner>

  <div class="bg-dark q-py-lg q-px-xl q-mx-xl  desktop-only">
    <div class="q-px-xl q-mx-xl">


      <!-- Banner inicial del titulo -->
      <q-toolbar class="bg-accent text-white shadow-5  rounded-borders" style="z-index:3;">
        <q-icon name="edit_location_alt" size="30px" color="primary" dense flat class="q-ma-sm" />
        <q-toolbar-title>{{ $t('adminAgregarParadas.agregar') }}</q-toolbar-title>
      </q-toolbar>

      <q-card class="col-sm-11 col-md-11 col-lg-11 bg-accent  row justify-center" style="z-index:1;">

        <q-card-section class="col-xs-10 col-sm-8 col-md-6">

          <!-- Empieza el formulario con el nombre de la parada a agregar-->
          <q-input :label="$t('adminAgregarParadas.nombreParada')" ref="controlesA" v-model="nuevo.nombre"
            :rules="[val => !!val || 'Campo requerido!!!']" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" />


          <!-- Se obtiene el campo de referencia, campo validado, no permite que este vacio -->
          <q-input :label="$t('adminAgregarParadas.referencia')" ref="controlesB" v-model="nuevo.referencia"
            :rules="[val => !!val || 'Campo requerido!!!']" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" />


          <!-- Se obtiene el departamento, campo validado, no permite que este vacio  -->
          <q-input :label="$t('adminAgregarParadas.departamento')" ref="controlesC" v-model="nuevo.ciudad"
            :rules="[val => !!val || 'Campo requerido!!!']" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" />


          <!-- se solicita los lugares cercanos, campo validado, no permite que este vacio -->
          <q-input :label="$t('adminAgregarParadas.lugaresCercanos')" ref="controlesD" v-model="nuevo.lugaresCercanos"
            :rules="[val => !!val || 'Campo requerido!!!']" dense color="primary" bg-color="white" rounded autogrow
            outlined class="q-my-md" />


          <div class="row justify-center">

            <!-- Ingreso de la latitud validada  -->
            <div class="col-6 ">
              <q-input type="number" ref="controlesE" v-model="nuevo.gps.value._latitude"
                :rules="[val => (val >= -90 && val <= 90) || 'Valor debe ser mayor que -90 y menor de 90!!!']"
                class="q-my-sm" :label="$t('adminAgregarParadas.latitud')" rounded outlined bg-color="white" dense
                color="primary" style="max-width: 200px" />
            </div>


            <!-- Ingreso de la longitud validada  -->
            <div class="col-6 ">
              <q-input type="number" ref="controlesF" v-model="nuevo.gps.value._longitude"
                :rules="[val => (val >= -180 && val <= 180) || 'Valor debe ser mayor que -180 y menor de 180!!!']"
                class="q-my-sm " :label="$t('adminAgregarParadas.longitud')" rounded outlined bg-color="white" dense
                color="primary" style="max-width: 200px" />
            </div>

          </div>

          <!-- Boton para guardar la parada con todos los campos validados  -->
          <div class="row justify-center ">
            <q-btn color="primary" icon="save" @click="GuardarParada" :label="$t('adminAgregarParadas.guardar')"
              class="q-mx-sm" />


            <!-- Boton para cancelar y volver a la pagina principal de administracion de pardas -->
            <q-btn color="dark" to="/Administracion/Paradas" icon="close" :label="$t('adminAgregarParadas.cancelar')"
              class="text-white q-mx-sm" />
          </div>

        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script setup>

import { db, collection, setDoc, doc, GeoPoint } from "../boot/firebase"
import { ref } from 'vue'
import useQuasar from 'quasar/src/composables/use-quasar.js'
import { api } from 'boot/axios';
const $q = useQuasar()

//declaracion de los campos que requiere la base de datos
/*const nuevo = ref({
  id: '',
  nombre: '',
  referencia: '',
  ciudad: '',
  lugaresCercanos: '',
  gps: new GeoPoint(0, 0)
})
*/

//Campos que se agregaran a la base de datos
const nuevo = ref({

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

//validacions de formulario
const controlesA = ref(null)
const controlesB = ref(null)
const controlesC = ref(null)
const controlesD = ref(null)
const controlesE = ref(null)
const controlesF = ref(null)


//Validacion para limpiar los campos del formulario
const resetearValidacion = function () {
  controlesA.value.resetValidation()
  controlesB.value.resetValidation()
  controlesC.value.resetValidation()
  controlesD.value.resetValidation()
  controlesE.value.resetValidation()
  controlesF.value.resetValidation()
}


// validacion para guardar la parada, todos los campos tienen que estar llenos
const GuardarParada = function () {

  controlesA.value.validate()
  controlesB.value.validate()
  controlesC.value.validate()
  controlesD.value.validate()
  controlesE.value.validate()
  controlesF.value.validate()


  //lineas de verificacion de que el formulario esté lleno
  if (!controlesA.value.hasError && !controlesB.value.hasError && !controlesC.value.hasError && !controlesD.value.hasError &&
    !controlesE.value.hasError && !controlesF.value.hasError) {

    console.log('Todo está valido')

    //se llama a la funcion para subir la parada luego de verificar de que este validado
    subirParada()

    //se muestra una notificacion de que se ha subido con éxito
    $q.notify({
      message: 'Se agregó la parada',
      color: 'primary',
      icon: 'save'
    })

    //regresa a la pagina principal de administración de paradas
    window.location.href = "/Administracion/Paradas#/Administracion/Paradas"
  }


}

//declaracion de la funcion asincrona para subir parada
const subirParada = async function () {

  /*
   try {

     console.log('El nombre es de ', nuevo.value.nombre)

     const paradas1 = doc(collection(db, 'paradas'))

     nuevo.value.id = paradas1.id

     await setDoc(paradas1, nuevo.value)




     //const docRef = await addDoc(collection(db, 'paradas'), nuevo.value)
     //console.log('Document written whit ID: ', docRef.id)
     //idParada.value = docRef.id

     //subir()
   } catch (e) {

     console.error('Error al subir archivo', e)

   }
 */

  try {

    //Se agrega la parada por medio de la URL donde se tiene la base de datos y por medio de post
    const response = await api.post('/atrasvasolo-paradas', nuevo.value)
    console.log('Documento agregado:', response.data)

  } catch (error) {
    //Imprime un error en consola si falla la subida del documento
    console.error('Error al agregar documento', error)
  }
}



//export default {
//  setup() {
//    const $q = useQuasar()

//    return {
//      showNotif() {
//        $q.notify({
//          message: 'Se guardo',
//          color: 'primary'
//        })
//      }

//    }
//  }
//}

</script>
