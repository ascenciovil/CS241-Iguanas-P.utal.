<template>

  <body>
    <div class="propuestas">
      <h1>Listado de Propuestas</h1>
      <div class="campus-dropdown-container">
      <div class="campus-dropdown">
        <select v-model="campus" name="campus" class="login__input" required>
          <option disabled value="">Selecciona tu campus</option>
          <option v-for="opcion in opcionesCampus" :value="opcion">{{ opcion }}</option>
        </select>
      </div>
    </div>
    
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
              <p class="propuesta-expiracion">Fecha límite: <strong>{{ propuesta.Fecha_expiracion }}</strong></p>
            </div>
            <p class="propuesta-descripcion">{{ propuesta.propuesta }}</p>
            <p>Porcentaje aprobación: <strong>{{ propuesta.aprobacion }}%</strong></p>
            <div class="propuesta-info2">
              <div class="propuesta-info3">
                <td>{{ propuesta.aprobacion }}%</td>
            <td v-if="campus === campusUsuarioLogeado">
            <button @click="votarPositivo(propuesta.id, 'up')" class="btn-thumb-up">{{propuesta.up}} 👍</button>
            </td>
            <td v-if="campus === campusUsuarioLogeado">
            <button @click="votarNegativo(propuesta.id, 'down')" class="btn-thumb-down">{{propuesta.down}} 👎</button>
            </td>
              </div>
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
              <p class="evento-expiracion">Fecha límite: <strong>{{ evento.Fecha_expiracion }}</strong></p>
            </div>
            <p class="evento-descripcion">{{ evento.evento }}</p>
            <p class="button-cell"><button @click="verComentariosEvento(evento.id)" class="btn-ver-comentarios">Ver
                comentarios</button></p>
          </div>
        </div>
      </div>
    </div>
  </body>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { supabase } from "../clients/supabase";
import { useRouter } from 'vue-router';
const router = useRouter();
const propuestas = ref([]);
const campusUsuarioLogeado = localStorage.getItem('campusUsuarioLogeado');
const showPropuestas = ref(true);
const eventos = ref([]);
const showEventos = ref(false);
const buttonClicked = ref([true, false]);
const campus = ref(campusUsuarioLogeado);
const opcionesCampus = ref(["Curico", "Talca", "Santiago", "Linares", "Colchagua"]); 

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

async function loadPropuestas(campus) {
  const currentDate = new Date();
  const { data: propuestasData, error: propuestasError } = await supabase
    .from('propuestas')
    .select('id, usuario_id, titulo, propuesta, Fecha_expiracion, up, down')  // Incluye 'up' y 'down'
    .eq('Aprobado', true)
    .eq('campusAutor', campus);

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
  propuestas.value = propuestasConAutor;
  const propuestafiltradas = propuestasConAutor.filter(propuesta => new Date(propuesta.Fecha_expiracion) > currentDate);
  propuestafiltradas.sort((a, b) => new Date(a.Fecha_expiracion) - new Date(b.Fecha_expiracion));
  propuestas.value = propuestafiltradas;
}

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

  const { up } = propuestaData;

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

async function loadEventos(campus) {
  const currentDate = new Date();
  const { data: eventosData, error: eventosError } = await supabase
    .from('eventos')
    .select('id, usuario_id, titulo, evento, Fecha_expiracion')
    .eq('campusAutor', campus);
  
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
  await loadPropuestas(campusUsuarioLogeado);
  await loadEventos(campusUsuarioLogeado);
});

watch(campus, async (newCampus) => {
  if (newCampus) {
    await loadPropuestas(newCampus);
    await loadEventos(newCampus);
  }
});

</script>


<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.campus-dropdown-container {
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
}

.campus-dropdown {
  width: 200px;
  text-align: right;
}

.campus-dropdown select {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  background-color: white;
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

.propuesta-info2 {
  display: flex;
  justify-content: space-between;
  /* Alinear los elementos al principio y al final del contenedor */
}

.propuesta-info3 {
  display: flex;
  justify-content: left;
  /* Alinear los elementos al principio y al final del contenedor */
}

.propuesta-info3,
button {
  margin-right: 10px;
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
</style>
