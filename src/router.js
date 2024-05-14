import { createMemoryHistory, createRouter } from 'vue-router'

import login from './pages/Login.vue'
import registro from './pages/Registro.vue'
import editar from './pages/Editar.vue'
import propuesta from './pages/Propuesta.vue'
import alumno from './pages/Alumno.vue'
import profesor from './pages/Profesor.vue'
import aprobar from './pages/Aprobar.vue'
import admin from './pages/Admin.vue'
import evento from './pages/Evento.vue'
import app from './App.vue'
import comentarios from './pages/Comentarios.vue'
import ComentariosEvento from './pages/ComentariosEvento.vue'

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
  { path: '/Aprobar', component: aprobar },
  { path: '/Comentarios/:id',name: 'Comentarios', component:comentarios,props: true},
  { path: '/ComentariosEvento/:id',name: 'ComentariosEvento', component:ComentariosEvento,props: true},
]
const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router