<template>
  <!--Selector departamento-->
  <div class="row justify-center ">
    <div class="q-py-xs q-pr-sm col-md-7 col-xs-10 col-sm-8">
      <h6 class="q-my-md">{{ $t('agregarSitio.departamento') }}</h6>
      <q-select class="q-mt-sm" filled v-model="departamento" use-input input-debounce="0"
        :label="$t('agregarSitio.elige')" :options="deps" style="width: 250px" behavior="menu">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Departamento no valido
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>

  <!--Apartado descripcion-->

  <div v-if="'es' === $i18n.locale">
    <div class="row d-flex justify-center items-center">
      <div class="col-md-7 col-sm-8 col-xs-10">
        <h6 class="q-my-md">{{ $t('agregarSitio.descripcion') }}</h6>
        <q-input type="textarea" v-model="descripcion" filled :label="$t('agregarSitio.max')" :rules="[
          (val) =>
            val.length <= 2200 ||
            'Recuerda usar un máximo de 2,200 caracteres',
        ]" />
      </div>
    </div>
    <div class="row d-flex justify-center items-center">
      <div class="col-md-7 col-sm-8 col-xs-10">
        <p class="q-my-md">Descripción (opcional - Ingles):</p>
        <q-input type="textarea" v-model="description" filled :label="$t('agregarSitio.max')" :rules="[
          (val) =>
            val.length <= 2200 ||
            'Recuerda usar un máximo de 2,200 caracteres',
        ]" />
      </div>
    </div>
  </div>
  <div v-else>
    <div class="row d-flex justify-center items-center">
      <div class="col-md-7 col-sm-8 col-xs-10">
        <h6 class="q-my-md">{{ $t('agregarSitio.descripcion') }}</h6>
        <q-input type="textarea" v-model="description" filled :label="$t('agregarSitio.max')" :rules="[
          (val) =>
            val.length <= 2200 ||
            'Recuerda usar un máximo de 2,200 caracteres',
        ]" />
      </div>
    </div>
    <div class="row d-flex justify-center items-center">
      <div class="col-md-7 col-sm-8 col-xs-10">
        <p class="q-my-md">Description (optional - Spanish):</p>
        <q-input type="textarea" v-model="descripcion" filled :label="$t('agregarSitio.max')" :rules="[
          (val) =>
            val.length <= 2200 ||
            'Recuerda usar un máximo de 2,200 caracteres',
        ]" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var deps = [
      "Ahuachapán",
      "Cabañas",
      "Chalatenango",
      "Cuscatlán",
      "La Libertad",
      "Morazán",
      "La Paz",
      "Santa Ana",
      "San Miguel",
      "San Salvador",
      "San Vicente",
      "Sonsonate",
      "Usulután",
      "La Unión"
    ];
    return {
      descripcion: "",
      description: "",
      departamento: null,
      deps
    };
  },
  methods: {
    // Métodos del componente aquí
    getDescripcionDepartamento() {
      return { descripcion: this.descripcion, departamento: this.departamento, description: this.description };
    },
    valida() {
      // Expresión regular para detectar espacios en blanco
      const regex = /^\s*$/;
      if ('es' === this.$i18n.locale) {
        if (this.descripcion === null || this.descripcion === "" || regex.test(this.descripcion)) {
          return false;
        }
        if (this.departamento == null) {
          return false;
        }
      } else {
        if (this.description === null || this.description === "" || regex.test(this.description)) {
          return false;
        }
        if (this.departamento == null) {
          return false;
        }
      }
      return true;
    },
    setD(dato) {
      this.descripcion = dato.descripcion;
      this.description = dato.description;
      this.departamento = dato.department;
    }
  }
};

</script>

<style lang="scss"></style>
