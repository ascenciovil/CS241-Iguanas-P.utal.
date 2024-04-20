<script setup>
import { defineProps } from 'vue';

const props = defineProps(['loginEstudiante','loginProfesor','loginAux']);
</script>

<template>
  <h1>Propuestas Utalca</h1>

  <nav>
    <span v-if="loginAux">
      <RouterLink to="/login">Login</RouterLink> |
      <RouterLink to="/Registro">Registro</RouterLink>
    </span>
    <span v-if="loginEstudiante">
      <RouterLink to="/Editar">EditarPerfil</RouterLink> |
      <RouterLink to="/Propuesta">Propuesta</RouterLink> |
      <RouterLink to="/Alumno">Alumno</RouterLink>
      <div><button @click="logout">Log Out</button></div>
      
      
    </span>
    <span v-if="loginProfesor">
      <RouterLink to="/Editar">EditarPerfil</RouterLink> |
      <RouterLink to="/Profesor">Profesor</RouterLink>
      <div><button @click="logout">Log Out</button></div>
    </span>
    <div class="dropdown">
      <button class="acercaDe">Acerca de</button>
      <div class="dropdown-content">
        <a @click="abrirLineamientos()">Lineamientos</a>
        <a @click="abrirDocumentacion()">Documentación</a>
        <a @click="abrirPreguntas()">Preguntas Frecuentes</a>
      </div>
    </div>
  </nav>
  <main>
    <RouterView />
  </main>
  <div id="ventanaLineamientos" class="ventana">
    <div class="contenido">
      <h2>Lineamientos</h2>
      <p>1° Registrarse</p>
      <br>
      <p>2° Iniciar sesión</p>
      <br>
      <p>3° Irse a la página de propuestas</p>
      <br>
      <p>4° Ingresar título y propuesta</p>
      <button @click="cerrarLineamientos()">Cerrar</button>
    </div>
  </div>
  <div id="ventanaDocumentacion" class="ventana">
    <div class="contenido">
      <h2>Documentacion</h2>
      <p>Deben cumplir con las leyes del país, no involucrar datos personales ni ocupar propiedad de otros autores.</p>
      <button @click="cerrarDocumentacion()">Cerrar</button>
    </div>
  </div>
  <div id="ventanaPreguntas" class="ventana">
    <div class="contenido">
      <h2>Preguntas Frecuentes</h2>
      <p>Página exclusivamente dirigida a propuestas de los estudiantes para los estudiantes</p>
      <br>
      <p>Las propuestas se revisan en un máximo de una semana</p>
      <br>
      <p>Puedes enviar propuestas solo en tu campus, pero puedes observar las establecidas en los otros</p>
      <br>
      <p>Contacto: jascencio21@alumnos.utalca.cl</p>
      <button @click="cerrarPreguntas()">Cerrar</button>
    </div>
  </div>
</template>

<script>
import { supabase } from "./clients/supabase";
import { ref } from 'vue';

// Definir loggedIn como ref
const loginEstudiante = ref(false);
const loginProfesor = ref(false);
const loginAux=ref(true);
// Función para actualizar el estado de loggedIn
function updateLoginState(valueEstudiante,valueProfesor) {
    loginEstudiante.value = valueEstudiante;
    loginProfesor.value = valueProfesor;
    if(loginAux.value){
      loginAux.value=false;
    }else{
      loginAux.value=true;
    }
    console.log(loginAux.value);
}
export { loginEstudiante,loginProfesor, updateLoginState };
// Funciones de ventana
function abrirLineamientos() {
  var elemento = document.getElementById("ventanaLineamientos");
  if (elemento != null) {
    elemento.style.display = "block";
  }
}
async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error al cerrar sesión:", error.message);
  } else {
    console.log("Sesión cerrada exitosamente.");
    updateLoginState(false);
  }
}

function cerrarLineamientos() {
  var elemento = document.getElementById("ventanaLineamientos");
  if (elemento != null) {
    elemento.style.display = "none";
  }
}

function abrirDocumentacion() {
  var elemento = document.getElementById("ventanaDocumentacion");
  if (elemento != null) {
    elemento.style.display = "block";
  }
}

function cerrarDocumentacion() {
  var elemento = document.getElementById("ventanaDocumentacion");
  if (elemento != null) {
    elemento.style.display = "none";
  }
}

function abrirPreguntas() {
  var elemento = document.getElementById("ventanaPreguntas");
  if (elemento != null) {
    elemento.style.display = "block";
  }
}

function cerrarPreguntas() {
  var elemento = document.getElementById("ventanaPreguntas");
  if (elemento != null) {
    elemento.style.display = "none";
  }
}
</script>

<style scoped>
.dropdown {
  display: inline-block;
  position: relative;
  width: 8%;
  font-size: small;
}

.dropdown-content {
  display: none;
  position: absolute;
  width: 100%;
  overflow: auto;
  box-shadow: 0px 20px 20px 0px rgba(0, 0, 0, 0.4);
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a {
  display: block;
  color: #000000;
  padding: 5px;
  text-decoration: none;
  background-color: white;
}

.dropdown-content a:hover {
  color: #FFFFFF;
  background-color: #00cccc;
}

.ventana {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.contenido {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

#cerrarVentana {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ff6347;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.acercaDe {
  margin-left: 5px;
  font-size: medium;
  background-color: #bfbcf0;
  color: blue;
  text-decoration: underline;
  border-bottom: none;
  border-top: none;
  border-right: none;
  padding-left: 5px;
}
</style>
