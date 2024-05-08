<template>
  <div class="propuestas">
    <h1>Listado de Propuestas</h1>
    <button @click="reiniciarPropuestas" class="btn-reiniciar">Reiniciar todas las propuestas</button>
    <ul>
      <li v-for="propuesta in propuestas" :key="propuesta.id" class="propuesta">
        <h3 class="propuesta-titulo">{{ propuesta.titulo }}</h3>
        <p class="propuesta-autor">Autor: {{ propuesta.autor }}</p>
        <p class="propuesta-descripcion">{{ propuesta.propuesta }}</p>
        <p class="propuesta-expiracion">Fecha de Expiración: {{ propuesta.Fecha_expiracion }}</p>
        <div class="acciones">
          <button @click="votar(propuesta, 'up')" class="btn-thumb-up">👍</button>
          <span>{{ propuesta.Me_gusta }}</span>
          <button @click="votar(propuesta, 'down')" class="btn-thumb-down">👎</button>
          <span>{{ propuesta.votosNegativos }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from "../clients/supabase";

const propuestas = ref([]);
const campusUsuarioLogeado = localStorage.getItem('campusUsuarioLogeado');

async function loadPropuestas() {
  const currentDate = new Date();
  const { data: propuestasData, error: propuestasError } = await supabase
    .from('propuestas')
    .select('id, usuario_id, titulo, propuesta, Fecha_expiracion, Me_gusta') // Asegúrate de seleccionar Me_gusta
    .eq('Aprobado', true)
    .eq('campusAutor', campusUsuarioLogeado);
  if (propuestasError) {
    console.error('Error cargando las propuestas:', propuestasError.message);
    return;
  }

  const propuestasConAutor = await Promise.all(propuestasData.map(async (propuesta) => {
    const { data: autorData, error: autorError } = await supabase
      .from('usuarios')
      .select('nombre')
      .eq('UID', propuesta.usuario_id)
      .single();

    if (autorError) {
      console.error('Error cargando el autor de la propuesta:', autorError.message);
      return { ...propuesta, autor: 'Desconocido' };
    }

    return { ...propuesta, autor: autorData.nombre, votosPositivos: 0, votosNegativos: 0 };
  }));

  propuestasConAutor.sort((a, b) => new Date(a.Fecha_expiracion) - new Date(b.Fecha_expiracion));

  propuestas.value = propuestasConAutor;
  const propuestasFiltradas = propuestasConAutor.filter(propuesta => new Date(propuesta.Fecha_expiracion) > currentDate);

  propuestasFiltradas.sort((a, b) => new Date(a.Fecha_expiracion) - new Date(b.Fecha_expiracion));

  propuestas.value = propuestasFiltradas;
}

async function votar(propuesta, voto) {
  // Verificar si el usuario ya ha votado en esta propuesta
  const usuarioYaVoto = localStorage.getItem(`voto_${propuesta.id}`);

  // Si el usuario ya ha votado en esta propuesta, no hacer nada
  if (usuarioYaVoto) {
    alert('Ya has votado en esta propuesta.');
    return;
  }

  // Si el usuario no ha votado en esta propuesta, registrar su voto
  if (voto === 'up') {
    propuesta.votosPositivos++;
  } else if (voto === 'down') {
    propuesta.votosNegativos++;
  }
  
  // Marcar que el usuario ya ha votado en esta propuesta
  localStorage.setItem(`voto_${propuesta.id}`, true);

  // Actualizar la columna 'Me_gusta' en la base de datos
  await supabase
    .from('propuestas')
    .update({
      Me_gusta: voto === 'up' ? propuesta.votosPositivos : propuesta.votosNegativos
    })
    .eq('id', propuesta.id);

  alert(`Votaste ${voto} por la propuesta con ID ${propuesta.id}`);
}

async function reiniciarPropuestas() {
  // Reiniciar todas las propuestas a cero en la base de datos
  await supabase
    .from('propuestas')
    .update({ Me_gusta: 0 })
    .eq('Aprobado', true)
    .eq('campusAutor', campusUsuarioLogeado);

  // Eliminar los votos de los usuarios en todas las propuestas
  for (const propuesta of propuestas.value) {
    localStorage.removeItem(`voto_${propuesta.id}`);
  }

  // Actualizar el estado local para mostrar los cambios
  propuestas.value.forEach(propuesta => {
    propuesta.Me_gusta = 0;
  });

  alert('Todas las propuestas han sido reiniciadas.');
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
