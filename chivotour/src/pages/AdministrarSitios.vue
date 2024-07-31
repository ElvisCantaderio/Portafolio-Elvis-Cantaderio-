<template>
  <div v-if="esAdmin === true">
    <DesktopHeaderAdmin :esAdmin="esAdmin" class="gt-xs header-adm"></DesktopHeaderAdmin>
    <div class="column fit-content">
      <div class="row flex-center">
        <q-btn @click="navigateToMainPage" icon="arrow_back" outline color="primary" class=""
          style="position: absolute; top: auto; left: 2%;" />
        <h1 class="h1-adm">
          {{ $t('administrarSitio.titulo') }}
        </h1>
      </div>
      <div class="col-10">
        <div class="row items-center justify-center q-mt-xs">
          <div class="col-6 col-md-7 q-mr-sm">
            <q-input outlined v-model="searchUser" :label="$t('administrarSitio.buscar')" dense />
          </div>
          <div class="col-4 col-md-3 flex items-center justify-center">
            <q-btn class="q-mx-sm" padding="sm" icon="filter_alt" color="primary" outline @click="filtrarUsuarios" />
            <q-btn padding="sm" icon="backspace" color="primary" outline @click="limpiarFiltros" />
          </div>
        </div>
      </div>
      <div>
        <div class="row justify-center q-my-md">
          <button class="btn-adm" :class="{ 'btn-adm-selected': selectedButton === 'sitiosPorValidar' }"
            @click="haySitiosAgregados('sitiosPorValidar')">
            {{ $t("administrarSitio.sitiosPV") }} - {{ sitesToValidateQuantity }}
          </button>
          <button class="btn-adm" :class="{ 'btn-adm-selected': selectedButton === 'sitiosAgregados' }"
            @click="haySitiosAgregados('sitiosAgregados')">
            {{ $t("administrarSitio.sitiosA") }} - {{ addedSitesQuantity }}
          </button>
        </div>
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-11 q-py-lg">
        <router-link style="text-decoration: none; color: black" v-for="card in cards" :key="card.id"
          :to="`/validar_sitio/${card.id}`">
          <AdministrarSitioCard class="q-my-md" :card="card" />
        </router-link>
        <div class="flex justify-center items-center border q-py-lg" v-if="cardsSegunFiltro.length === 0">
          <q-icon name="block" size="10vw" color="red" />
          <p v-if="selectedButton === 'sitiosPorValidar'" class="advertencia-adm">
            {{ $t("administrarSitio.noHaySitiosPorValidar") }}
          </p>
          <p v-if="selectedButton === 'sitiosAgregados'" class="advertencia-adm">
            {{ $t("administrarSitio.noHaySitiosAgregados") }}
          </p>
        </div>
        <div class="flex justify-center items-center border q-py-lg" v-if="cardsSegunFiltro.length > 0 &&
          searchUser.length > 0 &&
          cards.length === 0
          ">
          <q-icon name="zoom_out" size="10vw" color="red" />
          <p class="advertencia-adm">
            {{ $t("administrarSitio.noHayUsuarioONombreSitio") }}:
            {{ searchedUser }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <error />
  </div>
</template>

<script>
import { ref, onMounted, watchEffect } from 'vue';
import AdministrarSitioCard from 'src/components/AdministrarSitioCard.vue';
import DesktopHeaderAdmin from 'src/components/DesktopHeaderAdmin.vue';
import { useRouter } from 'vue-router';
import { useCardStore } from 'src/stores/CardStore';
import error from 'src/pages/ErrorNotFound.vue';

export default {
  components: {
    AdministrarSitioCard,
    DesktopHeaderAdmin,
    error
  },
  /*
  beforeRouteEnter(to, from, next) {
    if (localStorage.getItem("reloaded")) {
      localStorage.removeItem("reloaded");
    } else {
      localStorage.setItem("reloaded", "1");
      location.reload();
    }
    next();
  },
  */

  setup() {
    const searchUser = ref("");
    const cards = ref([]);
    const unapprovedCards = ref([]);
    const approvedCards = ref([]);
    const cardsSegunFiltro = ref([]);
    const selectedButton = ref(null);
    const searchedUser = ref("");
    const esAdmin = ref(false);
    const addedSitesQuantity = ref(0);
    const sitesToValidateQuantity = ref(0);
    const router = useRouter();
    const cardStore = ref(null);

    const esAdministrador = () => {
      esAdmin.value = localStorage.getItem("esAdmin") === "true";
    };

    const navigateToMainPage = () => {
      router.push("/");
    };

    const haySitiosAgregados = (button) => {
      searchUser.value = "";
      selectedButton.value = button;
      const estado = selectedButton.value === "sitiosAgregados";
      filtrarPorApproved(estado);
    };

    const filtrarPorApproved = (estado) => {
      cardsSegunFiltro.value = estado
        ? approvedCards.value
        : unapprovedCards.value;
      cards.value = cardsSegunFiltro.value;
      if (!estado) {
        sitesToValidateQuantity.value = cards.value.length;
      } else {
        addedSitesQuantity.value = cards.value.length;
      }
    };

    const obtenerSitiosTuristicos = () => {
      unapprovedCards.value = cardStore.value.unapprovedCards;
      approvedCards.value = cardStore.value.approvedCards;
      haySitiosAgregados("sitiosAgregados");
      haySitiosAgregados("sitiosPorValidar");
      // console.log(unapprovedCards.value);
    };

    const filtrarUsuarios = () => {
      if (searchUser.value.trim().length > 0) {
        searchedUser.value = searchUser.value.trim().toLowerCase();
        cards.value = cardsSegunFiltro.value.filter(
          (card) =>
            card.createdBy.usuario.toLowerCase().includes(searchedUser.value) ||
            card.centerName.toLowerCase().includes(searchedUser.value)
        );
      } else {
        cards.value = cardsSegunFiltro.value;
      }
    };

    const limpiarFiltros = () => {
      haySitiosAgregados(selectedButton.value);
      searchUser.value = "";
    };

    const actualizarCards = () => {
      new Promise((resolve) => {
        cardStore.value = useCardStore();
        resolve();
      }).then(() => {
        obtenerSitiosTuristicos();
        // console.log('OnMounted');
      });
    };

    onMounted(() => {
      esAdministrador();
      actualizarCards();
    });

    watchEffect(() => {
      sitesToValidateQuantity.value = unapprovedCards.value.length;
      addedSitesQuantity.value = approvedCards.value.length;
    });

    return {
      searchUser,
      cards,
      cardStore,
      unapprovedCards,
      approvedCards,
      cardsSegunFiltro,
      selectedButton,
      searchedUser,
      esAdmin,
      addedSitesQuantity,
      sitesToValidateQuantity,
      router,
      esAdministrador,
      navigateToMainPage,
      haySitiosAgregados,
      filtrarPorApproved,
      obtenerSitiosTuristicos,
      filtrarUsuarios,
      limpiarFiltros,
      actualizarCards,
    };
  },
};
</script>

<style lang="scss">
$white: #fff;
$green-medium: #02735e;
$green-dark: #014040;
$gray-4: #cacaca;

.border {
  border: solid 3px $primary;
  border-radius: 8px;
}

.advertencia-adm {
  font-size: clamp(12px, 2vw, 25px);
  margin-bottom: 0px;
  margin-left: 10px;
}

.router-link {
  text-decoration: none;
  color: black;
}

.justify-evenly {
  justify-content: space-evenly;
}

.h1-adm {
  font-size: clamp(19px, 3vw, 32px);
  font-weight: 400;
  color: #014040;
}

.header-adm {
  font-family: 'Hind Madurai', sans-serif;
}

.btn-adm {
  font-size: clamp(11px, 2vw, 15px) !important;
  text-transform: uppercase;
  border: 1px solid $green-dark;
  background-color: $white;
  color: $green-dark;
  margin-inline: 5px;
  padding: 10px 15px;
  border-radius: 4px;
  font-weight: 500;
}

.h-fit-content {
  height: fit-content;
}

.btn-adm-selected {
  background: $green-dark !important;
  border: 1px solid $green-medium !important;
  color: $white !important;
}

.btn-adm:hover {
  cursor: pointer;
  background: $gray-4;
}

.btn-adm-selected {
  background-color: $green-dark;
  color: $white;
}
</style>
