<template>
    <div id="app">
      <h1>Agregar Usuario</h1>
      <form @submit.prevent="createAccount">
        <label for="email">Email: </label>
        <input type="email" id= "email" v-model="email" placeholder="Email" />
        <label for ="password"> Password: </label>
        <input type="password" id= "password" v-model="password" placeholder="contraseña" />
        <button type="submit">Añadir Usuario</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import {ref} from "vue";
  import { supabase } from "../clients/supabase";
  
  
  let email = ref("");
  let password = ref("");
  
  //crear cuenta
  // Crear cuenta
  async function createAccount() {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value
      });
      if (error) {
        console.error("Error al crear la cuenta:", error.message);
      } else {
        console.log("Usuario creado correctamente:", data);
        // Clear form fields after successful sign-up
        email.value = "";
        password.value = "";
      }
    } catch (error) {
      console.error("Error al crear la cuenta:", error.message);
    }
  }
  </script>
  
  <style>
  /* Estilos opcionales */
  </style>