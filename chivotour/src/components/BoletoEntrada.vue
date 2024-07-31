<template>
  <!-- Aparatado para agregar precio de entrada y tipo de entrada-->
  <div class="row justify-center items-center">

    <div class="col-md-7 col-sm-8 col-xs-10">
      <h6 class="q-my-md">{{ $t('agregarSitio.costoDeEntrada') }}</h6>
    </div>
    <div class="row col-md-7 col-sm-8 col-xs-10 q-py-sm">
      <!--Precio entrada-->
      <q-input filled v-model="valorEntrada" :label="$t('agregarSitio.costoDeEntrada')" mask="#.##" fill-mask="0"
        reverse-fill-mask prefix="$" input-class="text-right" class="col-md-6 col-sm-6 col-xs-12 q-pa-sm" />

      <!--Tipos de entrada-->
      <q-select v-if="idioma === 'es'" :label="$t('agregarSitio.tipoDeEntrada')" transition-show="jump-up"
        transition-hide="jump-up" filled v-model="tipoEntrada" :options="tiposEntrada.tipo"
        class="col-md-6 col-sm-6 col-xs-12 q-pa-sm" />
      <q-select v-else :label="$t('agregarSitio.tipoDeEntrada')" transition-show="jump-up" transition-hide="jump-up"
        filled v-model="typeEntrada" :options="tiposEntrada.type" class="col-md-6 col-sm-8 col-xs-12 q-pa-sm" />
    </div>


    <!--Boton para agregar-->
    <div id="contacto-i" class="col-md-7 col-sm-8 col-xs-10">
      <div v-if="tipoEntrada || typeEntrada" class="col-md-4 col-sm-4 col-xs-4 text-center q-my-sm">
        <q-btn class="text-capitalize" unelevated color="primary" :label="$t('agregarSitio.agregar')"
          @click="agregarEntrada" />
      </div>

    </div>
  </div>

  <!--Apartado para poder mostrar la lista de los costos de entrada por su tipo-->
  <div class="row justify-center items-center" v-for="(boleto, index) in boletos" :key="index" style="padding: 1px;">
    <div class="row col-md-6 col-sm-8 col-xs-10 q-py-sm">
      <div class="row border rounded-borders col-md-10" style="background-color: #999999">
        <q-item-label v-if="idioma === 'es'" class="col-md-6 col-xs-12 q-my-sm q-px-sm q-py-xs">{{ $t('agregarSitio.tipo')
        }}&nbsp;&nbsp;<b>{{ boleto.tipo }}</b></q-item-label>
        <q-item-label v-else class="col-md-6 col-xs-12 q-my-sm q-px-sm q-py-xs">{{ $t('agregarSitio.tipo')
        }}&nbsp;&nbsp;<b>{{ boleto.type }}</b></q-item-label>
        <q-item-label class="col-md-6 col-xs-12 q-my-sm q-px-sm q-py-xs">{{ $t('agregarSitio.valorDeEntrada')
        }}&nbsp;&nbsp;<b>${{ boleto.valor }}</b></q-item-label>
      </div>
      <div class="row col-md-2 col-sm-2 col-xs-3 items-center q-pl-md">
        <q-btn round color="primary" icon="delete" size="17.25px" @click="borraEntrada(index)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var idioma = this.$i18n.locale;
    return {
      idioma,
      boletos: [],
      valorEntrada: null,
      tipoEntrada: null,
      typeEntrada: null,
      textInput: "",
      maxChars: 50,//Maximo de caracteres permitidos
      tiposEntrada: {
        tipo: [
          "Adultos",
          "Menores",
          "Tercera edad",
          "Extranjeros",
          "Estudiantes",
          "Igual"
        ], type: [
          "Adults",
          "Minors",
          "Senior citizens",
          "Foreigners",
          "Students",
          "Same"
        ]
      }
    };
  },
  methods: {
    // Métodos del componente aquí
    agregarEntrada() {
      if (this.valorEntrada !== null && (this.tipoEntrada !== null || this.typeEntrada !== null)) {
        let tipoEncontrado = false;
        for (let index = 0; index < this.boletos.length; index++) {
          if (this.boletos[index].tipo === this.tipoEntrada || this.boletos[index].type === this.typeEntrada) {
            this.boletos[index].valor = this.valorEntrada;
            tipoEncontrado = true;
            break;
          }
        }
        if (!tipoEncontrado) {
          for (let index = 0; index < this.tiposEntrada.tipo.length; index++) {
            if (this.tiposEntrada.tipo[index] === this.tipoEntrada || this.tiposEntrada.type[index] === this.typeEntrada) {
              this.tipoEntrada = this.tiposEntrada.tipo[index];
              this.typeEntrada = this.tiposEntrada.type[index];
              break;
            }
          }
          this.boletos.push({ valor: this.valorEntrada, tipo: this.tipoEntrada, type: this.typeEntrada });
        }

        this.valorEntrada = null;
        this.tipoEntrada = null;
        this.typeEntrada = null;
      } else {
        alert("¡Ups! Creo que no has agregado ningun valor ó tipo de entrada");
      }
    },
    borraEntrada(indes) {
      this.boletos.splice(indes, 1);
      this.valorEntrada = null;
      this.tipoEntrada = null;
      this.typeEntrada = null;
    },
    getD() {
      var pase = [];
      for (let index = 0; index < this.boletos.length; index++) {
        pase.push({ type: this.boletos[index].tipo, amount: this.boletos[index].valor });
      }
      if (pase.length === 0) {
        pase.push({ type: "EveryOne", amount: 0.0 });//, benefits: "" });
      }
      return pase;
    },
    validateInput() {
      return [
        (v) =>
          (v && v.length <= this.maxChars) || `El máximo permitido es ${this.maxChars} caracteres`,
      ];
    },
    setD(dato) {
      for (let i = 0; i < this.tiposEntrada.tipo.length; i++) {
        for (let j = 0; j < dato.length; j++) {
          if (this.tiposEntrada.tipo[i] === dato[j].type) {
            this.boletos.push({
              valor: parseFloat(dato[j].amount).toFixed(2).toString()
              , tipo: this.tiposEntrada.tipo[i], type: this.tiposEntrada.type[i]
            });
            j = dato.length + 1;
          }
        }
      }
    }
  }
};

</script>

<style lang="scss"></style>
