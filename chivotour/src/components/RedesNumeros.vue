<template>
  <!--Apartado REDE SOCIALES Y NUMERO DE CONTACTO-->
  <div class="row justify-center">
    <div id="contacto-d" class="col-md-8 col-sm-8 col-xs-10 justify-center">
      <h6 class="q-my-md text-center col-md-12 col-sm-12 col-xs-12">
        {{ $t('agregarSitio.redesSociales') }}
      </h6>
      <q-item-label class="text-center col-md-12 col-sm-12 col-xs-12" caption>
        {{ $t('agregarSitio.redes') }}
      </q-item-label>
      <!-- Esta parte es para los botones de las redes sociales -->
      <div class="row q-pa-md col-md-12 justify-center items-center">
        <q-btn v-for="red in contactos.redes" :key="red.name" class="q-mr-sm q-mt-sm"
          :color="red.boolean ? 'positive' : 'primary'" round :icon="red.icon" @click="generarInput(red.name)" />
      </div>
      <!-- Este apartado muestra los input para cada red social seleccionada -->
      <div class="col-md-8 col-sm-8 col-xs-10 justify-center">
        <div v-for="red in contactos.redes" :key="red.name">
          <div v-if="red.boolean">
            <!--
              <span class="col-md-12 col-sm-8 col-xs-12">Se busca como:</span>
            <q-input class="q-mt-sm" filled v-model="red.link" :label="red.name" />
            <span class="col-md-12 col-sm-8 col-xs-12">Direccion URL:</span>
            -->
            <q-input class="q-mt-sm" filled v-model="red.value" :label="red.label" v-if="red.name !== 'whatsapp'" />
            <q-input class="q-mt-sm" filled v-model="red.value" :label="$t('agregarSitio.numeroDeWhatsapp')" v-else
              mask="########" unmasked-value :hint="$t('agregarSitio.ejemplo') + ': #### - ####'" />
          </div>
        </div>
      </div>

    </div>
    <!--Aqui va el numero de contacto-->
    <div id="contacto-i" class="col-md-8 col-sm-8 col-xs-10 justify-center q-pb-md">
      <h6 class="q-my-md text-center col-md-12 col-sm-12 col-xs-12">
        {{ $t('agregarSitio.numeroDeContacto') }}
      </h6>
      <q-item-label class="text-center col-md-12 col-sm-12 col-xs-12" caption>
        {{ $t('agregarSitio.contact') }}
      </q-item-label>
      <span class="col-md-12 col-sm-8 col-xs-12">
        {{ $t('agregarSitio.telefono') }}:
      </span>
      <q-input filled v-model="numeroTelefono" :label="$t('agregarSitio.numero')" mask="(503) #### - ####" unmasked-value
        :hint="$t('agregarSitio.ejemplo') + ': (503) #### - ####'" class="col-md-8 col-sm-6 col-xs-8" />
      <div v-if="numeroTelefono" class="col-md-4 col-sm-4 col-xs-4 text-center q-my-sm">
        <q-btn class="text-capitalize" unelevated color="primary" :label="$t('agregarSitio.agregar')"
          @click="agregarNumero" />
      </div>
    </div>
  </div>


  <!--APARTADO PARA MOSTRAR LA LISTA DE NUMEROS-->
  <div class="row justify-center items-center" v-for="(n, indes) in contactos.telefonos" :key="indes"
    style="padding: 1px;">
    <div class="row col-md-6 col-sm-6 col-xs-7 border rounded-borders justify-center" style="background-color: #999999">
      <q-item-label class="col-md-6 col-xs-12 q-my-sm q-px-sm q-py-xs">{{ $t('agregarSitio.numero') }}:&nbsp;&nbsp;<b>{{
        n.numero
      }}</b></q-item-label>
    </div>
    <div class="row col-md-1 col-sm-2 col-xs-3 justify-center items-center">
      <q-btn round color="primary" icon="delete" size="17.25px" @click="borrarNumero(indes)" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contactos: {
        redes: [
          {
            name: "facebook", icon: "fa-brands fa-facebook", boolean: false,
            label: "URL Facebook", value: ""
          },
          {
            name: "instagram", icon: "fa-brands fa-instagram", boolean: false,
            label: "URL Instagram", value: ""
          },
          {
            name: "whatsapp", icon: "fa-brands fa-whatsapp", boolean: false,
            label: "Número de Whatsapp", value: ""
          },
          {
            name: "tiktok", icon: "fa-brands fa-tiktok", boolean: false,
            label: "URL TikTok", value: ""
          },
          {
            name: "twitter", icon: "fa-brands fa-twitter", boolean: false,
            label: "URL Twitter", value: ""
          },
          {
            name: "youtube", icon: "fa-brands fa-youtube", boolean: false,
            label: "URL Youtube", value: ""
          },
          {
            name: "email", icon: "fa-solid fa-envelope", boolean: false,
            label: "EMAIL", value: ""
          }

        ],
        telefonos: []
      },
      numeroTelefono: null
    };
  },
  methods: {
    // Métodos del componente aquí
    agregarNumero() {
      if (this.numeroTelefono != null) {
        if (this.redSeleccionada === 'whatsapp') {
          this.contactos.telefonos.push({ numero: this.numeroTelefono });
        } else {
          this.contactos.telefonos.push({ numero: ' (503) ' + this.numeroTelefono });
          this.numeroTelefono = null;
        }
      }
    },
    borrarNumero(indes) {
      this.contactos.telefonos.splice(indes, 1);
      this.numeroTelefono = null;
    },
    generarInput(name) {
      const redEncontrada = this.contactos.redes.find((red) => red.name === name);
      if (redEncontrada) {
        if (redEncontrada.boolean) {
          redEncontrada.value = null;
        }
        redEncontrada.boolean = !redEncontrada.boolean;
      }
    },
    getD() {
      var red = [];
      for (let index = 0; index < this.contactos.redes.length; index++) {
        if (this.contactos.redes[index].boolean) {
          red.push({
            name: this.contactos.redes[index].name, value: this.contactos.redes[index].value,
            icon: this.contactos.redes[index].icon
          });
        }
      }
      return { redes: red, telefonos: this.contactos.telefonos };
    },
    setD(dato) {
      //console.log(dato);
      this.contactos.telefonos = dato.phones;
      var lista = dato.contacts;
      for (let i = 0; i < this.contactos.redes.length; i++) {
        for (let j = 0; j < lista.length; j++) {
          if (this.contactos.redes[i].name === lista[j].name) {
            this.contactos.redes[i].boolean = true;
            this.contactos.redes[i].value = lista[j].value;
            lista.splice(j, 1);
            j = lista.length + 1;
          }
        }
      }
    }
  }
};

</script>

<style lang="scss">
@media screen and (min-width: $breakpoint-sm-max) {
  #contacto-d {
    padding-right: 8px;
  }

  #contacto-i {
    padding-left: 8px;
  }
}
</style>
