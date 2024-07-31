<template>
  <!-- lHh lpr lFf -->
  <q-layout view="hHh Lpr lFf" container class="body">
    <div class="ues-banner" v-if="banner">
      <div class="ues-banner__close" @click="closeBanner">
        <q-icon name="fa-solid fa-xmark" class="ues-banner__close-icon" />
      </div>
    </div>
    <DesktopHeader @change-mode="changeMode" :esAdmin="esAdmin" :showSignOff="showSignOff" />
    <MobileHeader :categoryList="categoryList" @toggle-left-drawer="toggleLeftDrawer"
      @toggle-drawer-filter="toggleDrawerFilter" @choose-category="chooseCategory" v-model="filterText" />
    <!-- Footer -->
    <MobileFooter @choose-mode="chooseMode" @show-random-site="showRandomSiteFirst" />
    <!-- Page container -->
    <q-page-container class="spacing">
      <div class="hide-on-mobile">
        <div class="flex justify-center desktop-search" v-if="!mapMode">
          <div class="q-px-md">
            <input type="text" v-model="filterText" :placeholder="$t('index.buscar')" class="desktop-search-input" />
            <q-icon name="fa-solid fa-magnifying-glass" class="desktop-search-icon" />
          </div>
          <div class="desktop-search-select">
            <!--Filtro de Categorias-->
            <select @change="setCategory($event.target.value)">
              <option v-for="category in categoryList" :key="category.id" :value="category.name">{{ category.name }}
              </option>
            </select>
            <q-icon name="fa-solid fa-angle-up" class="desktop-search-select-icon" />
          </div>
        </div>
      </div>
      <q-page class="q-pa-md" v-if="!mapMode">
        <div class="cards-container">
          <InfoCard v-for="(card, index) in paginatedSites" :key="index" :card="card" :is-favorite="isFavorite(card.id)"
            @toggle-favorite="toggleFavorite" />
        </div>

      </q-page>
      <q-page v-if="mapMode">
        <div class="text-center text-weight-bold text-h4">
          <MapMode />
        </div>
      </q-page>
      <div class="flex flex-center q-pb-xl">
        <q-pagination v-model="currentPage" :max="pageCount" @input="goToPage" direction-links flat size="16px" />
      </div>
    </q-page-container>
    <!-- Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above :width="300" :breakpoint="700" elevated class="hide-on-desktop">
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <ul class="drawer__list">
          <!-- Seleccion de Idioma -->
          <li class="drawer__item" style="padding-bottom: 0;">
            <div class="drawer__item--icon drawer__item--icon-1">
              <q-icon name="fa-solid fa-flag" />
            </div>
            <q-select class="drawer__item" v-model="selectedLanguage" :options="localeOptions" dense borderless emit-value
              map-options options-dense style="min-width: 100px" />
          </li>
          <!-- Principal -->
          <q-item style="padding: 0;" clickable to="/">
            <li class="drawer__item">
              <div class="drawer__item--icon drawer__item--icon-2">
                <q-icon name="fa-solid fa-house" />
              </div>
              <div class="drawer__item--text">
                {{ $t('index.principal') }}
              </div>
            </li>
          </q-item>
          <!-- Agregar Nuevo sitio -->
          <q-item style="padding: 0;" clickable to="/agregar_sitios" v-if="user">
            <li class="drawer__item">
              <div class="drawer__item--icon drawer__item--icon-5">
                <q-icon name="fa-solid fa-plus" />
              </div>
              <div class="drawer__item--text">
                {{ $t('index.agregar') }}
              </div>
            </li>
          </q-item>
          <!-- Administrar sitios -->
          <q-item class="hide-on-mobile" v-if="esAdmin === true" style="padding: 0;" clickable to="/administrar_sitios">
            <li class="drawer__item">
              <div class="drawer__item--icon drawer__item--icon-9">
                <q-icon name="fa-solid fa-hammer" />
              </div>
              <div class="drawer__item--text">
                {{ $t('index.administrar') }}
              </div>
            </li>
          </q-item>
          <!--Mis Sitios-->
          <q-item v-if="user" class="drawer__item" style="padding: 0;" clickable to="/mis_sitios">
            <li class="drawer__item">
              <div class="drawer__item--icon drawer__item--icon-3">
                <q-icon name="fa-solid fa-check" />
              </div>
              <div class="drawer__item--text">
                {{ $t('index.misSitios') }}
              </div>
            </li>
          </q-item>
          <!-- Favoritos -->
          <q-item style="padding: 0;" clickable to="/mis_favoritos">
            <li class="drawer__item">
              <div class="drawer__item--icon drawer__item--icon-4">
                <q-icon name="fa-solid fa-heart" />
              </div>
              <div class="drawer__item--text">
                {{ $t('index.favoritos') }}
              </div>
            </li>
          </q-item>
          <!-- Sitio Web -->
          <q-item style="padding: 0;" clickable href="https://website.chivotour.com/" target="_blank">
            <li class="drawer__item">
              <div class="drawer__item--icon drawer__item--icon-6">
                <q-icon name="fa-solid  fa-earth-americas" />
              </div>
              <div class="drawer__item--text">
                {{ $t('index.sitioWeb') }}
              </div>
            </li>
          </q-item>
          <!-- Iniciar sesion -->
          <newLogin2 v-if="!user" @login="handleLogin" class="native-mobile-hide" />
          <q-item clickable @click="signOff" class="drawer__item" v-if="user">
            <div class="drawer__item--icon drawer__item--icon-8">
              <q-icon name="fa-solid fa-arrow-right-from-bracket" />
            </div>
            <div class="drawer__item--text">
              {{ $t('index.cerrarSesion') }}
            </div>
          </q-item>
        </ul>
      </q-scroll-area>
      <div class="logo2 flex flex-center native-mobile-only">
        <q-img src="../assets/ChivoTour.png" spinner-color="white" style="height: auto; max-width: 40%" />
      </div>
      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img :src="user.photoURL" v-if="user">
          </q-avatar>
          <div class="text-weight-bold" v-if="user">{{ user.displayName }}</div>
        </div>
      </q-img>
    </q-drawer><!--Fin Drawer-->
    <!-- Filtros -->
    <q-drawer v-model="leftDrawerFilter" show-if-above :width="300" :breakpoint="700" elevated style="padding: 30px">
      <div class="flex justify-between q-mb-md">
        <p class="text-h6 text-weight-medium">{{ $t('index.filtros') }}</p>
        <q-icon name="fa-solid fa-arrow-left" @click="toggleDrawerFilter" style="font-size: 20px;"
          class="hide-on-desktop" />
      </div>
      <p class="text-h6 text-weight-medium mobile-hide" style="color: #F27405">{{ $t('index.tipo') }}</p>
      <!--Filtro de Categorias-->
      <select class="select__category q-mb-md mobile-hide" @change="setCategory($event.target.value)">
        <option v-for="category in categoryList" :key="category.id" :value="category.name">{{ category.name }}</option>
      </select>
      <p class="text-h6 text-weight-medium" style="color: #F27405">{{ $t('index.departamento') }}</p>
      <div class="departments" ref="departmentsRef">
        <div class="cntr" v-for="       department       in       departmentList      " :key="department.id">
          <input type="checkbox" :id="department.name" class="hidden-xs-up icbx" @click="filterCards(department.name)"
            :ref="department.name" />
          <label :for="department.name" class="cbx q-mr-md q-mb-sm"></label>
          <div style="font-size: 16px;">{{ department.name }}</div>
        </div>
      </div>
      <div class="show-all-departments-box q-mb-md" @click="showAllDepartments">
        <p>{{ $t('index.verMas') }}</p>
        <q-icon name="fa-solid fa-angle-down" />
      </div>
      <p class="text-h6 text-weight-medium" style="color: #F27405">{{ $t('index.valoracion') }}
      </p>
      <div class="flex items-center q-mb-md" v-for="     rating     in     ranking     " :key="rating.value">
        <!-- <label class="container q-mr-sm">
          <input type="radio" name="ranking">
          <q-radio v-model="selectedRating" :val="rating.value" color="orange" />
          <div class="checkmark"></div>
        </label> -->
        <q-radio v-model="selectedRating" :val="rating.value" color="orange" />
        <q-rating v-model="rating.value" max="5" size="20px" color="grey" icon="star_border" icon-selected="star"
          icon-half="star_half" readonly class="q-mr-sm" />
        <p style="margin: 0; color: #AFAFAF">({{ rating.value }} {{ $t('index.rango') }})</p>
      </div>
      <div class="apply-filters q-mt-xl">
        <!-- <q-btn flat style="margin: 0;">{{ $t('index.filtros') }}</q-btn> -->
        <q-btn flat style="margin: 0;" @click="cleanFilters">{{ $t('index.limpiar') }}</q-btn>
      </div>
    </q-drawer>
    <div class="modal" ref="modalRef" @click="closeModal">
      <div class="modal-content">
        <InfoCard v-if="randomSite" :card="randomSite" :is-favorite="isFavorite(randomSite.id)"
          @toggle-favorite="toggleFavorite" />
        <div class="random-btn-modal" ref="randomBtnModal" @click="showRandomSiteFirst">
          <q-icon name="fa-solid fa-shuffle" />
        </div>
      </div><!-- Fin de modal-content -->
    </div><!-- Fin de modal -->
    <div class="desktop-btn-random hide-on-mobile" @click="showRandomSiteFirst">
      <q-icon name="fa-solid fa-shuffle" class="desktop-btn-random-icon" />
    </div>
  </q-layout>
