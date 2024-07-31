<template>
  <q-layout view="lHh Lpr lFf" class="bg-dark">
    <AdminNavbar></AdminNavbar>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

import AdminNavbar from "src/components/AdminNavbar.vue"



export default defineComponent({
    name: "AdminLayout",
    components: {AdminNavbar },

    setup() {

    },

});
</script>
<style>

</style>
