import { createMemoryHistory, createRouter } from 'vue-router'

import login from './pages/Login.vue'
import registro from './pages/Registro.vue'


const routes = [
  { path: '/login', component: login },
  { path: '/Registro', component: registro },

]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router