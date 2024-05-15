<template>
  <body>
  <div class="propuestas">
    <h1>Listado de Propuestas</h1>
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
            <th class="border-0">Aprobación</th>
            <th class="border-0" colspan="2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="propuesta in propuestas" :key="propuesta.id" class="propuesta">
            <td class="propuesta-titulo">{{ propuesta.titulo }}</td>
            <td class="propuesta-autor">{{ propuesta.autor }}</td>
            <td class="propuesta-descripcion">{{ propuesta.propuesta }}</td>
            <td class="propuesta-expiracion">{{ propuesta.Fecha_expiracion }}</td>
            <td>{{ propuesta.aprobacion }}%</td>
            <td><button @click="votarPositivo(propuesta.id, 'up')" class="btn-thumb-up">{{propuesta.up}} 👍</button></td>
            <td><button @click="votarNegativo(propuesta.id, 'down')" class="btn-thumb-down">{{propuesta.down}} 👎</button></td>
            <td class="button-cell"><button @click="verComentarios(propuesta.id)" class="btn-ver-comentarios">Ver comentarios</button></td>
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
              <td class="evento-descripcion">{{ evento.evento }}</td>
              <td class="evento-expiracion">{{ evento.Fecha_expiracion }}</td>
              <td class="button-cell"><button @click="verComentariosEvento(evento.id)" class="btn-ver-comentarios">Ver comentarios</button></td>
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


async function loadPropuestas() {
  const currentDate = new Date();
  const { data: propuestasData, error: propuestasError } = await supabase
    .from('propuestas')
    .select('id, usuario_id, titulo, propuesta, Fecha_expiracion, up, down')  // Incluye 'up' y 'down'
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

    // Calcular los porcentajes de aprobación y rechazo
    const totalVotos = propuesta.up + propuesta.down;
    const aprobacion = totalVotos > 0 ? Math.round((propuesta.up / totalVotos) * 100) : 0;
    const rechazo = totalVotos > 0 ? Math.round((propuesta.down / totalVotos) * 100) : 0;

    return { 
      ...propuesta, 
      autor: autorData.nombre, 
      votosPositivos: propuesta.up, 
      votosNegativos: propuesta.down,
      aprobacion,  // Porcentaje de aprobación
      rechazo  // Porcentaje de rechazo
    };
  }));

  propuestasConAutor.sort((a, b) => new Date(a.Fecha_expiracion) - new Date(b.Fecha_expiracion));

  propuestas.value = propuestasConAutor.filter(propuesta => new Date(propuesta.Fecha_expiracion) > currentDate);
}

onMounted(async () => {
  await loadPropuestas();
});

async function verComentarios(propuestaId) {
  await router.push({ path: `/comentarios/${propuestaId}` });
}
async function verComentariosEvento(eventoId) {
  await router.push({ path: `/comentariosEvento/${eventoId}` });
}

async function votarPositivo(propuestaId) {
  const localUser = await supabase.auth.getSession();
  const userUID = localUser.data.session.user.id;

  const { data: existingVote, error: voteError } = await supabase
    .from('votos')
    .select()
    .eq('uid_user', userUID)
    .eq('id_propuesta', propuestaId);

  if (voteError) {
    console.error('Error verificando el voto:', voteError.message);
    return;
  }

  if (existingVote.length > 0) {
    alert('Ya has votado en esta propuesta.');
    return;
  }

  const { error: insertError } = await supabase
    .from('votos')
    .insert([{ uid_user: userUID, id_propuesta: propuestaId, voto: true }]);

  if (insertError) {
    console.error('Error registrando el voto:', insertError.message);
    return;
  }

  const { data: propuestaData, error: propuestaError } = await supabase
    .from('propuestas')
    .select('up, down')
    .eq('id', propuestaId)
    .single();

  if (propuestaError) {
    console.error('Error obteniendo la propuesta:', propuestaError.message);
    return;
  }

  const {up} = propuestaData;

  const { error: updateError } = await supabase
    .from('propuestas')
    .update({ up: up + 1 })
    .eq('id', propuestaId);

  if (updateError) {
    console.error('Error actualizando la propuesta:', updateError.message);
    return;
  }

  alert(`Votaste 👍 por la propuesta con ID ${propuestaId}`);

  // Actualizar los datos de las propuestas en la interfaz
  await loadPropuestas();
}

