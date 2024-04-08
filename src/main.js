import { createApp } from 'vue';
import App from './App.vue';
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://jaubayxbwflblrthehdj.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphdWJheXhid2ZsYmxydGhlaGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI0MzM1MDIsImV4cCI6MjAyODAwOTUwMn0.tGggr751oq5X9NZ3PVGcv5jnBiQOicsbBZPViOHMtYI';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = createApp(App);

app.config.globalProperties.$supabase = supabase;

app.mount('#app');