import { createApp } from 'vue';
import App from './App.vue';
import { createClient } from "@supabase/supabase-js";
import router from './router'
const supabaseUrl = import.meta.env.VITE_SUPAURL;
const supabaseKey = import.meta.env.VITE_SUPAKEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = createApp(App);

app.config.globalProperties.$supabase = supabase;

createApp(App)
  .use(router)
  .mount('#app')