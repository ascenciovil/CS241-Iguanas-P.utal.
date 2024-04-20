<template>
    <div>
      <h1>Listado de Propuestas</h1>
      <ul>
        <li v-for="propuesta in propuestas" :key="propuesta.id">
          <h3>{{ propuesta.titulo }}</h3>
          <p>{{ propuesta.propuesta }}</p>
          <p>Fecha de Expiración: {{ propuesta.Fecha_expiracion }}</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { supabase } from "../clients/supabase";
  
  const propuestas = ref([]);
  
  async function loadPropuestas() {
    const { data, error } = await supabase
      .from('propuestas')
      .select('id, usuario_id, titulo, propuesta, Fecha_expiracion');
    if (error) {
      console.error('Error cargando las propuestas:', error.message);
    } else {
      propuestas.value = data;
    }
  }
  
  onMounted(() => {
    loadPropuestas();
  });
  </script>