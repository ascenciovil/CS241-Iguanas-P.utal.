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
      <div v-if="showPropuestas">
        <div v-for="propuesta in propuestas" :key="propuesta.id" class="propuesta">
          <div class="post">
            <h2 class="propuesta-titulo">{{ propuesta.titulo }}</h2>
            <div class="propuesta-info">
              <p class="propuesta-autor">Autor: <strong>{{ propuesta.autor }}</strong></p>
              <p class="propuesta-expiracion">Fecha límite: <strong>{{ formatDate(propuesta.Fecha_expiracion)
                  }}</strong></p>
            </div>
            <p class="propuesta-descripcion">{{ propuesta.propuesta }}</p>
            <div class="comentarios">
              <p class="button-cell"><button @click="verComentarios(propuesta.id)" class="btn-ver-comentarios">Ver
                  comentarios</button></p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showEventos">
        <div v-for="evento in eventos" :key="evento.id" class="evento">
          <div class="post">
            <h2 class="evento-titulo">{{ evento.titulo }}</h2>
            <div class="propuesta-info">
              <p class="evento-autor">Autor: <strong>{{ evento.autor }}</strong></p>
              <p class="propuesta-expiracion">Fecha límite: <strong>{{ formatDate(evento.Fecha_expiracion) }}</strong>
              </p>
            </div>
            <p class="evento-descripcion">{{ evento.evento }}</p>
            <div class="comentarios">
              <p class="button-cell"><button @click="verComentariosEvento(evento.id)" class="btn-ver-comentarios">Ver
                  comentarios</button></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from "../clients/supabase";
import { useRouter } from 'vue-router';
const router = useRouter();
const propuestas = ref([]);
const campusUsuarioLogeado = localStorage.getItem('campusUsuarioLogeado');
const showPropuestas = ref(true);
const eventos = ref([]);
const showEventos = ref(false);
const buttonClicked = ref([true, false]);

async function togglePropuestasYEventos(buttonIndex) {
  if (buttonIndex === 0) {
    buttonClicked.value[0] = true;
    buttonClicked.value[1] = false;
    showPropuestas.value = true;
    showEventos.value = false;
  } else if (buttonIndex === 1) {
    buttonClicked.value[1] = true;
    buttonClicked.value[0] = false;
    showEventos.value = true;
    showPropuestas.value = false;
  }
}
async function verComentarios(propuestaId) {
  await router.push({ path: `/comentarios/${propuestaId}` });
}
async function verComentariosEvento(eventoId) {
  await router.push({ path: `/comentariosEvento/${eventoId}` });
}
async function loadPropuestas() {
  const currentDate = new Date();
  const { data: propuestasData, error: propuestasError } = await supabase
    .from('propuestas')
    .select('id, titulo, propuesta, Fecha_expiracion, usuario_id')
    .eq('Visualización_profesores', true)
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
    .eq('Visualización_profesores', true)
    .eq('campusAutor', campusUsuarioLogeado);
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

function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  return formattedDate;
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
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.centered-title {
  text-align: center;
  color: black;
}

.propuestas {
  font-family: Arial, sans-serif;
}

.propuesta,
.evento {
  margin-bottom: 20px;
  padding: 10px;
}

.propuesta-titulo,
.evento-titulo {
  font-size: 20px;
  margin-bottom: 5px;
}

.propuesta-autor,
.evento-autor {
  font-style: italic;
  margin-bottom: 5px;
}

.propuesta-descripcion,
.evento-descripcion {
  margin-bottom: 10px;
}

.propuesta-expiracion,
.evento-expiracion {
  font-style: italic;
  color: black;
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
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.toggle-button:hover {
  background-color: #45a049;
}

.toggle-button:disabled {
  background-color: #cccccc;
  color: #666666;
  cursor: not-allowed;
}

.post {
  margin-bottom: 20px;
  padding: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  margin-left: 100px;
  margin-right: 100px;
  background-color: #7875B5;
  color: white;
}

.post h2 {
  margin-bottom: 10px;
  /* Espaciado entre título y descripción */
}

.post p {
  margin-bottom: 5px;
  text-align: justify;
  /* Espaciado entre descripción y nombre de usuario */
}

.propuesta-info {
  display: flex;
  justify-content: space-between;
  /* Alinear los elementos al principio y al final del contenedor */
}

.btn-ver-comentarios {
  background-color: #0079d3;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-ver-comentarios:hover {
  background-color: #005ea8;
}

h1 {
  margin-top: 20px;
  margin-bottom: 20px;
}

.propuesta-expiracion,
.evento-expiracion {
  font-style: italic;
  color: white;
}

.comentarios {
  display: flex;
  justify-content: right;
}
</style>