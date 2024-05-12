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
        <!-- Imagen a la izquierda -->
        <img src="../assets/img/editar.jpg" alt="Imagen Izquierda" class="left-image">
        
        <div class="login">
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
              <input type="submit" class="login__submit" value="Submit">
            </div>
          </form>
        </div>
        
        <!-- Imagen a la derecha -->
        <img src="../assets/img/editar2.jpg" alt="Imagen Derecha" class="right-image">
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
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Raleway', sans-serif;
  background: linear-gradient(90deg, #C7C5F4, #776BCC);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container {
  position: relative;
  background: linear-gradient(90deg, #5D54A4, #7C78B8);
  box-shadow: 0px 0px 24px #5C5696;
  border-radius: 20px;
  width: 480px;
  padding: 40px;
  margin: auto; /* Centrar horizontalmente */
}

.login__input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  border-bottom: 2px solid #D1D1D4;
  background: none;
  font-size: 20px;
  transition: border-color 0.3s ease;
}

.login__input:focus {
  outline: none;
  border-bottom-color: #6A679E;
}

.login__submit-container {
  text-align: center;
  margin-top: 20px;
  padding-left: 30px;
}

.login__submit {
  background: #fff;
  color: #4C489D;
  font-size: 14px;
  padding: 16px 20px;
  border-radius: 26px;
  border: 1px solid #D4D3E8;
  text-transform: uppercase;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s ease;
  justify-content: center;
}

.login__submit:hover {
  background-color: #F1F0F7;
}

/* Estilos para las imágenes */
.left-image,
.right-image {
  position: fixed; /* Fijar la imagen en la ventana gráfica */
  top: 25vh; /* Centrado verticalmente a media altura */
  height: 50vh; /* La mitad de la altura del viewport */
  width: auto;
}

.left-image {
  left: 20px; /* Alineado a la izquierda */
}

.right-image {
  right: 20px; /* Alineado a la derecha */
}

.login {
  padding-top: 50px;
}

</style>