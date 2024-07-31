<template>
  <div v-if="this.esAdmin === true">
    <DesktopHeader :showModeBTN="false" :mostrarLogin="false" :esAdmin="esAdmin" :showSignOff="showSignOff"
      class="gt-xs header-users" />
    <div class="column fit-content">
      <div class="col-10 flex flex-center">
        <q-btn flat round dense @click="$router.go(-1)" style="position: absolute; top: 110px; left: 30px">
          <q-icon name="arrow_back" size="sm" color="primary" class="gt-xs" />
        </q-btn>
        <h2 class="h1-adm q-mx-xl">{{ $t('users.administracionUsuarios') }}
          <q-btn class="arrow_back q-mb-xs" style="position: absolute; top: 28px; left: 10px" flat round dense
            @click="$router.go(-1)">
            <q-icon name="arrow_back" color="primary" />
          </q-btn>
        </h2>
      </div>
      <div class="col-12 col-xs-10">
        <div class="row items-center justify-center q-mt-xs">
          <div class="col-9 col-sm-7 col-md-5 text-center">
            <addAdmin></addAdmin>
            <!-- Campo de búsqueda -->
            <q-input outlined v-model="search" :label="$t('users.Buscar')" @keyup="filterUsers" class="q-pa-md" />
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-center q-ml-md q-mb-xl">
      <div class="qtable-container">
        <q-table :rows="filteredUsers" row-key="id" :columns="computedColumns" class="columnas">
          <template v-slot:body="props">
            <!-- Muestra las columnas con la información de los usuarios -->
            <q-tr :props="props">
              <q-td key="email" style="font-weight: bold; color: #333;" :props="props">{{ props.row.email }}</q-td>
              <q-td key="email" style="font-weight: bold; color: #333;" :props="props">{{ props.row.nombre }}</q-td>
              <q-td key="email" style="font-weight: bold; color: #0e741f;" :props="props">{{ props.row.role }}</q-td>
              <q-td>
                <q-btn @click="prompt1 = true; userToDeleteId = props.row.id" color="negative" icon="person_remove"
                  size="sm" class="q-py-sm" rounded></q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-dialog v-model="prompt1" persistent style="font-size: 15px;">
          <q-card style="min-width: 350px">
            <q-card-section class="">
              <span>{{ $t('users.advertencia') }}</span>
            </q-card-section>
            <q-card-actions align="right" class="text-primary">
              <q-btn flat :label="$t('users.Cancelar')" v-close-popup color="negative" class="text-capitalize" />
              <q-btn flat :label="$t('users.Eliminar')" v-close-popup @click="eliminar(userToDeleteId)" color="positive"
                class="text-capitalize" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
  <div v-else>
    <error />
  </div>
</template>

<script>
import DesktopHeader from 'src/components/DesktopHeader.vue';
import addAdmin from 'src/components/addAdmin.vue';
import { Nusuarios } from "../boot/pouchdb.js";
import error from 'src/pages/ErrorNotFound.vue';

export default {
  components: {
    DesktopHeader,
    addAdmin,
    error
  },
  data() {
    return {

      search: '',
      products: [],
      filteredUsers: [],
      esAdmin: false,
      showSignOff: false,
      prompt1: false,

      userToDeleteId: null,
    };

  },
  watch: {
    '$i18n.locale': function () {
      this.roles = {
        'Administrador': this.$t('users.Administrador'),
        'Usuario': this.$t('users.Usuario')
      };
      this.updateUserRoles();
    }
  },
  computed: {
    computedColumns() {
      return [
        { name: 'email', required: true, label: this.$t('users.Email'), align: 'left', field: 'email', sortable: true },
        { name: 'displayName', required: true, label: this.$t('users.Nombre'), align: 'left', field: 'displayName', sortable: true },
        { name: 'role', required: true, label: this.$t('users.Rol'), align: 'left', field: 'role', sortable: true },
        { name: 'delete', required: true, label: this.$t('users.Eliminar'), align: 'left', field: 'delete', sortable: true }
      ];
    }
  },
  methods: {
    async eliminar(id) {
      try {
        const doc = await Nusuarios.get(id);
        await Nusuarios.remove(doc);
        //console.log("Usuario eliminado correctamente.");
        this.actualizarListaUsuarios();
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    },
    esAdministrador() {
      if (localStorage.getItem('esAdmin') === null) {
        this.esAdmin = false;
      } else {
        if (localStorage.getItem('esAdmin') === 'false') {
          this.esAdmin = false;
        } else {
          this.esAdmin = true;
        }
      }
    },
    async actualizarListaUsuarios() {
      // Limpia la lista de usuarios y obtiene los datos actualizados de la base de datos
      this.products = [];
      try {
        const allDocs = await Nusuarios.allDocs({ include_docs: true });
        allDocs.rows.forEach((row) => {
          const { email, nombre, _id } = row.doc;
          this.products.push({ email, nombre, id: _id });
        });
        this.filteredUsers = this.products;
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    },
    filterUsers() {
      // console.log("filterUsers is called", this.search);
      // console.log("Current search value", this.search);

      if (this.search) {
        this.filteredUsers = this.products.filter(user =>
          user.nombre.toLowerCase().includes(this.search.toLowerCase()) ||
          user.email.toLowerCase().includes(this.search.toLowerCase()) ||
          user.role.toLowerCase().includes(this.search.toLowerCase())
        );
        // console.log("Filtered users", this.filteredUsers);
      } else {
        this.filteredUsers = this.products;
      }
    },
    updateUserRoles() {
      this.products.forEach(user => {
        user.role = user.email.endsWith('@ues.edu.sv') ?
          this.$t('users.Administrador') :
          this.$t('users.Usuario');
      });
    }



  },
  async created() {
    this.esAdministrador();
    await this.actualizarListaUsuarios();
    this.filterUsers();
    this.updateUserRoles();
  },
};
</script>


<style>
.qtable-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.columnas {

  width: 300%;
  /* Ajusta el ancho según tus necesidades */
}

.h1-adm {
  font-size: clamp(19px, 3vw, 32px);
  color: #014040;
  font-weight: 400;
}

.header-users {
  font-family: 'Hind Madurai', sans-serif;
}

.h-fit-content {
  height: fit-content;
}

.q-table {
  th {
    font-size: 14px;
  }

  tbody td {
    font-size: 14px;
  }
}
</style>
