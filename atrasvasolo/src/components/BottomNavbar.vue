<template>
  <q-footer class="header" id="header ">
    <nav class="nav container">
      <div class="nav__menu" id="nav-menu">
        <ul class="nav__list">
          <li class="nav__item">
            <a href="#" :class="store.view == 'rutas-view' ? active[0] : inactive[0]">
              <q-icon name="directions_bus" class="nav__icon" @click="navegarNavbar" id="rutas-view" />
              <span class="nav__name nav__name__rutas" :style="store.view == 'rutas-view' ? active[1] : inactive[1]">{{
                $t('btnNavbar.rutas') }}</span>
            </a>
          </li>
          <li class="nav__item">
            <a href="#" :class="store.view == 'paradas-view' ? active[0] : inactive[0]">
              <q-icon name="place" class="nav__icon" @click="navegarNavbar" id="paradas-view" />
              <span class="nav__name nav__name__paradas"
                :style="store.view == 'paradas-view' ? active[1] : inactive[1]">{{
                  $t('btnNavbar.paradas') }}</span>
            </a>
          </li>

          <li class="nav__item">
            <a href="#" :class="store.view == 'destinos-view' ? active[0] : inactive[0]">
              <q-icon name="route" class="nav__icon" @click="navegarNavbar" id="destinos-view" />
              <span class="nav__name nav__name__destinos"
                :style="store.view == 'destinos-view' ? active[1] : inactive[1]">{{ $t('btnNavbar.destino') }}</span>
            </a>
          </li>


        </ul>
      </div>
    </nav>
  </q-footer>
</template>

<script>
import { defineComponent, ref } from "vue";

import { useCounterStore } from "stores/dataGlobal";
import { watch } from "vue";
const store = useCounterStore();

export default defineComponent({
  name: "BottomNavbar",
  emits: ["cambiarView"],


  setup(props, { emit }) {

    function navegarNavbar(e) {
      emit("cambiarView", e.target.id);
      store.view = e.target.id
    }


    return {
      // navItems,
      active: ref(['nav__link active__link', 'display: block']),
      inactive: ref(['nav__link ', 'display: none']),
      store,
      navegarNavbar,
    };
  }, mounted() {

  }
});
</script>

<style>
ul {
  list-style: none;
  margin-left: -40px;
}

a {
  text-decoration: none;
  cursor: pointer;
}

.nav__menu {
  position: fixed;
  box-shadow: 0px 0px 7px rgb(0, 0, 0);
  bottom: 0;
  left: 0;
  background-color: #303030;
  width: 100%;
  height: 3.5rem;
  padding: 0 1rem;
  display: grid;
  align-content: center;
  border-radius: 1.25rem 1.25rem 0 0;
  transition: 0.4s;
}

.nav__list,
.nav__link {
  display: flex;
}

.nav__link {
  flex-direction: column;
  align-items: center;
  row-gap: 0.25rem;
  color: #fff;
  font-weight: 600;
}

.nav__list {
  justify-content: space-around;
  align-items: flex-end;
}

.nav__name {
  display: none;
  /*For minimalist approach*/
  color: #fff;
  margin-top: 7px;
}

.nav__icon {
  font-size: 1.5rem;
}

/*Active link*/
.active__link {
  position: relative;
  color: #303030;
  transition: 0.4s;
  margin-top: -20px;
}

/* Minimalist design, active link */
.active__link::before {
  content: "";
  position: absolute;
  top: -10px;
  width: 40px;
  height: 40px;
  background-color: #ff5709;
  border: 5px solid #fff;
  border-radius: 10px;
  transform: rotate(45deg);
  z-index: -1;
}

@media screen and (min-width: 576px) {
  .nav__list {
    justify-content: center;
    column-gap: 3rem;
  }
}
</style>
