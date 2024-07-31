<template>
  <q-page>
    <DesktopHeaderAdmin></DesktopHeaderAdmin>
    <div class="col-10 form-container">
      <q-btn @click="navigateToMainPage" icon="arrow_back" outline color="primary" class="q-mt-md q-ml-md" />
    </div>
    <div class="row  form-container">
      <div class="col-12 col-md-6 ">
        <!--Nombre del Sitio-->
        <div class="row flex-center">
          <div class="col-10 q-mt-lg" id="sitioNormal">
            <q-input v-model="nombreSitio" outlined :label="$t('validarSitio.nombreSitio')" readonly />
          </div>
        </div>
        <!--Imagenes-->
        <div class="row flex-center">
          <div class="col-8">
            <div class="q-pa-md">
              <div class="q-pa-md">
                <q-carousel swipeable animated v-model="slide" thumbnails infinite style="height: 300px;">

                  <q-carousel-slide v-for="(img, id) in imagenes" :key="id" :name="id" :img-src="img" />
                </q-carousel>
              </div>
            </div>
          </div>
        </div>
        <!--Categorias y Departamento-->
        <div class="row justify-center">
          <div class="col-7 col-md-6 col-lg-5">
            <q-select :label="$t('validarSitio.categorias')" transition-show="flip-up" transition-hide="flip-down" filled
              readonly v-model="model" :options="options" style="width: 250px; padding-bottom: 10px; padding-left: 40px;"
              class="p-md-left " />
          </div>
          <div class="col-7 col-md-6 col-lg-5">
            <q-select :label="$t('validarSitio.departamento')" transition-show="flip-up" transition-hide="flip-down"
              readonly filled v-model="modelDepartamento" :options="optionDepartamentos"
              style="width: 250px; padding-bottom: 10px; padding-left: 40px;" class="p-md-left" />
          </div>
        </div>

        <!--Horarios-->
        <div class="row flex-center q-mt-lg">
          <div class="col-10" id="sitioNormal">
            <div class="q-pa-md">
              <!--Aca va otra tabla-->
              <q-table :title="$t('validarSitio.horarios')" :rows="rowsHorario" :columns="columnsHorario" />
            </div>
          </div>
        </div>
        <!--Entradas-->
        <div class="row flex-center q-mt-lg">
          <div class="col-11" id="sitioNormal">
            <div class="q-pa-md">
              <!--Aca va una tabla-->
              <q-table :title="$t('validarSitio.entradas')" :rows="rowsEntrada" :columns="columnsEntrada" />
            </div>
          </div>
        </div>
        <h6 class="row q-mt-lg q-mb-xs q-pl-lg">{{ $t('validarSitio.enlace') }}</h6>
        <div class="row flex-center">
          <div class="q-pa-md">
            <q-list bordered separator>
              <q-item clickable v-ripple v-for="item in enlaces" :key="item.name">
                <a :href="item.value" target="_blank" class="custom-link">
                  <q-item-section>
                    <q-item-label>{{ item.value }}</q-item-label>
                    <q-item-label caption>{{ item.name }}</q-item-label>
                  </q-item-section>
                </a>
              </q-item>
            </q-list>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 q-mt-lg">
        <div class="row flex-center">
          <div class="col-5" id="sitioNormal">
            <q-input v-model="autor" outlined :label="$t('validarSitio.publicado')" readonly />
          </div>
          <div class="col-5 q-mx-lg" id="sitioNormal">
            <q-input v-model="fechaPublicacion" outlined :label="$t('validarSitio.fecha')" readonly />
          </div>
        </div>
        <!--Ubicacion-->
        <h6 class="row q-mt-lg q-mb-xs q-pl-lg">{{ $t('validarSitio.ubicacion') }}</h6>
        <div class="row flex-center">
          <div class="col-10 q-mt-none">
            <div id="mapa" class="mapa"></div>
          </div>
        </div>
        <!--Descripcion-->
        <h6 class="row q-mt-lg q-mb-xs q-pl-lg">{{ $t('validarSitio.descripcion') }}</h6>
        <div class="row flex-center">
          <div class="col-10">
            <q-input type="textarea" style="max-width: 900px;" v-model="descripcionEsp" filled
              :rules="[val => !!val || $t('validarSitio.campoVacio')]" :rows="15" />
          </div>
        </div>
        <div class="row flex-center">
          <div class="q-pa-md col-5">
            <q-btn @click="copiarTextoEspa" color="primary" :label="$t('validarSitio.copiar')" />
          </div>
          <div class="q-pa-md col-5">
            <q-btn @click="irGoogleTranslate" color="orange" :label="$t('validarSitio.translate')" />
          </div>
        </div>
        <!--Descripcion-- ingles-->
        <h6 class="row q-mt-lg q-mb-xs q-pl-lg">{{ $t('validarSitio.descrip') }}</h6>
        <div class="row flex-center">
          <div class="col-10">
            <q-input type="textarea" style="max-width: 900px;" v-model="descripcionIng" filled
              :rules="[val => !!val || $t('validarSitio.campoVacio')]" :rows="15" />
            <div class="q-pa-md flex justify-center">
              <q-btn @click="copiarTextoIngles" color="primary" :label="$t('validarSitio.copiar')" />
            </div>
          </div>
        </div>
        <!--Botones-->

      </div>

    </div>

    <div class="row form-container  " v-if="!aprovado">

      <div class="col-11 col-md-10 bottom-buttons">

        <q-btn id="margin" class="edit" icon="edit" unelevated color="grey" :label="$t('validarSitio.botonEditar')"
          :to="`/modificar/${this.$route.params.idSitio}`" />
        <q-btn icon="done" class="post" unelevated color="green" :label="$t('validarSitio.botonPublicar')"
          @click="publicar" />
        <q-btn icon="delete" class="delete" unelevated color="red" :label="$t('validarSitio.botonEliminar')"
          @click="eliminar" />
      </div>

    </div>
    <div class="row form-container bottom-buttons-approved" v-if="aprovado">
      <q-btn id="margin" unelevated color="red" icon="delete" :label="$t('validarSitio.botonEliminar')"
        @click="eliminar" />
      <q-btn unelevated color="green" icon="edit" :label="$t('validarSitio.botonEditar')"
        :to="`/modificar/${this.$route.params.idSitio}`" />
    </div>
  </q-page>