async function votarNegativo(propuestaId) {
  const localUser = await supabase.auth.getSession();
  const userUID = localUser.data.session.user.id;

  // Verificar si el usuario ya ha votado en esta propuesta
  const { data: existingVote, error: voteError } = await supabase
    .from('votos')
    .select()
    .eq('uid_user', userUID)
    .eq('id_propuesta', propuestaId);

  if (voteError) {
    console.error('Error verificando el voto:', voteError.message);
    return;
  }

  if (existingVote.length > 0) {
    alert('Ya has votado en esta propuesta.');
    return;
  }

  // Registrar el voto del usuario en la base de datos
  const { error: insertError } = await supabase
    .from('votos')
    .insert([{ uid_user: userUID, id_propuesta: propuestaId, voto: false }]);

  if (insertError) {
    console.error('Error registrando el voto:', insertError.message);
    return;
  }

  // Obtener el valor actual de 'down'
  const { data: propuestaData, error: propuestaError } = await supabase
    .from('propuestas')
    .select('down')
    .eq('id', propuestaId)
    .single();

  if (propuestaError) {
    console.error('Error obteniendo la propuesta:', propuestaError.message);
    return;
  }

  const { down } = propuestaData;

  // Actualizar el valor de 'down' en la base de datos
  const { error: updateError } = await supabase
    .from('propuestas')
    .update({ down: down + 1 })
    .eq('id', propuestaId);

  if (updateError) {
    console.error('Error actualizando la propuesta:', updateError.message);
    return;
  }

  alert(`Votaste 👎 por la propuesta con ID ${propuestaId}`);

  await loadPropuestas();
}

async function loadEventos() {
  const currentDate = new Date();
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
  const eventosFiltrados = eventosConAutor.filter(evento => new Date(evento.Fecha_expiracion) > currentDate);
  eventosFiltrados.sort((a, b) => new Date(a.Fecha_expiracion) - new Date(b.Fecha_expiracion));
  eventos.value = eventosFiltrados;
}
function calculateApprovalPercentage(propuesta) {
    const totalVotes = propuesta.votosPositivos + propuesta.votosNegativos;
    if (totalVotes === 0) return 0;
    return (propuesta.votosPositivos / totalVotes) * 100;
  }

  function calculateRejectionPercentage(propuesta) {
    const totalVotes = propuesta.votosPositivos + propuesta.votosNegativos;
    if (totalVotes === 0) return 0;
    return (propuesta.votosNegativos / totalVotes) * 100;
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

.toggle-button {
  width: 200px;
  font-size: 1.5rem;
  padding: 10px 20px;
  margin: 0 10px;
  background-color: #4CAF50; /* Color de fondo */
  color: white; /* Color del texto */
  border: none; /* Sin borde */
  border-radius: 5px; /* Bordes redondeados */
  cursor: pointer;
}

.toggle-button:hover {
  background-color: #45a049; /* Cambio de color de fondo al pasar el mouse */
}

.toggle-button:disabled {
  background-color: #cccccc; /* Color de fondo cuando está desactivado */
  color: #666666; /* Color del texto cuando está desactivado */
  cursor: not-allowed; /* Cursor no permitido cuando está desactivado */
}
.button-cell {
  /* Ajusta el espaciado y el alineamiento del contenido */
  padding: 5px 10px;
  text-align: center;
}

.button-cell a {
  /* Ajusta el aspecto del enlace para que se parezca a un botón */
  display: inline-block;
  background-color: #C0C0C0; /* Color de fondo del botón */
  color: black; /* Color del texto del botón */
  padding: 8px 16px; /* Espaciado interno del botón */
  border-radius: 4px; /* Bordes redondeados */
  text-decoration: none; /* Quita el subrayado del enlace */
  transition: background-color 0.3s ease; /* Efecto de transición al pasar el ratón */
}

.button-cell a:hover {
  background-color: #666666; /* Cambia el color de fondo al pasar el ratón */
  color:white;
}
</style>
