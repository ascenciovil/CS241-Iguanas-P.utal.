<template>
  <!DOCTYPE html>
  
  <html lang="en" dir="ltr">
    <head>
      <meta charset="UTF-8">
      <link rel="stylesheet" href="style.css">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <div class="container">
        <div class="title">Registro</div>
        <div class="image"></div>
        <div class="content">
          <form action="#" @submit.prevent="handleSubmit">
            <div class="user-details">
              <div class="input-box">
                
                <input type="text" id="Nombre" v-model="Nombre" placeholder="Nombre" required>
              </div>
              <div class="input-box">
                
                <input type="text" id="usernombre" v-model="usernombre" placeholder="Usuario" required>
              </div>
              <div class="input-box">
              
                <input type="email" id="email" v-model="email" placeholder="Correo instuticional" required>
              </div>
              <div class="input-box">
              
                <select id="campus" v-model="campus" required class="input-box">
  <option disabled value="">Selecciona tu campus</option>
  <option v-for="opcion in opcionesCampus" :value="opcion">{{ opcion }}</option>
</select>
              </div>
              <div class="input-box">
              
                <input type="password" id="password" v-model="password" placeholder="Contraseña" required>
              </div>
              <div class="input-box">
         
                <input type="password" id="conpassword" v-model="conpassword" placeholder="Confirmar contraseña" required>
              </div>
            </div>
            <div class="gender-details">
              <input type="radio" name="gender" id="dot-1" value="masculino" v-model="gender">
              <input type="radio" name="gender" id="dot-2" value="femenino" v-model="gender">
              <input type="radio" name="gender" id="dot-3" value="Prefiero_no_decirlo" v-model="gender">
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
              <p>¿Ya tienes una cuenta? <a href="../pages/Login.vue">Iniciar sesión</a></p>

            </div>
          </form>
        </div>
        <!-- Footer con imagen de banner -->
        <div class="toggle-container">
          <div class="toggle">
            <div class="toggle-panel toggle-left">
              <img src="../assets/img/Ingenieria.jpg" alt="Imagen de ejemplo">
            </div>
          </div>
        </div>
      </div>  
      
    </body>
  </html>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "../clients/supabase";
import { onMounted } from "vue";

// Define las variables reactivas para los campos del formulario
let email = ref("");
let Nombre = ref("");
let password = ref("");
let campus = ref("");
let usernombre = ref("");
let conpassword = ref("");
let gender = ref(""); 
let opcionesCampus = ref(["Curico", "Talca", "Santiago","Linares","Colchagua"]); // Agrega aquí tus opciones de campus

// Función para validar el dominio del correo electrónico
function validarDominio(correo) {
  var dominio = correo.split('@')[1];
  if (dominio === "alumnos.utalca.cl" || dominio === "estudiante.utalca.cl") {
    console.log("es un estudiante");
    return "estudiante";
  } else if (dominio === "utalca.cl" || dominio === "profesor.utalca.cl") {
    console.log("es un profesor");
    return "profesor";
  } else {
    return "desconocido";
  }
}

// Función para manejar el envío del formulario
async function handleSubmit() {
  var correo = document.getElementById("email").value;
  var tipoUsuario = validarDominio(correo);
  console.log(tipoUsuario.valueOf);

  createAccount(tipoUsuario);
}

async function createAccount(tipoUsuario) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      campus: campus.value,
      nombre: Nombre.value,
      gender: gender.value,
      rol: tipoUsuario,
      Baneado : false
    });

    if (error) {
      console.error("Error al crear la cuenta:", error.message);
    } else {
      const userUID = data.user.id;

      console.log(tipoUsuario);
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .insert([{ nombre: Nombre.value, correo: email.value, UID: userUID, campus: campus.value, username: usernombre.value, gender: gender.value, rol:tipoUsuario, Baneado: false }]);

      console.log("Usuario creado correctamente:", data);
      mostrarMensajeTipoUsuario(tipoUsuario);
      alert('Usuario Registrado');
      email.value = "";
      password.value = "";
      campus.value = "";
      Nombre.value = "";
      conpassword.value = "";
      usernombre.value = "";
      gender.value = ""; 
    }
  } catch (error) {
    console.error("Error al crear la cuenta:", error.message);
  }
}

// Función para mostrar mensaje según el tipo de usuario
function mostrarMensajeTipoUsuario(tipoUsuario) {
  var message = "";
  switch (tipoUsuario) {
    case "estudiante":
      message = "¡Bienvenido estudiante!";
      break;
    case "profesor":
      message = "¡Bienvenido profesor!";
      break;
    case "federacion":
      message = "¡Bienvenido miembro de la federación!";
      break;
    default:
      message = "Tipo de usuario desconocido";
  }
  console.log(message); 
}


import { RouterLink } from "vue-router";


onMounted(() => {
  const form = document.querySelector('form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await createAccount(); 
  });
});
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Estilos para el cuerpo de la página */

