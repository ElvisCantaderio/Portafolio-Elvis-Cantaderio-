<template>
  <div class="flex">
    <q-header elevated class="desktop-header hide-on-mobile">
      <div class="flex items-center no-wrap">
        <div class="logo-box">
          <img src="../assets/logo.svg" alt="logo" />
        </div>
        <p class="logo-text">ChivoTour</p>
      </div>
      <div class="menu-box">
        <ul>
          <!--
              Comento Seleccionar el idioma en administracion

            <q-select v-model="selectedLanguage" :options="localeOptions" dense borderless emit-value map-options
              options-dense style="min-width: 100px;">
              <template v-slot:prepend>
                <q-icon name="language" />
              </template>
            </q-select>


          -->

          <!-- -------------------------------------------------------------- -->
          <login-desktop @login="handleLogin" v-if="!user" />
          <!-- ---------------------------------------------------------------- -->
          <button class="authBox" v-if="user">
            <q-icon name="list" class="q-mr-sm" />
            <p class="authBox__username">{{ user.displayName }}</p>
            <q-avatar size="25px">
              <img :src="user.photoURL">
            </q-avatar>
          </button>
          <div class="menu" ref="userMenu" v-if="user">
            <!-- Principal -->
            <q-item class="menu__item" clickable to="/">
              <div class="menu__item-icon menu__item-icon--2">
                <q-icon name="fa-solid fa-house" />
              </div>
              <div class="menu__item-text">{{ $t('index.principal') }}</div>
            </q-item>
            <!-- Agregar nuevo sitio -->
            <q-item class="menu__item" clickable to="/agregar_sitios">
              <div class="menu__item-icon menu__item-icon--5">
                <q-icon name="fa-solid fa-plus" />
              </div>
              <div class="menu__item-text">{{ $t('index.agregar') }}</div>
            </q-item>
            <!-- Administrar sitios -->
            <q-item v-if="esAdmin === true" class="menu__item" clickable to="/administrar_sitios">
              <div class="menu__item-icon menu__item-icon--9">
                <q-icon name="fa-solid fa-hammer" />
              </div>
              <div class="menu__item-text">{{ $t('index.administrar') }}</div>
            </q-item>
            <!--Mis Sitios-->
            <q-item class="menu__item" clickable to="/mis_sitios">
              <div class="menu__item-icon menu__item-icon--3">
                <q-icon name="fa-solid fa-check" />
              </div>
              <div class="menu__item-text">{{ $t('index.misSitios') }}</div>
            </q-item>
            <!-- Administrar Usuarios -->
            <q-item v-if="esAdmin === true" class="menu__item" clickable to="/users">
              <div class="menu__item-icon menu__item-icon--7">
                <q-icon name="fa-solid fa-users" />
              </div>
              <div class="menu__item-text">{{ $t('index.usuarios') }}</div>
            </q-item>
            <!-- Favoritos -->
            <q-item class="menu__item" clickable to="/mis_favoritos">
              <div class="menu__item-icon menu__item-icon--4">
                <q-icon name="fa-solid fa-heart" />
              </div>
              <div class="menu__item-text">{{ $t('index.favoritos') }}</div>
            </q-item>
            <!-- Sitio Web -->
            <q-item class="menu__item" clickable href="https://website.chivotour.com/" target="_blank">
              <div class="menu__item-icon menu__item-icon--6">
                <q-icon name="fa-solid  fa-earth-americas" />
              </div>
              <div class="menu__item-text">{{ $t('index.sitioWeb') }}</div>
            </q-item>
          </div>
        </ul>
      </div>
    </q-header>

    <!-- Iniciar sesion -->

  </div>
</template>
<script>
import { ref } from 'vue';
import LoginDesktop from 'src/components/LoginDesktop.vue';
import { signOut } from 'firebase/auth';
import { auth } from 'src/boot/database';

