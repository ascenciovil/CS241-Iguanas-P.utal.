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
</template>


<script setup>
import { ref } from "vue";
import { updateLoginState } from "@/App.vue";
import { supabase } from "../clients/supabase";
import { RouterLink } from "vue-router";

let email = ref("");
let password = ref("");
let userId = ref("");

async function createAccount() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });
  if (error) {
    console.error("Error: ", error.message);
    alert('No eres un usuario, ahora sufriras las consecuencias');
    //easter egg
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  } else {
    console.log("Usuario autenticado:", data.user);


    // Obtener el UID del usuario
    const userId = data.user.id;

    // Consultar la tabla de usuarios para obtener el rol
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('UID', userId.value)
      .single();

    if (userError) {
      console.error("Error al obtener la información del usuario:", userError.message);
    } else {
      console.log("Rol del usuario:", userData.rol);
      mostrarInterfaces(userData.rol);
      console.log("nombre del usuario:", userData.nombre);
      console.log("nombre del usuario:", userData.campus);
      console.log("nombre del usuario:", userData.username);
      console.log("nombre del usuario:", userData.gender);
    }
    // Redireccionar según el rol del usuario
    // Tambien probe con useRouter().push("/Alumno"); pero useRouter sale que es undefined
    // Gaste casi una hora intentando solucionar ese error asi que ten en cuenta eso (Felipe)
    if (userData.rol == 'estudiante') {
      console.log("estudiante");
      abrirAlumno();
      //window.location.href = '/Alumno'; //por algun motivo esta redireccionando al App.vue en vez de Alumno.vue
    } else if (userData.rol == 'profesor') {
      console.log("profesor");
      abrirProfesor();
      //window.location.href = '/Profesor';
    }else if (userData.rol == 'admin') {
      console.log("admin");
      abrirAdmin();
      //window.location.href = '/Profesor';
    } else if(userData.rol == 'federacion'){
      console.log("federacion");
      //window.location.href = '/Federacion';
    }
    else {
      console.log("ninguno");
    }
  }


}

function mostrarInterfaces(tipoUsuario) {
  var message = "";
  switch (tipoUsuario) {
    case "estudiante":
      message = "¡Bienvenido estudiante!";
      updateLoginState(true, false, false);
      break;
    case "profesor":
      message = "¡Bienvenido profesor!";
      updateLoginState(false, true, false);
      break;
    case "admin":
      message = "¡Bienvenido admin!"; //pa q wea sirve esto
    case "federacion":
      message = "¡Bienvenido miembro de la federación!";
      updateLoginState(false, false, true);
      break;
    default:
      message = "Tipo de usuario desconocido";
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

//export { userId };

</script>



<style>
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
  background: linear-gradient(90deg, #5D54A4, #7C78B8);
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

.screen__background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  -webkit-clip-path: inset(0 0 0 0);
  clip-path: inset(0 0 0 0);
}

.screen__background__shape {
  transform: rotate(45deg);
  position: absolute;
}

.screen__background__shape1 {
  height: 520px;
  width: 520px;
  background: #FFF;
  top: -50px;
  right: 120px;
  border-radius: 0 72px 0 0;
}

.screen__background__shape2 {
  height: 220px;
  width: 220px;
  background: #6C63AC;
  top: -172px;
  right: 0;
  border-radius: 32px;
}

.screen__background__shape3 {
  height: 540px;
  width: 190px;
  background: linear-gradient(270deg, #5D54A4, #6A679E);
  top: -24px;
  right: 0;
  border-radius: 32px;
}

.screen__background__shape4 {
  height: 400px;
  width: 200px;
  background: #7E7BB9;
  top: 420px;
  right: 50px;
  border-radius: 60px;
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
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 3));
}

</style>

