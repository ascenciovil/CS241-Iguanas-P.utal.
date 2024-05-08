<template>
  <body>
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
    <div class="table-responsive">
      <table class="table v-middle text-nowrap bg-transparent" v-if="showPropuestas">
        <thead class="bg-light">
            <tr>
              <th class="border-0">Título</th>
              <th class="border-0">Autor</th>
              <th class="border-0">Descripción</th>
              <th class="border-0">Expiración</th>
              <th class="border-0" colspan="2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="propuesta in propuestas" :key="propuesta.id" class="propuesta">
              <td class="propuesta-titulo">{{ propuesta.titulo }}</td>
              <td class="propuesta-autor">{{ propuesta.autor }}</td>
              <td class="propuesta-descripcion">{{ propuesta.propuesta }}</td>
              <td class="propuesta-expiracion">{{ propuesta.Fecha_expiracion }}</td>
              <td><button @click="votar(propuesta.id, 'up')" class="btn-thumb-up">👍</button></td>
              <td><button @click="votar(propuesta.id, 'down')" class="btn-thumb-down">👎</button></td>
            </tr>
          </tbody>
      </table>
      <table class="table v-middle text-nowrap bg-transparent" v-if="showEventos">
        <thead class="bg-light">
            <tr>
              <th class="border-0">Título</th>
              <th class="border-0">Autor</th>
              <th class="border-0">Descripción</th>
              <th class="border-0">Expiración</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="evento in eventos" :key="evento.id" class="evento">
              <td class="evento-titulo">{{ evento.titulo }}</td>
              <td class="evento-autor">{{ evento.autor }}</td>
              <td class="evento-descripcion">{{ evento.propuesta }}</td>
              <td class="evento-expiracion">{{ evento.Fecha_expiracion }}</td>
            </tr>
          </tbody>
      </table>
    </div>
  </div>
  </body>
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
    .select('id, usuario_id, titulo, propuesta, Fecha_expiracion')
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
  const { data: eventosData, error: eventosError } = await supabase
    .from('eventos')
    .select('id, usuario_id, titulo, evento, Fecha_expiracion')
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
}

async function votar(propuestaId, voto) {
  // Lógica para registrar el voto en la base de datos
  console.log(`Votaste ${voto} por la propuesta con ID ${propuestaId}`);
  alert(`Votaste ${voto} por la propuesta con ID ${propuestaId}`);
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
  color: black;
}

.propuestas {
  font-family: Arial, sans-serif;
}

.propuesta, .evento {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid black;
}

.propuesta-titulo, .evento-titulo {
  font-size: 20px;
  margin-bottom: 5px;
}

.propuesta-autor, .evento-autor {
  font-style: italic;
  margin-bottom: 5px;
}

.propuesta-descripcion, .evento-descripcion {
  margin-bottom: 10px;
}

.propuesta-expiracion, .evento-expiracion {
  font-style: italic;
  color: black;
}

.acciones {
  margin-top: 10px;
}

.btn-thumb-up, .btn-thumb-down {
  font-size: 18px;
  cursor: pointer;
  margin-right: 10px;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.toggle-button {
  width: 200px;
  font-size: 1.5rem;
  padding: 10px 20px;
  margin: 0 10px;
}

.bg-light {
  background-color: #f8f9fa!important;
  font-size: 1.5rem;
}

* {
  outline: none;
}

*, :after, :before {
  box-sizing: border-box;
}

.text-nowrap {
  white-space: nowrap!important;
}

.table {
  width: 100%;
  margin-bottom: 1rem;
  color: black;
}

table {
  border-collapse: collapse;
}

body {
  margin: 0;
  font-family: Nunito Sans, sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: black;
  text-align: left;
  background-color: #00aae4;
}

.propuesta-titulo{
  font-size: 1.5rem;
}

.evento-titulo{
  font-size: 1.5rem;
}

h1 {
  font-size: 2.5rem;
}

</style>
