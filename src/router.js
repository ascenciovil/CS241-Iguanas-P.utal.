import { createMemoryHistory, createRouter } from 'vue-router'

import login from './pages/Login.vue'
import registro from './pages/Registro.vue'
import editar from './pages/Editar.vue'
import propuesta from './pages/Propuesta.vue'
import alumno from './pages/Alumno.vue'
import profesor from './pages/Profesor.vue'
const routes = [
  { path: '/login', component: login },
  { path: '/Registro', component: registro },
  { path: '/Editar', component: editar },
  { path: '/Propuesta', component: propuesta }, 
  { path: '/Alumno', component: alumno }, 
  { path: '/Profesor', component: profesor }, 
]
const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router