</template>

<script>

import { ref } from 'vue'
import InfoCard from 'src/components/InfoCard.vue';
import MobileHeader from 'src/components/MobileHeader.vue';
import MobileFooter from 'src/components/MobileFooter.vue';
import DesktopHeader from 'src/components/DesktopHeader.vue';
import newLogin2 from 'src/components/newLogin2.vue';
import { signOut } from "firebase/auth";
import { auth, db } from 'src/boot/database';
import MapMode from 'src/components/MapMode.vue';
import { useCardStore } from 'src/stores/CardStore';
import { sitios } from "../boot/pouchdb.js";
import { useAdmiStore } from 'src/stores/AdmiStore';

export default {
  components: {
    InfoCard,
    MobileHeader,
    MobileFooter,
    DesktopHeader,
    MapMode,
    newLogin2,
  },
  mounted() {
    const storedBanner = localStorage.getItem('banner');
    if (storedBanner) {
      this.banner = false;
    }
    localStorage.setItem('reloaded', '1')
    const cardStore = useCardStore();
    this.cardList = cardStore.approvedCards;

    // logica para cargar data de pouchdb al inicio
    this.intervalo1 = setInterval(() => {
      if (this.cardList.length > 0) {
        clearInterval(this.intervalo1);
        this.isOpen();
      } else {
        this.dataPouch();
      }
    }, 100);

    // llamar a la funcion para calcular la distancia
    this.calculardistancia();

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }

    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
    }
    // Seleccionar idioma
    if (localStorage.getItem('languaje') == null) {
      this.selectedLanguage = localStorage.getItem('selectedLanguage');
      this.$i18n.locale = localStorage.getItem('selectedLanguage');
    } else {
      this.selectedLanguage = localStorage.getItem('languaje');
      this.$i18n.locale = localStorage.getItem('languaje');
      localStorage.setItem('selectedLanguage', localStorage.getItem('languaje'));
    }

    this.intervalo = setInterval(() => {
      // Lógica a ejecutar continuamente
      this.updateLanguage();
    }, 1000);

    //Obtiene el dia y la hora actual y verifica si el sitio turistico esta abierto
    const currentDate = new Date();
    const dateFormat = new Intl.DateTimeFormat("es-ES", { weekday: "long" });
    const timeFormat = new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    this.day = dateFormat.format(currentDate);
    this.time = timeFormat.format(currentDate);

    this.isOpen();
    //Cada minuto verifica si el sitio continua abierto
    setInterval(() => {
      const currentDate = new Date();
      const dateFormat = new Intl.DateTimeFormat("es-ES", { weekday: "long" });
      const timeFormat = new Intl.DateTimeFormat("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      this.day = dateFormat.format(currentDate);
      this.time = timeFormat.format(currentDate);
      this.isOpen();
    }, 60000);
  },
  data() {
    return {
      day: "",
      time: "",
      open: false,
      showSignOff: true,
      autoplay: ref(true),
      slide: ref(1),
      inception: ref(false),
      secondDialog: ref(false),
      leftDrawerOpen: false,
      leftDrawerFilter: false,
      mapMode: false,
      categoryList: [
        { id: 1, name: "", active: false },
        { id: 2, name: "", active: false },
        { id: 3, name: "", active: false },
        { id: 4, name: "", active: false },
        { id: 5, name: "", active: false },
        { id: 6, name: "", active: false },
        { id: 7, name: "", active: false },
      ],

      departmentList: [
        { id: 1, name: "Santa Ana", checked: false },
        { id: 10, name: "San Salvador", checked: false },
        { id: 12, name: "Sonsonate", checked: false },
        { id: 9, name: "La Libertad", checked: false },
        { id: 2, name: "Cabañas", checked: false },
        { id: 3, name: "Ahuachapán", checked: false },
        { id: 4, name: "Chalatenango", checked: false },
        { id: 5, name: "Cuscatlán", checked: false },
        { id: 6, name: "Morazán", checked: false },
        { id: 7, name: "La Paz", checked: true },
        { id: 8, name: "San Miguel", checked: false },
        { id: 11, name: "San Vicente", checked: false },
        { id: 13, name: "La Unión", checked: false },
        { id: 14, name: "Usulután", checked: false },
      ],

      cardList: [],
      admiList: [],
      esAdmin: false,
      selectedCategory: null,
      selectedDepartments: [],
      filterText: '',
      ranking: [
        { value: 4, selected: false },
        { value: 3, selected: false },
        { value: 2, selected: false },
        { value: 1, selected: false }
      ],
      selectedRating: ref(0),
      user: null,
      selectedLanguage: ref('en-US'),
      localeOptions: ref([
        { value: 'cn', label: '中文' },         // Chino
        { value: 'en-US', label: 'English' },   // Inglés
        { value: 'kr', label: '한국어' },        // Coreano
        { value: 'es', label: 'Español' },      // Español
        { value: 'jp', label: '日本語' },        // Japonés
        { value: 'de', label: 'Deutsch' },      // Alemán
        { value: 'fr', label: 'Français' },     // Francés
        { value: 'pt', label: 'Português' },    // Portugués
        { value: 'ru', label: 'Русский' },      // Ruso
        { value: 'it', label: 'Italiano' }      // Italiano
      ]),
      intervalo: ref(),
      favorites: [],
      randomSite: null,
      banner: true,
      currentPage: 1,
      cardsPerPage: 12,
    }
  },
  unmounted() {
    // remover localstorage
    localStorage.removeItem('approvedCards');
  },
  watch: {
    selectedLanguage(idioma) {
      this.$i18n.locale = idioma; //cambiamos el idioma seleccionado
      localStorage.setItem('selectedLanguage', idioma); //Agregamos la variable a localStorege
    },
  },
  methods: {
    // metodo para verificar si el sitio esta abierto
    isOpen() {
      if (this.cardList.length) {
        this.cardList.forEach((card) => {
          var day = this.day;
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

          const textoSinTildes = day.replace(
            /[áéíóúÁÉÍÓÚüÜñÑ]/g,
            (letra) => mapaTildes[letra]
          );
          day = textoSinTildes.toLowerCase();
          const currentDay = card.schedule.find(
            (card) =>
              card.day
                .replace(/[áéíóúÁÉÍÓÚüÜñÑ]/g, (letra) => mapaTildes[letra])
                .toLowerCase() === day
          );
          let isOpen = false;
          if (currentDay) {
            currentDay.ranges.forEach((range) => {
              const currentTime = new Date();
              currentTime.setHours(parseInt(this.time.split(":")[0], 10));
              currentTime.setMinutes(parseInt(this.time.split(":")[1], 10));
              currentTime.setSeconds(0);

              const start = new Date();
              start.setHours(parseInt(range.start.split(":")[0], 10));
              start.setMinutes(parseInt(range.start.split(":")[1], 10));
              start.setSeconds(0);
              const end = new Date();
              end.setHours(parseInt(range.end.split(":")[0], 10));
              end.setMinutes(parseInt(range.end.split(":")[1], 10));
              end.setSeconds(0);

              if (currentTime >= start && currentTime <= end) {
                isOpen = true;
              }
            });
          }
          this.open = isOpen;
          card.open = this.open;
        });
      }
    },
    // obtener los datos de pouchdb
    dataPouch() {
      sitios.allDocs({
        include_docs: true,
        attachments: true
      }).then((result) => {
        this.cardList = result.rows.filter((row) => {
          return row.doc.approved === true;
        }).map((row) => {
          // asignar a row.doc el id del documento
          row.doc.id = row.doc._id;
          return row.doc;
        });
      }).catch((err) => {
        console.log(err);
      });
    },
    // obtener la ubicacion actual del usuario y calcula la distancia que existe desde su posicion actual hasta el sitio
    calculardistancia() {
      if (this.cardList.length) {
        this.cardList.forEach((card) => {
          const storedPosition = localStorage.getItem("position");
          if (storedPosition) {
            const position = JSON.parse(storedPosition);
            this.latitude = position.latitude;
            this.longitude = position.longitude;

            const siteLatitude = card.location.latitude;
            const siteLongitude = card.location.longitude;
            // metodo para calcular la distancia entre dos puntos
            const distance = (lat1, lon1, lat2, lon2, unit) => {
              if ((lat1 == lat2) && (lon1 == lon2)) {
                return 0;
              }
              else {
                const radlat1 = Math.PI * lat1 / 180;
                const radlat2 = Math.PI * lat2 / 180;
                const theta = lon1 - lon2;
                const radtheta = Math.PI * theta / 180;
                let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                  dist = 1;
                }
                dist = Math.acos(dist);
                dist = dist * 180 / Math.PI;
                dist = dist * 60 * 1.1515;
                if (unit == "K") { dist = dist * 1.609344 }
                if (unit == "N") { dist = dist * 0.8684 }
                return dist;
              }
            }
            const distanceBetween = distance(this.latitude, this.longitude, siteLatitude, siteLongitude, "K");
            card.distance = distanceBetween.toFixed(2);


          }
        });
        // guardar lista en localstorage
        localStorage.setItem('approvedCards', JSON.stringify(this.cardList));
      } else {
        // usar lista guardada en localstorage
        const storedCards = localStorage.getItem('approvedCards');
        if (storedCards) {
          this.cardList = JSON.parse(storedCards);
        }
      }

    },
    closeBanner() {
      this.banner = false;
      localStorage.setItem("banner", "false");
    },
    setCategory(name) {
      this.selectedCategory = name;
    },
    updateLanguage() {
      this.$i18n.locale = localStorage.getItem('selectedLanguage');
      localStorage.setItem('languaje', this.$i18n.locale);
      this.categoryList[0].name = this.$t('index.tipoLugar.todos');
      this.categoryList[1].name = this.$t('index.tipoLugar.balnearios');
      this.categoryList[2].name = this.$t('index.tipoLugar.playa');
      this.categoryList[3].name = this.$t('index.tipoLugar.museo');
      this.categoryList[4].name = this.$t('index.tipoLugar.iglesias');
      this.categoryList[5].name = this.$t('index.tipoLugar.bosques');
      this.categoryList[6].name = this.$t('index.tipoLugar.ruinas');
      // mostrar administrar sitios solo si es admin
      const storedUser = localStorage.getItem('user'); // Obtenemos el usuario de localStorage
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
      if (this.user != null) { // Si el usuario no es null
        const admiStore = useAdmiStore(); // Obtenemos la lista de administradores
        this.admiList = admiStore.adminis;
        this.esAdmin = false; // Establecer esAdmin como false por defecto
        localStorage.setItem('esAdmin', this.esAdmin);
        this.admiList.forEach((admi) => {
          if (admi.email === this.user.email) {
            this.esAdmin = true; // Establecer esAdmin como true si el EMAIL coincide
            localStorage.setItem('esAdmin', this.esAdmin);
          }
        });
      }
    },
    chooseCategory(categoryName, event) {
      this.selectedCategory = categoryName;
      this.categoryList.map((category) => {
        event.target.textContent === category.name ? category.active = true : category.active = false;
      });
    },
    chooseMode(event) {
      const selectedMode = event.target.outerText;
      selectedMode === "Mapa" || selectedMode === "Map" ? this.mapMode = true : this.mapMode = false;
      const children = event.target.parentElement.children;
      for (let i = 0; i < children.length; i++) {
        children[i].outerText === selectedMode ? children[i].classList.add("active") : children[i].classList.remove("active");
      }
    },
    changeMode() {
      this.mapMode = this.mapMode ? false : true;
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },

    toggleDrawerFilter() {
      this.leftDrawerFilter = !this.leftDrawerFilter;
    },

    showAllDepartments(event) {
      const departmentsElement = this.$refs.departmentsRef;
      let object;
      event.target.nodeName === "P" ? object = event.target.parentElement : object = event.target;
      object.innerHTML = "";
      if (!departmentsElement.classList.contains("collapsed")) {
        departmentsElement.classList.add("collapsed");
        departmentsElement.style.maxHeight = "435px";
        object.innerHTML = "<p>" + this.$t('index.verMenos') + "</p><i class=\"q-icon fa-solid fa-angle-up\" aria-hidden=\"true\" role=\"presentation\"> </i>";
      }
      else {
        departmentsElement.classList.remove("collapsed");
        departmentsElement.style.maxHeight = "150px";
        object.innerHTML = "<p>" + this.$t('index.verMas') + "</p><i class=\"q-icon fa-solid fa-angle-down\" aria-hidden=\"true\" role=\"presentation\"> </i>";
      }
    },
    filterCards(filterName) {
      if (this.$refs[filterName]) {
        const isChecked = this.$refs[filterName][0].checked;
        if (isChecked) {
          this.selectedDepartments.push(filterName);
        }
        else {
          const index = this.selectedDepartments.indexOf(filterName);
          if (index !== -1) {
            this.selectedDepartments.splice(index, 1);
          }
        }
      }

    },
    closeModal(event) {
      const modal = this.$refs.modalRef;

      if (event.target == modal) {
        modal.classList.remove("modal-show")
      }
    },

    showRandomSiteFirst() {
      let i = 0;
      const changeWithDelay = () => {
        const randomPosition = Math.floor(Math.random() * this.cardList.length);
        this.randomSite = this.cardList[randomPosition];

        i++;

        if (i < 10) {
          setTimeout(changeWithDelay, 200);
        }
      }

      changeWithDelay();
      const modal = this.$refs.modalRef;
      if (!modal.classList.contains("modal-show")) modal.classList.add("modal-show");
    },
    handleLogin(userInfo) {
      this.user = userInfo;
      localStorage.setItem('user', JSON.stringify(userInfo));
    },
    signOff() {
      signOut(auth)
        .then(() => {
          // Cierre de sesión exitoso
          localStorage.removeItem('user');
          this.user = null;
          this.esAdmin = false;
          console.log("Se ha cerrado la sesión");
        })
        .catch(err => {
          // Error al cerrar sesión
          console.log(err.code);
        });
    },
    toggleFavorite(cardId) {
      if (this.isFavorite(cardId)) {
        const index = this.favorites.indexOf(cardId);
        if (index !== -1) {
          this.favorites.splice(index, 1);
        }
        //Se actualiza el objeto en la sesion
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
      } else {
        this.favorites.push(cardId);
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
      }
    },

    isFavorite(cardId) {
      return this.favorites.includes(cardId);
    },

    cleanFilters() {
      this.selectedDepartments.forEach((filterName) => {
        this.$refs[filterName][0].checked = false;
      });
      this.selectedDepartments = [];
      this.filterText = "";
      this.selectedRating = 0;
      this.filteredSites;
      // limpiar el filtro de categorias
      this.selectedCategory = null;
    },
    goToPage(page) {
      this.currentPage = page;
    },

  },
  computed: {
    filteredSites() {
      const todoCategoryLanguages = ["Todos", "All", "全部", "Alle", "Tous", "Tutti", "すべて", "전체", "Все"];
      const poolCategoryLanguages = ["游泳池", "Schwimmbäder", "Swimming pools", "Balnearios", "Piscines", "Piscine", "スイミングプール", "수영장", "Piscinas", "Бассейны"];
      const beachCategoryLanguages = ["海滩", "Strand", "Beach", "Playas", "Plage", "Spiaggia", "ビーチ", "해변", "Praia", "Пляж"];
      const museumCategoryLanguages = ["博物馆", "Museum", "Museum", "Museos", "Musée", "Museo", "博物館", "박물관", "Museu", "Музей"];
      const churchesCategoryLanguages = ["教堂", "Kirchen", "Churches", "Iglesias", "Églises", "Chiese", "教会", "교회", "Igrejas", "Церкви"];
      const forestCategoryLanguages = ["森林", "Wälder", "Forests", "Bosques", "Forêts", "Foreste", "森林", "숲", "Florestas", "Леса"];
      const ruinsCategoryLanguages = ["遗址", "Ruinen", "Ruins", "Ruinas", "Ruines", "Rovine", "遺跡", "유적지", "Ruínas", "Руины"];

      if (todoCategoryLanguages.includes(this.selectedCategory) && this.selectedDepartments.length === 0 && this.filterText === "" && this.selectedRating === 0) return this.cardList;
      let filter = [];
      // Obtener la categoría
      let category = "Todos";
      if (todoCategoryLanguages.includes(this.selectedCategory)) {
        category = "Todos";
      }
      else if (poolCategoryLanguages.includes(this.selectedCategory)) {
        category = "Balnearios";
      }
      else if (beachCategoryLanguages.includes(this.selectedCategory)) {
        category = "Playas";
      }
      else if (museumCategoryLanguages.includes(this.selectedCategory)) {
        category = "Museos";
      }
      else if (churchesCategoryLanguages.includes(this.selectedCategory)) {
        category = "Iglesias";
      }
      else if (forestCategoryLanguages.includes(this.selectedCategory)) {
        category = "Bosques";
      }
      else if (ruinsCategoryLanguages.includes(this.selectedCategory)) {
        category = "Ruinas";
      }
      // Filtrar por categoría
      filter = category === "Todos" ? this.cardList : this.cardList.filter((card) => card.category === category);
      // Filtrar por departamento
      if (this.selectedDepartments.length > 0) {
        filter = filter.filter((card) => this.selectedDepartments.includes(card.department));
      }
      // Filtrar por puntuación
      if (this.selectedRating > 0) {
        let filterTmp = [];
        filter.forEach((card) => {
          if (card.rankingAverage > this.selectedRating) filterTmp.push(card);
        });
        filter = filterTmp;
      }
      // Filtrar por texto
      if (this.filterText !== "") {
        filter = filter.filter((card) => {
          return card.centerName.toLowerCase().includes(this.filterText.toLowerCase()) || card.description.toLowerCase().includes(this.filterText.toLowerCase()) || card.descripcion.toLowerCase().includes(this.filterText.toLowerCase());
        });
      }
      return filter
    },
    paginatedSites() {
      const startIndex = (this.currentPage - 1) * this.cardsPerPage;
      const endIndex = startIndex + this.cardsPerPage;
      return this.filteredSites.slice(startIndex, endIndex);
    },
    pageCount() {
      return Math.ceil(this.filteredSites.length / this.cardsPerPage);
    },
  }
  ,
  beforeUnmount() {
    clearInterval(this.intervalo);
  },

}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Hind+Madurai:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap');


