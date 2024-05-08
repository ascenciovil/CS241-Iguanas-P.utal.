<template>
  <div class="propuestas">
    <h1 class="centered-title">Listado</h1>
    <div class="button-container">
      <button @click="togglePropuestasYEventos(0)" class="toggle-button" :disabled="buttonClicked[0]">
        {{ showPropuestas ? 'Propuestas' : 'Propuestas' }}
      </button>
      <button @click="togglePropuestasYEventos(1)" class="toggle-button" :disabled="buttonClicked[1]">
        {{ showEventos ? 'Eventos' : 'Eventos' }}
      </button>
    </div>
    <ul v-if="showPropuestas">
      <li v-for="propuesta in propuestas" :key="propuesta.id" class="propuesta">
        <h3 class="propuesta-titulo">{{ propuesta.titulo }}</h3>
        <p class="propuesta-autor">Autor: {{ propuesta.autor }}</p>
        <p class="propuesta-descripcion">{{ propuesta.propuesta }}</p>
        <p class="propuesta-expiracion">Fecha de expiración: {{ propuesta.Fecha_expiracion }}</p>
      </li>
    </ul>
    <ul v-if="showEventos">
      <li v-for="evento in eventos" :key="evento.id" class="evento">
        <h3 class="evento-titulo">{{ evento.titulo }}</h3>
        <p class="evento-autor">Autor: {{ evento.autor }}</p>
        <p class="evento-descripcion">{{ evento.evento }}</p>
        <p class="evento-expiracion">Fecha de expiración: {{ evento.Fecha_expiracion }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from "../clients/supabase";

const propuestas = ref([]);
const campusUsuarioLogeado = localStorage.getItem('campusUsuarioLogeado');
const showPropuestas = ref(false);
const eventos = ref([]);
const showEventos = ref(false);
const buttonClicked = ref([false, false]); 

async function togglePropuestasYEventos(buttonIndex) {
  buttonClicked.value[buttonIndex] = true;
  buttonClicked.value[1 - buttonIndex] = false;
  if (buttonIndex === 0) {
    showPropuestas.value = !showPropuestas.value;
    showEventos.value = false;
  } else if (buttonIndex === 1) {
    showEventos.value = !showEventos.value;
    showPropuestas.value = false;
  }
}

async function loadPropuestas() {
  const currentDate = new Date();
  const { data: propuestasData, error: propuestasError } = await supabase
    .from('propuestas')
    .select('id, titulo, propuesta, Fecha_expiracion, usuario_id')
    .eq('Visualización_profesores',true)
    .eq('Aprobado', true)
    .eq('campusAutor',campusUsuarioLogeado);
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

async function loadEventos() {
  const currentDate = new Date();
  const { data: eventosData, error: eventosError } = await supabase
    .from('eventos')
    .select('id, titulo, evento, Fecha_expiracion, usuario_id')
    .eq('Visualización_profesores',true)
    .eq('campusAutor',campusUsuarioLogeado);
  if (eventosError) {
    console.error('Error cargando los eventos:', eventosError.message);
    return;
  }

  const eventosConAutor = await Promise.all(eventosData.map(async (evento) => {
    const { data: autorData, error: autorError } = await supabase
      .from('usuarios')
      .select('nombre')
      .eq('UID', evento.usuario_id)
      .single();

    if (autorError) {
      console.error('Error cargando el autor del evento:', autorError.message);
      return { ...evento, autor: 'Desconocido' };
    }

    return { ...evento, autor: autorData.nombre };
  }));
  eventosConAutor.sort((a, b) => new Date(a.Fecha_expiracion) - new Date(b.Fecha_expiracion));
  eventos.value = eventosConAutor;
  const eventosFiltrados = eventosConAutor.filter(evento => new Date(evento.Fecha_expiracion) > currentDate);
  eventosFiltrados.sort((a, b) => new Date(a.Fecha_expiracion) - new Date(b.Fecha_expiracion));
  eventos.value = eventosFiltrados;
}


onMounted(async () => {
  await loadPropuestas();
});

onMounted(() => {
  loadPropuestas();
});

onMounted(() => {
  loadEventos();
});
</script>

<style scoped>

.centered-title {
  text-align: center;
}

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

.eventos {
  font-family: Arial, sans-serif;
}

.evento {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
}

.evento-titulo {
  font-size: 20px;
  margin-bottom: 5px;
}

.evento-autor {
  font-style: italic;
  margin-bottom: 5px;
}

.evento-descripcion {
  margin-bottom: 10px;
}

.evento-expiracion {
  font-style: italic;
  color: #888;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.toggle-button {
  width: 200px;
  font-size: 24px;
  padding: 10px 20px;
  margin: 0 10px;
}
</style>