import { boot } from 'quasar/wrappers'
import { createApp } from 'vue'
import VueSocials from 'vue-socials';
import App from '../App.vue'

const app = createApp(App)
app.use(VueSocials)

