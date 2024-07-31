<template>
  <div class="row justify-center">
    <!--Nombre del sitio-->
    <div class="q-py-sm q-pr-sm col-md-4 col-xs-10 col-sm-5">
      <h6 class="q-my-md">{{ $t('agregarSitio.titulo') }}</h6>
      <q-input class="q-mt-sm" filled v-model="nombreSitio" :label="$t('agregarSitio.nombreSitiolabel')" />
    </div>

    <!--Selector de categoria-->
    <div class="q-py-sm col-md-3 col-xs-10 col-sm-3">
      <h6 class="q-my-md">{{ $t('agregarSitio.categoria') }}</h6>
      <q-select v-if="idioma === 'es'" class="q-mt-sm" :label="$t('agregarSitio.eligeCategoria')"
        transition-show="flip-up" transition-hide="flip-down" filled v-model="categoria"
        :options="categoriasSitio.dato" />
      <q-select v-else class="q-mt-sm" :label="$t('agregarSitio.eligeCategoria')" transition-show="flip-up"
        transition-hide="flip-down" filled v-model="category" :options="categoriasSitio.data" />
    </div>

    <div class="q-py-sm col-xs-0 col-sm-0">

    </div>
  </div>
</template>

<script>
export default {
  data() {
    var idioma = this.$i18n.locale;
    var categoriasSitio = {
      dato: [
        "Playas",
        "Ruinas",
        "Museos",
        "Balnearios",
        "Bosques",
        "Iglesias"
      ], data: [
        "Beach",
        "Ruins",
        "Museum",
        "Swimming pools",
        "Forests",
        "Churches"
      ]
    };
    return {
      idioma,
      nombreSitio: null,
      categoria: null,
      category: null,
      categoriasSitio
    };
  },
  methods: {
    // Métodos del componente aquí
    getNombreCategoria() {
      for (let index = 0; index < this.categoriasSitio.dato.length; index++) {
        if (this.categoriasSitio.data[index] === this.category || this.categoriasSitio.dato[index] === this.categoria) {
          this.categoria = this.categoriasSitio.dato[index];
          this.category = this.categoriasSitio.data[index];
          console.log(this.categoria);
          return { nombre: this.nombreSitio, categoria: this.categoria, category: this.category };

        }
      }
      return { nombre: null, categoria: null, category: null };
    },
    valida() {
      // Expresión regular para detectar espacios en blanco
      const regex = /^\s*$/;

      if (this.nombreSitio === null || this.nombreSitio === "" || regex.test(this.nombreSitio)) {
        return false;
      }
      if (this.categoria == null && this.category == null) {
        return false;
      }
      return true;
    },
    setD(datos) {
      this.nombreSitio = datos.centerName;
      for (let i = 0; i < this.categoriasSitio.dato.length; i++) {
        if (datos.category === this.categoriasSitio.dato[i]) {
          if (this.$i18n.locale === "es") {
            this.categoria = this.categoriasSitio.dato[i];
          } else {
            this.category = this.categoriasSitio.data[i];
          }
          this.idioma = this.$i18n.locale;
          i = this.categoriasSitio.dato.length + 1;
        }
      }
    }
  }
};

</script>

<style lang="scss"></style>
