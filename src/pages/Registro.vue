<template>
  <body id="app">
        <h1>Agregar Usuario</h1>
        <form @submit.prevent="createAccount">
            <div class="Nombre">
                <label for="Nombre">Nombre:</label>
                <input type="text" id="nombre" v-model="nombre" required> 
            </div>
            <div class="email">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required> 
            </div>
            <div class="password">
                <label for="password">Contraseña:</label>
                <input type="password" id="password" v-model="password" required>
            </div>
            <div class="Campus">
                <label for="Campus">Campus:</label>
                <input type="text" id="campus" v-model="campus" required> 
            </div>
            <div class="boton">
              <button type="submit">Añadir Usuario</button>
            </div>
        </form>
    </body>
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
/* Add your custom styles here */
body{
    background-color: #ebdeff;
    height: 100%;
    padding-bottom: 12%;
    width: 100%;
}
h1{
    text-align: center;
    background-color: #ff7f27;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 2%;
}
form{
    position: relative;
    left: 55%;
    width: 40%;
    height: 300px;
    box-sizing: border-box;
    margin-top: 9%;
    border-radius: 50px;
    background-color: #00cccc;
    align-items: center;
}
.email{
    padding-top: 10%;
    padding-bottom: 4%;
    position: relative;
}
.password{
    padding-top: 4%;
    padding-bottom: 4%;
    position: relative;
}
.boton{
    margin-top: 4%;
    margin-bottom: 10%;
    margin-left: 45%;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;
}
div{
    display:inline-block;
    width: 50%;
    margin-left: 25%;
    height: 8%;
}
input{
    border-color: #ff7f27;
    border-left: none;
    border-right: none;
    border-top: none;
    background: none;
    outline: none;
    width: 100%;
    padding-top: 10px;
}
label{
    color: white;
    font-size: 20px;
}
</style>