// Variables
$bg-body: #E8FFF4;
$bg-orange: #F27405;
$bg-yellow: #FFC107;
$bg-red: #ED1515;

$green-light: #03A678;
$green-medium: #02735E;
$green-dark: #014040;

$gray-1: #828282;
$gray-2: #969696;
$gray-3: #AFAFAF;
$gray-4: #CACACA;

$white: #FFFF;
$black: #000;

*,
*::before,
*::after {
  // margin: 0;
  // padding: 0;
  box-sizing: border-box;
}

.ues-banner {
  position: fixed;
  left: 50%;
  top: 0;
  width: 90vw;
  height: 45vh;
  background-image: url('../assets/banner.png');
  background-size: cover;
  background-position: center center;
  transform: translate(-50%, 60%);
  box-shadow: 0 10px 20px rgba(0, 0, 0, .7);
  z-index: 5000;

  &__close {
    position: absolute;
    background-color: white;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    top: -10px;
    right: -10px;
    cursor: pointer;

    &-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 20px;
    }
  }
}

@media(min-width: $breakpoint-sm-max) {
  .ues-banner {
    width: 60vw;
    height: 60vh;
    // background-image: url('../assets/Banner_small.png');
    transform: translate(-50%, 35%);

    &__close {
      width: 50px;
      height: 50px;
      top: -15px;
      right: -15px;
    }
  }
}

