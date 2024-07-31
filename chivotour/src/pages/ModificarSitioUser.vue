<template>
  <!--Titulo-->
  <div class="text-center">
    <h5 class="titleSite">
      <q-btn flat round dense @click="$router.go(-1)" style="position: absolute; top: 0px; left: 20px">
        <q-icon class="lt-sm" name="arrow_back" size="sm" color="primary" />
      </q-btn>
      {{ $t('agregarSitio.modificarSitioTuristico') }}
      <!--Aqui se muestra la foto y el nombre de usuario para moviles-->
      <q-avatar size="30px" class="user-login lt-md" style="position: absolute;">
        <img
          :src="user ? user.photoURL : 'https://static.vecteezy.com/system/resources/thumbnails/005/544/770/small_2x/profile-icon-design-free-vector.jpg'">
        <q-tooltip transition-show="rotate" transition-hide="rotate">
          {{ user ? user.displayName : 'No se ha iniciado sesión' }}
        </q-tooltip>
      </q-avatar>
    </h5>
  </div>
  <div class="row justify-center">
    <div class="col-md-1 col-sm-1 col-xs-0">
      <!-- Aquí se muestra la foto y el nombre de usuario -->
      <q-chip class="q-pa-lg user-login gt-sm" style="position: absolute;">
        <q-avatar>
          <img
            :src="user ? user.photoURL : 'https://static.vecteezy.com/system/resources/thumbnails/005/544/770/small_2x/profile-icon-design-free-vector.jpg'">
        </q-avatar>
        <div>
          {{ user ? user.displayName : 'No se ha iniciado sesión' }}
        </div>
      </q-chip>


    </div>
    <div class="form-container col-md-10 col-sm-10 col-xs-11 q-mb-lg">
      <!--aqui se creara el form-->
      <q-form @submit.prevent="submitForm">

        <div>
          <nombre-sitio-categoria ref="nombreSitioCategoriaRef" />
        </div>

        <!--Invocacion del componente Geocalizar-->
        <div class="row d-flex justify-center items-center">
          <div class="col-md-7 col-sm-8 col-xs-10 ">
            <GeoCalizar ref="geoCalizarRef" />
          </div>
        </div>
        <div>
          <descripcion-departamento ref="descripcionDepartamentoRef" />
        </div>
        <!--Apartado de agregar horario-->

        <!-- calendario, este componente esta definico en componentes y otras funciones en los metodos-->
        <div class="row d-flex justify-center items-center">
          <div class="col-md-7 col-sm-8 col-xs-10">
            <h6 class="q-my-md">{{ $t('agregarSitio.horarios') }}</h6>
          </div>
          <div class="col-md-7 col-sm-8 col-xs-10">
            <dynamic-calendar ref="dynamicCalendarRef" />
          </div>
        </div>

        <div>
          <subir-imagen ref="subirImagenRef" />
        </div>


        <!--componente de servicios adiciones responsivo y dinamico-->
        <div class="row d-flex justify-center items-center">
          <div class="col-md-7 col-sm-8 col-xs-10">
            <h6 class="q-my-md">{{ $t('agregarSitio.servicios') }}</h6>
          </div>
          <div class="col-md-7 col-sm-8 col-xs-10">
            <barra-servicios ref="barraServiciosRef" />
          </div>
        </div>

        <!-- Aparatado para agregar precio de entrada y tipo de entrada-->
        <div>
          <boleto-entrada ref="boletoEntradaRef" />
        </div>

        <!--Apartado REDE SOCIALES Y NUMERO DE CONTACTO-->
        <!--APARTADO PARA MOSTRAR LA LISTA DE NUMEROS-->
        <div>
          <redes-numeros ref="redesNumerosRef" />
        </div>


        <!--Botones de agregar y cancelar-->
        <div class="row">
          <div class="q-pa-md col-md-6 col-sm-6 col-xs-6 text-right">
            <q-btn color="negative" icon="cancel" :label="$t('agregarSitio.cancelar')" class="q-mt-md"
              @click="mostrarDialogo" />
          </div>
          <div class="q-pa-md col-md-6 col-sm-6 col-xs-6 text-left">
            <q-btn color="positive" :loading="cargando" icon="save" :label="$t('agregarSitio.actualizar')" class="q-mt-md"
              @click="validarInputs" />
          </div>
          <!--Apartado de la alerta CANCELAR-->
          <q-dialog v-model="mostrar" title="Confirmar cancelación" persistent>
            <q-card>
              <q-card-section>
                {{ $t('agregarSitio.pregunta') }}
              </q-card-section>

              <q-card-actions align="right">
                <q-btn :label="$t('agregarSitio.no')" color="primary" @click="mostrar = false" />
                <q-btn :label="$t('agregarSitio.si')" color="negative" @click="redireccionar" />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <!--Apartado de alerta ENVIAR-->
          <q-dialog v-model="dialogVisible" @update:modelValue="cerrarDialog">
            <q-card>
              <q-card-section>
                <span class="text-primary" style="font-size: 20px;">
                  {{ $t('agregarSitio.enviado') }}
                </span>
              </q-card-section>

              <q-card-section class="text-center">
                <q-btn color="primary" :label="$t('agregarSitio.aceptar')" @click="cerrarDialog" />
              </q-card-section>
            </q-card>
          </q-dialog>
          <q-dialog v-model="dialogErrorVisible" @update:modelValue="cerrarDialogError">
            <q-card>
              <q-card-section>
                <span class="text-negative" style="font-size: 25px;">{{ $t('agregarSitio.error') }}</span>
                <p>{{ $t('agregarSitio.rellenar') }}</p>

                <p v-if="validaciones.nombCate">{{ $t('agregarSitio.rellenaNombreyCategoria') }}</p>
                <p v-if="validaciones.descripDepart">{{ $t('agregarSitio.rellenaDescripcionyDepartamento') }}</p>
                <p v-if="validaciones.usuario">{{ $t('agregarSitio.login') }}</p>
                <p v-if="validaciones.gps">{{ $t('agregarSitio.seleccionaUbicacion') }}</p>
                <p v-if="validaciones.imagenes">{{ $t('agregarSitio.agregueImagenes') }}</p>
                <p v-if="validaciones.servicios">{{ $t('agregarSitio.agregueServicios') }}</p>
              </q-card-section>

              <q-card-section class="text-center">
                <q-btn color="negative" :label="$t('agregarSitio.cerrar')" @click="cerrarDialogError" />
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
      </q-form>
    </div>
    <div class="col-md-1 col-sm-1 col-xs-0"></div>
  </div>
