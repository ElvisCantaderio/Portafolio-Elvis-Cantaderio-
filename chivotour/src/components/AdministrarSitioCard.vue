<template>
  <div class="row border q-pa-sm adm-site-preview">
    <div class="col-3 col-md-2 item-center flex">
      <q-img :ratio="1" :src="url + card.photos[0] + '/imagen'" class="q--img-size" />
    </div>
    <div class="col-9 col-md-7">
      <div class="adm-description">
        <p><span>{{ $t('administrarSitio.nombre') }}:</span> {{ card.centerName }}</p>
        <p><span>{{ $t('administrarSitio.categoria') }}:</span> {{ $t('validarSitio.categoria.' + card.category) }}</p>

        <div v-if="'es' === $i18n.locale">
          <p class="site-description"><span>{{ $t('administrarSitio.descripcion') }}: </span>{{ card.descripcion }}</p>
        </div>
        <div v-else>
          <div v-if="card.description === ''">
            <p class="site-description"><span>{{ $t('administrarSitio.descripcion') }}: </span> NEED TRADUCTION</p>
          </div>
          <div v-else>
            <p class="site-description"><span>{{ $t('administrarSitio.descripcion') }}: </span>{{ card.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-3">
      <div class="adm-by q-ml-md">
        <p><span>{{ $t('administrarSitio.fecha') }}: {{ card.createdBy.fecha }}</span></p>
        <p><span>{{ $t('administrarSitio.publicadoPor') }}:</span> {{ card.createdBy.usuario }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { url } from 'src/boot/pouchdb';

const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
});


</script>

<style lang="scss">
h1 {
  text-align: center;
  font-weight: 400;
}

.border {
  border: solid 3px $primary;
  border-radius: 8px;
}

.adm-description {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-evenly;
  margin-inline: 15px;
}

.adm-description span,
.adm-by span {
  font-weight: 600;
}

.adm-site-preview p {
  font-size: clamp(10px, 1.75vw, 16px);
  padding-bottom: 1px;
}

.site-description {
  max-height: 70px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}


@media screen and (max-width: 1024px) {
  .adm-by {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }
}

@media screen and (min-width: 1024px) {
  .adm-by {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%
  }
}

@media screen and (max-width: 599px) {
  .site-description {
    max-height: 40px;
    overflow: hidden;
  }
}
</style>
