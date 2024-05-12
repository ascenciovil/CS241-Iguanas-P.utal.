<template>
  <div class="propuestas">
    <h1>Propuestas pendientes</h1>
    <ul>
      <li v-for="propuesta in propuestas" :key="propuesta.id" class="propuesta">
        <h3 class="propuesta-titulo">{{ propuesta.titulo }}</h3>
        <p class="propuesta-autor">Autor: {{ propuesta.autor }}</p>
        <p class="propuesta-descripcion">{{ propuesta.propuesta }}</p>
        <p class="propuesta-expiracion">Fecha de Expiración: {{ propuesta.Fecha_expiracion }}</p>
        <div class="acciones">
          <button @click="votar(propuesta.id, 'Aprobaste')" class="btn-thumb-up">Aprobar</button>
          <button @click="votar(propuesta.id, 'Rechazaste')" class="btn-thumb-down">Rechazar</button>
          <button @click="banear(propuesta.usuario_id, 'Baneaste', propuesta.id)" class="btn-thumb-down">banear 1 semana</button>
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
  const currentDate = new Date();
  const { data: propuestasData, error: propuestasError } = await supabase
    .from('propuestas')
    .select('id, usuario_id, titulo, propuesta, Fecha_expiracion')
    .eq('Aprobado',false);
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

    return { ...propuesta, autor: autorData.nombre };
  }));
  propuestasConAutor.sort((a, b) => new Date(a.Fecha_expiracion) - new Date(b.Fecha_expiracion));

  propuestas.value = propuestasConAutor;
  const propuestasFiltradas = propuestasConAutor.filter(propuesta => new Date(propuesta.Fecha_expiracion) > currentDate);

  propuestasFiltradas.sort((a, b) => new Date(a.Fecha_expiracion) - new Date(b.Fecha_expiracion));

  propuestas.value = propuestasFiltradas;
}

// Define la función para guardar la propuesta baneada
async function guardarPropuestaBaneada(usuario_id, razon, propuesta_id) {
  try {
    // Inserta los datos en la tabla "Ban"
    const { data, error } = await supabase
      .from('Ban')
      .insert([{ razon, uid_user: usuario_id, id_propuesta: propuesta_id }]);
    
    if (error) {
      console.error('Error al guardar la propuesta baneada:', error.message);
      return;
    } else {
      window.alert(`Propuesta baneada con éxito: ${razon}`);
      // Recarga las propuestas después de banear la propuesta
      await loadPropuestas();
    }
  } catch (error) {
    console.error('Error en la solicitud:', error.message);
  }
}

// Define la función banear con los cambios necesarios
async function banear(usuario_id, voto, propuesta_id) {
  if (voto === 'Baneaste') {
    if (confirm('¿Estás seguro de que quieres banear al usuario por 1 semana?')) {
      try {
        // Calcular la fecha de desbaneo sumando una semana a la fecha actual
        const fechaDesban = new Date();
        fechaDesban.setDate(fechaDesban.getDate() + 7);

        // Actualizar la tabla de usuarios con el estado de baneo y la fecha de desbaneo
        const { data, error } = await supabase
          .from('usuarios')
          .update({ Baneado: true, Fecha_Desban: fechaDesban })
          .eq('UID', usuario_id);
        
        if (error) {
          console.error('Error al actualizar el estado de baneo del usuario:', error.message);
          return;
        } else {
          // Llama a la función para guardar la propuesta baneada
          await guardarPropuestaBaneada(usuario_id, 'Test', propuesta_id);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error.message);
      }
    }
  }
}

async function votar(propuestaId, voto) {
if (voto === 'Aprobaste') {
  try {
    const { data, error } = await supabase
      .from('propuestas')
      .update({ Aprobado: true })
      .eq('id', propuestaId);
    
    if (error) {
      console.error('Error al actualizar la propuesta:', error.message);
      return;
    }else{
      window.alert(`${voto} la propuesta con ID ${propuestaId}`);
      // Recargar las propuestas después de votar aprobado
      await loadPropuestas();
    }
  } catch (error) {
    console.error('Error en la solicitud:', error.message);
  }
  
}
if (voto === 'Rechazaste') {
  try {
    const { data, error } = await supabase
      .from('propuestas')
      .update({ Aprobado: false })
      .eq('id', propuestaId);
    
    if (error) {
      console.error('Error al eliminar la propuesta:', error.message);
      return;
    }else{
      window.alert(`${voto} la propuesta con ID ${propuestaId}`);
      // Recargar las propuestas después de votar aprobado
      await loadPropuestas();
    }
    
  } catch (error) {
    console.error('Error en la solicitud:', error.message);
  }
}
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