</template>

<script>

import DesktopHeaderAdmin from "src/components/DesktopHeaderAdmin.vue";
//Base de Datos Pouchdb
import { sitios, Nsitios, Nimagenes, url } from "../boot/pouchdb.js";
//mapa
import logoIcon from 'src/assets/logo.png';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';



const columnsHorario = [
  { name: 'dia', align: 'left', label: 'Dia', field: 'dia' },
  { name: 'horaApertura', align: 'left', label: 'Apertura', field: 'horaApertura' },
  { name: 'horaCierre', align: 'left', label: 'Cierre', field: 'horaCierre' }
]

const rowsHorario = [

  { dia: 'Lunes', horaApertura: '-', horaCierre: '-' },
  { dia: 'Martes', horaApertura: '-', horaCierre: '-' },
  { dia: 'Miércoles', horaApertura: '-', horaCierre: '-' },
  { dia: 'Jueves', horaApertura: '-', horaCierre: '-' },
  { dia: 'Viernes', horaApertura: '-', horaCierre: '-' },
  { dia: 'Sabado', horaApertura: '-', horaCierre: '-' },
  { dia: 'Domingo', horaApertura: '-', horaCierre: '-' }
]


const columnsEntrada = [
  { name: 'tipoEntrada', align: 'left', label: 'Tipo Entrada', field: 'tipoEntrada' },
  { name: 'valor', align: 'left', label: 'Valor($)', field: 'valor' }
]
const rowsEntrada = [
  { tipoEntrada: "adultos", valor: '-', beneficio: '-' },
  { tipoEntrada: "menores", valor: '-', beneficio: '-' },
  { tipoEntrada: "tercera edad", valor: '-', beneficio: '-' },
  { tipoEntrada: "extranjeros", valor: '-', beneficio: '-' },
  { tipoEntrada: "estudiantes", valor: '-', beneficio: '-' }
]
export default {
  data() {
    return {
      nombreSitio: "Sitio Arquelogico El Tazumal",
      slide: 0,
      autor: "Nayib Armando Bukele Ortez",
      fechaPublicacion: '',
      descripcionEsp: '',
      descripcionIng: '',
      model: "Ruinas",
      options: [
        "Playa",
        "Ruinas",
        "Museo",
        "Piscinas",
        "Bosques",
        "Iglesias"
      ],
      imagenes: [],
      columnsEntrada,
      rowsEntrada,
      aprovado: '',
      columnsHorario,
      rowsHorario,
      modelDepartamento: "Santa Ana",
      enlaces: [],
      optionDepartamentos:
        [
          'Ahuachapán',
          'Cabañas',
          'Chalatenango',
          'Cuscatlán',
          'La Libertad',
          'La Paz',
          'La Unión',
          'Morazán',
          'San Miguel',
          'San Salvador',
          'San Vicente',
          'Santa Ana',
          'Sonsonate',
          'Usulután'
        ], map: null,
      marker: null, lati: null, longit: null,
    }
  },
  components: {
    DesktopHeaderAdmin,
  },
  created() {

    this.$i18n.locale = localStorage.getItem('selectedLanguage');
    this.updateLanguage();

    this.cargarDatos();

  },
  mounted() {

    this.cargarDatos().then(() => {
      this.mapa = L.map('mapa').setView([this.lati, this.longit], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.mapa);

      const personalizadox = L.icon({
        iconUrl: logoIcon,
        iconSize: [35, 35]
      });

      this.marker = L.marker([this.lati, this.longit], {
        draggable: true,
        icon: personalizadox
      }).addTo(this.mapa);

      this.marker.on('dragend', (event) => {
        const coordenadaModificada = event.target.getLatLng();
        // Actualizar las coordenadas en la variable y las mandas a la base, te queda ahi compa
        console.log(coordenadaModificada);
      });
    })

  },
  methods: {

    navigateToMainPage() {
      this.$router.go(-1);
    },

    irGoogleTranslate() {
      window.open("https://translate.google.com/", "_blank");
    },

    copiarTextoEspa() {
      const textoCopiar = this.descripcionEsp;
      navigator.clipboard.writeText(textoCopiar)
        .then(() => {
          this.$q.notify({
            message: this.$t('validarSitio.textoCopiado'),
            color: 'positive'
          })
        })
        .catch((error) => {
          this.$q.notify({
            message: this.$t('validarSitio.errorCopiar'),
            color: 'negative'
          });
        });
    },

    copiarTextoIngles() {
      const textoCopiar = this.descripcionIng;
      navigator.clipboard.writeText(textoCopiar)
        .then(() => {
          this.$q.notify({
            message: this.$t('validarSitio.textoCopiado'),
            color: 'positive'
          })
        })
        .catch((error) => {
          this.$q.notify({
            message: this.$t('validarSitio.errorCopiar'),
            color: 'negative'
          });
        });
    },

    updateLanguage() {
      this.columnsHorario[0].label = this.$t('validarSitio.dias.dia');
      this.columnsHorario[1].label = this.$t('validarSitio.dias.start');
      this.columnsHorario[2].label = this.$t('validarSitio.dias.end');
      this.columnsEntrada[0].label = this.$t('validarSitio.tipoEntrada');
      this.columnsEntrada[1].label = this.$t('validarSitio.valor');
    },

    async publicar() {

      try {
        var data = await sitios.get(this.$route.params.idSitio);
        data.approved = true;
        await Nsitios.put(data);
        this.$router.go(-1);
        this.$q.notify({
          message: this.$t('validarSitio.mensajeP'),
          color: 'red'
        })
      } catch (error) {
        console.log("ocurrio error al publicar el sitio", error);
      }
    },

    async eliminar() {

      //Para eliminar las Imagenes
      Nimagenes.get(this.$route.params.idSitio).then(function (doc) {

        return Nimagenes.remove(doc);
      }).then(function (result) {
        // console.log('Documento eliminado con éxito:', result);
      }).catch(function (err) {
        // console.log('Error al eliminar el documento:', err);
      });


      //Para eliminar los documentos
      Nsitios.get(this.$route.params.idSitio).then(function (doc) {

        return Nsitios.remove(doc);
      }).then(function (result) {
        //console.log('Documento eliminado con éxito:', result);
      }).catch(function (err) {
        // console.log('Error al eliminar el documento:', err);
      });

      this.$q.notify({
        message: this.$t('validarSitio.mensajeE'),
        color: 'red'
      })

      this.$router.go(-1);

    },

    async cargarDatos() {

      try {

        var data = await sitios.get(this.$route.params.idSitio);
        this.descripcionEsp = data.descripcion;
        this.descripcionIng = data.description;
        this.nombreSitio = data.centerName;
        this.enlaces = data.contacts;
        this.autor = data.createBy.usuario;
        this.fechaPublicacion = data.createBy.fecha;
        this.imagenes = data.photos;
        this.model = this.$t('validarSitio.categoria.' + data.category);
        this.modelDepartamento = data.department;
        this.aprovado = data.approved;
        this.schedule = data.schedule;
        const horarios = data.schedule;
        const entradas = data.prices;
        const location = data.location;
        const latitud = location.latitude;
        const longitud = location.longitude;
        this.lati = parseFloat(latitud);
        this.longit = parseFloat(longitud);
        const mapaTildes = {
          'á': 'a',
          'é': 'e',
          'í': 'i',
          'ó': 'o',
          'ú': 'u',
          'Á': 'A',
          'É': 'E',
          'Í': 'I',
          'Ó': 'O',
          'Ú': 'U',
          'ü': 'u',
          'Ü': 'U',
          'ñ': 'n',
          'Ñ': 'N'
        };
        this.rowsHorario = horarios.map((horario) => {
          var dia = horario.day.replace(/[áéíóúÁÉÍÓÚüÜñÑ]/g, letra => mapaTildes[letra]);
          return {
            dia: this.$t('validarSitio.dias.' + dia),
            horaApertura: horario.ranges[0].start,
            horaCierre: horario.ranges[0].end
          };
        });
        this.rowsEntrada = entradas.map((entrada) => {
          return {
            tipoEntrada: this.$t('validarSitio.tipoD.' + entrada.type),
            valor: entrada.amount,
          };
        });

        for (var i = 0; i < this.imagenes.length; i++) {
          this.imagenes[i] = url + this.imagenes[i] + '/imagen';
        }

      } catch (error) {
        console.log("ocurrio error al obtener y cargar ", error);
      }
    }
  }
}