.body {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: $bg-body;
  font-family: 'Hind Madurai', sans-serif;
  font-size: 12px;
  overflow-y: hidden;
}

.active {
  border-bottom: 3px solid $bg-orange;
  color: $bg-orange;
}

.text-gray-light {
  color: $gray-3;
}

.text-green-light {
  color: $green-light;
}

.option {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F27405;
}

.cards-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
}

@media(min-width: $breakpoint-sm-max) {
  .cards-container {
    flex-direction: row;
    flex-wrap: wrap;
    // margin: 0 10px;
    gap: 20px;
  }
}

// Drawer options
.drawer {
  &__list {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 10px 20px;

    &--icon {
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      font-size: 20px;
      color: $white;

      &-1 {
        background-color: #50E7C5;
      }

      &-2 {
        background-color: $bg-yellow;
      }

      &-3 {
        background-color: $bg-orange;
      }

      &-4 {
        background-color: #ED1515;
      }

      &-5 {
        background-color: $green-light;
      }

      &-6 {
        background-color: #664CE3;
      }

      &-7 {
        background-color: #75e3e5;
      }

      &-8 {
        background-color: #E075E5;
      }

      &-9 {
        background-color: #023535;
      }
    }

    &--text {
      font-size: 16px;
      font-weight: 500;
      margin-left: 18px;
    }
  }
}

