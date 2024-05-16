<template>
  <div>
    <div class="container">
      <div class="screen"style="margin-top: 70px;">
        <div class="screen__content">
          <form class="login" @submit.prevent="createAccount">
            <div class="login__field">
              <i class="login__icon fas fa-user"></i>
              <input type="email" id="email" v-model="email" class="login__input" placeholder="Correo Institucional">
            </div>
            <div class="login__field">
              <i class="login__icon fas fa-lock"></i>
              <input type="password" id="password" v-model="password" class="login__input" placeholder="Contraseña">
            </div>
            <button class="button login__submit" type="submit">
              <span class="button__text">Ingresa ahora</span>
              <i class="button__icon fas fa-chevron-right"></i>
            </button>
            <router-link to="/registro" class="toRegistro">
              <button class="button login__submit">Regístrate aquí</button>
            </router-link>
          </form>
        </div>
        <div class="screen__background">
          <span class="screen__background__shape screen__background__shape4"></span>
          <span class="screen__background__shape screen__background__shape3"></span>
          <span class="screen__background__shape screen__background__shape2"></span>
          <span class="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>
    </div>
  </div>

  <footer class="footer">
    <img src="../assets/img/footer2.png" alt="Footer Image" class="footer-image">
  </footer>

  <div id="ventanaAlumno" class="ventana">
    <div class="contenido">
      <h2>Ha iniciado sesión correctamente</h2>
      <RouterLink to="/Alumno" replace @click="cerrarAlumno()">Cerrar</RouterLink>
    </div>
  </div>

  <div id="ventanaProfesor" class="ventana">
    <div class="contenido">
      <h2>Ha iniciado sesión correctamente</h2>
      <RouterLink to="/Profesor" replace @click="cerrarProfesor()">Cerrar</RouterLink>
    </div>
  </div>

  <div id="ventanaAdmin" class="ventana">
    <div class="contenido">
      <h2>Ha iniciado sesión correctamente</h2>
      <RouterLink to="/Admin" @click="cerrarAdmin()">Cerrar</RouterLink>
    </div>
  </div>

  <div id="ventanaBanPropuesta" class="ventana">
    <div class="contenido">
      <h2>Ha iniciado sesión correctamente, pero no podrá subir propuestas por su comportamiento inadecuado</h2>
      <RouterLink to="/Alumno" @click="CerrarAlumnoBanPropuesta()">Cerrar</RouterLink>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";
import { updateLoginState } from "@/App.vue";
import { supabase } from "../clients/supabase";
import { RouterLink } from "vue-router";

let email = ref("");
let password = ref("");

async function createAccount() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });
  if (error) {
    console.error("Error: ", error.message);
    alert('No eres un usuario, ahora sufriras las consecuencias');
  } else {
    console.log("Usuario autenticado:", data.user);

    // Obtener el UID del usuario
    const userId = data.user.id;

    // Consultar la tabla de usuarios para obtener el rol
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('rol, campus, Baneado, Fecha_Desban')
      .eq('UID', userId)
      .single();

    var Finban='si';
    console.log(userData.Baneado);
    if(userData.Baneado){
      const fechaDesbanUsuario = new Date(userData.Fecha_Desban);
      // Comparar las fechas
      if (Date.now() < fechaDesbanUsuario.getTime()) {
        Finban='no';
      }else{
        const { data, error } = await supabase
                .from('usuarios')
                .update({ Baneado: false})
                .eq('UID', userId);
      }
    }
    if (userError) {
      console.error("Error al obtener la información del usuario:", userError.message);
    } else {
      console.log("Rol del usuario:", userData.rol);
console.log("Campus del usuario:", userData.campus);
      console.log(Finban);
      mostrarInterfaces(userData.rol,Finban);

      // Después de obtener la información del usuario autenticado
      const campusUsuarioLogeado = userData.campus; // Asumiendo que userData.campus contiene el campus del usuario
      localStorage.setItem('campusUsuarioLogeado', campusUsuarioLogeado); // Almacenar el campus en el almacenamiento local
    }
    // Redireccionar según el rol del usuario
    if(Finban == 'si'){
      if (userData.rol == 'estudiante') {
        console.log("estudiante");
        abrirAlumno();
      } else if (userData.rol == 'profesor') {
        console.log("profesor");
        abrirProfesor();
      } else if (userData.rol == 'admin') {
        console.log("admin");
        abrirAdmin();
      } else if(userData.rol == 'federacion'){
        console.log("federacion");
        abrirAlumno();
      }
      else {
        console.log("ninguno");
      }
    }else{
      console.log("Alumno que no puede ver propuestas");
      AbrirAlumnoBanPropuesta();
    }
  }


}

