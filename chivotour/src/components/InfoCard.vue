<template>
  <div class="card">
    <div class="card__top q-mb-sm">
      <div>
        <!-- Parte superior de la carta -->
        <div class="flex">
          <div class="company_thumbnail q-mr-sm">
            <img ref="thumbnail" />
          </div>
          <div>
            <div class="flex">
              <p class="q-mr-sm text-weight-bold centerName">
                {{ card.centerName }}
              </p>
              <p class="text-green-light text-weight-bold" v-if="card.distance">
                {{ card.distance }} Km
              </p>
            </div>
            <div class="flex" style="margin-top: -10px">
              <p class="q-mr-sm flex align-center text-gray-light">
                <q-icon name="fa-solid fa-location-dot" class="q-mr-xs" />
                {{ card.department }}
              </p>
              <p class="flex align-center text-gray-light">
                <q-icon name="fa-solid fa-star" class="q-mr-xs" />
                {{ card.rankingAverage }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <!-- <q-icon name="fa-regular fa-heart" style="font-size: 18px; color: #828282;" /> -->
        <label class="heart-container" @click="toggleFavorite($event)" :class="{ active: isFavorite }">
          <input type="checkbox" class="heart-container__checkbox" />
          <svg id="Layer_1" version="1.0" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink">
            <path
              d="M16.4,4C14.6,4,13,4.9,12,6.3C11,4.9,9.4,4,7.6,4C4.5,4,2,6.5,2,9.6C2,14,12,22,12,22s10-8,10-12.4C22,6.5,19.5,4,16.4,4z">
            </path>
          </svg>
        </label>
        <!--Alerta si se desea agregar Favoritos-->
        <q-dialog v-model="dialogFavorites">
          <q-card>
            <q-card-section class="text-h6">{{ $t("index.modalAñadirFavoritos") }}
              <q-icon name="info" size="sm" class="q-mx-sm q-mb-xs" color="orange" />
            </q-card-section>
            <p class="q-mx-md">{{ $t("index.modalAñadirFavoritosDos") }}</p>
            <q-card-actions align="right">
              <q-btn rounded color="orange" label="Ok" @click="dialogFavorites = false" class="text-capitalize" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
      <!--Fin de la parte superior de la carta -->
    </div>
    <div class="card__main">
      <!-- Contenido principal de la carta -->
      <!-- Titulo del sitio -->
      <div class="flex justify-between q-mb-sm">
        <p class="text-weight-bold centerName" style="font-size: 14px; margin: 0">
          {{ card.centerName }}
        </p>
        <div class="text-weight-bold" :style="card.open ? 'color: #03A678;' : 'color: red;'">
          <q-icon name="fa-regular fa-clock" />
          {{ card.open ? $t("index.abierto") : $t("index.cerrado") }}
        </div>
      </div>
      <!-- Descripcion del sitio -->
      <div class="card__main--description q-mb-sm truncate-text">
        <div v-if="'es' === $i18n.locale">
          <p>{{ card.descripcion }}</p>
        </div>
        <div v-else>
          <p>{{ card.description }}</p>
        </div>
      </div>
      <!-- Imagen del sitio -->
      <div class="card__main--img q-mb-md">
        <img ref="photo" />
      </div>
      <!-- Botones de accion -->
      <div class="flex justify-between">
        <q-btn v-if="card.location.url" class="btn btn-location text-capitalize" :href="card.location.url"
          target="_blank">
          <q-icon name="fa-solid fa-location-dot" class="q-mr-xs" size="xs" />
          {{ $t("index.ubicacion") }}
        </q-btn>
        <q-btn v-else class="btn btn-location text-capitalize" :href="'https://www.google.com/maps?q=' +
          card.latitude +
          ',' +
          card.longitude
          " target="_blank">
          <q-icon name="fa-solid fa-location-dot" class="q-mr-xs" size="xs" />
          {{ $t("index.ubicacion") }}
        </q-btn>
        <q-btn class="btn btn-details text-capitalize" :to="`/about/${this.card.id}`">
          <q-icon name="fa-solid fa-arrow-right" class="q-mr-sm" size="xs" />
          {{ $t('index.detalles') }}
        </q-btn>
        <!--<q-btn class="btn btn-details text-capitalize" :href="`/about/${this.card.id}`">
          <q-icon name="fa-solid fa-arrow-right" class="q-mr-sm" size="xs" />
          {{ $t("index.detalles") }}
        </q-btn>-->
      </div>
    </div>
    <!-- Fin del contenido principal de la carta -->
  </div>
</template>
<script>
import { sitios, url } from "src/boot/pouchdb";
export default {
  mounted() {
    this.updateImage();
    //Calcula la puntuacion promedio de cada sitio
    // if (this.card.ranking && this.card.ranking.length > 0) {
    //   let totalRanking = 0;
    //   this.card.ranking.forEach((ranking) => (totalRanking += ranking.value));
    //   this.averageRanking = Math.floor(totalRanking / this.card.ranking.length);
    // }
  },

  props: {
    card: {
      type: Object,
      required: true,
    },
    isFavorite: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    card: {
      handler: "updateImage",
      deep: true,
    },
  },
  methods: {
    toggleFavorite(e) {
      e.preventDefault();
      const cardId = this.card.id;
      this.$emit("toggle-favorite", cardId);
    }
    ,
    updateImage() {
      sitios
        .get(this.card.id)
        .then((sitio) => {
          const thumbnail = this.$refs.thumbnail;
          const image = this.$refs.photo;
          if (thumbnail && image) {
            const url1 = url + sitio.photos[0] + "/imagen";
            image.setAttribute("src", url1);
            thumbnail.setAttribute("src", url1);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },
  data() {
    return {
      dialogFavorites: false,
      latitude: null,
      longitude: null,
      distance: null,
      averageRanking: 0,
    };
  },
};
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Hind+Madurai:wght@400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap");

// Variables
$bg-body: #e8fff4;
$bg-orange: #f27405;
$bg-yellow: #ffc107;
$bg-red: #ed1515;

$green-light: #03a678;
$green-medium: #02735e;
$green-dark: #014040;

$gray-1: #828282;
$gray-2: #969696;
$gray-3: #afafaf;
$gray-4: #cacaca;

$white: #ffff;
$black: #000;

.btn {
  font-size: 15px;
  width: 49%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;

  &-location {
    color: $white;
    background-color: $bg-orange;
  }

  &-details {
    color: $gray-1;
    border: 2px solid $gray-1;
  }
}

// Limitar la descripción del sitio turístico a 3 lineas.
.truncate-text {
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}

/*.ellipsis {
  background-color: rgb(255, 0, 0);
}
*/

.centerName {
  width: 120px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

// Carta
.card {
  width: 100%;
  height: 410px;
  background-color: $white;
  box-shadow: 0 5px 10px rgba($black, 0.25);
  padding: 20px;
  margin-bottom: 20px;

  &__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: 1px solid $gray-4;
  }

  &__main {
    &--description {
      max-height: 60px;
      overflow-y: hidden;
      font-family: "Lora", sans-serif;
    }

    &--img {
      width: 100%;
      height: 150px;
      background-color: $gray-1;

      & img {
        width: 100%;
        height: 150px;
      }
    }
  }
}

@media (min-width: $breakpoint-sm-max) {
  .card {
    max-width: 320px;
  }
}

.company_thumbnail {
  width: 40px;
  height: 40px;
  background-color: $bg-orange;
  border-radius: 50%;

  & img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}

.heart-container {
  display: block;
  position: relative;
  cursor: pointer;
  user-select: none;
  border-bottom: none !important;

  &__checkbox {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  & svg {
    position: relative;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    transition: all 0.3s;
    fill: #666;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.active svg {
  fill: #e3474f;
}
</style>
