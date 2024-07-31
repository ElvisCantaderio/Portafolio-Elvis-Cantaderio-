<template>
    <div class="flex">
        <q-footer elevated class="footer hide-on-desktop">
            <div class="mode active" @click="$emit('choose-mode', $event)">
                <q-icon name="fa-solid fa-list" class="q-mr-sm" />
                {{ $t('index.lista') }}
            </div>
            <div class="mode" @click="$emit('choose-mode', $event)">
                <q-icon name="fa-solid fa-location-arrow" class="q-mr-sm" />
                {{ $t('index.mapa') }}
            </div>
            <div class="random-btn" ref="randomBtn" @click="$emit('show-random-site')">
                <q-icon name="fa-solid fa-shuffle" />
            </div>
        </q-footer><!-- Fin Footer -->
    </div>
</template>
<script>
export default {
    emits: [
        'choose-mode',
        'show-random-site'
    ]
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

.footer {
    display: flex;
    color: $black;
    background-color: $white;
    height: 65px;
}

.mode {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.random-btn {
    color: $white;
    width: 70px;
    height: 70px;
    box-shadow: 5px 5px 15px rgba($black, $alpha: .5);
    background-image: linear-gradient(to right bottom, rgba($bg-orange, 1.0), rgba($bg-yellow, 1.0));
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    position: absolute;
    left: 50%;
    bottom: 50%;
    transform: translateX(-50%);
    z-index: 300;
}
</style>