function mostrarInterfaces(tipoUsuario, Findesban) {
  var message = "";
  if(Findesban=='si'){
    switch (tipoUsuario) {
      case "estudiante":
        message = "¡Bienvenido estudiante!";
        updateLoginState(true, false, false, false);
        break;
      case "profesor":
        message = "¡Bienvenido profesor!";
        updateLoginState(false, true, false, false);
        break;
      case "admin":
        message = "¡Bienvenido admin!"; //pa q wea sirve esto
      case "federacion":
        message = "¡Bienvenido miembro de la federación!";
        updateLoginState(false, false, true, false);
        break;
      default:
        message = "Tipo de usuario desconocido";
    }
  }else{
    updateLoginState(false, false, false, true);
    message = "usuario no puede subir propuestas";
  }
  console.log(message);
}

function abrirAlumno() {
  var elemento = document.getElementById("ventanaAlumno");
  if (elemento != null) {
    elemento.style.display = "block";
  }
}
function cerrarAlumno() {
  var elemento = document.getElementById("ventanaAlumno");
  if (elemento != null) {
    elemento.style.display = "none";
  }
}

function AbrirAlumnoBanPropuesta() {
  var elemento = document.getElementById("ventanaBanPropuesta");
  if (elemento != null) {
    elemento.style.display = "block";
  }
}
function CerrarAlumnoBanPropuesta() {
  var elemento = document.getElementById("ventanaBanPropuesta");
  if (elemento != null) {
    elemento.style.display = "none";
  }
}

function abrirProfesor() {
  var elemento = document.getElementById("ventanaProfesor");
  if (elemento != null) {
    elemento.style.display = "block";
  }
}

function cerrarProfesor() {
  var elemento = document.getElementById("ventanaProfesor");
  if (elemento != null) {
    elemento.style.display = "none";
  }
}

function abrirAdmin() {
  var elemento = document.getElementById("ventanaAdmin");
  if (elemento != null) {
    elemento.style.display = "block";
  }
}

function cerrarAdmin() {
  var elemento = document.getElementById("ventanaAdmin");
  if (elemento != null) {
    elemento.style.display = "none";
  }
}
</script>



<style >
@import url('https://fonts.googleapis.com/css?family=Raleway:400,700');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: Raleway, sans-serif;
}

body {
  background: linear-gradient(90deg, #C7C5F4, #776BCC);
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 6vh;
}

.screen {
  background: #7E7BB9;
  position: relative;
  height: 600px;
  width: 360px;
  box-shadow: 0px 0px 24px #5C5696;
}

.screen__content {
  z-index: 1;
  position: relative;
  height: 100%;
  margin-top: 0%;
}


.login {
  width: 320px;
  padding: 30px;
  padding-top: 156px;
  position: relative;
}

.login__field {
  padding: 20px 0px;
  position: relative;
}

.login__icon {
  position: absolute;
  top: 30px;
  color: #7875B5;
}

.login__input {
  border: none;
  border-bottom: 2px solid #D1D1D4;
  background: none;
  padding: 10px;
  padding-left: 24px;
  font-weight: 700;
  width: 100%; /* Ajuste del ancho del campo de entrada */
  transition: .2s;
}


.login__input:active,
.login__input:focus,
.login__input:hover {
  outline: none;
  border-bottom-color: #6A679E;
}

.login__submit {
  background: linear-gradient(90deg, #FFF, #E5E5FF); /* Cambio de color del botón */
  font-size: 14px;
  margin-top: 30px;
  padding: 16px 20px;
  border-radius: 26px;
  border: 1px solid #D4D3E8;
  text-transform: uppercase;
  font-weight: 700;
  display: flex;
  align-items: center;
  width: 100%;
  color: #4C489D;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Efecto de sombra */
  cursor: pointer;
  transition: .2s;
  justify-content: center;
}

.button__text {
  margin-left: auto;
}

.login__input:active,
.login__input:focus,
.login__input:hover {
  outline: none;
  border-bottom-color: #6A679E; /* Cambio de color al enfocar el campo */
}
.button__icon {
  font-size: 24px;
  margin-left: auto;
  color: #7875B5;
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


.login__submit:active,
.login__submit:focus,
.login__submit:hover {
  outline: none;
  transform: translateY(-2px); /* Efecto de elevación al hacer hover */
}



.footer-image {
  position: absolute;
  bottom: 0;
  width: 100%;
  max-height: 100px; /* Ajusta este valor según tus necesidades */
  height: auto;
  object-fit: contain;
  margin-bottom: 30px;
}
.footer-image {
  filter: drop-shadow(0 0 20px rgba(0, 0, 0, 5));
}

.toRegistro {
  text-decoration: none;
  display: block;
}
</style>

