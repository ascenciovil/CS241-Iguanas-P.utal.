<template>
    <App :loginEstudiante="loginEstudiante":loginProfesor="loginProfesor":loginAux="loginAux" />
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const loginEstudiante = ref(false); // O cualquier valor por defecto
  const loginProfesor = ref(false);
  const loginAux = ref(true);
  </script>