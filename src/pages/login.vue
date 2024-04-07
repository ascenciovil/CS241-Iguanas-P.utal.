<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="login">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email" required>
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" required>
            <button type="submit">Login</button>
        </form>
    </div>
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
</style>