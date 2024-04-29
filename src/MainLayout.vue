<template>
    <App :loginEstudiante="loginEstudiante":loginProfesor="loginProfesor":loginAux="loginAux":loginNopropuesta="loginNopropuesta" />
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const loginEstudiante = ref(false); // O cualquier valor por defecto
  const loginProfesor = ref(false);
  const loginAux = ref(true);
  const loginNopropuesta = ref(false);
  </script>