</script>
<style lang="scss">
.custom-link {
  text-decoration: none;
  color: #000;
  /* Cambia el color del enlace según tus preferencias */
}

#mapa {
  height: calc(100vh - 400px);
  width: 100%;
}

#principal {
  background-color: #03A678;
  font-family: "Helvetica", Arial, sans-serif;
  font-size: xx-large;
  font-weight: bold;
}

.text-center-principal {
  background-color: #03A678;
}

.form-container {
  background-color: #E8FFF4;
}

#sitioNormal {
  background-color: #CACACA;
}

#margin {
  // margin: 40px;
  text-align: left;
}

.bottom-buttons {
  display: flex;
  margin-inline: auto;
  justify-content: space-evenly;
  margin-top: 20px;
  margin-bottom: 20px;
}

.bottom-buttons-approved {
  display: flex;
  justify-content: space-evenly;
  margin-block: 20px;
}

.bottom-buttons>.q-btn,
.bottom-buttons-approved>.q-btn {
  font-size: 22px;
}

.margin-auto {
  margin-inline: auto;
}

@media screen and (max-width: 550px) {

  .bottom-buttons>.q-btn,
  .bottom-buttons-approved>.q-btn {
    font-size: 15px;
  }
}

@media screen and (max-width: 399px) {
  .bottom-buttons {
    flex-wrap: wrap;
    margin-bottom: 15px;
  }

  .bottom-buttons>q.btn {
    flex: 1;
    min-width: calc(40%+5px);
    margin: 0 5px;
    margin-bottom: 10px;
  }

  .bottom-buttons>q.btn:first-child {
    margin-bottom: 10px;
  }

  .bottom-buttons>.delete {
    margin: auto;
    margin-top: 15px;
  }
}
</style>
