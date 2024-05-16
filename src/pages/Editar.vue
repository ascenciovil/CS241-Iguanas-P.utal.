<template>
  <div class="container">
    <div class="screen">
      <div class="screen__background">
        <div class="screen__background__shape screen__background__shape1"></div>
        <div class="screen__background__shape screen__background__shape2"></div>
        <div class="screen__background__shape screen__background__shape3"></div>
        <div class="screen__background__shape screen__background__shape4"></div>
      </div>
      <div class="screen__content">
        <div class="login">
          <h2 class="profile-title">Mi Perfil</h2>
          <form @submit.prevent="submitForm">
            <div class="login__field">
              <input v-model="correo" type="email" name="correo" class="login__input" placeholder="Correo" required>
            </div>
            <div class="login__field">
              <input v-model="Nombre_Completo" type="text" name="Nombre_Completo" class="login__input" placeholder="Nombre Completo" required>
            </div>
            <div class="login__field">
              <select v-model="campus" name="campus" class="login__input" required>
                <option disabled value="">Selecciona tu campus</option>
                <option v-for="opcion in opcionesCampus" :value="opcion">{{ opcion }}</option>
              </select>
            </div>
            <div class="login__field">
              <select v-model="gender" name="gender" class="login__input" required>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="prefiero_no_decirlo">Prefiero no decirlo</option>
              </select>
            </div>
            <div class="login__field">
              <input v-model="username" type="text" name="username" class="login__input" placeholder="Nombre de usuario" required>
            </div>
            <!-- Agrega más campos de entrada aquí -->
            <div class="login__submit-container">
              <input type="submit" class="login__submit" value="Actualizar">
            </div>
          </form>
        </div>
        
       
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { supabase } from "../clients/supabase";
import { onMounted } from "vue"; 

export default {
  name: "Formulario",
  setup() {
    const correo = ref("");
    const Nombre_Completo = ref("");
    const campus = ref("");
    const gender = ref("");
    const username = ref("");
    let userId = ref("");
    let userData = ref({});
    let opcionesCampus = ref(["Curico", "Talca", "Santiago", "Linares", "Colchagua"]);

    const submitForm = async () => {

      try {
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('UID', userId.value)
          .single();
        const { data, error } = await supabase
          .from('usuarios')
          .update({
            correo: correo.value,
            nombre: Nombre_Completo.value,
            campus: campus.value,
            gender: gender.value,
            username: username.value,
          })
          .eq('correo', correo.value);

        if (error) {
          throw error;
        } else {
          localStorage.setItem('campusUsuarioLogeado', campus.value);
          const campusUsuarioLogeado = localStorage.getItem('campusUsuarioLogeado');
          console.log(campusUsuarioLogeado);
          console.log("Datos actualizados correctamente:", data);
          alert('Datos actualizados correctamente ');
          // Reiniciar los valores de los campos después de enviarlos
         
        }
      } catch (error) {
        console.error("Error al actualizar los datos:", error.message);
      }
    };

    const getUid = async () => {
      try {
        const localUser = await supabase.auth.getSession();
        console.log(localUser.data.session.user.id);
        userId.value = localUser.data.session.user.id;

        const { data: userDataFromDB, error: userError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('UID', userId.value)
          .single();

        userData.value = userDataFromDB;

        // Asignar el valor de userData.nombre al campo Nombre_Completo si no está definido aún
        if (!Nombre_Completo.value && userData.value.nombre) {
          Nombre_Completo.value = userData.value.nombre;
        }

        // Asignar el valor de userData.nombre al campo Nombre_Completo si no está definido aún
        if (!username.value && userData.value.username) {
          username.value = userData.value.username;
        }
        // Asignar el valor de userData.correo al campo correo si no está definido aún
        if (!correo.value && userData.value.correo) {
          correo.value = userData.value.correo;
        }

        // Asignar el valor de userData.campus al campo campus si no está definido aún
        if (!campus.value && userData.value.campus) {
          campus.value = userData.value.campus;
        }

        // Asignar el valor de userData.campus al campo campus si no está definido aún
        if (!gender.value && userData.value.gender) {
          gender.value = userData.value.gender;
        }

       
        
        console.log("rol:", userData.value.rol);
        console.log("nombre:", userData.value.nombre);
        console.log("username:", userData.value.username);
        console.log("genero:", userData.value.gender);
        console.log("correo:", userData.value.correo);
        
      } catch (error) {
        console.error('Error al obtener la sesión:', error.message);
      }
    };

    // Llama a la función getUid cuando el componente se monta
    onMounted(getUid);
   
    return { correo, Nombre_Completo, campus, gender, username, submitForm , userData, opcionesCampus};
  }
};
</script>


<style scoped>
/* Configuración global para todos los elementos */
* {
  box-sizing: border-box; /* Utiliza el modelo de caja border-box para todos los elementos */
  margin: 0; /* Elimina el margen predeterminado */
  padding: 0; /* Elimina el relleno predeterminado */
}

/* Estilos para el cuerpo del documento */
body {
  font-family: 'Montserrat', sans-serif; /* Establece la fuente del texto en el cuerpo */
  display: flex; /* Flexbox para alinear contenido */
  justify-content: center; /* Centra horizontalmente*/
  align-items: center; /* Centra verticalmente */
  height: 100vh; /* 100% de la altura de la ventana gráfica */
}

/* Estilos para el contenedor principal */
.container {
  font-family: 'Montserrat', sans-serif;
  position: relative;
  width: 80%; /* Ancho del contenedor */
  max-width: 600px; /* Ancho máximo */
  height: auto; /* Altura automática */
  padding: 19px;
  margin: auto;
}

/* Estilos para los campos de entrada del formulario */
.login__input {
  width: calc(100% - 22px); /* Ancho total menos el padding y el borde */
  padding: 10px;
  margin-bottom: -10px;
  margin-top: 5%;
  border-bottom: 2px solid #502ea7;
  background: #fefffe;
  font-size: 13px;
  transition: border-color 0.3s ease;
  margin-left: 10px;
}

/* Estilos para el contenedor del botón de enviar */
.login__submit-container {
  width: 200px;
  margin-left: 20%;
  text-align: center;
  margin-top: 10px;
  padding-left: 30px;
}

/* Estilos para el botón de enviar */
.login__submit {
  margin-top: 35%;
  width: 200px; /* Ancho del botón */
  height: 40px; /* Altura del botón */
  background: #fff;
  color: #502fa9;
  font-size: 13px;
  border-radius: 16px;
  border: 1px solid #D4D3E8;
  text-transform: uppercase;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s ease;
  justify-content: center;
}

/* Estilos para el título del perfil */
.profile-title {
  text-align: center;
  font-family: 'Comic Sans MS'; /* Cambia la fuente del texto a Comic Sans MS */
  color: #5230aa; /* Cambia el color del texto a blanco */
  padding-top: 20px;
}

/* Estilos para el formulario de inicio de sesión */
.login {
  border-radius: 3%;
  margin-top: 0px;
  padding-top: 100px;
  background-color: #efeeef;
  height: 600px;
  width: 450px;
  padding-top: 50px; /* Espaciado superior */
}

</style>