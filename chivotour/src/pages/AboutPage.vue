<template>
  <div class="row justify-center">
    <div class="col-xs-12 col-sm-11 col-md-11 col-lg-10">
      <div class="image-wrapper" style="position: relative">
        <q-img class="image" :src="sitio && photos && photos.length > 0 ? photos[0] : ''" no-native-menu />
        <q-btn flat round dense @click="$router.go(-1)" style="position: absolute; top: 10px; left: 10px">
          <q-icon name="arrow_back" size="sm" color="white" />
        </q-btn>
        <!--Icono Favoritos -->
        <label class="favorite-container" @click="toggleFavorite($event)" :class="{ active: isFavorite }"
          style="position: absolute; top: 15px; right: 15px">
          <input type="checkbox" class="heart-container__checkbox favorite-hidden" />
          <q-tooltip class="gt-sm" transition-show="rotate" transition-hide="rotate">
            {{
              isFavorite
              ? $t("about.eliminarFavorito")
              : $t("about.agregarFavorito")
            }}
          </q-tooltip>
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
            <q-card-section class="text-h6">{{ $t("about.modalAñadirFavoritos") }}
              <q-icon name="info" size="sm" class="q-mx-sm q-mb-xs" color="orange" />
            </q-card-section>
            <p class="q-mx-md">{{ $t("about.modalAñadirFavoritosDos") }}</p>
            <q-card-actions align="right">
              <q-btn color="orange" label="Aceptar" @click="dialogFavorites = false" class="text-capitalize" />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <div class="text-container row">
          <div class="about-title subtitle q-ma-md col-xs-6 col-sm-8 col-md-8 col-lg-10">
            {{ sitio.centerName }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Informacion -->
  <div class="" v-if="showingInfo">
    <div class="icons-container gray-color subtitle">
      <div class="icon">
        <q-icon name="fmd_good" size="md" />
        <p class="q-my-sm">{{ sitio.department }}</p>
      </div>
      <q-separator vertical inset />
      <div class="icon">
        <q-icon :name="getIconName(sitio.category)" size="md" />
        <p class="q-my-sm">{{ $t("about." + sitio.category) }}</p>
      </div>
      <q-separator vertical inset />
      <div class="icon">
        <q-icon name="route" size="md" />
        <p class="q-my-sm">{{ distance }} km</p>
      </div>
    </div>
    <!-- Descripcion -->
    <div class="about q-pt-md separator separator-line">
      <span class="gray-color subtitle">{{ $t("about.acercaDelSitio") }}</span>
      <div class="row q-col-gutter-lg row-xs">
        <div class="col-md-12 col-sm-12 col-xs-12">
          <div class="description-box" style="margin: 2% auto">
            <div v-if="'es' === $i18n.locale">
              <p class="p-description">{{ sitio.descripcion }}</p>
            </div>
            <div v-else>
              <p class="p-description">{{ sitio.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Servicios -->
    <div class="row md-center">
      <div class="about q-pt-md separator separator-line col-lg-5 col-md-5 col-sm-8 col-xs-11">
        <span class="gray-color subtitle">{{
          $t("about.nuestrosServicios")
        }}</span>
        <div class="description-box">
          <q-list class="row justify-center">
            <q-item v-ripple class="q-mx-xs col-lg-5 col-md-5 col-sm-8 col-xs-8" v-for="item in sitio.services"
              :key="item.id" v-bind:class="{ 'gray-box': true }">
              <q-item-section avatar>
                <q-avatar color="secondary" text-color="white" :icon="item.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t("about." + item.name) }}
                  <!-- obtengo el tipo de la data y le cambio el idioma -->
                </q-item-label>
              </q-item-section>
              <q-separator spaced inset="item" />
            </q-item>
          </q-list>
        </div>
      </div>
      <!-- Ubicacion -->
      <div class="about q-pt-md separator ubication-movil col-lg-5 col-md-5 col-sm-8 col-xs-11">
        <span class="gray-color subtitle">{{ $t("about.ubicacion") }}</span>
        <div class="description-box" style="display: flex; flex-direction: column; height: 100%">
          <div style="flex-grow: 1">
            <AboutGeolocalizar v-if="retornar === false" :latitude1="latitude" :longitude1="longitude"
              :locationUrl="locationUrl" />
            <AboutGeolocalizar v-else :latitude1="latitude" :longitude1="longitude" :locationUrl="locationUrl" />
          </div>
        </div>
      </div>
    </div>
    <!-- Contacto -->
    <div class="about q-pt-lg separator separator-line">
      <span class="gray-color subtitle">{{
        $t("about.contactaConNosotros")
      }}</span>
      <div class="description-box row">
        <!--mostrar numeros de telefono-->
        <div v-if="hayNumero === true" class="q-mx-xs q-mt-sm">
          <q-icon name="phone" size="md" class="q-mr-sm" color="primary"></q-icon>
        </div>
        <div v-if="hayNumero === true" class="q-mr-md q-mt-sm">
          <template v-for="(phone, index) in sitio.phones" :key="index">
            <a class="row subtitle q-mr-xs" style="color: black" :href="'tel:+' + phone.numero">
              {{ phone.numero }}</a>
          </template>
        </div>
        <!--mostrar correo-->
        <div v-if="hayCorreo === true" class="q-mr-md q-mt-sm">
          <q-icon name="fa-solid fa-envelope" size="md" class="col q-mr-sm" color="primary"></q-icon>
          <template v-for="(item, index) in sitio.contacts" :key="index">
            <a v-if="item.name === 'email'" :href="'mailto:' + item.value" style="color: black">
              {{ item.value }}
            </a>
          </template>
        </div>
        <!--mostrar redes sociales-->
        <div class="q-mt-md">
          <template v-for="(item, index) in sitio.contacts" :key="index">
            <q-btn v-if="item.name === 'whatsapp' && item.value"
              class="q-mx-none q-px-none q-mt-xl bg-gradient text-white" round :icon="item.icon"
              :href="'https://wa.me/503' + item.value" target="_blank">
              <q-tooltip anchor="top middle" self="bottom middle">
                {{ $t("about." + item.name) }}
              </q-tooltip>
            </q-btn>
            <q-btn v-else-if="item.name !== 'email' && item.value" class="q-mx-none q-px-none" round
              :class="['bg-gradient-' + item.name, 'text-white']" :icon="item.icon" :href="item.value" target="_blank">
              <q-tooltip anchor="top middle" self="bottom middle">
                {{ $t("about." + item.name) }}
              </q-tooltip>
            </q-btn>
          </template>
        </div>
      </div>
    </div>

    <!--Comentarios y puntuaciones-->
    <div class="about q-pt-lg separator separator-line">
      <div class="row">
        <span class="gray-color subtitle col-md-2 col-sm-4 col-xs-4">{{
          $t("about.reseñas")
        }}</span>
        <div class="col-md-8 col-sm-7 col-xs-8 native-mobile-hide" style="display: flex; justify-content: flex-end">
          <q-btn :label="$t('about.añadirComentarios')" @click="addReview()" rounded :disable="!newCommentDisabled"
            class="q-px-md q-py-sm text-capitalize" style="color: #808080">
            <q-icon name="send" color="orange" class="q-ml-md" />
          </q-btn>
        </div>
      </div>
      <!-- Formulario para enviar reseñas-->
      <q-form v-if="isLoggedIn" class="modal-review">
        <q-dialog v-model="review">
          <q-card style="min-width: 375px" class="text-center">
            <q-card-section>
              <div class="text-h6">{{ $t("about.calificaSitio") }}</div>
            </q-card-section>
            <!-- Foto de el usuario-->
            <q-card-section class="q-pa-none">
              <q-avatar size="30px">
                <img :src="user
                  ? user.photoURL
                  : 'https://static.vecteezy.com/system/resources/thumbnails/005/544/770/small_2x/profile-icon-design-free-vector.jpg'
                  " />
                <q-tooltip transition-show="rotate" transition-hide="rotate">
                  {{ user ? user.displayName : "No se ha iniciado sesión" }}
                </q-tooltip>
              </q-avatar>
            </q-card-section>

            <q-card-section>
              <q-rating name="quality" v-model="quality" max="5" size="3em" color="primary" icon="star_border"
                icon-selected="star" no-dimming />
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-input v-model="comment" filled autofocus counter maxlength="200">
                <template v-slot:append>
                  <q-icon name="comment" />
                </template>
              </q-input>
            </q-card-section>
            <q-card-actions align="right" class="text-primary">
              <q-btn @click="resetFormReview" flat :label="$t('about.cancelar')" v-close-popup class="text-capitalize" />
              <q-btn @click="onSubmit" flat :label="$t('about.enviar')" type="submit" :disable="!reviewValida"
                v-close-popup class="text-capitalize" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-form>
      <!--Alerta si se desea agregar comentarios y no esta logueado-->
      <q-dialog v-model="dialogReview">
        <q-card>
          <q-card-section class="text-h6">{{ $t("about.sesionRequerida") }}
            <q-icon name="info" size="sm" class="q-mx-sm q-mb-xs" color="orange" />
          </q-card-section>
          <p class="q-mx-md">{{ $t("about.sesionRequeridaComentario") }}</p>
          <q-card-actions align="right">
            <q-btn color="orange" :label="$t('about.aceptar')" @click="dialogReview = false" class="text-capitalize" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- Lista de reseñas-->
      <div class="row list-box q-pb-md">
        <q-list v-if="hayComentarios === true" bordered padding class="col-xs-12 col-sm-10 col-md-8"
          style="background-color: #f0f0f0; border-radius: 0.4rem; font-size: ;">
          <template v-for="(item, index) in items" :key="index">
            <q-item>
              <q-item-section top avatar>
                <q-avatar>
                  <img :src="item.photoPerfil" alt="Avatar">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
                <q-item-label caption>{{ item.secondaryText }}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>{{ item.date }}</q-item-label>
                <div style="display: flex; align-items: center">
                  <q-icon v-for="(icon, index) in item.value" :key="index" name="star" color="orange" size="12px" />
                </div>
                <div v-if="userLogin == item.name" class="review-actions">
                  <q-btn class="q-pa-xs" @click="toggleOptionsReview(item)" flat rounded icon="more_horiz">
                  </q-btn>
                  <q-menu v-model="item.openOptionsReview" auto-close content-class="menu-content"
                    @before-show="closeOptionsReview" @before-hide="closeOptionsReview">
                    <q-list style="min-width: 120px; font-weight: 400" link dense>
                      <q-item clickable @click="editReview(item)">
                        <q-item-section avatar class="q-pr-xs" style="min-width: 1px">
                          <q-avatar>
                            <q-icon size="xs" name="edit" style="color: #808080;" />
                          </q-avatar>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{
                            $t("about.editarComentario")
                          }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable @click="deleteReview(item)">
                        <q-item-section avatar class="q-pr-xs" style="min-width: 1px">
                          <q-avatar>
                            <q-icon size="xs" name="delete" style="color: #808080;" />
                          </q-avatar>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{
                            $t("about.eliminarComentario")
                          }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </div>
              </q-item-section>
            </q-item>
            <q-separator spaced inset="item" />
            <!-- Formulario para editar reseñas-->
            <q-form>
              <q-dialog v-model="edit" class="modal-review">
                <q-card style="min-width: 375px" class="text-center">
                  <q-card-section>
                    <div class="text-h6">{{ $t("about.calificaSitio") }}</div>
                  </q-card-section>
                  <!-- Foto de el usuario-->
                  <q-card-section class="q-pa-none">
                    <q-avatar size="30px">
                      <img :src="user
                        ? user.photoURL
                        : 'https://static.vecteezy.com/system/resources/thumbnails/005/544/770/small_2x/profile-icon-design-free-vector.jpg'
                        " />
                      <q-tooltip transition-show="rotate" transition-hide="rotate">
                        {{
                          user ? user.displayName : "No se ha iniciado sesión"
                        }}
                      </q-tooltip>
                    </q-avatar>
                  </q-card-section>

                  <q-card-section>
                    <q-rating name="quality" v-model="quality" max="5" size="3em" color="primary" icon="star_border"
                      icon-selected="star" no-dimming />
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <q-input v-model="editcomment" type="textarea" filled autofocus counter maxlength="200">
                      <template v-if="editcomment" v-slot:append>
                        <q-icon name="comment" />
                      </template>
                    </q-input>
                  </q-card-section>
                  <q-card-actions align="right" class="text-primary">
                    <q-btn @click="resetFormReview" flat :label="$t('about.cancelar')" v-close-popup
                      class="text-capitalize" />
                    <q-btn @click="onSubmitEdit" flat :label="$t('about.enviar')" type="submit"
                      :disable="!reviewValidaEdit" v-close-popup class="text-capitalize" />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </q-form>
          </template>
        </q-list>
        <q-list v-else bordered padding class="col-xs-12 col-sm-10 col-md-8"
          style="background-color: #f0f0f0; border-radius: 0.4rem">
          <template v-for="(item, index) in items" :key="index">
            <q-item>
              <q-item-section top avatar>
                <q-avatar>
                  <img src="../assets/logo.png" alt="Avatar" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-center">{{
                  $t("about.nohaycomentario")
                }}</q-item-label>
                <q-item-label caption class="text-center">{{
                  $t("about.ayudacomentario")
                }}</q-item-label>
              </q-item-section>
              <q-item-section top avatar>
                <q-avatar icon="comment"> </q-avatar>
              </q-item-section>
            </q-item>
            <q-separator spaced inset="item" />
          </template>
        </q-list>
      </div>
    </div>
  </div>

  <!-- Imagenes de el sitio turistico-->
  <div class="about separator-line separator-images" v-if="showingImages">
    <div class="row justify-center align-items-center">
      <q-icon name="image" size="md" class="header q-mr-sm q-pt-md"></q-icon>
      <h5 class="header q-pt-md" style="margin-bottom: 1rem">
        {{ $t("about.imagenes") }}
      </h5>
    </div>
    <div class="row q-col-gutter-xs q-pb-md custom-images justify-center">
      <div class="col-lg-3 col-md-3 col-sm-4 col-xs-4" v-for="(imagen, index) in photos" :key="index">
        <q-img class="img-fluid img-gallery" :src="imagen" :alt="imagen" @click="openDialog(imagen)"></q-img>
      </div>
    </div>
    <q-dialog v-model="dialogVisible" style="backdrop-filter: blur(4px)">
      <q-carousel arrows transition-prev="slide-right" transition-next="slide-left" swipeable animated infinite
        v-model="slide" class="bg-whiterounded-borders carousel-movil q-ma-none q-pa-none" :autoplay="autoplay"
        style="overflow: hidden; height: auto; width: auto">
        <q-carousel-slide v-for="(imagen, index) in photos" :key="index" :name="index" class="q-pa-none q-ma-none">
          <div class="image-container">
            <img :src="imagen" :style="{ maxWidth: '100%', maxHeight: '100%' }" />
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-dialog>
  </div>

  <!-- Horarios -->
  <div v-if="showingSchedule">
    <div class="row justify-center">
      <q-icon name="access_time" size="md" class="header q-mr-xs q-pt-md"></q-icon>
      <h5 class="header q-pt-md" style="margin-bottom: 0.1rem">
        {{ $t("about.horarios") }}
      </h5>
    </div>
    <!--Horario mejorado con data-->
    <div class="row justify-center q-py-md items-center">
      <div class="q-px-md q-py-md col-lg-6 col-md-6 col-sm-8 col-xs-10">
        <q-timeline :layout="layout" color="secondary" class="subtitle">
          <template v-for="(item1, index) in sitio.schedule" :key="index">
            <q-timeline-entry :title="sitio.schedule[index].ranges[0].start +
              ' am -' +
              sitio.schedule[index].ranges[0].end +
              ' pm'
              " :subtitle="$t('about.' + item1.day)">
            </q-timeline-entry>
          </template>
        </q-timeline>
      </div>
    </div>
  </div>

  <!-- Precios -->
  <div class="" v-if="showingPrices">
    <div class="row justify-center align-items-center">
      <q-icon name="sell" size="md" class="header q-mr-sm q-pt-md"></q-icon>
      <h5 class="header q-pt-md" style="margin-bottom: 0rem">
        {{ $t("about.precios") }}
      </h5>
    </div>
    <div class="row q-px-lg justify-center">
      <div class="col-lg-2 col-md-3 col-sm-5 col-xs-9" v-for="(card, index) in sitio.prices" :key="index">
        <q-card v-if="sitio.prices.length > 0 && card.type != 'EveryOne'" class="my-card text-black q-ma-md">
          <q-card-section>
            <div class="text-subtitle1" style="color: #f27405; font-weight: 400">
              {{ $t("about." + card.type) }}
              <!-- obtengo el tipo de la data y le cambio el idioma -->
            </div>
            <div class="text-h4 q-mt-xs">
              <span v-if="card.amount === 0.0 || card.amount === '0.00'">
                {{ $t("about.gratis") }}
              </span>
              <span v-else>
                <q-icon name="attach_money" size="xs" class="q-mb-lg" />{{
                  card.amount
                }}
              </span>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-icon name="done" size="xs" class="q-mr-xs" color="positive" />
            <span class="">{{ $t("about.entradaInstalaciones") }}</span>
          </q-card-section>
        </q-card>
        <!--Para el caso que no se agregue ningun precio-->
        <q-card v-else class="my-card text-black q-ma-md">
          <q-card-section>
            <div class="text-subtitle1" style="color: #f27405; font-weight: 600">
              {{ $t("about.general") }}
            </div>
            <div class="text-h4 q-mt-x" style="color: black; font-weight: 600">
              {{ $t("about.entradaGratis") }}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-icon name="done" size="xs" class="q-mr-xs" color="positive" />
            <span class="">{{ $t("about.entradaInstalaciones") }}</span>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>

  <q-footer class="bg-gradient q-pt-xs">
    <q-tabs class="justify-between q-mx-lg" v-model="tab" narrow-indicator>
      <q-tab rounded icon="info" name="info" @click="showInfo" class="text-capitalize">
        <span class="tab-label custom-style">{{
          $t("about.informacion")
        }}</span>
        <q-tooltip class="gt-sm" anchor="bottom middle" self="top middle">{{
          $t("about.informacion")
        }}</q-tooltip>
      </q-tab>

      <q-tab icon="image" @click="showImages" class="text-capitalize">
        <span class="tab-label">{{ $t("about.imagenes") }}</span>
        <q-tooltip class="gt-sm" anchor="bottom middle" self="top middle">{{
          $t("about.imagenes")
        }}</q-tooltip>
      </q-tab>
      <q-tab icon="sell" @click="showPrices" class="text-capitalize">
        <span class="tab-label">{{ $t("about.precios") }}</span>
        <q-tooltip class="gt-sm" anchor="bottom middle" self="top middle">{{
          $t("about.precios")
        }}</q-tooltip>
      </q-tab>
      <q-tab icon="schedule" @click="showSchedule" class="text-capitalize">
        <span class="tab-label">{{ $t("about.horarios") }}</span>
        <q-tooltip class="gt-sm" anchor="bottom middle" self="top middle">{{
          $t("about.horarios")
        }}</q-tooltip>
      </q-tab>
    </q-tabs>
  </q-footer>
</template>

<script>
import { defineComponent, ref } from "vue";
import { computed } from "vue";
import useQuasar from "quasar/src/composables/use-quasar.js";
import AboutGeolocalizar from "components/AboutGeolocalizar.vue";
import { Nsitios, sitios, url } from "../boot/pouchdb.js";

export default defineComponent({
  name: "AboutPage",

  components: {
    AboutGeolocalizar,
  },

  methods: {
    showInfo() {
      this.showingInfo = true;
      this.showingImages = false;
      this.showingSchedule = false;
      this.showingPrices = false;
    },
    showImages() {
      this.showingInfo = false;
      this.showingImages = true;
      this.showingSchedule = false;
      this.showingPrices = false;
    },
    showSchedule() {
      this.showingInfo = false;
      this.showingImages = false;
      this.showingSchedule = true;
      this.showingPrices = false;
    },
    showPrices() {
      this.showingInfo = false;
      this.showingImages = false;
      this.showingSchedule = false;
      this.showingPrices = true;
    },
    openDialog(imagen) {
      this.dialogVisible = true;
      this.slide = this.photos.indexOf(imagen);
    },

    getIconName(category) {
      if (category === "Playas") {
        return "beach_access";
      } else if (category === "Bosques") {
        return "forest";
      } else if (category === "Balnearios") {
        return "pool";
      } else if (category === "Ruinas") {
        return "temple_hindu";
      } else if (category === "Museos") {
        return "museum";
      } else if (category === "Iglesias") {
        return "church";
      }
      return "star";
    },

    toggleFavorite(event) {
      event.preventDefault();
      const idSitio = this.sitio._id;

      if (this.isFavorite) {
        const index = this.favorites.indexOf(idSitio);
        if (index !== -1) {
          this.favorites.splice(index, 1);
        }
      } else {
        this.favorites.push(idSitio);
      }

      this.isFavorite = !this.isFavorite;
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    }
    ,

    async cargarDatos() {
      const idDetalles = this.$route.params.idDetalles;
      const sitio = await sitios.get(idDetalles);
      // const cardStore = useCardStore();
      // const cards = cardStore.approvedCards;
      // const sitio = cards.find((card) => card.id === idDetalles);
      if (sitio) {
        this.sitio = sitio;
        this.location = this.sitio.location;
        this.latitude = this.location.latitude;
        this.longitude = this.location.longitude;
        // Convierte el string de latitude y longitude a número utilizando parseFloat()
        const latitudeString = this.latitude;
        const latitudeNumber = parseFloat(latitudeString);
        this.latitude = latitudeNumber; // pasar la latitude de la ubicacion
        const longitudeString = this.longitude;
        const longitudeNumber = parseFloat(longitudeString);
        this.longitude = longitudeNumber; // pasar la longitude de la ubicacion
        this.locationUrl = this.sitio.location.url; // pasar la url de la ubicacion
        //------------------------
        this.retornar = true;
        // obtener las fotos
        this.IDphotos = this.sitio.photos;
        for (let i = 0; i < this.IDphotos.length; i++) {
          this.photos[i] = url + this.IDphotos[i] + "/imagen";
        }
        // comprobar si hay numero
        this.hayNumero = this.sitio.phones.length > 0;
        // comprobar si hay correo
        for (let i = 0; i < this.sitio.contacts.length; i++) {
          if (this.sitio.contacts[i].name === "email") {
            if (this.sitio.contacts[i].value !== "") {
              this.hayCorreo = true;
              break;
            }
          }
        }
        // Mostrar comentarios

        if (this.user) {
          this.userLogin = this.user.displayName;
        }

        const comentarios = this.sitio.ranking;
        if (comentarios) {
          for (let i = 0; i < comentarios.length; i++) {
            this.hayComentarios = true;
            if (comentarios[i].usuario === this.userLogin) {
              this.mycomentario = true;
              this.newCommentDisabled = false;
              this.editcomment = comentarios[i].comentario;
            }
            this.items[i] = {
              name: comentarios[i].usuario,
              secondaryText: comentarios[i].comentario,
              date: comentarios[i].fecha,
              photoPerfil: comentarios[i].photoPerfil,
              value: comentarios[i].value,
            };
          }
        }
        const mapaTildes = {
          á: "a",
          é: "e",
          í: "i",
          ó: "o",
          ú: "u",
          Á: "A",
          É: "E",
          Í: "I",
          Ó: "O",
          Ú: "U",
          ü: "u",
          Ü: "U",
          ñ: "n",
          Ñ: "N",
        };

        var horario = this.sitio.schedule;
        for (let i = 0; i < horario.length; i++) {
          this.sitio.schedule[i] = {
            day: horario[i].day.replace(
              /[áéíóúÁÉÍÓÚüÜñÑ]/g,
              (letra) => mapaTildes[letra]
            ),
            ranges: horario[i].ranges,
          };
        }
        // Guardar los datos en el local storage
        // localStorage.setItem('sitio', JSON.stringify(sitio));
      }

      // Calcular la distancia
      const storedPosition = localStorage.getItem("position");
      if (storedPosition) {
        const position = JSON.parse(storedPosition);
        this.latitudeDistance = position.latitude;
        this.longitudeDistance = position.longitude;

        const siteLatitude = this.latitude;
        const siteLongitude = this.longitude;

        this.calculateDistance(
          this.latitudeDistance,
          this.longitudeDistance,
          siteLatitude,
          siteLongitude
        );
      }
    },
    calculateDistance(latp1, longp1, latp2, longp2) {
      //convierte las coordenadas de grados a radianes
      const latp1ToRad = this.degToRad(latp1);
      const longp1ToRad = this.degToRad(longp1);
      const latp2ToRad = this.degToRad(latp2);
      const longp2ToRad = this.degToRad(longp2);

      //Radio aproximado de la tierra en kilometros
      const earthRadius = 6371.0;

      //Diferencia en latitud y longitud
      const deltaLatitude = latp2ToRad - latp1ToRad;
      const deltaLongitude = longp2ToRad - longp1ToRad;

      //Formula de Haversine
      const a =
        Math.sin(deltaLatitude / 2) ** 2 +
        Math.cos(latp1ToRad) *
        Math.cos(latp2ToRad) *
        Math.sin(deltaLongitude / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      //Calcular la distancia en kilometros
      const distance = earthRadius * c;

      this.distance = distance.toFixed(1);
    },

    degToRad(deg) {
      return deg * (Math.PI / 180.0);
    },
    resetFormReview() {
      this.comment = "";
      this.quality = 0;
    },

    addReview() {
      if (this.user) {
        this.isLoggedIn = true;
        this.review = true;
        //console.log(this.user.displayName)
      } else {
        // El usuario no está autenticado, muestra el diálogo modal
        this.dialogReview = true;
      }
    },
    editReview() {
      this.edit = true;
    },

    validarCamposReview(quality, comment) {
      this.reviewValida =
        quality !== null && quality !== 0 && comment.trim() !== "";
    },
    validarCamposReviewEdit(quality, editcomment) {
      this.reviewValidaEdit =
        quality !== null && quality !== 0 && editcomment.trim() !== "";
    },

    getUsuario() {
      return this.user.displayName;
    },
    getFotoUsuario() {
      return this.user.photoURL;
    },
    getEmail() {
      return this.user.email;
    },
    getFecha() {
      return new Date().toLocaleDateString("es-ES");
    },

    //Enviar comentarios y puntuaciones
    async onSubmit() {
      const formData = {
        user: this.getUsuario(),
        email: this.getEmail(),
        userPhoto: this.getFotoUsuario(),
        quality: this.quality,
        comment: this.comment,
        fecha: this.getFecha(),
      };

      const documentId = this.$route.params.idDetalles;
      // Se obtiene el documento existente y verifica si el campo "ranking" existe
      try {
        const doc = await Nsitios.get(documentId);

        if (!doc.ranking) {
          doc.ranking = [];
        }

        const nuevoComentario = {
          value: formData.quality,
          usuario: formData.user,
          email: formData.email,
          fecha: formData.fecha,
          comentario: formData.comment,
          photoPerfil: formData.userPhoto,
        };

        doc.ranking.push(nuevoComentario);

        // Calcular el promedio
        const sumaValoraciones = doc.ranking.reduce((total, comentario) => total + comentario.value, 0);
        doc.rankingAverage = (sumaValoraciones / doc.ranking.length).toFixed(1);

        // Actualizar el documento para colocar el valor en rankingAverage
        await Nsitios.put(doc);

        this.quality = 0;
        this.comment = "";

        this.$q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: this.$t("about.comentarioAgregado"),
        });
      } catch (error) {
        console.error("Error al agregar el comentario:", error);
      }
    },

    //Editar los comentarios y puntuaciones
    async onSubmitEdit() {
      const formData = {
        user: this.getUsuario(),
        email: this.getEmail(),
        userPhoto: this.getFotoUsuario(),
        quality: this.quality,
        comment: this.editcomment,
        fecha: this.getFecha(),
      };

      const documentId = this.$route.params.idDetalles;

      // Se obtiene el documento existente y verifica si el campo "ranking" existe
      try {
        const doc = await Nsitios.get(documentId);

        if (!doc.ranking) {
          doc.ranking = [];
        }

        const editComentario = {
          value: formData.quality,
          usuario: formData.user,
          email: formData.email,
          fecha: formData.fecha,
          comentario: formData.comment,
          photoPerfil: formData.userPhoto,
        };

        // Busca el índice del comentario a editar
        const index = doc.ranking.findIndex(
          (comentario) => comentario.email === this.user.email
        ); // this.user.email es el usuario actual actualmente logueado

        if (index !== -1) {
          // Si se encuentra el comentario, actualiza su información
          doc.ranking[index] = editComentario;
        } else {
          doc.ranking.push(editComentario);
        }

        // Recalcula rankingAverage
        if (doc.ranking.length > 0) {
          const sumaValoraciones = doc.ranking.reduce((total, comentario) => total + comentario.value, 0);
          doc.rankingAverage = (sumaValoraciones / doc.ranking.length).toFixed(1);
        } else {
          doc.rankingAverage = 0;
        }
        await Nsitios.put(doc);

        this.quality = 0;
        this.comment = "";

        this.$q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: this.$t("about.comentarioActualizado"),
        });
      } catch (error) {
        console.error("Error al agregar el comentario:", error);
      }
    },
    async deleteReview() {
      const documentId = this.$route.params.idDetalles;
      try {
        const doc = await Nsitios.get(documentId);

        if (!doc.ranking) {
          return;
        }
        // Busca el índice del comentario a eliminar en la matriz de comentarios en función del email del usuario actual
        const index = doc.ranking.findIndex(
          (comentario) => comentario.email === this.user.email
        );

        if (index !== -1) {
          doc.ranking.splice(index, 1);

          // Recalcula rankingAverage
          if (doc.ranking.length > 0) {
            const sumaValoraciones = doc.ranking.reduce((total, comentario) => total + comentario.value, 0);
            doc.rankingAverage = (sumaValoraciones / doc.ranking.length).toFixed(1);
          } else {
            doc.rankingAverage = 0;
          }

          await Nsitios.put(doc);

          this.$q.notify({
            color: "red-4",
            textColor: "white",
            icon: "delete",
            message: this.$t("about.comentarioEliminado"),
          });
        } else {
          this.$q.notify({
            color: "orange-4",
            textColor: "white",
            icon: "warning",
            message: this.$t("about.comentarioNoEncontrado"),
          });
        }
      } catch (error) {
        console.error("Error al eliminar el comentario:", error);
      }
    },

    toggleOptionsReview(review) {
      this.selectedReview = review;
      this.openOptionsReview = !this.openOptionsReviewReview;
    },
    closeOptionsReview() {
      this.openOptionsReview = false;
    },
  },

  watch: {
    quality(newValue) {
      this.validarCamposReview(newValue, this.comment);
      this.validarCamposReviewEdit(newValue, this.editcomment);
    },
    comment(newValue) {
      this.validarCamposReview(this.quality, newValue);
      this.validarCamposReviewEdit(this.quality, newValue);
    },
  },

  mounted() {
    // Seleccionar idioma
    this.$i18n.locale = localStorage.getItem("languaje");
    // -----------------------
    this.showInfo();
    this.cargarDatos();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }

    const idSitio = this.$route.params.idDetalles;
    // console.log(idSitio);
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
      this.isFavorite = this.favorites.includes(idSitio);
    }
  },

  unmounted() {
    localStorage.removeItem("sitio");
  },

  data() {
    const $q = useQuasar();

    return {
      hayComentarios: false,
      user: null,
      locationUrl: null,
      latitudeDistance: null,
      longitudeDistance: null,
      distance: null,
      hayCorreo: false,
      hayNumero: false,
      slide: ref(1),
      dialogVisible: false,
      photos: ref([]),
      showCarousel: false,
      autoplay: true,
      retornar: false,
      location: ref({}),
      latitude: ref(0),
      longitude: ref(0),
      sitio: ref({}),
      carousel: ref(false),
      showingInfo: true,
      showingImages: false,
      showingSchedule: false,
      showingPrices: false,
      tab: ref("info"),
      ratingModel: ref(1),
      isFavorite: false,
      favorites: [],
      dialogFavorites: false,
      submitResult: ref([]),
      comment: ref(""),
      quality: ref(0),
      review: ref(false),
      dialogReview: ref(false),
      isLoggedIn: ref(false),
      reviewValida: false,
      reviewValidaEdit: false,
      mycomentario: ref(false),
      edit: ref(false),
      editcomment: ref(""),
      userLogin: ref(""),
      newCommentDisabled: ref(true),
      layout: computed(() => {
        return $q.screen.lt.sm
          ? "dense"
          : $q.screen.lt.md
            ? "comfortable"
            : "loose";
      }),

      items: [
        {
          name: "",
          secondaryText: "",
          date: "",
        },
      ],
    };
  },
});
</script>

