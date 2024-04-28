import { createMemoryHistory, createRouter } from 'vue-router'

import login from './pages/Login.vue'
import registro from './pages/Registro.vue'
import editar from './pages/Editar.vue'
import propuesta from './pages/Propuesta.vue'
import alumno from './pages/Alumno.vue'
import profesor from './pages/Profesor.vue'
import admin from './pages/Admin.vue'
import evento from './pages/Evento.vue'
import app from './App.vue'

const routes = [
  { path: '/login', component: login },
  { path: '/Registro', component: registro },
  { path: '/Editar', component: editar },
  { path: '/App', component: app},
  { path: '/Propuesta', component: propuesta }, 
  { path: '/Alumno', component: alumno }, 
  { path: '/Profesor', component: profesor }, 
  { path: '/Admin', component: admin },
  { path: '/Evento', component: evento },
]
const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router