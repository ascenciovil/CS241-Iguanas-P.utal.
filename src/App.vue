<script setup>
import { defineProps } from 'vue';

const props = defineProps(['loginEstudiante', 'loginProfesor', 'loginFederacion', 'loginAux' , 'loginNopropuesta']);
</script>

<template>
  
  <nav>
    <span v-if="loginAux">
      <RouterLink to="/login" @click="ocultarVentana()">Login</RouterLink> |
      <RouterLink to="/Registro"@click="ocultarVentana()">Registro</RouterLink> |
    </span>
    <span v-if="loginNopropuesta">
      <RouterLink to="/Editar">Editar perfil</RouterLink> |
      <RouterLink to="/Alumno">Alumno</RouterLink>
      <div><button @click="logout">Log Out</button></div>
    </span>
    <span v-if="loginEstudiante">
      <RouterLink to="/Editar">Editar perfil</RouterLink> |
      <RouterLink to="/Propuesta">Propuesta</RouterLink> |
      <RouterLink to="/Alumno">Alumno</RouterLink>
      <div><button @click="logout">Log Out</button></div>
    </span>
    <span v-if="loginProfesor">
      <RouterLink to="/Editar">Editar perfil</RouterLink> |
      <RouterLink to="/Profesor">Profesor</RouterLink>
      <div><button @click="logout">Log Out</button></div>
    </span>
    <span v-if="loginFederacion">
      <RouterLink to="/Editar">Editar perfil</RouterLink> |
      <RouterLink to="/Evento">Evento</RouterLink> |
      <RouterLink to="/Alumno">Alumno</RouterLink> |
      <RouterLink to="/Aprobar">Evaluar Propuestas</RouterLink>
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
    <div class="contenido" >
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
  <div class="centered" id="centered">
    <h1>¡Bienvenido a propuestas Utalca!</h1>
    <p>Donde puedes hacer tus sueños realidad</p>
    <div>
      <router-link to="/login" @click="ocultarVentana()">
        <button class="login-button">Login</button>
      </router-link>
    </div>
    <div>
      <router-link to="/registro" @click="ocultarVentana()">
        <button class="register-button">Regístrate aquí</button>
      </router-link>
    </div>
    <p class="bottom-text">Creado por y para estudiantes &#174</p>
    <img src="./assets/img/footer2.png" alt="Footer Image" class="footer-image">
  </div>
  <div id="ventanaLogOut" class="ventana">
    <div class="contenido">
      <h2>Ha cerrado sesión correctamente</h2>
      <RouterLink to="/App" replace @click="cerrarLogOut()">Cerrar</RouterLink>
    </div>
  </div>

</template>

<script>
import { supabase } from "./clients/supabase";
import { ref } from 'vue';

// Definir loggedIn como ref
const loginEstudiante = ref(false);
const loginProfesor = ref(false);
const loginFederacion = ref(false);
const loginAux = ref(true);
const loginNopropuesta = ref(false);
// Función para actualizar el estado de loggedIn
function updateLoginState(valueEstudiante,valueProfesor, valueFederacion, valueBaneadoNoPropuesta) {
    loginEstudiante.value = valueEstudiante;
    loginProfesor.value = valueProfesor;
    loginFederacion.value = valueFederacion;
    loginNopropuesta.value = valueBaneadoNoPropuesta;
    if(loginAux.value){
      loginAux.value=false;
    }else{
      loginAux.value=true;
    }
    console.log(loginAux.value);
}
export { loginEstudiante, loginProfesor, loginFederacion,loginNopropuesta, updateLoginState };
async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error al cerrar sesión:", error.message);
  } else {
    console.log("Sesión cerrada exitosamente.");
    updateLoginState(false);
  }
  var elemento = document.getElementById("ventanaLogOut");
  if (elemento != null) {
    elemento.style.display = "block";
  }
}

function abrirLineamientos() {
  var elemento = document.getElementById("ventanaLineamientos");
  if (elemento != null) {
    elemento.style.display = "block";
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

function ocultarVentana() {
  var elemento = document.getElementById("centered");
  if (elemento != null) {
    elemento.style.display = "none";
  }
}

function cerrarLogOut() {
  var elemento = document.getElementById("ventanaLogOut");
  if (elemento != null) {
    elemento.style.display = "none";
  }
}
</script>

<style scoped>
.dropdown {
  position: relative;
  background-color: #333;
  display: block;
  color: white;

}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #333; /* Change this to the color of your navbar */
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  padding: 12px 16px;
  z-index: 1;
}

.dropdown-content a {
  color: white; /* Change this to the color of your navbar text */
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown:hover .dropdown-content {
  display: block;
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
  margin-left: -76px;
  font-size: medium;
  background-color: #333;
  color: white;
  text-decoration: underline;
  border-bottom: none;
  border-top: none;
  border-right: none;
  padding-left: px;
  position: relative;
  top: -19px;
  
}

nav {
  background-color: #333;
  color: white;
  padding: 20px;
  display: flex;
}

nav span {
  display: inline-block;
  margin-right: 20px;
}

nav a {
  color: white;
  text-decoration: none;
  margin-right: 0px;
}

nav button {
  background-color: #5b4fbb; /* Green */
  border-radius: 10px;
  color: white;
  border: none;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  position: absolute;
  left: 90%;
  top: 2%;
}

.centered {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 75vh;
  text-align: center;
  background: 
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
    url('./assets/img/gente.jpg');
  background-size: cover;
  background-position: center;
  color: white; /* Cambia el color del texto a blanco para mejorar la legibilidad */
}
.login-button, .register-button {
  font-size: 20px;
  padding: 15px 30px;
  margin-top: 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover, .register-button:hover {
  background-color: #45a049;
}

.bottom-text {
  margin-top: 40px;
}



.footer-image {
  position: absolute;
  bottom: 0;
  width: 100%;
  max-height: 100px; /* Ajusta este valor según tus necesidades */
  height: auto;
  object-fit: contain;
}
.footer-image {
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 3));
}

/* Media query for screens smaller than 600px */
@media (max-width: 600px) {
  .dropdown {
    left: 5%;
    top: 2%;
  }

  .dropdown-content {
    min-width: 100px;
    padding: 6px 8px;
  }

  .dropdown-content a {
    padding: 6px 8px;
  }
}
</style>