<style lang="scss">
/******************************************
 * ABOUT                                  *
*******************************************/
.subtitle {
  font-family: "Hind Madurai", sans-serif;
}

.image-wrapper {
  position: relative;
  overflow: hidden;

  .image {
    height: 250px;
    filter: brightness(0.3);
  }
}

.text-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: start;

  .about-title {
    font-weight: bold;
    font-size: 25px;
    color: white;
    padding: 10px;
  }
}

.icons-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;

  .icon {
    width: 33.3%;
    text-align: center;
  }
}

.gray-color {
  font-weight: 500;
  color: #999999;
}

.about {
  font-size: 20px;
}

.description-box {
  display: flex;
  justify-content: center;
  text-align: justify;

  font: {
    size: 16px;
    weight: 400;
  }

  margin-top: 4%;
  margin-bottom: 4%;
}

.list-box {
  display: flex;
  justify-content: center;

  font: {
    size: 16px;
  }

  margin-top: 4%;
  margin-bottom: 4%;
}

.separator {
  border-top: 2px solid #e0e0e0;
  padding-bottom: 0px;
}

.separator-line {
  margin-left: 5%;
  margin-right: 5%;
}

.gray-box {
  background-color: #f0f0f0;
  margin-bottom: 10px;
  border-left: 2px solid #f27405;
}