.q-item.q-router-link--active,
.q-item--active {
  color: #000;
}

// SELECT CATEGORY
.select__category {
  width: 100%;
  font-size: 15px;
  padding: 5px;
  border: none;
  outline: none;
  background-color: $white;
  border-bottom: 1px solid $gray-3;
}

//DEPARTMENTS
.departments {
  max-height: 150px;
  //43.5
  overflow-y: hidden;
  transition: max-height .5s ease-in-out;
}

//CHECKBOX
.cbx {
  position: relative;
  top: 1px;
  width: 23px;
  height: 23px;
  border: 1px solid #c8ccd4;
  border-radius: 3px;
  transition: background 0.1s ease;
  cursor: pointer;
  display: block;
}

.cbx:after {
  content: '';
  position: absolute;
  top: 2px;
  left: 7px;
  width: 7px;
  height: 12px;
  opacity: 0;
  transform: rotate(45deg) scale(0);
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transition: all 0.3s ease;
  transition-delay: 0.15s;
}

.lbl {
  margin-left: 5px;
  vertical-align: middle;
  cursor: pointer;
}

.icbx:checked~.cbx {
  border-color: transparent;
  background: $bg-yellow;
  animation: jelly 0.6s ease;
}

.icbx:checked~.cbx:after {
  opacity: 1;
  transform: rotate(45deg) scale(1);
}

