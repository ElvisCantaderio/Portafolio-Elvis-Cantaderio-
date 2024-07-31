<template>
  <q-banner inline-actions class="text-white bg-red text-center mobile-only">
    {{ $t('nomovile') }}

  </q-banner>

  <div class="bg-dark q-py-lg q-px-xl q-mx-xl  desktop-only">
    <div>
      <q-card class="bg-dark">
        <q-tabs v-model="tab" dense class="text-grey q-mx-md bg-accent" active-color="white" indicator-color="primary"
          align="justify">
          <q-tab name="ruta" :label="$t('adminPubli.anuncioDetalleR')" />
          <q-tab name="parada" :label="$t('adminPubli.anuncioDetalleP')" />
        </q-tabs>

        <div class="q-card-content">
          <q-tab-panels v-model="tab" animated class="bg-dark">
            <q-tab-panel name="ruta" class="text-white" style="min-height: 80vh;">
              <div class="row justify-center q-mt-sm">
                <div style="width: 600px; max-width: 100%; height: 200px" class="q-px-xl q-mx-xl ">
                  <q-toolbar class="bg-accent text-white shadow-5  rounded-borders" style="z-index:3;">
                    <q-icon name="sell" size="30px" color="primary" dense flat />
                    <q-toolbar-title>{{ $t('adminPubli.publicidad') }}</q-toolbar-title>
                    <q-space></q-space>
                    <q-btn icon="add" color="primary" class="q-ma-sm" no-caps to="/Administracion/Publicidad/Agregar">{{
                      $t('adminPubli.nuevo') }}</q-btn>
                  </q-toolbar>
                  <q-card class="bg-accent ">


                    <div class=" q-px-sm q-py-md  flex justify-center">
                      <!--<anuncios-rutas></anuncios-rutas>-->
                      <anuncios-rutas-admin></anuncios-rutas-admin>
                      <!--Hasta acá termina los anuncios-->
                    </div>

                  </q-card>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="parada" class="text-white" style="min-height: 80vh;">
              <div class="row justify-center q-mt-sm">
                <div style="width: 600px; max-width: 100%; height: 200px" class="q-px-xl q-mx-xl ">
                  <q-toolbar class="bg-accent text-white shadow-5  rounded-borders" style="z-index:3;">
                    <q-icon name="sell" size="30px" color="primary" dense flat />
                    <q-toolbar-title>{{ $t('adminPubli.publicidad') }}</q-toolbar-title>
                    <q-space></q-space>
                    <q-btn icon="add" color="primary" class="q-ma-sm" no-caps to="/Administracion/Publicidad/Agregar">
                      {{ $t('adminPubli.nuevo') }}</q-btn>
                  </q-toolbar>
                  <q-card class="bg-accent ">


                    <div class=" q-px-sm q-py-md  flex justify-center">
                      <!--<anuncios-paradas></anuncios-paradas>-->
                      <anuncios-paradas-admin></anuncios-paradas-admin>

                    </div>

                  </q-card>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </q-card>
    </div>
  </div>
</template>


<script>
import { defineComponent, ref } from "vue";
//import AnunciosRutas from "src/components/AnunciosRutas.vue";
import AnunciosRutasAdmin from "src/components/AnunciosRutasAdmin.vue";
//import AnunciosParadas from "src/components/AnunciosParadas.vue";
import AnunciosParadasAdmin from "src/components/AnunciosParadasAdmin.vue";
import { doc, deleteDoc } from "firebase/firestore";
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../boot/firebase'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'


export default defineComponent({
  name: "AdminPublicidad",
  components: {},
  setup() {
    const quasar = useQuasar()
    const router = useRouter()

    return {
      tab: ref("ruta"),
      router,
      quasar

    };
  },
  components: { AnunciosRutasAdmin, AnunciosParadasAdmin }
});
</script>
<style>
body {
      overflow: hidden; /* Deshabilita el scroll de la página por defecto */
    }

.q-card-content {
  overflow-y: auto; /* Habilita el scroll vertical si es necesario */
}
</style>
