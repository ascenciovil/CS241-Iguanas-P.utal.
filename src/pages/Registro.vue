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
              
                <select id="campus" v-model="campus" required>
                  <option disabled value="">Selecciona tu campus</option>
                  <option v-for="opcion in opcionesCampus" :value="opcion">{{ opcion }}</option>
                </select>
              </div>
              <div class="input-box">
              
                <input type="password" id="password" v-model="password" placeholder="Contraseña" required>
              </div>
              <div class="input-box">
         
                <input type="password" id="conpassword" v-model="conpassword" placeholder="Contraseña" required>
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
            </div>
          </form>
        </div>
        <!-- Footer con imagen de banner -->
     
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
  height: 100%; /* Establece la altura del cuerpo al 100% del viewport */
  display: flex; /* Utiliza un modelo de caja flexible */
  justify-content: center; /* Centra el contenido horizontalmente */
  align-items: center; /* Centra el contenido verticalmente */
  padding: 100px; /* Añade relleno alrededor del cuerpo */
  background: linear-gradient(135deg, #e0e1e2, #cad7fc); /* Establece un fondo de gradiente lineal */
  font-family: 'Poppins', sans-serif; /* Establece la fuente de texto */
}

/* Estilos para el contenedor principal */

.container {
  display: flex; /* Utiliza un modelo de caja flexible */
  align-items: center; /* Centra el contenido verticalmente */
  width: 70%;
  justify-content: center; /* Centra el contenido horizontalmente */
  min-height: 70vh; /* Establece la altura mínima del contenedor al 100% del viewport */
  background: linear-gradient(135deg, #fefffe, #fefffe); /* Establece un fondo de gradiente lineal */
  border-radius: 40px; /* Agrega bordes redondeados */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Agrega una sombra al borde */
}



/* Estilos para el título */

.container .title {
  font-size: 50px; /* Establece el tamaño del texto */
  font-weight: 750; /* Establece el grosor del texto */
  text-align: left; /* Alinea el texto al centro */
  position: absolute; /* Establece una posición absoluta */
  top: 22%; /* Ajusta la posición verticalmente */
  left: 35%; /* Centra horizontalmente */
  color: black; /* Establece el color del texto */
  padding: 1px; /* Añade relleno alrededor del texto */
}

/* Estilos para el contenido del formulario */
.content form .user-details {
  margin-top: 10%;
  align-items: left; /* Alinea los elementos a la izquierda */
  display: flex; /* Utiliza un modelo de caja flexible */
  flex-wrap: nowrap; /* Evita que los elementos se envuelvan */
  width: 300%; /* Ancho del contenedor */
  flex-direction: column; /* Coloca los elementos en una columna */
  margin-bottom: 10%; /* Añade un margen inferior */
  margin-left: -100%; /* Traslada el contenedor a la izquierda */
  gap: 20px; /* Agrega espacio entre cada columna */
}




/* Estilos para los detalles del usuario */

form .user-details .input-box {
  width: 48%; /* Establece el ancho del contenedor */
}

form .input-box span.details {
  font-weight: 500; /* Establece el grosor del texto */
  margin-bottom: 5px; /* Añade un margen inferior */
  display: block; /* Hace que el elemento sea un bloque */
}

.user-details .input-box input {
  height: 45px; /* Establece la altura del campo de entrada */
  width: 100%; /* Establece el ancho del campo de entrada */
  outline: none; /* Elimina el contorno del campo de entrada al hacer clic */
  font-size: 16px; /* Establece el tamaño del texto */
  border-radius: 5px; /* Agrega bordes redondeados */
  padding-left: 15px; /* Añade relleno a la izquierda */
  border: 1px solid #ccc; /* Establece el borde del campo de entrada */
  border-bottom-width: 2px; /* Establece el ancho del borde inferior */
  transition: all 0.3s ease; /* Agrega una transición suave */
}

.user-details .input-box input:focus,
.user-details .input-box input:valid {
  border-color: #9b59b6; /* Cambia el color del borde cuando el campo está enfocado o válido */
}

/* Estilos para las categorías (por ejemplo, género) */

form .category {
  display: flex; /* Utiliza un modelo de caja flexible */
  flex-wrap: wrap; /* Permite que los elementos se envuelvan */
  gap: 10px; /* Establece el espacio entre los elementos */
  margin-bottom: 20px; /* Añade un margen inferior */
}

form .category label {
  display: flex; /* Utiliza un modelo de caja flexible */
  align-items: center; /* Alinea los elementos verticalmente */
  cursor: pointer; /* Cambia el cursor al pasar por encima */
}

form .category label .dot {
  height: 18px; /* Establece la altura del punto */
  width: 18px; /* Establece el ancho del punto */
  border-radius: 50%; /* Hace que el punto sea circular */
  margin-right: 10px; /* Añade un margen a la derecha */
  background: #d9d9d9; /* Establece el color de fondo del punto */
  border: 5px solid transparent; /* Establece el borde del punto */
  transition: all 0.3s ease; /* Agrega una transición suave */
}

/* Estilos para los puntos de categoría seleccionados */

#dot-1:checked ~ .category label .one,
#dot-2:checked ~ .category label .two,
#dot-3:checked ~ .category label .three {
  background: #9b59b6; /* Cambia el color de fondo del punto */
  border-color: #d9d9d9; /* Cambia el color del borde del punto */
}

form input[type="radio"] {
  display: none; /* Oculta los botones de radio */
}

/* Estilos para el botón */

form .button {
  text-align: center; /* Centra el botón */
}

form .button input {
  height: 45px; /* Establece la altura del botón */
  width: 200px; /* Establece el ancho del botón */
  border-radius: 5px; /* Agrega bordes redondeados */
  border: none; /* Elimina el borde */
  color: #fff; /* Establece el color del texto */
  font-size: 18px; /* Establece el tamaño del texto */
  font-weight: 500; /* Establece el grosor del texto */
  letter-spacing: 1px; /* Establece el espaciado entre letras */
  cursor: pointer; /* Cambia el cursor al pasar por encima */
  transition: all 0.3s ease; /* Agrega una transición suave */
  background: linear-gradient(135deg, #71b7e6, #9b59b6); /* Establece un fondo de gradiente lineal */
}

form .button input:hover {
  background: linear-gradient(-135deg, #71b7e6, #9b59b6); /* Cambia el fondo del botón al pasar el ratón */
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

/* Estilos para el pie de página */

footer {
  position: fixed; /* Establece una posición fija */
  left: 0; /* Establece la posición desde la izquierda */
  bottom: 0; /* Establece la posición desde la parte inferior */
  width: 100%; /* Establece el ancho al 100% */
  height: 20%; /* Establece la altura al 20% */
  background-color: #333; /* Establece el color de fondo */
  color: white; /* Establece el color del texto */
  text-align: center; /* Centra el texto horizontalmente */
  padding: 10px 0; /* Añade relleno */
}

footer img {
  width: 100%; /* Establece el ancho de la imagen al 100% */
  height: auto; /* Establece la altura automáticamente */
  max-height: 100%; /* Establece la altura máxima al 100% del pie de página */
}
</style>