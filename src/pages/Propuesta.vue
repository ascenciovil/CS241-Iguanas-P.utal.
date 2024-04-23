<template>
  <div class="formulario-container">
    <div class="formulario">
      <h1>Ingresa tu propuesta <br></h1>
      <br>
      <input type="text" v-model="titulo" placeholder="Título" class="input-titulo">
      <textarea v-model="propuesta" placeholder="Propuesta" class="textarea-propuesta"></textarea>
      <input v-model="birthday" type="date" name="birthday" class="select-fecha" required>
      <label class="checkbox-label">
        <input type="checkbox" v-model="visibleParaProfesores">
        ¿Es visible para los profesores?
      </label>
      <button @click="enviarTituloYPropuesta" class="boton-enviar">Enviar</button>
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
      propuesta: '',
      fecha: '',
      birthday: '',
      visibleParaProfesores: false,
    }
  },
  methods: {
    async enviarTituloYPropuesta() {
      try {
        const { data, error } = await supabase
          .from('propuestas')
          .insert([{ 
            usuario_id: (await supabase.auth.getUser()).data.user.id, 
            titulo: this.titulo, 
            propuesta: this.propuesta, 
            Fecha_expiracion: this.birthday, 
            Visualización_profesores: this.visibleParaProfesores
          }]);
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

h1 {
  text-align: center;
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

.textarea-propuesta {
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
