<template>
    <div>
      <h1>Evento {{ eventoId }}</h1>
      <div class="espacio"></div>
  
      <div class="evento" v-if="evento">
        <h2>{{ evento.titulo }}</h2>
        <div class="espacio"></div>
        <p>Descripción: {{ evento.evento }}</p>
      </div>
  
      <div class="comentario-form">
        <textarea v-model="nuevoComentario" placeholder="Escribe tu comentario aquí"></textarea>
        <button @click="agregarComentario">Agregar Comentario</button>
      </div>
  
      <div class="comentarios" v-if="comentarios.length > 0">
        <h3>Comentarios:</h3>
        <ul>
          <li v-for="comentario in comentarios" :key="comentario.id" class="comentario">
            <div class="usuario">{{ comentario.usuario }}</div>
            <div class="texto">{{ comentario.comentario }}</div>
          </li>
        </ul>
      </div>
  
      <div v-else>
        <p>Sin comentarios</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { supabase } from "../clients/supabase";
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const eventoId = route.params.id;
  const evento = ref(null);
  const comentarios = ref([]);
  const nuevoComentario = ref('');
  
  async function cargarEvento() {
    const { data, error } = await supabase
      .from('eventos')
      .select('titulo, evento')
      .eq('id', eventoId)
      .single();
  
    if (error) {
      console.error('Error cargando el evento:', error.message);
      return;
    }
  
    evento.value = data;
  }
  
  async function cargarComentarios() {
    const { data, error } = await supabase
      .from('comentariosEvento')
      .select('*')
      .eq('evento_id', eventoId);
  
    if (error) {
      console.error('Error cargando los comentarios:', error.message);
      return;
    }
  
    comentarios.value = await Promise.all(data.map(async comentario => {
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('username')
        .eq('UID', comentario.usuario_id)
        .single();
  
      if (userError) {
        console.error('Error cargando el nombre de usuario:', userError.message);
        return comentario;
      }
  
      comentario.usuario = userData.username;
      return comentario;
    }));
  }
  
  async function agregarComentario() {
    if (!nuevoComentario.value.trim()) {
      alert('Por favor, escribe un comentario.');
      return;
    }
  
    const { data, error } = await supabase
      .from('comentariosEvento')
      .insert({
        evento_id: eventoId,
        usuario_id: (await supabase.auth.getUser()).data.user.id,
        comentario: nuevoComentario.value.trim()
      });
  
    if (error) {
      console.error('Error al agregar comentario:', error.message);
      return;
    }
  
    nuevoComentario.value = '';
    await cargarComentarios();
  }
  
  onMounted(async () => {
    await cargarEvento();
    await cargarComentarios();
  });
  </script>

  
  
  <style scoped>
  .evento {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .comentario-form {
    margin-left: 20px; /* Ajusta la posición de la caja de comentario hacia la derecha */
  }
  .comentario-form textarea {
    width: 60%;
    height: 50px;
    margin-bottom: 30px;
  }
  
  .comentario-form button {
    padding: 5px 10px;
    margin-bottom: 20px;
    background-color: white;
    color: black;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  
  .comentarios {
    margin-top: 20px;
  }
  
  .comentario {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .comentario .usuario {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .comentario .texto {
    margin-bottom: 5px;
  }
  .espacio {
    margin-bottom: 10px; /* Espacio de 10px entre el título y el párrafo */
    }
  </style>
  