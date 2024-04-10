<template>
    <div>
        <h1>Edit Profile</h1>
        <form @submit="saveProfile">
            <label for="name">Name:</label>
            <input type="text" id="name" v-model="profile.name" required>
            
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="profile.email" required>
            
            <label for="bio">Bio:</label>
            <textarea id="bio" v-model="profile.bio"></textarea>
            
            <button type="submit">Save</button>
        </form>
    </div>
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
</style>