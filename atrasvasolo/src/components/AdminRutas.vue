<template>
  <q-banner inline-actions class="text-white bg-red text-center mobile-only">
    {{ $t("nomovile") }}
  </q-banner>
  <div class="bg-dark q-mx-xl q-px-xl desktop-only">
    <div class="q-px-xl q-mx-xl q-py-lg">
      <q-toolbar bordered class="bg-accent text-white shadow-5 q-pa-sm rounded-borders">
        <q-icon name="post_add" color="primary" size="md"></q-icon>
        <q-toolbar-title>{{ $t("adminRutas.Arutas") }}</q-toolbar-title>
        <q-space></q-space>
        <q-btn icon="add" color="primary" class="q-ma-sm" to="/Administracion/Rutas/Agregar" no-caps>{{
          $t("adminRutas.nuevaR") }}</q-btn>
      </q-toolbar>

      <q-list bordered class="bg-accent">
        <q-card-section class="row flex-center">
          <q-input v-model="searchQuery" :label="$t('adminRutas.busca')" dense color="primary" bg-color="white" rounded
            outlined class="q-my-none col-md-6 col-8">
            <template v-slot:append>
              <q-icon name="search" color="primary"></q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-item v-for="ruta in filteredItems" :key="ruta._id" class="q-my-sm flex justify-center">

          <q-item-section avatar class="justify-star">
            <q-icon name="directions_bus" color="info" size="35px" />
          </q-item-section>
          <q-item-section class="text-white col-7">
            <q-item-label>{{ $t("adminRutas.ruta") }} {{ ruta.nombre }}</q-item-label>
            <q-item-label class="text-grey" caption lines="1">{{
              ruta.ciudad
            }}</q-item-label>

            <q-item-label>
              <q-btn :to="'/DetalleRuta/' + ruta._id" :label="$t('adminRutas.verR')" outline color="info" />
            </q-item-label>
          </q-item-section>

          <div class="self-center">
            <q-btn color="white" dense flat text-color="white" icon="more_vert">
              <q-menu>
                <q-list dense style="min-width: 100px">
                  <q-item clickable :to="'/Administracion/Rutas/Editar/' + ruta._id" v-close-popup>
                    <q-item-section>{{
                      $t("adminRutas.editar")
                    }}</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="verificarEliminar(ruta)">
                    <q-item-section @click="verificarEliminar(ruta)">{{
                      $t("adminRutas.eliminar")
                    }}</q-item-section>
                  </q-item>


                </q-list>

              </q-menu>
            </q-btn>

          </div>

        </q-item>

      </q-list>
    </div>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px; background-color: #272727;">
        <q-card-section>
          <div class="text-subtitle1 text-white">{{ $t("adminRutas.seguro") }} <span style="color:#ff5709;">{{
            rutaNombre }}</span> {{ $t("adminRutas.escribeid") }} <br><span style="color:#cdefdf;">{{ rutaId
  }}</span></div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense color="primary" bg-color="white" rounded outlined v-model="textId" autofocus
            @keyup.enter="prompt = false" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="white" flat :label="$t('adminRutas.cancelar')" v-close-popup />
          <q-btn color="negative" :label="$t('adminRutas.eliminar')" v-close-popup @click="deleteDoc(rutaId)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

import { api } from "../boot/axios";
import { defineComponent, ref, computed } from "vue";
import { useRouter } from 'vue-router';
import useQuasar from 'quasar/src/composables/use-quasar.js'
export default defineComponent({
  name: "AdminRutas",
  setup() {
    const $q = useQuasar()
    const searchQuery = ref("");
    const prompt = ref(false)
    const rutaId = ref("")
    const revRuta = ref("")
    const rutaNombre = ref("")
    const textId = ref("")
    function verificarEliminar(ruta) {
      rutaId.value = ruta._id
      rutaNombre.value = ruta.nombre
      revRuta.value = ruta._rev;
      prompt.value = true
    }
    const filteredItems = computed(() => {
      return rutas.value.filter((item) =>
        item.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });
    const router = useRouter();
    const rutas = ref([]);
    async function deleteDoc(id) {
      if (textId.value == id) {
        const url = `/atrasvasolo-rutas/${id}`
        api.delete(`${url}?rev=${revRuta.value}`).then(response => {
        console.log('Ruta eliminada de la base de datos:', response.data);
        $q.notify({
          message: 'La ruta se elimino exitosamente',
          color: 'positive'
          })
          router.go();
        }).catch(error => {
          console.log("Error al Eliminar:", error)
        })
      } else {
        $q.notify({
          message: 'El ID no fue escrito correctamente',
          color: 'negative'
        })
      }
    }
    return {
      rutas,
      searchQuery,
      filteredItems,
      deleteDoc,
      prompt,
      rutaId,
      rutaNombre,
      verificarEliminar,
      textId
    };
  },
  methods: {
    async loadData() {
      const response = await api.get("/atrasvasolo-rutas/_all_docs?include_docs=true");
      if (response.status === 200) {
        const rutas = response.data.rows
        for (const ruta of rutas) {
          this.rutas.push(ruta.doc);
        }
      } else {
        console.log("Error al obtener las paradas");
      }
    }
  },

  mounted() {
    this.loadData();
  },
});
</script>