.button-container {
  position: relative;
  bottom: 13%;
  left: 50%;
  transform: translateX(-50%);
}

.description-box a {
  margin: 0 15px;
}

.favorite-hidden {
  display: none;
}

.bg-gradient-instagram {
  background-image: linear-gradient(to right, #405de6, #e1306c, #f77737);
}

.bg-gradient-facebook {
  background-image: linear-gradient(to right, #000fff, #000fff);
}

.bg-gradient-twitter {
  background-image: linear-gradient(to right, #1da1f2, #1da1f2);
}

.bg-gradient-tiktok {
  background-image: linear-gradient(to right, #ff0050, #00f2ea, #4e4e4e);
}

.bg-gradient-youtube {
  background-image: linear-gradient(to right, #ff0000, #c70505);
}

.favorite-container {
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
    height: 25px;
    width: 25px;
    transition: all 0.3s;
    fill: transparent;
    stroke: rgba(238, 238, 238, 0.692);
    stroke-width: 2px;

    &:hover {
      transform: scale(1.3);
    }
  }
}

.active svg {
  fill: #e3474f;
}

.text-caption {
  font-size: 12.5px;
  color: rgba(0, 0, 0, 0.719);
}

.review-actions {
  display: flex;
  align-items: center;
}

.modal-review {
  backdrop-filter: blur(2px);
}

/******************************************
 * FOOTER                                 *
*******************************************/
.q-tab--inactive {
  opacity: 0.8;
}

.tab-label {
  margin: 3px 0;
  font-size: 12px;
  font-family: "Hind Madurai", sans-serif;
  font-weight: 700;
}

.bg-gradient {
  background-image: linear-gradient(to right, #014040, #02735e, #03a678);
}

.header {
  margin-top: 2px;
  color: #999999;
  font-weight: 600;
}

/******************************************
 * HORARIOS                                *
*******************************************/
.q-timeline__subtitle {
  font-size: 1.1rem;
  text-transform: capitalize;
  font-weight: 600;
  color: #000;
}

.q-timeline {
  h6 {
    font-size: 1.1rem;
    color: #999999;
    margin-left: 20px;
  }

  .text-secondary {
    color: #f27405 !important;
  }

  .q-timeline__content {
    padding-bottom: 10px;
  }
}

.q-tab__icon {
  font-size: 25px;

  &:hover {
    transform: scale(1.2);
  }
}

/******************************************
 * Contenedor de imagenes para carousel   *
*******************************************/
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.img-gallery {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;

  img {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}

/******************************************
 * PRECIOS                                *
*******************************************/

.my-card {
  border-left: 2px solid #f27405;
  text-align: center;
  background: radial-gradient(circle, #ffff 0%, #ffff 100%);
}

// according to screen size
@media screen and (min-width: 400px) {
  .text-container {
    .about-title {
      font-size: 28px;
    }
  }
}

@media screen and (min-width: 599.99px) {
  .text-container {
    .about-title {
      font-size: 28px;
    }
  }

  .image-wrapper {
    border-radius: 0.525rem;
    margin-top: 2%;

    .image {
      height: 275px;
    }
  }

  .q-col-gutter-lg>* {
    padding-bottom: 0px;
    padding-top: 24px;
  }

}

@media (max-width: 600px) {
  .q-col-gutter-lg>* {
    padding-bottom: 0px;
    padding-top: 10px;
  }

  .row-xs .p-description {
    margin-top: 10px;
    margin-bottom: 0px;
  }

  .carousel-movil {
    height: 375px;
  }

  .separator-images {
    margin: auto 2%;
  }

  .list-box {
    font: {
      size: 14px;
    }
  }

  .text-caption {
    font-size: 12px;
  }
}

@media screen and (min-width: 1023px) {
  .text-container {
    .about-title {
      font-size: 30px;
    }
  }
}

@media screen and (max-width: 1024px) {
  .ubication-movil {
    margin-left: 5%;
    margin-right: 5%;
  }

  .md-center {
    justify-content: center;
  }
}

@media screen and (min-width: 1440px) {
  .about {
    .custom-images {
      margin-left: 4%;
      margin-right: 4%;
    }
  }

  .q-tab {
    min-height: 60px;
    padding: 0 26px;
  }

  .q-tab__icon {
    padding-top: 10px;
    font-size: 36px;
  }

  .tab-label {
    padding: 6px 0;
  }
}
</style>
