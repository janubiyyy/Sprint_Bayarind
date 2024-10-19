import { createApp } from 'vue';  // Import createApp dari Vue 3
import App from './App.vue';
import router from './router';  // Import router

const app = createApp(App);

app.use(router);  // Gunakan router di aplikasi
app.mount('#app');  // Mount aplikasi ke elemen dengan id 'app'
