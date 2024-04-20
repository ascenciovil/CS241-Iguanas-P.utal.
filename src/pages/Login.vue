<template>
  <div>
    <img src="../assets/img/foto.jpeg" alt="Imagen Izquierda" style="position: absolute; top: 29vh; left: 0; height: 70vh;">
    <img src="../assets/img/foto.jpeg" alt="Imagen Derecha" style="position: absolute; top: 29vh; right: 0; height: 70vh;">
    <div class="container">
      <div class="screen">
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
</template>


<script setup>
import { ref } from "vue";
import { updateLoginState } from "@/App.vue";
import { supabase } from "../clients/supabase";

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
    //easter egg
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  } else {
    console.log("Usuario autenticado:", data.user);

    // Obtener el UID del usuario
    const userId = data.user.id;
    
    // Consultar la tabla de usuarios para obtener el rol
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('UID', userId)
      .single();

    if (userError) {
      console.error("Error al obtener la información del usuario:", userError.message);
    } else {
      console.log("Rol del usuario:", userData.rol);
      mostrarInterfaces(userData.rol);

    }
    alert('Usuario logueado');
  }
  
}

function mostrarInterfaces(tipoUsuario) {
  var message = "";
  switch (tipoUsuario) {
    case "estudiante":
      message = "¡Bienvenido estudiante!";
      updateLoginState(true,false);
      break;
    case "profesor":
      message = "¡Bienvenido profesor!";
      updateLoginState(false,true);
      break;
    default:
      message = "Tipo de usuario desconocido";
  }
  console.log(message); 
}

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
  min-height: 100vh;
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
  width: 75%;
  transition: .2s;
}

.login__input:active,
.login__input:focus,
.login__input:hover {
  outline: none;
  border-bottom-color: #6A679E;
}

.login__submit {
  background: #fff;
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
  box-shadow: 0px 2px 2px #5C5696;
  cursor: pointer;
  transition: .2s;
}

.login__submit:active,
.login__submit:focus,
.login__submit:hover {
  border-color: #6A679E;
  outline: none;
}

.button__icon {
  font-size: 24px;
  margin-left: auto;
  color: #7875B5;
}
</style>