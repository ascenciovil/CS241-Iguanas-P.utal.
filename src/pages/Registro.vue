<template>
  <!DOCTYPE html>
  
  <html lang="en" dir="ltr">
    <head>
      <meta charset="UTF-8">
      <title> Responsive Registration Form | CodingLab </title>
      <link rel="stylesheet" href="style.css">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <div class="container">
        <div class="title">Registro</div>
        <div class="content">
          <form action="#">
            <div class="user-details">
              <div class="input-box">
                <span class="details">Nombre Completo</span>
                <input type="text" placeholder="Ingresa tu nombre" required>
              </div>
              <div class="input-box">
                <span class="details">Nombre de usuario</span>
                <input type="text" placeholder="Ingresa tu usuario" required>
              </div>
              <div class="input-box">
                <span class="details">Email</span>
                <input type="text" placeholder="Ingresa tu Correo instuticional" required>
              </div>
              <div class="input-box">
                <span class="details">Numero de Telefono</span>
                <input type="text" placeholder="Ingresa tu numero" required>
              </div>
              <div class="input-box">
                <span class="details">Contraseña</span>
                <input type="text" placeholder="Ingresa tu contraseña" required>
              </div>
              <div class="input-box">
                <span class="details">Confirmar contraseña</span>
                <input type="text" placeholder="Confirma tu contraseña" required>
              </div>
            </div>
            <div class="gender-details">
              <input type="radio" name="gender" id="dot-1">
              <input type="radio" name="gender" id="dot-2">
              <input type="radio" name="gender" id="dot-3">
              <span class="gender-title">Genero</span>
              <div class="category">
                <label for="dot-1">
                  <span class="dot one"></span>
                  <span class="gender">Masculino</span>
                </label>
                <label for="dot-2">
                  <span class="dot two"></span>
                  <span class="gender">Femenino</span>
                </label>
                <label for="dot-3">
                  <span class="dot three"></span>
                  <span class="gender">Prefiero no decirlo</span>
                </label>
              </div>
            </div>
            <div class="button">
              <input type="submit" value="Registrarme">
            </div>
          </form>
        </div>
        <!-- Footer con imagen de banner -->
        <footer>
          <img src="../assets/img/footer.png" alt="Banner">
        </footer>
      </div>
    </body>
  </html>
</template>


<script setup>
import {ref} from "vue";
import { supabase } from "../clients/supabase";

let email = ref("");
let Nombre = ref ("");
let password = ref("");
let campus = ref("");

//crear cuenta
// Crear cuenta
async function createAccount() {
try {
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    campus: campus.value
  });
  if (error) {
    console.error("Error al crear la cuenta:", error.message);
  } else {
    const userUID = data.user.id;
    const { data: userData, error: userError }=await supabase
        .from('usuarios')
        .insert([{ nombre: Nombre.value, correo: email.value , UID: userUID, campus: campus.value}]);
    console.log("Usuario creado correctamente:", data);
    // Clear form fields after successful sign-up
    email.value = "";
    password.value = "";
    campus.value= "";
  }
} catch (error) {
  console.error("Error al crear la cuenta:", error.message);
}
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');

* {
margin: 0;
padding: 0;
box-sizing: border-box;
}

body {
height: 100vh;
display: flex;
justify-content: center;
align-items: center;
padding: 10px;
background: linear-gradient(135deg, #71b7e6, #9b59b6);
font-family: 'Poppins', sans-serif;
}

.container {
display: flex;
align-items: center;
justify-content: center;
min-height: 100vh;
background: linear-gradient(135deg, #9b59b6, #71b7e6); /* Cambia los colores para obtener el tono morado */
}

.screen {
background: linear-gradient(90deg, #5D54A4, #7C78B8);
position: relative;
height: 600px;
width: 360px;
box-shadow: 0px 0px 24px #5C5696;
}
.container .title {
font-size: 60px; /* Aumenta el tamaño del texto */
font-weight: 500;
text-align: center; /* Alinea el texto al centro */
position: absolute; /* Añade posicionamiento absoluto */
top: 20%; /* Ajusta la posición verticalmente */
left: 50%; /* Centra horizontalmente */
transform: translateX(-50%); /* Centra horizontalmente */
color: white; /* Cambia el color del texto a blanco */

padding: 10px ; /* Añade un espacio alrededor del texto */
border-radius: 10px; /* Agrega bordes redondeados al fondo */
}



.content form .user-details {
display: flex;
flex-wrap: wrap;
justify-content: space-between;
margin-bottom: 20px; /* Agregué un margen inferior */
}

form .user-details .input-box {
width: 48%; /* Cambié el ancho para que quepan dos elementos en una fila */
}

form .input-box span.details {
font-weight: 500;
margin-bottom: 5px;
display: block;
}

.user-details .input-box input {
height: 45px;
width: 100%;
outline: none;
font-size: 16px;
border-radius: 5px;
padding-left: 15px;
border: 1px solid #ccc;
border-bottom-width: 2px;
transition: all 0.3s ease;
}

.user-details .input-box input:focus,
.user-details .input-box input:valid {
border-color: #9b59b6;
}

form .category {
display: flex;
flex-wrap: wrap;
gap: 10px; /* Espacio entre los elementos */
margin-bottom: 20px; /* Margen inferior para separarlo del siguiente grupo */
}

form .category label {
display: flex;
align-items: center;
cursor: pointer;
}

form .category label .dot {
height: 18px;
width: 18px;
border-radius: 50%;
margin-right: 10px;
background: #d9d9d9;
border: 5px solid transparent;
transition: all 0.3s ease;
}

#dot-1:checked ~ .category label .one,
#dot-2:checked ~ .category label .two,
#dot-3:checked ~ .category label .three {
background: #9b59b6;
border-color: #d9d9d9;
}

form input[type="radio"] {
display: none;
}

form .button {
text-align: center; /* Centra el botón */
}

form .button input {
height: 45px;
width: 200px; /* Ancho del botón */
border-radius: 5px;
border: none;
color: #fff;
font-size: 18px;
font-weight: 500;
letter-spacing: 1px;
cursor: pointer;
transition: all 0.3s ease;
background: linear-gradient(135deg, #71b7e6, #9b59b6);
}

form .button input:hover {
background: linear-gradient(-135deg, #71b7e6, #9b59b6);
}

@media(max-width: 584px) {
.container {
  max-width: 100%;
}

form .user-details .input-box {
  margin-bottom: 15px;
  width: 100%;
}

form .category {
  width: 100%;
}

.content form .user-details {
  max-height: 300px;
  overflow-y: scroll;
}

.user-details::-webkit-scrollbar {
  width: 5px;
}
}

@media(max-width: 459px) {
.container .content .category {
  flex-direction: column;
}
}

footer {
  position: fixed; /* Lo fija en la parte inferior */
  left: 0;
  bottom: 0;
  width: 100%; /* Ancho completo */
  height: 20%;
  background-color: #333; /* Color de fondo */
  color: white; /* Color de texto */
  text-align: center; /* Centrado horizontal */
  padding: 10px 0; /* Espaciado interno */
}

footer img {
  width: 100%; /* La imagen ocupa todo el ancho */
  height: auto; /* La altura se ajusta automáticamente para mantener la proporción */
  max-height: 100%; /* La imagen no superará el 100% de la altura del footer */
}
</style>