import multiguard from 'vue-router-multiguard'

const logado = (to, from, next) => {
  if (localStorage.getItem('AUTENTICADO')) {
    next()
  } else {
    next({
      path: '/'
    })
  }
}

const deslogado = (to, from, next) => {
  if (!localStorage.getItem('AUTENTICADO')) {
    next()
  } else {
    next({
      path: '/auth'
    })
  }
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    beforeEnter: multiguard([deslogado]),
    children: [
      { path: '', name: 'login', component: () => import('pages/Login.vue') },
      { path: 'esqueci-minha-senha', name: 'esqueciSenha', component: () => import('pages/EsqueciSenha.vue') }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: multiguard([logado]),
    children: [
      { path: '', name: 'home', component: () => import('pages/Index.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
