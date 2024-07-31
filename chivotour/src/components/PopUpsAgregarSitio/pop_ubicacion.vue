<template>
  <div class="q-gutter-sm">
    <q-btn @click="showPopup = true" class="text-capitalize q-pr-xs" color="orange" icon-right="chevron_right">
      {{ $t('agregarSitio.guiaBoton') }}
    </q-btn>
    <q-dialog v-model="showPopup">
      <q-card>
        <q-card-section>
          <div class="text-h6"> {{ $t('agregarSitio.guia') }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ $t('agregarSitio.infoUbicacion1') }} <br>
          {{ $t('agregarSitio.infoUbicacion2') }}
          {{ $t('agregarSitio.infoUbicacion3') }} <br>
          {{ $t('agregarSitio.infoUbicacion4') }}
          {{ $t('agregarSitio.infoUbicacion5') }}<br>
          {{ $t('agregarSitio.infoUbicacion6') }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPopup: false
    };
  }
};
</script>

<style lang="scss">
.my-button {
  padding: 0;
  /* Elimina el espacio interior del botón */
  /* Ajusta el ancho del botón según el tamaño del icono */
}

.my-icon {
  height: 100%;
}
</style>
