
<template>
  <h6 class="q-my-md">{{ $t('agregarSitio.ubicacion') }}</h6>
  <my-button class="q-pt-xs q-pb-md" />
  <!-- Mapa -->
  <div>
    <div id="mapa"></div>
    <!-- Botones para móvil y tablet -->
    <div v-if="!mostrarCodigo" class="q-my-md d-flex">

      <div class="row " style="display: flex; align-items: center; justify-content: center;" v-if="!marcadorMovido">
        <q-btn color="orange" icon="place" @click="localizar" :label="$t('agregarSitio.miUbicacion')" />
        <div class="q-px-md">
          <!-- Botón "Agregar URL" -->
          <q-btn class="codigo-url" icon="map" v-if="!mostrarCodigo" color="orange" :label="$t('agregarSitio.agregarURL')"
            @click="mostrarCodigo = true" />
          <!-- <q-icon name="info" class="info-icon q-mx-md text-primary" />-->
          <!-- <p class="info-text">Busque su sitio turistico en el Google Maps <br>y copie la URL (link) del navegador</p> -->
        </div>
      </div>
      <div v-else>
        <q-btn color="orange" icon="place" @click="moverAlMarcador" :label="$t('agregarSitio.selecione')" />
        <p class="alerta-url" v-if="!esURLValida">{{ $t('agregarSitio.coloquePuntero') }}</p>
      </div>

    </div>


    <!-- Código -->
    <div v-if="mostrarCodigo" class="codigo-url">
      <!-- Sección que se mostrará solo en PC -->
      <div class="col-md-9 col-sm-10 col-xs-7">
        <div class="row d-none d-md-flex items-center">
          <q-input filled class="col-9" v-model="urlGoogleMaps" type="text" :placeholder="$t('agregarSitio.url')" />
          <!-- Botón "X" para ocultar el código -->
          <q-btn icon="close" class="col-1 q-ml-sm" color="orange" @click="mostrandoCodigo" />

        </div>
        <div style="padding-left: 1%; display: flex; align-items: center;">
          <q-btn color="orange" icon="place" :label="$t('agregarSitio.ubicacion')" @click="extraerCoordenadas"
            :disabled="!esURLValida" />
        </div>
      </div>
      <div>
        <p class="alerta-url" v-if="!esURLValida">{{ $t('agregarSitio.url2') }}</p>
      </div>

    </div>

    <div @click="moverAlMarcador" class="q-my-md">
      <q-card>
        <q-card-section>
          <div class=" text-h7 text-center">{{ $t('agregarSitio.coordenadasSeleccionadas') }}:</div>
          <div class="text-subtitle1 text-center col-md-6 col-xs-6 col-sm-6">{{ $t('agregarSitio.latitud') }} {{
            usuarioCoordenadas.split(',')[0]
          }}</div>
          <div class="text-subtitle1 text-center col-md-6 col-xs-6 col-sm-6"> {{ $t('agregarSitio.longitud') }} {{
            usuarioCoordenadas.split(',')[1]
          }}</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import logoIcon from 'src/assets/logo.png';
import MyButton from "components/PopUpsAgregarSitio/pop_ubicacion.vue";

