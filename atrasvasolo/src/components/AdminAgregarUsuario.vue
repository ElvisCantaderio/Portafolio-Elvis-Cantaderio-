<template>
  <q-banner inline-actions class="text-white bg-red text-center mobile-only">
    {{ $t('nomovile') }}
  </q-banner>
  <div class="desktop-only q-py-lg q-px-xl q-mx-xl">
    <div class="q-px-xl q-mx-xl">
      <q-toolbar class="bg-accent text-white shadow-5 rounded-borders" style="z-index:3;">
        <q-icon name="person_add" size="30px" color="primary" dense flat class="q-ma-sm" />
        <q-toolbar-title>{{ $t('adminAgregarUsuario.agregar') }}</q-toolbar-title>
      </q-toolbar>

      <q-card class="col-6 bg-accent row justify-center">
        <q-card-section class="col-6">
          <q-input :label="$t('adminEditarUsurio.nombre')" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" v-model="model.nombre" />
          <q-input :label="$t('adminEditarUsurio.apellido')" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" v-model="model.apellido" />
          <q-input :label="$t('adminEditarUsurio.email')" dense color="primary" bg-color="white" rounded outlined
            class="q-my-md" v-model="model.email" />
          <q-select :label="$t('adminEditarUsurio.rol')" transition-show="jump-up" transition-hide="jump-up" rounded dense
            color="primary" bg-color="white" outlined v-model="model.tipo" :options="optionsRol" class="q-my-md"
            @change="handleRolChange" />
        </q-card-section>
        <q-card-section class="col-12 q-pb-sm q-pt-none">
          <div class="row justify-center">
            <q-btn color="primary" icon="save" @click="openConfirmationDialog" :label="$t('adminEditarUsurio.guardar')"
              class="q-mx-sm" :disable="buttonEnabled" />
            <q-btn color="dark" @click="showConfirmationDialog = false" to="/Administracion/Usuario" icon="close"
              :label="$t('adminEditarUsurio.cancelar')" class="text-white q-mx-sm" />
          </div>
        </q-card-section>
      </q-card>

      <q-dialog v-model="showConfirmationDialog" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ $t('adminAgregarUsuario.aggusuario') }}</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="primary" :label="$t('adminAgregarUsuario.confirmar')" @click="agregarDocumentoConfirmado"
              to="/Administracion/Usuario" />
            <q-btn color="secondary" :label="$t('adminAgregarUsuario.cancelar')"
              @click="showConfirmationDialog = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { doc, getDoc, updateDoc, addDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../boot/firebase';
import { api } from 'boot/axios';
const buttonEnabled = ref(false);
const model = ref({
  nombre: '',
  apellido: '',
  email: '',
  tipo: '',
});
const optionsRol = ref(["ADMINISTRADOR", "COLABORADOR"]);
const rolDeUsuario = ref('');
const route = useRoute();

const showConfirmationDialog = ref(false);

function openConfirmationDialog() {
  showConfirmationDialog.value = true;
}

async function agregarDocumentoConfirmado() {
  try {
    const raw = model;
    let nuevoDocumento = {};

    if (!verificacion(raw.value) && rolDeUsuario.value !== null && rolDeUsuario.value.trim() !== "") {
      console.log("objeto no vacío");
      nuevoDocumento = raw.value;

      await api.post(`/atrasvasolo-administradores/`, nuevoDocumento);
      // Cierra el diálogo de confirmación
      showConfirmationDialog.value = false;
    } else {
      console.log("objeto vacío o rolDeUsuario no válido");
      // Muestra una notificación al usuario
    }
  } catch (error) {
    console.error('Error al agregar el documento:', error);
  }
}

async function agregarDocumento() {
  try {
    const collectionRef = collection(db, 'administradores');
    const raw = model;
    let nuevoDocumento = {} // Crea un objeto con los datos que deseas agregar

    if (verificacion(raw.value)) {
      console.log("objeto vacio");
      console.log(raw.value);
    } else {
      console.log("objeto no vacio");
      nuevoDocumento = raw.value;
    }
    // Agrega el documento a la colección
    const docRef = await addDoc(collectionRef, nuevoDocumento);
    console.log('Documento agregado con ID:', docRef.id);
  } catch (error) {
    console.error('Error al agregar el documento:', error);
  }
}

function verificacion(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

function handleRolChange() {
  if (rolDeUsuario.value === "ADMINISTRADOR") {
    // Realizar acciones para el rol de Administrador
    console.log("Rol seleccionado: Administrador");
    // Habilitar el botón de guardar
    buttonEnabled.value = true;
  } else if (rolDeUsuario.value === "COLABORADOR") {
    // Realizar acciones para el rol de Colaborador
    console.log("Rol seleccionado: Colaborador");
    // Habilitar el botón de guardar
    buttonEnabled.value = true;
  } else {
    // Si no se selecciona un rol válido, deshabilitar el botón de guardar
    buttonEnabled.value = false;
  }
}

onMounted(() => {

})

</script>
