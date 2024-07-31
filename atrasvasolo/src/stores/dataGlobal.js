import { defineStore } from "pinia";
import { db } from "app/src/boot/firebase";
import { collection, query, limit, getDocs, orderBy } from "firebase/firestore";

export const useCounterStore = defineStore("user", {
  state: () => ({
    view: "rutas-view",
    adminView: false,
    bandera: false,
    correosecionactiva: "User@User.com",
    nombre: "User",
    foto: "imagenes/perfil.png",
    rutaRenderizada: {
      id: "",
      vuelta: {
        paradas: [],
      },
      ida: {
        paradas: [],
      },
    },
    paradaActiva: {},
    paradasCercanas: [],
    origen: {
      gps: {
        latitude: undefined,
        longitude: undefined,
      },
      nombre: undefined,
    },
    destino: {
      gps: {
        latitude: undefined,
        longitude: undefined,
      },
      nombre: undefined,
    },
    destinoARenderizar: [[], { sentido: undefined }],
    recorridosEncontrados: [],
    datosdeUsuario: {},
    admin: undefined,
    ptermino: false,
    origenReferencia: "",
    destinoReferencia: "",
    paradasCercanas: [],
    rutasCercanas: [],
  }),
  actions: {
    // since we rely on `this`, we cannot use an arrow function
  },
});
