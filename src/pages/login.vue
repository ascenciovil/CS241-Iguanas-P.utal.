<template>
    <body>
        <h1>Login</h1>
        <form @submit.prevent="login">
            <div class="email">
                <label for="email" class="emailLabel">Email:</label>
                <input type="email" id="email" v-model="email" required> 
            </div>
            <div class="password">
                <label for="password" class="passwordLabel">Password:</label>
                <input type="password" id="password" v-model="password" required>
            </div>
            <button type="submit" class="boton">Login</button>
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
    padding-bottom: 2%;
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
    box-sizing: border-box;
    border-radius: 10px;
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
    margin-bottom: 10%;
    margin-left: 45%;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    position: absolute;
}
div{
    display: flex;
    justify-content: space-between;
    width: 50%;
    margin-left: 25%;
    height: 8%;
}
</style>./Login.vue./Login.vue