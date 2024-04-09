import { createMemoryHistory, createRouter } from 'vue-router'

import login from './pages/Login.vue'
import registro from './pages/Registro.vue'
import perfilusuario from './pages/PerfilUsuario.vue'

const routes = [
  { path: '/login', component: login },
  { path: '/Registro', component: registro },
  { path: '/PerfilUsuario', component: perfilusuario },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router