<template>
    <body>
        <h1>Editar perfil</h1>
        <form @submit="saveProfile">
            <div class="nombre">
                <label for="name">Nombre:</label>
                <input type="text" id="name" v-model="profile.name" required>
            </div>
            <div class="email">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="profile.email" required>
            </div>
            <div class="email">
                <label for="bio">Bio:</label>
                <textarea id="bio" v-model="profile.bio"></textarea>
            </div>
            <div class="boton">
                <button type="submit">Guardar</button>
            </div>
        </form>
    </body>
</template>

<script>
export default {
    data() {
        return {
            profile: {
                name: '',
                email: '',
                bio: ''
            }
        };
    },
    methods: {
        saveProfile() {
            // Implement your save logic here
            // You can access the updated profile data using this.profile
        }
    }
};
</script>

<style scoped>
/* Add your custom styles here */
body{
    background-color: #ebdeff;
    height: 100%;
    padding-bottom: 9%;
    width: 100%;
}
h1{
    text-align: center;
    background-color: #ff7f27;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 2%;
}
form{
    position: relative;
    left: 5%;
    width: 40%;
    height: 400px;
    box-sizing: border-box;
    margin-top: 6%;
    border-radius: 50px;
    background-color: #00cccc;
    align-items: center;
}
.nombre{
    padding-top: 10%;
    padding-bottom: 4%;
    position: relative;
}
.email{
    padding-top: 4%;
    padding-bottom: 4%;
    position: relative;
}
.boton{
    margin-top: 4%;
    margin-bottom: 10%;
    margin-left: 45%;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;
}
div{
    display:inline-block;
    width: 50%;
    margin-left: 25%;
    height: 8%;
}
input{
    border-color: #ff7f27;
    border-left: none;
    border-right: none;
    border-top: none;
    background: none;
    outline: none;
    width: 100%;
    padding-top: 10px;
}
textarea{
    border-color: #ff7f27;
    border-left: none;
    border-right: none;
    border-top: none;
    background: none;
    outline: none;
    width: 100%;
    padding-top: 10px;
}
label{
    color: white;
    font-size: 20px;
}
</style>