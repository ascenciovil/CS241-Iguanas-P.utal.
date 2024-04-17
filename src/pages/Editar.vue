<template>
    <div class="container">
      <div class="screen">
        <div class="screen__background">
          <div class="screen__background__shape screen__background__shape1"></div>
          <div class="screen__background__shape screen__background__shape2"></div>
          <div class="screen__background__shape screen__background__shape3"></div>
          <div class="screen__background__shape screen__background__shape4"></div>
        </div>
        <div class="screen__content">
          <div class="login">
            <form @submit.prevent="submitForm">
              <div class="login__field">
                <input v-model="firstName" type="text" name="first_name" class="login__input" placeholder="First Name" required>
              </div>
              <div class="login__field">
                <input v-model="lastName" type="text" name="last_name" class="login__input" placeholder="Last Name" required>
              </div>
              <div class="login__field">
                <input v-model="email" type="email" name="email" class="login__input" placeholder="Email Address" required>
              </div>
              <div class="login__field">
                <input v-model="phone" type="tel" name="phone" class="login__input" placeholder="Mobile Number" required pattern="[0-9]{10}">
              </div>
              <div class="login__field">
                <input v-model="birthday" type="date" name="birthday" class="login__input" required>
              </div>
              <div class="login__field">
                <select v-model="gender" name="gender" class="login__input" required>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div class="login__field">
                <input v-model="nationality" type="text" name="nationality" class="login__input" placeholder="Nationality" required>
              </div>
              <div class="login__field">
                <input v-model="monthlyIncome" type="text" name="monthly_income" class="login__input" placeholder="Monthly Income" required>
              </div>
              <div class="login__submit-container">
                <input type="submit" class="login__submit" value="Submit">
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  

<script>
import {ref} from "vue";
import { supabase } from "../clients/supabase";
let email = ref("");
let Nombre = ref ("");
let password = ref("");
let campus = ref("");

async function getProfile() {
    try {
      loading.value = true
      const { user } = session.value
  
      const { data, error, status } = await supabase
        .from('usuarios')
        .select(`nombre, correo, campus`)
        .eq('id', user.id)
        .single()
  
      if (error && status !== 406) throw error
  
      if (data) {
        nombre.value = data.nombre
        correo.value = data.correo
        campus.value = data.campus
      }
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }
  
  async function updateProfile() {
    try {
      loading.value = true
      const { user } = session.value
  
      const updates = {
        id: user.id,
        nombre: nombre.value,
        correo: correo.value,
        campus: campus.value
      }
  
      const { error } = await supabase.from('usuarios').upsert(updates)
  
      if (error) throw error
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: 'Raleway', sans-serif;
    background: linear-gradient(90deg, #C7C5F4, #776BCC);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .container {
    position: relative;
    background: linear-gradient(90deg, #5D54A4, #7C78B8);
    box-shadow: 0px 0px 24px #5C5696;
    border-radius: 20px;
    width: 480px;
    padding: 40px;
    margin: auto; /* Centrar horizontalmente */
  }
  
  .login__input {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: none;
    border-bottom: 2px solid #D1D1D4;
    background: none;
    font-weight: 700;
    transition: border-color 0.3s ease;
  }
  
  .login__input:focus {
    outline: none;
    border-bottom-color: #6A679E;
  }
  
  .login__submit-container {
    text-align: center;
    margin-top: 20px;
  }
  
  .login__submit {
    background: #fff;
    color: #4C489D;
    font-size: 14px;
    padding: 16px 20px;
    border-radius: 26px;
    border: 1px solid #D4D3E8;
    text-transform: uppercase;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .login__submit:hover {
    background-color: #F1F0F7;
  }
  </style>
  