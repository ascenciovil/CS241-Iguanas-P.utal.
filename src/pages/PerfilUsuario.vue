<template>
    <div id="app">
      <h1>Agregar Usuario</h1>
      <form @submit.prevent="addUser">
        <input type="text" v-model="name" placeholder="Nombre" />
        <button type="submit">Añadir Usuario</button>
      </form>
    </div>
    
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: ''
      };
    },
    methods: {
      async addUser() {
        try {
          const { data, error } = await this.$supabase.from('Test').insert([{ nombre: this.name }]);
          if (error) {
            console.error(error.message);
          } else {
            console.log('Usuario añadido correctamente:', data);
            this.name = '';
          }
        } catch (error) {
          console.error('Error al añadir usuario:', error.message);
        }
      }
    }
  }
  </script>
  
  <style>
  /* Estilos opcionales */
  </style>./Registro.vue