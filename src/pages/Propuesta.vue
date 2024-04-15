<template>
    <div>
      <input type="text" v-model="titulo" placeholder="Título">
      <textarea v-model="propuesta" placeholder="Propuesta"></textarea>
      <button @click="enviarTituloYPropuesta">Enviar</button>
    </div>
  </template>
  
  <script>
 import { supabase } from "./clients/supabase.js";
  
  export default {
    data() {
      return {
        titulo: '',
        propuesta: ''
      }
    },
    methods: {
      async enviarTituloYPropuesta() {
        try {
          const usuarioId = 1; // Id del usuario
          const { data, error } = await supabase
            .from('propuestas')
            .insert([{ usuario_id: usuarioId, titulo: this.titulo, propuesta: this.propuesta }]);
  
          if (error) {
            console.error('Error al enviar título y propuesta:', error.message);
          } else {
            console.log('Título y propuesta enviados correctamente:', data);
            // Limpiar los campos después de enviar los datos
            this.titulo = '';
            this.propuesta = '';
          }
        } catch (error) {
          console.error('Error en la solicitud:', error.message);
        }
      }
    }
  }
  </script>
  