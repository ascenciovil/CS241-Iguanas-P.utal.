<template>
    <body>
        <h1>Editar perfil</h1>
        <form @submit="saveProfile">
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
                <button type="submit">Guardar Cambios</button>
            </div>
        </form>
    </body>
</template>

<script>
import {ref} from "vue";
import { supabase } from "../clients/supabase";
let email = ref("");
let Nombre = ref ("");
let password = ref("");
let campus = ref("");

async function getProfile() {
    try {
      loading.value = true
      const { user } = session.value
  
      const { data, error, status } = await supabase
        .from('usuarios')
        .select(`nombre, correo, campus`)
        .eq('id', user.id)
        .single()
  
      if (error && status !== 406) throw error
  
      if (data) {
        nombre.value = data.nombre
        correo.value = data.correo
        campus.value = data.campus
      }
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }
  
  async function updateProfile() {
    try {
      loading.value = true
      const { user } = session.value
  
      const updates = {
        id: user.id,
        nombre: nombre.value,
        correo: correo.value,
        campus: campus.value
      }
  
      const { error } = await supabase.from('usuarios').upsert(updates)
  
      if (error) throw error
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }
</script>
<style scoped>
/* Add your custom styles here */
body{
    background-color: #ebdeff;
    height: 100%;
    padding-bottom: 9%;
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
    left: 5%;
    width: 40%;
    height: 400px;
    box-sizing: border-box;
    margin-top: 6%;
    border-radius: 50px;
    background-color: #00cccc;
    align-items: center;
}
.nombre{
    padding-top: 10%;
    padding-bottom: 4%;
    position: relative;
}
.email{
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
textarea{
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