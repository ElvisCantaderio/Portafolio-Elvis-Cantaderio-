<template >
  <q-banner inline-actions class="text-white bg-red text-center mobile-only">
    {{ $t('nomovile') }}

  </q-banner>
  <q-banner inline-actions class="text-white bg-red text-center" v-if="store.admin != 'ADMINISTRADOR'">
    Solo los ADMINISTRADORES tienen acceso a este apartado.<br>
    Only ADMINISTRADORES have acces to this area.

  </q-banner>

  <div class="row justify-center desktop-only" v-if="store.admin == 'ADMINISTRADOR'">
    <h6 class="text-white q-my-sm text-center text-weight-regular col-12">
      {{ $t('adminUsuario.Ausuarios') }}
    </h6>
    <q-card class="my-card col-8 bg-accent q-mx-sm justify-center">
      <q-card-section>
        <div class="row justify-between">
          <div class="text-h6 text-white">{{ $t('adminUsuario.colaboradores') }}</div>
          <q-btn color="primary" icon="add " to='/Administracion/Usuario/Agregar' no-caps>{{ $t('adminUsuario.aggusuario')
          }}</q-btn>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row justify-center">
          <q-input v-model="searchQuery" :label="$t('adminUsuario.busca')" dense color="primary" bg-color="white" rounded
            outlined class="q-my-sm ">
            <template v-slot:append>
              <q-icon name="search" color="primary"></q-icon>
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-card-section v-if="resultadosFiltrados.length > 0">
        <q-card-section>
          <!-- Renderiza los resultados filtrados aquí -->
          <!-- RESULTADOS FILTRADISIMOS XDDDDD -->
          <q-list>
            <q-separator spaced inset />
            <div v-for="resultado in resultadosFiltrados" :key="resultado.id">
              <q-item clickable v-ripple class="col-xs-9 col-sm-10 col-md-10 items-center">
                <q-item-section side top>
                  <q-icon name="person" color="info" />
                </q-item-section>
                <q-item-section>
                  <q-item-label :id="resultado.id" style="color: white">
                    {{ resultado.nombre }}
                    {{ resultado.apellido }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-chip color="dark" text-color="primary">{{ resultado.tipo }}</q-chip>
                </q-item-section>
                <q-btn color="white" dense flat text-color="white" icon="more_vert">
                  <q-menu>
                    <q-list dense style="min-width: 100px">
                      <q-item clickable :to="'/Administracion/Usuario/Editar/' + resultado.id" v-close-popup>
                        <q-item-section>{{ $t('adminUsuario.editar') }}</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item>
            </div>
          </q-list>
        </q-card-section>
      </q-card-section>
      <q-card-section v-else>
        <q-card-section>
          <q-list>
            <q-separator spaced inset />
            <div v-for="ruta in filteredItems " :key="ruta.id" :id="ruta.id">
              <div class="row justify-between items-center">
                <!-- RESULTADOS DE LISTA GENERAL ADMINISTRADORES  -->
                <q-item clickable v-ripple class="col-xs-9 col-sm-10 col-md-10 items-center">
                  <q-item-section side top>
                    <q-icon name="person" color="info" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label id="2sibndGT1kYV9zSZmL75" style="color: white">
                      {{ ruta.nombre }}
                      {{ ruta.apellido }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-chip color="dark" text-color="primary">{{ ruta.tipo }}</q-chip>
                  </q-item-section>
                </q-item>
                <q-btn color="white" dense flat text-color="white" icon="more_vert">
                  <q-menu>
                    <q-list dense style="min-width: 100px">
                      <q-item clickable :to="'/Administracion/Usuario/Editar/' + ruta._id" v-close-popup>
                        <q-item-section>{{ $t('adminUsuario.editar') }}</q-item-section>
                      </q-item>
                      <q-item clickable to="/Administracion/Usuario" @click="openConfirmationDialog">
                        <q-item-section>{{ $t('adminUsuario.eliminar') }}</q-item-section>
                      </q-item>
                      <q-dialog v-model="showConfirmationDialog" persistent>
                        <q-card>
                          <q-card-section>
                            <div class="text-h6">¿Deseas eliminar el usuario?</div>
                          </q-card-section>
                          <q-card-actions align="right">
                            <q-item clickable @click="deleteUsuario(ruta._id, ruta._rev)" to="/Administracion/Usuario"
                              v-close-popup>
                              <q-item-section>
                                <q-btn color="primary" label="Confirmar" />
                              </q-item-section>
                            </q-item>
                            <q-item clickable @click="cancelarEliminar" v-close-popup>
                              <q-item-section>
                                <q-btn color="secondary" label="Cancelar" />
                              </q-item-section>
                            </q-item>
                          </q-card-actions>
                        </q-card>
                      </q-dialog>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
              <q-separator spaced inset />
            </div>
          </q-list>
        </q-card-section>
      </q-card-section>
    </q-card>

    <q-card class=" my-card col-8 bg-accent q-mx-sm q-my-lg justify-center">
      <q-card-section>
        <div class="row justify-between">
          <div class="text-h6 text-white">{{ $t('adminUsuario.publicos') }}</div>

        </div>
      </q-card-section>
      <q-card-section>
        <div class="row justify-center">
          <q-input v-model="searchQueryPub" :label="$t('adminUsuario.busca')" dense color="primary" bg-color="white"
            rounded outlined class="q-my-sm ">
            <template v-slot:append>
              <q-icon name="search" color="primary"></q-icon>
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-card-section v-if="colaFiltrados.length > 0">
        <q-card-section>
          <!-- Renderiza los resultados filtrados aquí -->
          <q-list>
            <div v-for="resultado in colaFiltrados" :key="resultado.id">
              <q-item clickable v-ripple class="col-xs-9 col-sm-10 col-md-10 items-center">
                <q-item-section side top>
                  <q-icon name="person" color="info" />
                </q-item-section>
                <q-item-section>
                  <q-item-label id="2sibndGT1kYV9zSZmL75" style="color: white">
                    {{ resultado.nombre }}
                    {{ resultado.apellido }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-chip color="dark" text-color="primary">{{ resultado.tipo }}</q-chip>
                </q-item-section>
                <q-btn color="white" dense flat text-color="white" icon="more_vert">
                  <q-menu>
                    <q-list dense style="min-width: 100px">
                      <q-item clickable :to="'/Administracion/Usuario/Editar/' + resultado.id" v-close-popup>
                        <q-item-section>{{ $t('adminUsuario.editar') }}</q-item-section>
                      </q-item>
                      <div>
                        <q-item clickable to="/Administracion/Usuario" @click="openDialog(resultado.id)" v-close-popup>
                          <q-item-section>{{ $t('adminUsuario.eliminar') }}</q-item-section>
                        </q-item>
                      </div>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item>

            </div>
          </q-list>
        </q-card-section>
      </q-card-section>
      <q-card-section v-else>
        <q-card-section>
          <q-list>
            <q-separator spaced inset />
            <!-- filtrando a los publicos xdddd -->
            <div v-for="ruta in filteredItemsPub" :key="ruta.id" :id="ruta.id">
              <div class="row justify-between items-center">
                <!-- LISTA GLOBAL DE USUARIOS PUBLICOS -->
                <q-item clickable v-ripple class="col-xs-9 col-sm-10 col-md-10 items-center">
                  <q-item-section side top>
                    <q-icon name="person" color="info" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label id="2sibndGT1kYV9zSZmL75" style="color: white">
                      {{ ruta.nombre }}
                      {{ ruta.apellido }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-chip color="dark" text-color="primary">{{ ruta.tipo }}</q-chip>
                  </q-item-section>
                </q-item>
                <q-btn color="white" dense flat text-color="white" icon="more_vert">
                  <q-menu>
                    <q-list dense style="min-width: 100px">
                      <q-item clickable :to="'/Administracion/Usuario/Editar/' + ruta._id" v-close-popup>
                        <q-item-section>{{ $t('adminUsuario.editar') }}</q-item-section>
                      </q-item>
                      <q-item clickable to="/Administracion/Usuario" @click="openConfirmationDialog">
                        <q-item-section>{{ $t('adminUsuario.eliminar') }}</q-item-section>
                      </q-item>
                      <q-dialog v-model="showConfirmationDialog" persistent>
                        <q-card>
                          <q-card-section>
                            <div class="text-h6">¿Desea eliminar el usuario?</div>
                          </q-card-section>
                          <q-card-actions align="right">
                            <q-item clickable @click="deleteUsuario(ruta._id, ruta._rev)" to="/Administracion/Usuario"
                              v-close-popup>
                              <q-item-section>
                                <q-btn color="primary" label="Confirmar" />
                              </q-item-section>
                            </q-item>
                            <q-item clickable @click="cancelarEliminar" v-close-popup>
                              <q-item-section>
                                <q-btn color="secondary" label="Cancelar" />
                              </q-item-section>
                            </q-item>
                          </q-card-actions>
                        </q-card>
                      </q-dialog>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>
          </q-list>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { doc, getDoc, getDocs, collection, query, where, updateDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { db } from '../boot/firebase';
import { useCounterStore } from 'stores/dataGlobal';
import { usedetalleUsuarioStore } from '../stores/detalleUsuarios';
import { QDialog } from 'quasar'
import { api } from 'boot/axios';
const state = usedetalleUsuarioStore();
const rutas = ref([]);
const rutasDos = ref([]);
const input = ref('');
const inputDos = ref('');
const resultadosFiltrados = ref([]);
const colaFiltrados = ref([]);
const router = useRouter();
const showConfirmationDialog = ref(false);
const searchQuery = ref('');
const searchQueryPub = ref('');
const store = useCounterStore()

const filteredItems = computed(() => {
  return rutas.value.filter(item =>
    item.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredItemsPub = computed(() => {
  return rutasDos.value.filter(item =>
    item.nombre.toLowerCase().includes(searchQueryPub.value.toLowerCase())
  );
});
function openConfirmationDialog() {
  showConfirmationDialog.value = true;
}
async function dataQueryRoute(lugares) {
  const lugar = lugares;
  state.querySnapshoteUser();
  try {
    const querySnapshot = await api.get(`/atrasvasolo-administradores/_all_docs?include_docs=true`);
    const rutasData = [];
    querySnapshot.data.rows.forEach((doc) => {
      const rutas = doc.doc;

      if (rutas.tipo == "ADMINISTRADOR") {
        rutasData.push(rutas);
      }

    });
    rutas.value = rutasData;

  } catch (error) {
    console.error('Error al cargar los datos:', error);
  }

}

async function dataQuery(lugares) {
  const lugar = lugares;

  state.querySnapshoteUser();
  try {
    // const querySnapshot = await getDocs(
    //   query(collection(db, 'administradores'))
    // );
    const querySnapshot = await api.get(`/atrasvasolo-administradores/_all_docs?include_docs=true`);
    const rutasData = [];

    querySnapshot.data.rows.forEach((doc) => {
      // const rutasDos = doc.data();
      const rutasDos = doc.doc
      // console.log(rutasDos);
      if (rutasDos.tipo !== "ADMINISTRADOR") {

        //   rutasDos.id = doc.id;
        //   //console.log(rutasDos.id);
        rutasData.push(rutasDos);
        // console.log(rutasData);
      }

    });
    const arraySinDuplicados = rutasData.filter((valor, indice, self) => {
      return self.indexOf(valor) === indice;

    });
    //console.log(arraySinDuplicados);
    rutasDos.value = arraySinDuplicados;

  } catch (error) {
    console.error('Error al cargar los datos:', error);
  }

}

async function deleteUsuario(id, rev) {

  await api.delete(`/atrasvasolo-administradores/${id}?rev=${rev}`)
    .then(res => {
      router.push("/Administracion/Usuario");
      console.log('Usuario eliminado de la base de datos');
      showConfirmationDialog.value = false;
      router.go();
    })
    .catch(error => {
      console.error('Error al eliminar el documento:', error);
    });

  // try {
  //   await deleteDoc(docRef);
  //   router.push("/Administracion/Usuario");
  //   console.log('Usuario eliminado de la base de datos');
  //   showConfirmationDialog.value = false;
  //   // Puedes mostrar una notificación o redirigir a otra página después de eliminar el usuario
  //   //await actualizarDatos();
  //   router.go();
  // } catch (error) {
  //   console.error('Error al eliminar el usuario:', error);
  // }
}
function cancelarEliminar() {
  showConfirmationDialog.value = false;
  router.go(); // Recargar la página
}

// async function enviar() {
//   const usuariosCollection = collection(db, 'administradores');
//   //const db = firebase.firestore();
//   // const usersRef = db.collection('administradores');
//   const dato = searchQuery.value;
//   console.log(dato);
//   console.log(usuariosCollection);

//   const datoArray = dato.split(' ')
//   const querySnapshot = await getDocs(query(usuariosCollection, where('nombre', '==', datoArray[0])));
//   const querySnapshotApellido = await getDocs(query(usuariosCollection, where('apellido', '==', datoArray[1])));
//   resultadosFiltrados.value = []; // Reiniciar los resultados filtrados antes de realizar el nuevo filtrado
//   if (datoArray.length <= 1) {

//     querySnapshot.forEach((doc) => {
//       const usuario = doc.data();
//       if (usuario.tipo == "ADMINISTRADOR") {
//         console.log("hola" + usuario);
//         resultadosFiltrados.value.push(usuario);
//         // Haz algo con los datos del usuario encontrado
//         console.log(usuario); // Accede al valor del input a través de input.value
//       }

//     });
//   } else {
//     querySnapshotApellido.forEach((doc) => {
//       const usuario = doc.data();
//       if (usuario.tipo == "ADMINISTRADOR") {

//         resultadosFiltrados.value.push(usuario);
//         // Haz algo con los datos del usuario encontrado

//       }
//     });
//   }
// }
// async function send() {
//   const usuariosCollection = collection(db, 'administradores');
//   //const db = firebase.firestore();
//   // const usersRef = db.collection('administradores');

//   const dato = searchQueryPub.value;


//   const datoArray = dato.split(' ')
//   const querySnapshot = await getDocs(query(usuariosCollection, where('nombre', '==', datoArray[0])));
//   const querySnapshotApellido = await getDocs(query(usuariosCollection, where('apellido', '==', datoArray[1])));
//   colaFiltrados.value = []; // Reiniciar los resultados filtrados antes de realizar el nuevo filtrado
//   if (datoArray.length <= 1) {

//     querySnapshot.forEach((doc) => {
//       const usuario = doc.data();
//       if (usuario.tipo !== "ADMINISTRADOR") {
//         colaFiltrados.value.push(usuario);
//         // Haz algo con los datos del usuario encontrado

//       }

//     });
//   } else {
//     querySnapshotApellido.forEach((doc) => {
//       const usuario = doc.data();
//       if (usuario.tipo !== "ADMINISTRADOR") {

//         colaFiltrados.value.push(usuario);
//         // Haz algo con los datos del usuario encontrado

//       }
//     });
//   }
// }

// async function actualizarDatos() {
//   try {
//     const collectionRef = collection(db, 'administradores');
//     const querySnapshot = await getDocs(collectionRef);
//     const documentos = [];
//     querySnapshot.forEach((doc) => {
//       documentos.push(doc.data());
//     });
//     // Actualiza el modelo con los datos recuperados
//     model.value = documentos;
//     console.log("pase");
//   } catch (error) {
//     console.error('Error al recuperar los documentos:', error);
//   }
// }
onMounted(() => {
  dataQueryRoute()
  dataQuery()
  // const id = route.params.id;

})

</script>
<style scoped>
.btn {
  height: 10px;
  margin-top: 10px;
}

.no-ripple {
  background-color: #FFF;
  border: none;
  box-shadow: none;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  outline: none;
}
</style>
