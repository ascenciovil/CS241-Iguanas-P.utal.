<template>
    <div class="estudiantes">
        <h1>Estudiantes</h1>
        <ul>
            <li v-for="estudiante in usuarios" :key="estudiante.id" class="estudiante">
                <h2 class="estudiante-nombre">{{ estudiante.nombre }}</h2>
                <p class="estudiante-correo">Correo: {{ estudiante.correo }}</p>
                <p class="estudiante-campus">Campus: {{ estudiante.campus }}</p>
                <p class="estudiante-rol">Rol: {{ estudiante.rol }}</p>
                <div class="acciones">
                    <button @click="cambioRol(estudiante)">Cambiar rol</button>
                </div>
                <br>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from "../clients/supabase";

const usuarios = ref([]);

async function loadUsuarios() {
    try {
        const { data: usuariosData, error: usuariosError } = await supabase
            .from('usuarios')
            .select('id, nombre, correo, campus, rol')
            .in('rol', ['estudiante', 'federacion']);

        if (usuariosError) {
            console.error('Error cargando los usuarios:', usuariosError.message);
            return;
        }

        usuarios.value = usuariosData;
    } catch (error) {
        console.error('Error cargando los usuarios:', error.message);
    }
}

async function cambioRol(estudiante){
    try {
        // Determinar el nuevo rol
        const nuevoRol = estudiante.rol === 'estudiante' ? 'federacion' : 'estudiante';

        // Actualizar el rol en la base de datos
        const { data, error } = await supabase
            .from('usuarios')
            .update({ rol: nuevoRol })
            .eq('id', estudiante.id);

        if (error) {
            console.error('Error al cambiar el rol:', error.message);
            return;
        }

        // Actualizar el rol en la lista local de usuarios
        estudiante.rol = nuevoRol;

        console.log('Rol cambiado correctamente:', data);
    } catch (error) {
        console.error('Error al cambiar el rol:', error.message);
    }
}

onMounted(() => {
    loadUsuarios();
});

</script>

<style scoped>
/* Estilos CSS aquí */
</style>