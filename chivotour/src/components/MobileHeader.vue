<template>
  <!-- Header -->
  <div class="flex">
    <q-header elevated class="header-mobile hide-on-desktop">
      <q-toolbar class="flex justify-between">
        <q-btn flat round dense icon="fa-solid fa-bars" class="btn-menu q-mr-md" @click="$emit('toggle-left-drawer')" />
        <div class="search-bar">
          <q-btn flat round dense icon="fa-solid fa-magnifying-glass" style="font-size: 12px;" />
          <input type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            class="header__search" :placeholder="$t('index.buscarSitio')" />
        </div>
        <q-btn class="btn-filter" flat round dense icon="fa-solid fa-filter" @click="$emit('toggle-drawer-filter')" />
      </q-toolbar>
      <div class="category">
        <ul class="category__list">
          <li class="category__item" v-for="category in categoryList" :key="category.id"
            :class="{ active: category.active }" @click="this.$emit('choose-category', category.name, $event)">
            {{ category.name }}
          </li>
        </ul>
      </div>
    </q-header> <!-- Fin Header -->
  </div>
</template>
<script>
export default {
  props: ['categoryList', 'modelValue'],
  emits: [
    'toggle-left-drawer',
    'toggle-drawer-filter',
    'choose-category',
    'update:modelValue'],
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

.header-mobile {
  height: 140px;
  background-image: linear-gradient(to right, $green-light, $green-medium, $green-dark);
  padding: 10px 10px 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .header__search {
    height: 30px;
    border: none;
    padding: 0 5px;
    background-color: transparent;
    font-family: 'Hind Madurai', sans-serif;
    color: $white;
    font-size: 18px;
    width: 100%;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: $white;
      font-size: 18px;
    }
  }
}

.container-grid {
  margin-top: 24px;
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  grid-template-rows: auto auto;
  grid-gap: 5px;
  align-items: center;
}

.btn-menu {
  grid-column: 1 / 2;
}

.search-bar {
  display: flex;
  grid-column: 2 / 3;
  border-bottom: 1px solid white
}

.search-bar>input {
  width: auto;
}

.btn-filter {
  grid-column: 3 / 4;
}

@media screen and (max-width: 485px) {
  .container-grid {
    margin-top: 3px;
  }

  .btn-menu {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .btn-filter {
    grid-column: 3 / 4;
    grid-row: 1 / 2;
  }

  .search-bar {
    margin-block: 6px;
    grid-row: 2 / 3;
    grid-column: 1 / 4;
    justify-self: center;
  }
}

.category {
  padding: 0 10px;
  font-size: 18px;
  width: 100%;
  overflow-x: auto;
  scroll-behavior: smooth;

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    text-align: center;
    white-space: nowrap;
    cursor: pointer;
  }

  &__item {
    padding: 5px 10px 10px 5px;
    position: relative;
    color: $white !important;
  }
}

@media (max-width: $breakpoint-md-max) {
  .hide-on-tablet {
    display: none;
  }
}
</style>
