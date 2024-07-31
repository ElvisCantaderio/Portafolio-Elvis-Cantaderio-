<template>
  <div class="row q-pb-none">
    <div class="col-1">
      <q-btn size="15px" flat round color="white" icon="arrow_back" @click="retornar"/>
    </div>
    <div class="col-10 text-center text-white flex flex-center absolute-top-center q-my-md ">
      {{ $t('detalleR') }}
    </div>
  </div>

  <DetalleRuta></DetalleRuta>
</template>

<script>

import DetalleRuta from "src/components/DetalleRuta.vue";
import { defineComponent } from "vue";

import { ref } from "firebase/storage";

export default defineComponent({
  name: "DetalleRutaPage",
  components: { DetalleRuta },
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
<style>
body {
  background-color: #303030;
}
</style>

