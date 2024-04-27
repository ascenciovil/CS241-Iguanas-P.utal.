<template>
  <div class="formulario-container">
    <div class="formulario">
      <h1>Ingresa tu evento <br></h1>
      <br>
      <input type="text" v-model="titulo" placeholder="Título" class="input-titulo">
      <textarea v-model="evento" placeholder="Evento" class="textarea-evento"></textarea>
      <input v-model="birthday" type="date" name="birthday" class="select-fecha" required>
      <label class="checkbox-label">
        <input type="checkbox" v-model="visibleParaProfesores">
        ¿Es visible para los profesores?
      </label>
      <button @click="enviarTituloYEvento" class="boton-enviar" :class="{ 'disabled': submitButtonDisabled }" :disabled="submitButtonDisabled">Enviar</button>
      <div class="message-container">
        <div v-if="successMessage" class="message success">{{ successMessage }}</div>
        <div v-if="errorMessage" class="message error">{{ errorMessage }}</div>
      </div>
    </div>
    <footer class="footer">
      <p>Deben cumplir con las leyes del país, no involucrar datos personales ni ocupar propiedad de otros autores.</p>
      <p>Propuestas Utalca - 2024</p>
    </footer>
  </div>
</template>
  
<script>
import { supabase } from "../clients/supabase.js";

export default {
  data() {
    return {
      titulo: '',
      evento: '',
      fecha: '',
      birthday: '',
      visibleParaProfesores: false,
      successMessage: '',
      errorMessage: '',
    }
  },
  computed: {
    submitButtonDisabled() {
      return !(this.titulo.trim() && this.evento.trim() && this.birthday);
    }
  },
  methods: {
    async enviarTituloYEvento() {
      try {
        const { data, error } = await supabase
          .from('eventos')
          .insert([{ 
            usuario_id: (await supabase.auth.getUser()).data.user.id, 
            titulo: this.titulo, 
            evento: this.evento, 
            Fecha_expiracion: this.birthday, 
            Visualización_profesores: this.visibleParaProfesores
          }]);

        if (error) {
          this.displayErrorMessage('¡Error al enviar evento!');
        } else {
          this.displaySuccessMessage('¡Evento enviado correctamente!');
          // Limpiar los campos después de enviar los datos
          this.titulo = '';
          this.evento = '';
          this.fecha = '';
          this.visibleParaProfesores = false;
        }
      } catch (error) {
        console.error('Error en la solicitud:', error.message);
      }
    },
    displaySuccessMessage(message) {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    },
    displayErrorMessage(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
    }
  }
}
</script>

<style scoped>

h1 {
  text-align: center;
}

.message {
  padding: 10px;
  margin-bottom: 10px;
  margin-top: 5px;
  border-radius: 5px;
  text-align: center;
}
.message-container {
  margin-top: 10px;
}

.success {
  background-color: #d4edda;
  color: #155724;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
}

.formulario-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.formulario {
  max-width: 800px; /* Modifica el ancho máximo del formulario */
  width: 100%; /* Haz que el formulario ocupe todo el ancho disponible */
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-titulo,
.select-fecha {
  display: block;
  width: calc(100% - 20px); /* Ajusta el ancho para compensar el padding */
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
}

.textarea-evento {
  display: block;
  width: calc(100% - 20px); /* Ajusta el ancho para compensar el padding */
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  height: 20vh; /* Reduce la altura del textarea */
  resize: none;
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

.boton-enviar.disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.footer {
  width: 100%;
  background-color: #6C63AC;
  padding: 20px 0;
  color: #fff;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
}

@media screen and (max-width: 480px) {
  .formulario {
    max-width: 100%;
  }
}
</style>
  