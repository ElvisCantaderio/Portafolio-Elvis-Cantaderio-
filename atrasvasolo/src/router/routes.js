const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
      },
    ],
  },
  {
    path: "/Administracion",
    component: () => import("layouts/AdminLayout.vue"),
    children: [
      {
        path: "/Administracion/Rutas",
        component: () => import("components/AdminRutas.vue"),
      },
      {
        path: "/Administracion/Rutas/Editar/:id",
        component: () => import("components/AdminEditarRutas.vue"),
      },
      {
        path: "/Administracion/Rutas/Agregar",
        component: () => import("components/AdminAgregarRutas.vue"),
      },
      {
        path: "/Administracion/Usuario",
        component: () => import("components/adminUsuario.vue"),
      },
      {
        path: "/Administracion/Usuario/Editar/:id",
        component: () => import("components/AdminEditarUsuario.vue"),
      },
      {
        path: "/Administracion/Usuario/Agregar",
        component: () => import("components/AdminAgregarUsuario.vue"),
      },
      {
        path: "/Administracion/Paradas",
        component: () => import("components/AdminParada.vue"),
      },
      {
        path: "/Administracion/Paradas/Editar/:id",
        component: () => import("components/AdminEditarParadas.vue"),
      },
      {
        path: "/Administracion/Paradas/Eliminar/:id",
        component: () => import("components/AdminEliminarParadas.vue"),
      },
      {
        path: "/Administracion/Paradas/Agregar",
        component: () => import("components/AdminAgregarParadas.vue"),
      },
      {
        path: "/Administracion/Publicidad",
        component: () => import("components/AdminPublicidad.vue"),
      },
      {
        path: "/Administracion/Publicidad/Agregar",
        component: () => import("pages/AdminAgregarPublicidad.vue"),
      },
      
    ],
  },
  {
    path: "/DetalleRuta/:idRuta",
    component: () => import("pages/DetalleRutaPage.vue"),
  },

  {
    path: "/DetalleParada/:idParada",
    component: () => import("pages/DetalleParadaPage.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
