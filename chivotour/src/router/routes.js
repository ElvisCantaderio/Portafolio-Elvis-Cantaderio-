import ErrorNotFound from 'pages/ErrorNotFound.vue';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/about/:idDetalles', component: () => import('pages/AboutPage.vue') },
      { path: "/mis_favoritos", component: () => import("pages/FavoritesPage.vue") },
      { path: "/users", component: () => import("pages/AdminUsuarios.vue") },
      {
        path: "/modificar/:idModificar",
        component: () => import("pages/ModificarSitioUser.vue"),
        beforeEnter: (to, from, next) => {
          const isReloading = performance.navigation.type === 1 || window.performance.getEntriesByType('navigation')[0].type === 'reload';
          const indexRoute = from.matched.find(record => record.path === '/');
          if (!(indexRoute || isReloading)) {
            next('/error_not_found'); // Redirecciona a la página de error
          } else {
            next(); // Carga la página de administración normalmente
          }
        }
      },
      {
        path: '/administrar_sitios',
        component: () => import('pages/AdministrarSitios.vue'),
        beforeEnter: (to, from, next) => {
          const isReloading = performance.navigation.type === 1 || window.performance.getEntriesByType('navigation')[0].type === 'reload';
          const indexRoute = from.matched.find(record => record.path === '/');
          if (!(indexRoute || isReloading)) {
            next('/error_not_found'); // Redirecciona a la página de error
          } else {
            next(); // Carga la página de administración normalmente
          }
        }
      },
      {
        path: '/agregar_sitios',
        component: () => import('pages/AgregarSitios.vue'),
        beforeEnter: (to, from, next) => {
          const isReloading = performance.navigation.type === 1 || window.performance.getEntriesByType('navigation')[0].type === 'reload';
          const indexRoute = from.matched.find(record => record.path === '/');
          if (!(indexRoute || isReloading)) {
            next('/error_not_found'); // Redirecciona a la página de error
          } else {
            next(); // Carga la página de administración normalmente
          }
        }
      },
      {
        path: '/validar_sitio/:idSitio',
        component: () => import('pages/ValidarSitios.vue'),
        beforeEnter: (to, from, next) => {
          const isReloading = performance.navigation.type === 1 || window.performance.getEntriesByType('navigation')[0].type === 'reload';
          const indexRoute = from.matched.find(record => record.path === '/');
          if (!(indexRoute || isReloading)) {
            next('/error_not_found'); // Redirecciona a la página de error
          } else {
            next(); // Carga la página de administración normalmente
          }
        }
      },
      {
        path: '/mis_sitios',
        component: () => import('pages/MisSitios.vue'),
        beforeEnter: (to, from, next) => {
          const isReloading = performance.navigation.type === 1 || window.performance.getEntriesByType('navigation')[0].type === 'reload';
          const indexRoute = from.matched.find(record => record.path === '/');
          if (!(indexRoute || isReloading)) {
            next('/error_not_found'); // Redirecciona a la página de error
          } else {
            next(); // Carga la página de los estados de mis sitios normalmente
          }
        }
      },

      // { path: "/agregar_sitios", component: () => import("pages/AgregarSitios.vue") },
      // { path: "/validar_sitio/:idSitio", component: () => import("pages/ValidarSitios.vue") },
      { path: '*', component: ErrorNotFound }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound
  }
];

export default routes;
