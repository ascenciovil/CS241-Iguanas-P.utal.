<template>
  <div class="propuestas">
    <h1>Listado de Propuestas con Visualización de Profesores</h1>
    <ul>
      <li v-for="propuesta in propuestas" :key="propuesta.id" class="propuesta">
        <h3 class="propuesta-titulo">{{ propuesta.titulo }}</h3>
        <p class="propuesta-autor">Autor: {{ propuesta.autor }}</p>
        <p class="propuesta-descripcion">{{ propuesta.propuesta }}</p>
        <p class="propuesta-expiracion">Fecha de Expiración: {{ propuesta.Fecha_expiracion }}</p>
        <div class="acciones">
          <button @click="votar(propuesta.id, 'up')" class="btn-thumb-up">👍</button>
          <button @click="votar(propuesta.id, 'down')" class="btn-thumb-down">👎</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from "../clients/supabase";

const propuestas = ref([]);

async function loadPropuestas() {
  const { data: propuestasData, error: propuestasError } = await supabase
    .from('propuestas')
    .select('id, titulo, propuesta, Fecha_expiracion, usuario_id');
  
  if (propuestasError) {
    console.error('Error cargando las propuestas:', propuestasError.message);
    return;
  }

  const propuestasConAutor = await Promise.all(propuestasData.map(async (propuesta) => {
    const { data: autorData, error: autorError } = await supabase
      .from('usuarios')
      .select('nombre')
      .eq('id', propuesta.usuario_id)
      .single();

    if (autorError) {
      console.error('Error cargando el autor de la propuesta:', autorError.message);
      return { ...propuesta, autor: 'Desconocido' };
    }

    return { ...propuesta, autor: autorData.nombre };
  }));

  propuestas.value = propuestasConAutor;
}

async function votar(propuestaId, voto) {
  // Lógica para registrar el voto en la base de datos
  console.log(`Votaste ${voto} por la propuesta con ID ${propuestaId}`);
  alert(`Votaste ${voto} por la propuesta con ID ${propuestaId}`);
}

onMounted(() => {
  loadPropuestas();
});
</script>

<style scoped>
.propuestas {
  font-family: Arial, sans-serif;
}

.propuesta {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
}

.propuesta-titulo {
  font-size: 20px;
  margin-bottom: 5px;
}

.propuesta-autor {
  font-style: italic;
  margin-bottom: 5px;
}

.propuesta-descripcion {
  margin-bottom: 10px;
}

.propuesta-expiracion {
  font-style: italic;
  color: #888;
}

.acciones {
  margin-top: 10px;
}

.btn-thumb-up,
.btn-thumb-down {
  font-size: 18px;
  cursor: pointer;
  margin-right: 10px;
}
</style>