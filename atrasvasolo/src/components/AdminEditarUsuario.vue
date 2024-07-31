<template>
  <q-banner inline-actions class="text-white bg-red text-center mobile-only">
    {{ $t('nomovile') }}
  </q-banner>
  <div class="desktop-only q-py-lg q-px-xl q-mx-xl">
    <div class="q-px-xl q-mx-xl">
      <q-toolbar class="bg-accent text-white shadow-5 rounded-borders" style="z-index:3;">
        <q-icon name="person_add" size="30px" color="primary" dense flat />
        <q-toolbar-title>{{ $t('adminEditarUsurio.editar') }}</q-toolbar-title>
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
            color="primary" bg-color="white" outlined v-model="rolDeUsuario" :options="optionsRol" class="q-my-md"
            @change="handleRolChange" />
        </q-card-section>
        <q-card-section class="col-12 q-pb-sm q-pt-none">
          <div class="row justify-center ">
            <q-btn color="primary" icon="save" @click="mostrarMensaje" :label="$t('adminEditarUsurio.guardar')"
              class="q-mx-sm" :disable="buttonEnabled" />
            <q-btn color="dark" @click="mostrarMensaje" icon="close" :label="$t('adminEditarUsurio.cancelar')"
              class="text-white q-mx-sm" />
            <q-dialog v-model="showMessage" persistent>
              <q-card>
                <q-card-section>
                  <div class="text-h6">¡MODIFICACION DE USUARIO!</div>
                  <p>¿Deseas confirmar los cambios?</p>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn color="primary" label="Guardar" @click="guardarCambios" to="/Administracion/Usuario" />
                  <q-btn color="secondary" @click="mostrarMensaje" to="/Administracion/Usuario/"
                    :label="$t('adminEditarUsurio.cancelar')" />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { api } from 'boot/axios';
import { useRouter } from 'vue-router';

const buttonEnabled = ref(false);
const router = useRouter();
const model = ref({
  nombre: '',
  apellido: '',
  email: '',
  tipo: '',
});
const optionsRol = ref(["ADMINISTRADOR", "COLABORADOR"]);
const rolDeUsuario = ref('');
const route = useRoute();

const showMessage = ref(false);

function handleRolChange() {
  if (rolDeUsuario.value === "ADMINISTRADOR" || rolDeUsuario.value === "COLABORADOR") {
    console.log("Rol seleccionado:", rolDeUsuario.value);
    buttonEnabled.value = true;
  } else {
    buttonEnabled.value = false;
  }
}

async function guardarCambios() {
  const id = route.params.id;

  try {
    // Realiza una solicitud GET para obtener el documento actual en CouchDB
    const response = await api.get(`/atrasvasolo-administradores/${id}`);
    const existingDocument = response.data;

    if (existingDocument) {
      // Obtener el _rev actual del documento
      const rev = existingDocument._rev;

      // Actualiza el documento existente con los nuevos datos
      existingDocument.nombre = model.value.nombre;
      existingDocument.apellido = model.value.apellido;
      existingDocument.email = model.value.email;
      existingDocument.tipo = rolDeUsuario.value;

      // Incluye el _rev en los datos a actualizar
      existingDocument._rev = rev;

      // Realiza una solicitud PUT para actualizar el documento
      const updateResponse = await api.put(`/atrasvasolo-administradores/${id}`, existingDocument);

      if (updateResponse.status === 201 || updateResponse.status === 200) {
        console.log('Cambios guardados en CouchDB');
        showMessage.value = true;
        router.go();
      } else {
        console.error('Error al guardar los cambios en CouchDB');
      }
    } else {
      console.log("No se encontró el documento en CouchDB. Creando un nuevo documento...");
      // Si no se encuentra el documento, lo crea como uno nuevo
      const newDocument = {
        _id: id, // Usar el mismo _id
        nombre: model.value.nombre,
        apellido: model.value.apellido,
        email: model.value.email,
        tipo: rolDeUsuario.value,
      };

      const createResponse = await api.post(`/atrasvasolo-administradores/`, newDocument);

      if (createResponse.status === 201) {
        console.log('Nuevo documento creado en CouchDB.');
        showMessage.value = true;
        router.go();
      } else {
        console.error('Error al crear el nuevo documento en CouchDB');
      }
    }
  } catch (error) {
    console.error('Error al cargar los datos o al guardar los cambios:', error);
  }
}

function mostrarMensaje() {
  showMessage.value = true;
}

async function dataQueryRoute(id) {
  try {
    const docRef = await api.get(`/atrasvasolo-administradores/${id}`);
    const data = docRef.data;

    if (data) {
      model.value.nombre = data.nombre;
      model.value.apellido = data.apellido;
      model.value.email = data.email;
      model.value.tipo = data.tipo;
    } else {
      console.log("No se encontró el documento.");
    }
  } catch (error) {
    console.error('Error al cargar los datos:', error);
  }
}

onMounted(() => {
  const id = route.params.id;
  dataQueryRoute(id);
});
</script>