body {

  width: 100%;
  height: 732px; /* Establece la altura del cuerpo al 100% del viewport */
  display: flex; /* Utiliza un modelo de caja flexible */
  justify-content: center; /* Centra el contenido horizontalmente */
  align-items: center; /* Centra el contenido verticalmente */
  padding: 1%; /* Añade relleno alrededor del cuerpo */
  background: linear-gradient(135deg, #e0e1e2, #cad7fc); /* Establece un fondo de gradiente lineal */
  font-family: 'Poppins', sans-serif; /* Establece la fuente de texto */
  padding-bottom: 12vh;
  padding-top: 10vh;

}

/* Estilos para el contenedor principal */

.container {
  display: relative; /* Utiliza un modelo de caja flexible */
  align-items: center; /* Centra el contenido verticalmente */
  width: 920px;
  height: 487px;
  justify-content: center; /* Centra el contenido horizontalmente */
  min-height: 100%; /* Establece la altura mínima del contenedor al 100% del viewport */
  background: linear-gradient(135deg, #fefffe, #fefffe); /* Establece un fondo de gradiente lineal */
  border-radius: 40px; /* Agrega bordes redondeados */
  /*border: 2px solid #512ca6;  Agrega un borde sólido */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Agrega una sombra al borde */
}

/* Estilos para el título */

.container .title {

  font-size: 30px; /* Establece el tamaño del texto */
  font-weight: 750; /* Establece el grosor del texto */
  text-align: left; /* Alinea el texto al centro */
  position: relative; /* Establece una posición absoluta */
  top: -40%; /* Mueve el título hacia arriba */
  left: 18%;
  color: black; /* Establece el color del texto */
  padding: 1px; /* Añade relleno alrededor del texto */

}


.content form .user-details {
  margin-top: 25%;
  align-items: left; /* Alinea los elementos a la izquierda */
  display: flex; /* Utiliza un modelo de caja flexible */
  flex-wrap: nowrap; /* Evita que los elementos se envuelvan */
  width: 250%; /* Ancho del contenedor */
  flex-direction: column; /* Coloca los elementos en una columna */
  margin-bottom: 10%; /* Añade un margen inferior */
  margin-left: -25%; /* Traslada el contenedor a la izquierda */
  gap: 10px; /* Agrega espacio entre cada columna */
}

/* Estilos para los detalles del usuario */

form .user-details .input-box {
  width: 50%; /* Establece el ancho del contenedor */
}

form .input-box span.details {
  font-weight: 700; /* Establece el grosor del texto */
  margin-bottom: 10%; /* Añade un margen inferior */
  display: block; /* Hace que el elemento sea un bloque */
}

.user-details .input-box input {
  height: 35px; /* Establece la altura del campo de entrada */
  width: 90%; /* Establece el ancho del campo de entrada */
  outline: none; /* Elimina el contorno del campo de entrada al hacer clic */
  font-size: 13px; /* Establece el tamaño del texto */
  border-radius: 10px; /* Agrega bordes redondeados */
  padding-left: 15px; /* Añade relleno a la izquierda */
  border: 1px solid #ccc; /* Establece el borde del campo de entrada */
  border-bottom-width: 2px; /* Establece el ancho del borde inferior */
  transition: all 0.3s ease; /* Agrega una transición suave */
  background-color: #efeeef;
  color: #9a9898;
  font-family: 'Montserrat', sans-serif;
}

.user-details .input-box input:focus,
.user-details .input-box input:valid {
  border-color: #5237ac; /* Cambia el color del borde cuando el campo está enfocado o válido */
  color: black;
}



/* Estilos para las categorías (por ejemplo, género) */

/* Estilos para el título de género */
.gender-title {
  font-size: 13px; /* Establece el tamaño del texto */
  position: relative; /* Establece una posición absoluta */ 
  top: -20px; /* Ajusta la posición verticalmente */
  left: 24%;
  color: black; /* Establece el color del texto */
}

form .category {
  display: flex; /* Utiliza un modelo de caja flexible */
  flex-wrap: wrap; /* Permite que los elementos se envuelvan */
  gap: 20px; /* Establece el espacio entre los elementos */
  margin-top: -10px; /* Añade un margen superior */
  margin-bottom: 10px; /* Añade un margen inferior */
  font-family: 'Montserrat', sans-serif;
  margin-left: -18%;
  font-size: 12px;
}


form .category label {
  display: flex; /* Utiliza un modelo de caja flexible */
  align-items: left; /* Alinea los elementos verticalmente */
  cursor: pointer; /* Cambia el cursor al pasar por encima */ 
}

form .category label .dot {
  height: 18px; /* Establece la altura del punto */
  width: 18px; /* Establece el ancho del punto */
  border-radius: 50%; /* Hace que el punto sea circular */
  margin-right: 10px; /* Añade un margen a la derecha */
  background: #efeeef; /* Establece el color de fondo del punto */
  border: 5px solid transparent; /* Establece el borde del punto */
  transition: all 0.3s ease; /* Agrega una transición suave */
  font-family: 'Montserrat', sans-serif;
  
}

/* Estilos para los puntos de categoría seleccionados */

#dot-1:checked ~ .category label .one,
#dot-2:checked ~ .category label .two,
#dot-3:checked ~ .category label .three {
  font-family: 'Montserrat', sans-serif;
  background: #502fa9; /* Cambia el color de fondo del punto */
  border-color: #d9d9d9; /* Cambia el color del borde del punto */
}

form input[type="radio"] {
  display: none; /* Oculta los botones de radio */
}

/* Estilos para el botón */

form .button {
  text-align: left; /* Centra el botón */
}

form .button input {
  position: relative;
  height: 45px; /* Establece la altura del botón */
  width: 200px; /* Establece el ancho del botón */
  border-radius: 10px; /* Agrega bordes redondeados */
  border: none; /* Elimina el borde */
  color: #ffffff; /* Establece el color del texto */
  font-size: 13px; /* Establece el tamaño del texto */
  font-weight: 501; /* Establece el grosor del texto */
  letter-spacing: 1px; /* Establece el espaciado entre letras */
  cursor: pointer; /* Cambia el cursor al pasar por encima */
  transition: all 0.3s ease; /* Agrega una transición suave */
  background: linear-gradient(135deg, #512ca6, #512ca6); /* Establece un fondo de gradiente lineal */
  margin-top: 10px; /* Ajusta la distancia hacia arriba */
  margin-bottom: 20px;
  margin-left: 1%; /* Ajusta la distancia hacia la izquierda */
}



form .button input:hover {
  background: linear-gradient(-135deg, #7a5cbd, #512ca6); /* Cambia el fondo del botón al pasar el ratón */
}

/* Estilos para pantallas pequeñas (max-width: 584px) */

@media(max-width: 584px) {
  .container {
    max-width: 100%; /* Establece el ancho máximo al 100% del viewport */
  }

  form .user-details .input-box {
    margin-bottom: 15px; /* Añade un margen inferior */
    width: 100%; /* Establece el ancho al 100% */
  }

  form .category {
    width: 100%; /* Establece el ancho al 100% */
  }

  .content form .user-details {
    max-height: 300px; /* Establece la altura máxima */
    overflow-y: scroll; /* Añade una barra de desplazamiento vertical */
  }

  .user-details::-webkit-scrollbar {
    width: 5px; /* Establece el ancho de la barra de desplazamiento */
  }
}

/* Estilos para pantallas aún más pequeñas (max-width: 459px) */

@media(max-width: 459px) {
  .container .content .category {
    flex-direction: column; /* Cambia la dirección de los elementos a columnas */
  }
}



.toggle{
    height: 100%;
    /*background: linear-gradient(to right, #502fa9, #502fa9);*/
    color: #fff;
    position: relative;
    width: 100%;
    transform: translateX(0);
    transition: all 0.6s ease-in-out;
    border-radius: 20px; /* Agrega bordes redondeados */
    padding-left: 1%;
}

.toggle-panel img {
  width: 450px; /* Ajusta el ancho de la imagen al 100% del contenedor */
  height: 570px; /* Ajusta la altura automáticamente para mantener la proporción */
  border-radius: 30px; /* Agrega bordes redondeados */
  object-fit: cover; /* Ajusta el tamaño y recorta la imagen para que llene el contenedor */
  margin-bottom: -7px;
  margin-top: -2px;
}

.input-box select {
  height: 35px; /* Establece la altura del campo de selección */
  outline: none; /* Elimina el contorno del campo de selección al hacer clic */
  font-size: 13px; /* Establece el tamaño del texto */
  border-radius: 10px; /* Agrega bordes redondeados */
  padding-left: 15px; /* Añade relleno a la izquierda */
  border: 1px solid #ccc; /* Establece el borde del campo de selección */
  border-bottom-width: 2px; /* Establece el ancho del borde inferior */
  transition: all 0.3s ease; /* Agrega una transición suave */
  background-color: #efeeef;
  color: #939090;
  font-family: 'Montserrat', sans-serif;
}

.input-box select:focus {
  border-color: #5237ac; /* Cambia el color del borde cuando el campo está enfocado */
  color: black;
  width: 90%;
}

.button p {
  font-size: 11px;
  color: #6e6e6e;
  margin-top: -10px; 
  padding-top: 5px;
  padding-bottom: 15px;
  margin-left: 12px;
}

.button a {
  color: #5237ac;
}

.custom-button {
  height: 45px;
  width: 200px;
  border-radius: 5px;
  border: none;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #71b7e6, #9b59b6);
  text-decoration: none; /* Quita el subrayado */
  display: block;
  margin: 20px auto 0; /* Centro horizontalmente */
}

.custom-button:hover {
  background: linear-gradient(-135deg, #71b7e6, #9b59b6);
}

.button {
  text-decoration: none;
}

.user-details .input-box select {
  height: 36px;
  width: 30%;
  outline: none;
  font-size: 13px;
  border-radius: 10px;
  padding-left: 15px;
  border: 1px solid #ccc;
  border-bottom-width: 2px;
  transition: all 0.3s ease;
}

.user-details .input-box select:focus {
  border-color: #9b59b6;
  width: 90%;
}

.user-details .input-box select:valid {
  border-color: #9b59b6;
  width: 90%;
  color: black;
}

</style>