export default {
  data() {
    return {
      mapa: null,
      marcador: null,
      marcadorMovido: false,
      mostrarCodigo: false,
      urlGoogleMaps: '',
      usuarioCoordenadas: '',
      coordenadas: [null, null]
    };
  },
  computed: {
    esURLValida() {
      const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
      return this.urlGoogleMaps.match(regex);
    }
  },
  mounted() {
    this.initializeMap();
  },
  components: {
    MyButton
  },
  methods: {
    mostrandoCodigo() {
      this.marcadorMovido = false;
      this.mostrarCodigo = false;
      this.urlGoogleMaps = '';
      if (this.marcador) {
        this.mapa.removeLayer(this.marcador);
      }
      const personalizadox = L.icon({
        iconUrl: logoIcon,
        iconSize: [32, 32]
      });
      this.marcador = L.marker([0, 0], { icon: personalizadox }).addTo(this.mapa);
      this.mapa.on('click', this.alHacerClicEnMapa);

    },

    localizar() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          const objetivo = L.latLng(latitude, longitude);
          const nivelZoom = 14;
          this.mapa.flyTo(objetivo, nivelZoom, {
            animate: true,
            duration: 1.5
          });
          this.marcador.setLatLng(objetivo);
          this.actualizarCoordenadas([latitude, longitude]);
          this.marcadorMovido = true;
        }, error => {
          console.error('Error al obtener la ubicación:', error);
        });
      } else {
        console.error('Geolocalización no soportada en este navegador.');
      }
    },
    moverAlMarcador() {
      if (this.marcadorMovido) {
        const latlng = this.marcador.getLatLng();
        this.mapa.setView(latlng);
      }
    },
    alHacerClicEnMapa(e) {
      this.marcador.setLatLng(e.latlng);
      this.actualizarCoordenadas([e.latlng.lat, e.latlng.lng]);

    },
    actualizarCoordenadas(coordenadas) {
      this.usuarioCoordenadas = `${coordenadas[0]}, ${coordenadas[1]}`;
      this.coordenadas = [coordenadas[0], coordenadas[1]];
      console.log('usuarioCoordenadas:', this.usuarioCoordenadas);
    },
    initializeMap() {
      this.mapa = L.map('mapa').setView([13.7942, -88.8965], 8);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(this.mapa);

      const personalizadox = L.icon({
        iconUrl: logoIcon,
        iconSize: [32, 32]
      });

      this.marcador = L.marker([0, 0], { icon: personalizadox }).addTo(this.mapa);
      this.mapa.on('click', this.alHacerClicEnMapa);
    },
    extraerCoordenadas() {
      const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
      const match = this.urlGoogleMaps.match(regex);

      if (match) {
        const latitud = match[1];
        const longitud = match[2];
        this.usuarioCoordenadas = `${latitud}, ${longitud}`;
        this.coordenadas = [latitud, longitud];
        //console.log(this.usuarioCoordenadas);

        this.mapa.setView([latitud, longitud], 14);
        if (this.marcador) {
          this.marcador.setLatLng([latitud, longitud]);
        } else {
          const personalizadox = L.icon({
            iconUrl: logoIcon,
            iconSize: [32, 32]
          });

          this.marcador = L.marker([latitud, longitud], { icon: personalizadox }).addTo(this.mapa);
        }
        this.marcadorMovido = true;

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitud}&lon=${longitud}`)
          .then(response => response.json())
          .then(data => {
            const { departamento, municipio, ciudad, cantón, colonia } = data.address;
            const ubicacion = departamento || municipio || ciudad || cantón || colonia;
            //console.log('Nombre del lugar:', data.display_name);
          })
          .catch(error => {
            console.error('Error al obtener la información de ubicación:', error);
          });

      } else {
        alert('La URL de Google Maps no es válida');
      }
    },
    setD(dato) {
      if (dato.url === "") {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(position => {
            //const { latitude, longitude } = position.coords;
            const objetivo = L.latLng(dato.latitude, dato.longitude);
            const nivelZoom = 14;
            this.mapa.flyTo(objetivo, nivelZoom, {
              animate: true,
              duration: 1.5
            });
            this.marcador.setLatLng(objetivo);
            this.actualizarCoordenadas([dato.latitude, dato.longitude]);
            this.marcadorMovido = true;
          }, error => {
            console.error('Error al obtener la ubicación:', error);
          });
        } else {
          console.error('Geolocalización no soportada en este navegador.');
        }
      } else {
        this.urlGoogleMaps = dato.url;
        this.mostrarCodigo = true;
        this.extraerCoordenadas();
      }

    }
  }
};

</script>

<style>
#mapa {
  height: calc(100vh - 400px);
  width: 100%;
}

.alerta-url {
  padding-top: 1%;
  font-size: 12px;
  color: brown;
}

/* Estilos para tablet y móvil */
@media only screen and (max-width: 1024px) {
  .codigo-url {
    display: none;
  }


  .info-icon {
    display: none;
  }
}

/*
.info-icon {
  font-size: 14px;
  color: #9998;
  margin-left: 5px;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.info-text {
  position: absolute;
  display: none;
  margin-top: -40px;
  margin-left: 190px;
  padding: 5px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
  color: #333;
}

.info-icon:hover+.info-text {
  display: block;
}
*/
</style>
