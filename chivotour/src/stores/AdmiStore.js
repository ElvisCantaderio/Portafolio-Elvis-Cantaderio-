import { defineStore } from "pinia";
import { ref } from "vue";
import { Nadministradores } from "src/boot/pouchdb.js";

export const useAdmiStore = defineStore('adminis', () => {
  const adminis = ref([]);

  async function fetchAdminis() {
    try {
      const result = await Nadministradores.allDocs({ include_docs: true });
      const rows = result.rows;

      adminis.value = [];

      rows.forEach(row => {
        adminis.value.push({
          email: row.doc.email
        });
      });
    } catch (error) {
      console.error("Error al obtener administradores:", error);
    }
  }

  return {
    adminis,
    fetchAdminis
  };
});