export default {
  components: {
    LoginDesktop
  },
  emits: ['change-mode'],
  mounted() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
    localStorage.setItem('selectedLanguage', 'en-US');
    this.selectedLanguage = this.$i18n.locale;
    if (localStorage.getItem('languaje')) {
      this.selectedLanguage = localStorage.getItem('languaje');
    }
  },
  props: {
    showModeBTN: {
      type: Boolean,
      default: true
    },
    mostrarLogin: {
      type: Boolean,
      default: true
    },
    esAdmin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inception: ref(false),
      slide: ref(1),
      autoplay: ref(true),
      user: null,
      selectedLanguage: ref('en-US'),
      localeOptions: ref([
        { value: 'en-US', label: 'English' },
        { value: 'es', label: 'Español' }
      ])
    }
  },
  methods: {
    handleLogin(userInfo) {
      this.user = userInfo;
      localStorage.setItem('user', JSON.stringify(userInfo));
    },
    signOff() {
      localStorage.removeItem('user');
      this.user = null;
      signOut(auth)
        .then(() => {
          console.log("Se ha cerrado la sesión");
        })
        .catch((error) => {
          console.log(error);
        })
    }
  },
  watch: {
    selectedLanguage(idioma) {
      this.$i18n.locale = idioma; //cambiamos el idioma seleccionado
      localStorage.setItem('selectedLanguage', idioma); //Agregamos la variable a localStorege
    }
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

.desktop-header {
  background-image: linear-gradient(to right, $green-dark, $green-medium, $green-light);
  padding: 0 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-box {

  & img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
}

.logo-text {
  font-family: 'Hind Madurai', sans-serif;
  font-size: 32px;
  margin: 0;
  font-weight: 500;
}

.menu-box {

  & ul {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 16px;
    font-weight: 500;

    & li {
      cursor: default;

      &:not(:last-child):hover {
        text-decoration: underline;
      }
    }
  }
}

.relevant {
  background-color: $bg-orange;
  padding: 5px 10px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba($black, .3);
}

.menu {
  position: absolute;
  top: 62px;
  right: 50px;
  width: 250px;
  visibility: hidden;
  height: 0;
  color: #000;
  background-color: $white;
  font-family: 'Hind Madurai', sans-serif;
  box-shadow: 0 5px 5px rgba($black, .3);
  z-index: 100;
  transition: all .2s ease-in-out;
  border-radius: 0.8rem;

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    border-bottom: 1px solid $gray-4;

    &-icon {
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      font-size: 20px;
      color: $white;

      &--1 {
        background-color: #50E7C5;
      }

      &--2 {
        background-color: $bg-yellow;
      }

      &--3 {
        background-color: $bg-orange;
      }

      &--4 {
        background-color: #ED1515;
      }

      &--5 {
        background-color: $green-light;
      }

      &--6 {
        background-color: #664CE3;
      }

      &--7 {
        background-color: #75e3e5;
      }

      &--8 {
        background-color: #E075E5;
      }

      &--9 {
        background-color: #023535;
      }
    }

  }

}

.q-field__native {
  color: rgba(0, 0, 0, 0.54);
  font-weight: 700;
}


.authBox {
  background-color: $bg-orange;
  display: flex;
  align-items: center;
  padding: 8px 15px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 400;
  box-shadow: 0 3px 3px rgba(0, 0, 0, .3);
  border: none;
  color: $white;
  font-size: 18px;
  cursor: pointer;

  &__username {
    margin: 0;
    width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__photo {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-left: 20px;

    & img {
      width: 100%;
      height: 100%;
    }
  }
}

.authBox:focus+.menu {
  height: auto;
  visibility: visible;
}

//boton para mostrar modo lista y modo mapa
.checkbox-wrapper .tgl {
  display: none;
}

.tgl-btn {
  outline: 0;
  display: block;
  width: 80px;
  height: 40px;
  position: relative;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: #888;
  overflow: hidden;
  transform: skew(-10deg);
  backface-visibility: hidden;
  transition: all .2s ease;
  font-family: 'Hind Madurai', sans-serif;

  &::after,
  &::before {
    position: absolute;
    display: flex;
    content: "";
    width: 80px;
    height: 100%;
    align-items: center;
    justify-content: center;
    transform: skew(-10deg);
    font-weight: bold;
    transition: all .2s ease;
  }

  &::after {
    left: 110%;
    content: attr(data-tg-map);
    background-color: $bg-orange;
  }

  &::before {
    left: 0;
    content: attr(data-tg-list);
  }
}

.tgl:checked+.tgl-btn::after {
  left: 0;
}

.tgl:checked+.tgl-btn::before {
  left: 110%;
}


@media(max-width: $breakpoint-xs-max) {
  .desktop-header {
    height: 130px;
  }
}
</style>
