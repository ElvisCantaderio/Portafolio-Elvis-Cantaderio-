<template>
  <q-layout view="hHh Lpr lFf" container class="body">
    <q-page-container>
      <q-page class="q-px-lg">
        <div class="text-center">
          <q-btn flat round dense @click="$router.go(-1)" style="position: absolute; top: 0px; left: 30px">
            <q-icon name="arrow_back" size="sm" color="primary" />
          </q-btn>
          <h4 class="favorites q-pl-lg">
            {{ $t('favoritos.misSitios') }}
            <q-icon name="favorite" color="primary" class="q-mb-xs q-ml-sm icon_favorite" />
          </h4>
        </div>
        <div class="cards-container">
          <InfoCard v-for="(favorite, index) in favorites" :key="index" :card="favorite" :is-favorite="true"
            @toggle-favorite="toggleFavorite" />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { useCardStore } from 'src/stores/CardStore';
import InfoCard from 'src/components/InfoCard.vue';

export default {
  components: {
    InfoCard
  },
  mounted() {
    const storedFavoriteCards = localStorage.getItem('favorite-cards');
    if (!storedFavoriteCards) {
      const cardStore = useCardStore();
      const cards = cardStore.approvedCards;
      const storedFavoritesId = localStorage.getItem('favorites');

      if (storedFavoritesId) {
        this.favoritesId = JSON.parse(storedFavoritesId);
      }
      this.favorites = cards.filter((card) => this.favoritesId.includes(card.id));
      localStorage.setItem('favorite-cards', JSON.stringify(this.favorites));
    } else {
      this.favorites = JSON.parse(storedFavoriteCards);
    }
  },
  data() {
    return {
      favoritesId: [],
      favorites: []
    }
  },
  methods: {
    toggleFavorite(cardId) {
      const find = this.favorites.find((card) => card.id === cardId);
      const favoriteIndex = this.favorites.indexOf(find);
      const idIndex = this.favoritesId.indexOf();
      this.favorites.splice(favoriteIndex, 1);
      this.favoritesId.splice(idIndex, 1);
      //Se actualizan los cambios en el localStorage
      localStorage.setItem('favorites', JSON.stringify(this.favoritesId));
      localStorage.setItem('favorite-cards', JSON.stringify(this.favorites));
    }
  },
  unmounted() {
    localStorage.removeItem('favorite-cards');
  }
}
</script>


<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Hind+Madurai:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap');


// Variables
$bg-body: #E8FFF4;
$bg-orange: #F27405;
$bg-yellow: #FFC107;
$bg-red: #ED1515;

$green-light: #03A678;
$green-medium: #02735E;
$green-dark: #014040;

$gray-1: #828282;
$gray-2: #969696;
$gray-3: #AFAFAF;
$gray-4: #CACACA;

$white: #FFFF;
$black: #000;

*,
*::before,
*::after {
  // margin: 0;
  // padding: 0;
  box-sizing: border-box;
}

.body {
  width: 100vw;
  height: 100vh;
  background-color: $bg-body;
  font-family: 'Hind Madurai', sans-serif;
  font-size: 12px;
  overflow-y: hidden;
}

.favorites {
  font-weight: 500;
  color: #014040;
}

@media screen and (max-width: 599px) {
  h4 {
    font-size: 22px;
  }

  .icon_favorite {
    font-size: 25px;
  }
}

@media screen and (min-width: 600px) {
  .icon_favorite {
    font-size: 32px;
  }
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

@media(min-width: $breakpoint-sm-max) {
  .cards-container {
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0 60px;
    gap: 20px;
  }

}
</style>
