<template>
  <div class="formulario">
    <input type="text" v-model="titulo" placeholder="Título" class="input-titulo">
    <textarea v-model="propuesta" placeholder="Propuesta" class="textarea-propuesta"></textarea>
    <select v-model="fecha" class="select-fecha">
      <option disabled value="">Fecha de expiración de la propuesta</option>
      <option value="0">Una hora</option>
      <option value="1">Un día</option>
      <option value="2">Una semana</option>
    </select>
    <label class="checkbox-label">
      <input type="checkbox" v-model="visibleParaProfesores">
      ¿Es visible para los profesores?
    </label>
    <button @click="enviarTituloYPropuesta" class="boton-enviar">Enviar</button>
  </div>
</template>

<script>
import { supabase } from "../clients/supabase.js";

export default {
  data() {
    return {
      titulo: '',
      propuesta: '',
      fecha: '',
      visibleParaProfesores: false,
      fechas: this.getFechas()
    }
  },
  methods: {
    getFechas() {
      const now = new Date();
      const fecha1 = new Date(now.setHours(now.getHours() - 4)); // Placeholder/En una hora
      const fecha2 = new Date(now.setHours(now.getHours() + 20)); // Placeholder/En un dia
      const fecha3 = new Date(now.setHours(now.getHours() + 168)); // Placeholder/En una semana
      return [fecha1, fecha2, fecha3];
    },
    async enviarTituloYPropuesta() {
      try {
        const usuarioId = 'placeholder'; // Id del usuario
        const fechaSeleccionada = this.fechas[this.fecha]; // Selecciona la fecha
        const { data, error } = await supabase
          .from('propuestas')
          .insert([{ usuario_id: usuarioId, titulo: this.titulo, propuesta: this.propuesta, Fecha_expiracion: fechaSeleccionada , Visualización_profesores: this.visibleParaProfesores}]);

        if (error) {
          console.error('Error al enviar título y propuesta:', error.message);
        } else {
          console.log('Título y propuesta enviados correctamente:', data);
          // Limpiar los campos después de enviar los datos
          this.titulo = '';
          this.propuesta = '';
          this.fecha = '';
          this.visibleParaProfesores = false;
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
.textarea-propuesta,
.select-fecha {
  display: block;
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.checkbox-label {
  display: block;
  margin-bottom: 15px;
  font-size: 16px;
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
