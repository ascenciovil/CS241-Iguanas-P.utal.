<template>
    <body>
        <h1>Login</h1>
        <form @submit.prevent="login">
            <div class="email">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required> 
            </div>
            <div class="password">
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required>
            </div>
            <div class="boton">
                <button type="submit">Login</button>
            </div>
            <div class="link">
                <a>¿Olvidaste tu contraseña?</a>
            </div>
        </form>
    </body>
</template>

<script>
import { createClient } from '@supabase/supabase-js';

export default {
    data() {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        async login() {
            const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_API_KEY');
            const { user, error } = await supabase.auth.signIn({
                email: this.email,
                password: this.password
            });

            if (error) {
                console.error(error);
                // Handle login error
            } else {
                console.log(user);
                // Redirect to dashboard or perform other actions
            }
        }
    }
};
</script>

<style scoped>
/* Add your custom styles here */
body{
    background-color: #ebdeff;
    height: 100%;
    padding-bottom: 12%;
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
    left: 30%;
    width: 40%;
    height: 300px;
    margin-top: 9%;
    box-sizing: border-box;
    border-radius: 50px;
    background-color: #00cccc;
    align-items: center;
}
.email{
    padding-top: 10%;
    padding-bottom: 4%;
    position: relative;
}
.password{
    padding-top: 4%;
    padding-bottom: 4%;
    position: relative;
}
.boton{
    margin-top: 4%;
    margin-left: 45%;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;
}
.link{
    cursor: pointer;
    text-align: right;
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
label{
    color: white;
    font-size: 20px;
}
.link{
    color: white;
}

</style>./Login.vue./Login.vue
