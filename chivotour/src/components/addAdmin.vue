<template>
  <q-btn :label="$t('administrarSitio.agregarAdministrador')" color="orange" @click="prompt = true" />
  <q-dialog v-model="prompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">{{ $t('administrarSitio.agregarAdministrador') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="nombre" autofocus @keyup.enter="prompt = false"
          :label="$t('administrarSitio.nombreAdmin')" />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input dense v-model="correo" type="email" autofocus @keyup.enter="prompt = false"
          :label="$t('administrarSitio.correoAdmin')" />
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="mensaje">
        <p>{{ $t('administrarSitio.existe') }}</p>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat :label="$t('administrarSitio.cancelar')" v-close-popup @click="clean" />
        <q-btn v-if="!mensaje && nombre !== '' && correo !== ''" flat :label="$t('administrarSitio.agregar')"
          v-close-popup @click="submitForm()" />
        <q-btn v-if="mensaje" flat :label="$t('administrarSitio.agregar')" @click="submitForm()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { Nadministradores } from "src/boot/pouchdb.js";

export default {
  data() {
    return {
      prompt: false,
      nombre: "",
      correo: "",
      administradores: [],
      existe: false,
      mensaje: false
    };
  },
  async created() {
    await this.getData();
  },
  methods: {
    async getData() {
      try {
        const allDocs = await Nadministradores.allDocs({ include_docs: true });
        this.administradores = allDocs.rows.map(row => row.doc.email);
      } catch (error) {
        console.error("Error al obtener administradores:", error);
      }
    },
    async pullAdmin() {
      const dataAdmin = {
        email: this.correo,
        nombre: this.nombre
      };

      try {
        await Nadministradores.post(dataAdmin);
      } catch (error) {
        console.error("Error al agregar el administrador:", error);
      }
      this.correo = "";
      this.nombre = "";
    },
    async adminExits() {
      this.existe = false;
      this.mensaje = false;
      this.correo = this.correo.toLowerCase();
      const allDocs = await Nadministradores.allDocs({ include_docs: true });

      allDocs.rows.forEach(row => {
        if (row.doc.email === this.correo) {
          this.existe = true;
          this.mensaje = true;
        }
      });

      if (!this.existe) {
        this.pullAdmin();
      }
    },
    submitForm() {
      if (this.nombre.trim() !== "" && this.correo.trim() !== "") {
        this.adminExits();
      }
    },
    clean() {
      this.correo = "";
      this.nombre = "";
    }
  }
};
</script>
