<template>
  <DesktopHeader :showModeBTN="false" :mostrarLogin="false" :esAdmin="esAdmin" :showSignOff="showSignOff"
    class="gt-xs header-misitios" />
  <div class="column q-my-xl title-misSitios">
    <div class="col-10 text-center flex align-center flex-center">
      <q-btn class="arrow_back btn-position" flat round dense @click="$router.go(-1)">
        <q-icon name="arrow_back" color="primary" />
      </q-btn>
      <h4 class="h4-misSitios q-my-none">
        {{ $t('misSitios.misSitiosA') }}
        <q-icon name="preview" color="primary" class="q-mb-xs q-ml-sm icon_check mobile-hide" />
      </h4>
    </div>
  </div>
  <div class="row justify-center">
    <div class="col-11">
      <div style="text-decoration: none; color: black" v-for="card in cards" :key="card.id">
        <!--:to="`/validar_sitio/${card.id}`"-->
        <misSitiosCard class="q-my-md" :card="card" />
      </div>
      <div v-if="cards.length === 0" class="flex justify-center items-center border q-py-lg">
        <q-icon name="block" size="10vw" color="red" />
        <p class="advertencia-adm">{{ $t('misSitios.ningunSitio') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import misSitiosCard from 'src/components/misSitiosCard.vue';
import { useCardStore } from 'src/stores/CardStore';
import DesktopHeader from 'src/components/DesktopHeader.vue';

export default {
  name: 'MisSitios',
  components: {
    misSitiosCard,
    DesktopHeader,
  },
  methods: {
    cargarDatos() {
      const storedUser = localStorage.getItem('user'); // Obtenemos el usuario de localStorage
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
      this.cardStore = useCardStore();
      const cardsStore = this.cardStore;

      // Cargar los datos de las cards
      if (cardsStore.approvedCards.length) { // Si hay datos en el store
        for (let i = 0; i < this.cardStore.approvedCards.length; i++) {
          if (this.cardStore.approvedCards[i].email === this.user.email) {
            this.cards.push(this.cardStore.approvedCards[i]);
          }
        }
        for (let i = 0; i < this.cardStore.unapprovedCards.length; i++) {
          if (this.cardStore.unapprovedCards[i].email === this.user.email) {
            this.cards.push(this.cardStore.unapprovedCards[i]);
          }
        }
        // Guardar los datos en el local storage
        localStorage.setItem('cardsmisSitios', JSON.stringify(this.cards)); // Guardamos los datos en el local storage
      } else {  // Si no hay datos en el store
        this.cards = JSON.parse(localStorage.getItem('cardsmisSitios')); // Obtenemos los datos del local storage
      }

    }, esAdministrador() {
      if (localStorage.getItem('esAdmin') === 'false') {
        this.esAdmin = false;
      } else {
        this.esAdmin = true;
      }
    }
  },
  mounted() {
    this.esAdministrador();
    this.cargarDatos();
  },
  data() {
    return {
      showSignOff: false,
      cards: ref([]),
      esAdmin: ref(false),
    };
  },
  unmounted() {
    localStorage.removeItem('cardsmisSitios');
  },
};

</script>

<style lang="scss">
$white: #FFF;
$green-medium: #02735E;
$green-dark: #014040;
$gray-4: #CACACA;

.header-misitios {
  font-family: 'Hind Madurai', sans-serif;
}

.h4-misSitios {
  font-weight: 500;
  color: #014040;
  line-height: 1;
}

.btn-position {
  position: absolute;
  top: auto;
  left: 3%;
}

@media screen and (max-width: 599px) {

  .h4-misSitios {
    color: #014040;
    font-size: 22px;
  }

  .icon_check {
    font-size: 28px;
  }

  .arrow_back {
    font-size: 17px;
  }
}

@media screen and (max-width: 400px) {

  .h4-misSitios {
    font-weight: 400;
    color: #014040;
    font-size: 21px;
  }

  .arrow_back {
    font-size: 16px;
  }

  .icon_check {
    font-size: 23px;
  }
}

@media screen and (max-width: 350px) {

  .h4-misSitios {
    font-weight: 400;
    color: #014040;
    font-size: 19px;
  }

  .arrow_back {
    font-size: 14px;
  }

  .icon_check {
    font-size: 20px;
  }
}

@media screen and (min-width: 600px) {

  .h4-misSitios {
    font-weight: 400;
    color: #014040;
  }

  .icon_check {
    font-size: 34px;
  }

  .arrow_back {
    font-size: 20px;
  }

  .title-misSitios {
    margin-top: 40px;
  }

}
</style>
