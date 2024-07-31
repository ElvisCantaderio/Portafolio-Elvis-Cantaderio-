<template>
  <div class="bg-dark fullscreen">
    <div class="row q-pb-none">
      <div class="col-1">
        <q-btn size="15px" flat round color="white" icon="arrow_back" @click="retornar" />
      </div>
      <div class="col-10 text-center text-white flex flex-center absolute-top-center q-my-md ">
        {{ $t('detalleP') }}
      </div>
    </div>
    <q-scroll-area style="height: 100vh">

      <DetalleParada></DetalleParada>
    </q-scroll-area>
  </div>
</template>

<script>
import DetalleParada from "src/components/DetalleParada.vue";

import { defineComponent } from "vue";

export default defineComponent({
  // name: "DetalleRutaPage",
  valorAEnviar: "Pollo Campero",
  components: {

    DetalleParada,
  },
  setup() {
    function retornar(){
      history.back()
    }
    return {
      retornar
    }
  }

});
</script>
