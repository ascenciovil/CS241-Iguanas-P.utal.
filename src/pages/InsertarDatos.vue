<template>
  <div>
    <input type="text" v-model="nombre" placeholder="Nombre">
    <input type="email" v-model="correo" placeholder="Correo electrónico">
    <button @click="subirDatos">Guardar</button>
  </div>
</template>
<script>
import { supabase } from "./clients/supabase.js";

export default {
  data() {
    return {
      nombre: '',
      correo: ''
    }
  },
  methods: {
    async subirDatos() {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .insert([{ nombre: this.nombre, correo: this.correo }])

        if (error) {
          console.error('Error al insertar datos:', error.message)
        } else {
          console.log('Datos insertados correctamente:', data)
          // Limpiar los campos después de la inserción exitosa
          this.nombre = ''
          this.correo = ''
        }
      } catch (error) {
        console.error('Error en la solicitud:', error.message)
      }
    }
  }
}
</script>