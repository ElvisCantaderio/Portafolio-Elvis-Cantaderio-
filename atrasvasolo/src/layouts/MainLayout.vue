<template>
  <q-layout view="lHh Lpr lFf">
    <MainNavbar :view="varView"></MainNavbar>
    <BottomNavbar @cambiar-view="cambiarView"></BottomNavbar>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

import BottomNavbar from "src/components/BottomNavbar.vue";
import MainNavbar from "src/components/MainNavbar.vue"
import { useCounterStore } from "stores/dataGlobal";
import { watch } from "vue";
const store = useCounterStore();


export default defineComponent({
  name: "MainLayout",
  components: { BottomNavbar, MainNavbar },

  setup(props, { emit }) {
    const varView = ref(store.view)

    function cambiarView(view) {
      varView.value = view
    }


    return {
      varView,
      cambiarView,
      store
    };
  }

});
</script>
<style></style>