.cntr {
  position: relative;
  display: flex;
  align-items: center;
}

//show-all-departments-box
.show-all-departments-box {
  display: flex;
  align-items: center;
  justify-content: center;
  color: $gray-2;
  font-size: 14px;
  margin-top: 10px;
  border-bottom: 1px solid $gray-2;
  padding-bottom: 8px;

  & p {
    margin: 0;
    margin-right: 8px;
    cursor: default;
  }
}

//Radio buttons
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.container {
  position: relative;
  cursor: pointer;
  font-size: 15px;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  user-select: none;
  border: 3px solid $bg-yellow;
  display: block;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.checkmark:after {
  content: '';
  position: absolute;
  top: 25%;
  left: 25%;
  background-color: $bg-yellow;
  width: 50%;
  height: 50%;
  border-radius: 50%;
  transform: scale(0);
  transition: 100ms ease;
}

.container input:checked~.checkmark:after {
  transform: scale(1);
}

.apply-filters {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 500;
  color: $bg-orange;
  width: 100%
}

//MODAL PARA SELECCIONAR UN SITIO ALEATORIO
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($black, .5);
  backdrop-filter: blur(10px);
  z-index: 10000;

  &-content {
    position: absolute;
    width: 320px;
    height: 410px;
    background-color: $white;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &-show {
    display: block;
  }
}

// Random button modal
.random-btn-modal {
  color: $white;
  width: 70px;
  height: 70px;
  box-shadow: 5px 5px 15px rgba($black, .5);
  background-image: linear-gradient(to right bottom, $bg-orange, $bg-yellow);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  margin: 0 auto;
}

.desktop-search {
  padding: 40px 0;

  &-input {
    width: 600px;
    height: 50px;
    padding: 0 10px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border: none;
    box-shadow: 0 5px 5px rgba($black, .2);
    font-family: 'Hind Madurai', sans-serif;
    font-size: 18px;
    color: $gray-1;

    &:focus {
      outline: none;
    }
  }

  &-icon {
    margin-left: -35px;
    color: $gray-4;
    font-size: 20px;
  }

  &-select {
    position: relative;
    font-family: 'Hind Madurai', sans-serif;
    width: 200px;
    height: 50px;
    background-color: $white;
    box-shadow: 0 5px 5px rgba($black, .2);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;

    & select {
      appearance: none;
      display: inline-block;
      width: 100%;
      height: 100%;
      cursor: pointer;
      outline: none;
      border: none;
      padding: 0 10px;
      font-size: 18px;
      font-family: 'Hind Madurai', sans-serif;
      background-color: $white;
      color: $gray-3;
    }

    &-icon {
      display: inline-block;
      font-size: 18px;
      color: $gray-4;
      position: absolute;
      top: calc(50% - 10px);
      right: 10px;
      transition: transform .2s ease-in-out;
    }
  }
}

@media (max-width: $breakpoint-md-max) {
  .desktop-search {

    padding: 10px 0;

    &-input {
      width: 330px;
    }

    &-select {
      width: 150px;
    }
  }
}

.desktop-btn-random {
  position: fixed;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  box-shadow: 0 5px 10px rgba($black, .3);
  bottom: 40px;
  right: 40px;
  background-color: $bg-orange;
  color: $white;
  font-size: 32px;
  transition: transform .2s ease-in-out;

  &-icon {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:hover {
    transform: scale(1.1);
  }
}

@keyframes jelly {
  from {
    transform: scale(1, 1);
  }

  30% {
    transform: scale(1.25, 0.75);
  }

  40% {
    transform: scale(0.75, 1.25);
  }

  50% {
    transform: scale(1.15, 0.85);
  }

  65% {
    transform: scale(0.95, 1.05);
  }

  75% {
    transform: scale(1.05, 0.95);
  }

  to {
    transform: scale(1, 1);
  }
}

@media screen and (min-width: 700px) and (max-width: 810px) {
  .desktop-search-input {
    margin-bottom: 18px;
  }
}

.hidden-xs-up {
  display: none !important;
}

.hide-on-desktop {
  display: none;
}

.hide-on-mobile {
  display: inherit;
}

.spacing {
  margin-top: 20px;
  padding-top: 0 !important;
}

// colocar la imagen hasta abajo pero que no se sobreponga en texto
.logo2 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  z-index: 1000;
}

//mostrar solo en ventanas medianas
@media(max-width: $breakpoint-md-max) {
  .spacing {
    padding-top: 20px !important;
  }
}

@media (max-width: $breakpoint-xs-max) {

  .spacing {
    padding-top: 65px !important;
  }

  .hide-on-desktop {
    display: inherit;
  }

  .hide-on-mobile {
    display: none;
  }
}
</style>