</template>

<script>
import { sitios, Nsitios, Nimagenes } from "../boot/pouchdb.js";

import DynamicCalendar from "components/DynamicCalendar.vue";
import BarraServicios from "components/BarraServicios.vue";
import RedesNumeros from "components/RedesNumeros.vue";
import BoletoEntrada from "components/BoletoEntrada.vue";
import NombreSitioCategoria from "components/NombreSitioCategoria.vue";
import DescripcionDepartamento from "components/DescripcionDepartamento.vue";

import GeoCalizar from "components/GeoCalizar.vue";
import SubirImagen from "components/SubirImagen.vue";
import { QDialog } from "quasar";
export default {
  mounted() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.getDatos(this.$route.params.idModificar);
      //linea para test mostrar sitio de prueba subido
      //this.getDatos("2cc355734b1f688958f2d35384002b6a");
    }
  },
  data() {
    return {
      idDoc: "", //variable el id proporcionado por la url
      rev: "",
      creador: "",//datos del autor, solo se actualiza la fecha,
      rankingT: [],
      rankingAverage1: 0,
      cargando: false,
      UImagenes: [],
      enviado: false,
      mostrar: false,
      dialogVisible: false,
      dialogErrorVisible: false,
      user: null,
      validaciones: {
        nombCate: false, descripDepart: false,
        usuario: false, gps: false, imagenes: false,
        servicios: false
      }
    };
  },
  components: {
    DynamicCalendar,
    BarraServicios,
    GeoCalizar,
    RedesNumeros,
    BoletoEntrada,
    NombreSitioCategoria,
    DescripcionDepartamento,
    SubirImagen,
  },
  methods: {
    //Funcionalidad boton cancelar
    redireccionar() {
      this.mostrar = false;
      this.$router.go(-1);
    },
    //Funcionalidad boton enviar
    validarInputs() {
      if (this.$refs.descripcionDepartamentoRef.valida()
        && this.$refs.nombreSitioCategoriaRef.valida()
        && this.user != null
        && (this.datosGPS().coordenadas[0] != null)
        && ((this.$refs.subirImagenRef.BImagenes).length != 0
          || (this.$refs.subirImagenRef.BImagenes2).length != 0)
        && this.datosBarraServicios().length != 0
      ) {
        if (!this.cargando) {
          this.cargando = true;
          this.enviarImagenesACouchdb();
        }
      } else {
        this.validaciones = {
          nombCate: false, descripDepart: false,
          usuario: false, gps: false, imagenes: false,
          servicios: false
        };
        if (!this.$refs.descripcionDepartamentoRef.valida()) {
          this.validaciones.descripDepart = true;
        }
        if (!this.$refs.nombreSitioCategoriaRef.valida()) {
          this.validaciones.nombCate = true;
        }
        if (this.user === null) {
          this.validaciones.usuario = true;
        }
        if (this.datosGPS().coordenadas[0] === null) {
          this.validaciones.gps = true;
        }
        if (((this.$refs.subirImagenRef.BImagenes).length === 0
          && (this.$refs.subirImagenRef.BImagenes2).length === 0)) {
          this.validaciones.imagenes = true;
        }
        if ((this.datosBarraServicios().length === 0)) {
          this.validaciones.servicios = true;
        }
        this.dialogErrorVisible = true;
      }
    },
    handleLogin(userInfo) {
      this.user = userInfo;
      localStorage.setItem('user', JSON.stringify(userInfo));
    },
    mostrarDialogo() {
      this.mostrar = true;
    },
    //Apartado de alerta ENVIAR
    cerrarDialogError() {
      this.validaciones = {
        nombCate: false, descripDepart: false,
        usuario: false, gps: false, imagenes: false,
        servicios: false
      };
      this.dialogErrorVisible = false;
    },
    cerrarDialog() {
      this.dialogVisible = false;
      this.$router.go(-1);
    },

    datosDynamicCalendar() {
      return this.$refs.dynamicCalendarRef.getD();
    },
    datosBarraServicios() {
      return this.$refs.barraServiciosRef.getD();
    },
    datosRedesNumeros() {
      return this.$refs.redesNumerosRef.getD();
    },
    datosBoletoEntrada() {
      return this.$refs.boletoEntradaRef.getD();
    },
    datosNombreSitioCategoria() {
      return this.$refs.nombreSitioCategoriaRef.getNombreCategoria();
    },
    datosDescripcionDepartamento() {
      return this.$refs.descripcionDepartamentoRef.getDescripcionDepartamento();
    },
    datosGPS() {
      return { coordenadas: this.$refs.geoCalizarRef.coordenadas, url: this.$refs.geoCalizarRef.urlGoogleMaps };
    },
    datosMedia() {
      var lista = this.$refs.subirImagenRef.BImagenes2;
      console.log(lista.length);
      for (let i = 0; i < lista.length; i++) {
        this.UImagenes.push(lista[i]);
      }
      return this.UImagenes;//retorna los datos de media, es decir las urls
    },
    createBy() {
      this.creador.fecha = new Date().toLocaleDateString('es-ES');
      return this.creador;
    },
    async getDatos(docId) {
      try {
        // Obtener los datos del documento
        var data = await sitios.get(docId);
        this.idDoc = data._id;
        this.rev = data._rev;
        this.$refs.nombreSitioCategoriaRef.setD({
          centerName: data.centerName,
          category: data.category
        });
        this.$refs.geoCalizarRef.setD(data.location);
        this.$refs.descripcionDepartamentoRef.setD({
          department: data.department,
          description: data.description,
          descripcion: data.descripcion,
        });
        this.$refs.subirImagenRef.setD(data.photos);
        this.$refs.dynamicCalendarRef.setD(data.schedule);
        this.$refs.barraServiciosRef.setD(data.services);
        this.$refs.boletoEntradaRef.setD(data.prices);
        this.$refs.redesNumerosRef.setD({
          phones: data.phones,
          contacts: data.contacts
        });
        this.creador = data.createBy;
        this.rankingT = data.ranking;
        this.rankingAverage1 = data.rankingAverage;
        /*
        // Convertir los datos a texto
        const text = JSON.stringify(data);
        const blob = new Blob([text], { type: 'text/plain' });

        // Crear una URL de objeto Blob
        const url = URL.createObjectURL(blob);

        // Crear un enlace de descarga
        const link = document.createElement('a');
        link.href = url;
        link.download = 'datos.txt';

        // Simular un clic en el enlace para iniciar la descarga
        link.click();

        // Liberar la URL del objeto Blob
        URL.revokeObjectURL(url);
        */
      } catch (error) {
        console.log("ocurrio error al obtener y cargar ", error);
      }

    },
    //aqui enpieza a subir las imagenes justo despues de darle enviar al sitio
    async enviarImagenesACouchdb() {
      try {
        var documento = {};
        var temp = "";
        const BImagenes = this.$refs.subirImagenRef.BImagenes;
        var response = "";
        for (const imagen of BImagenes) {
          temp = imagen.data;
          temp = temp.split(',')[1];
          documento = {
            "_attachments": {
              "imagen": {
                "content_type": imagen.type,
                "data": temp
              }
            }
          };
          response = await Nimagenes.post(documento);
          this.UImagenes.push(response.id);
        }
        await this.submitForm(); // Llamar al método para enviar los datos
      } catch (error) {
        console.error("Error al cargar las imágenes a Couchdb:", error);
      }
      //borrar imagenes eliminadas
      const imageBorrar = this.$refs.subirImagenRef.IBorrar;
      await Promise.all(imageBorrar.map((id) => this.eliminarImagen(id)));
    },
    //metodo para enviar el formulario con toda la data del sitio y las ids de las imagenes
    async submitForm() {
      // Lógica para enviar el formulario al servidor
      var data = {
        _id: this.idDoc,
        _rev: this.rev,
        centerName: this.datosNombreSitioCategoria().nombre,
        category: this.datosNombreSitioCategoria().categoria,
        department: this.datosDescripcionDepartamento().departamento,
        description: this.datosDescripcionDepartamento().description,
        descripcion: this.datosDescripcionDepartamento().descripcion,
        photos: this.datosMedia(),
        services: this.datosBarraServicios(),
        location: {
          url: this.datosGPS().url,
          latitude: this.datosGPS().coordenadas[0],
          longitude: this.datosGPS().coordenadas[1]
        },
        contacts: this.datosRedesNumeros().redes,
        prices: this.datosBoletoEntrada(),
        schedule: this.datosDynamicCalendar(),
        phones: this.datosRedesNumeros().telefonos,
        createBy: this.createBy(),
        ranking: this.rankingT,
        approved: false,
        rankingAverage: this.rankingAverage1
      };
      this.UImagenes = [];
      try {
        var documento = await Nsitios.put(data);
        console.log(documento.id);
        this.dialogVisible = true;
      } catch (error) {
        console.error("Error al enviar los datos a Couchdb:", error);
      }
      this.cargando = false;
    },
    async eliminarImagen(id) {
      Nimagenes.get(id).then(function (doc) {
        console.log(doc.id);
        return Nimagenes.remove(doc);
      }).then(function (result) {
        console.log('Documento eliminado con éxito:', result);
      }).catch(function (err) {
        console.log('Error al eliminar el documento:', err);
      });
    }
  }
};
</script>

<style lang="scss">
.titleSite {
  color: #014040;
  font-weight: 900;
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.form-container {
  background-color: #f0f0f0;
  border-radius: 0.475rem;
}

.q-field--filled .q-field__control {
  background: #ffff;
  color: #f27405;
}

.button-localize {
  position: relative;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}

body h6 {
  font-family: "Lora", serif;
}

body {
  font-size: 16px;
}

.button-container {
  position: relative;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
}

.text-caption {
  font-size: 12px;
}


@media screen and (max-width: 599.99px) {
  body h6 {
    font-size: 16px;
  }

  .titleSite {
    font-size: 22px;
  }

  .user-login {
    top: 0px;
    right: 25px;
  }
}

@media screen and (min-width: 600px) {
  .user-login {
    top: 60px;
    right: 120px;
  }
}

@media screen and (min-width: 1024px) {
  .user-login {
    right: 120px;
  }
}

@media screen and (min-width: 1440px) {
  .user-login {
    right: 150px;
  }
}
</style>

