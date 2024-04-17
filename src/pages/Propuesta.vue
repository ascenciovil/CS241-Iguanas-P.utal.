<template>
  <div class="formulario">
    <input type="text" v-model="titulo" placeholder="Título" class="input-titulo">
    <textarea v-model="propuesta" placeholder="Propuesta" class="textarea-propuesta"></textarea>
    <button @click="enviarTituloYPropuesta" class="boton-enviar">Enviar</button>
    <div></div>
  </div>
</template>

<script>
import { supabase } from "../clients/supabase.js";

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
        const usuarioId = 'placeholder'; // Id del usuario
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

<style scoped>
.formulario {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-titulo,
.textarea-propuesta {
  display: block;
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.boton-enviar {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.boton-enviar:hover {
  background-color: #0056b3;
}
</style>
