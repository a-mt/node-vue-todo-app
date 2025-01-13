import { createApp } from 'vue';
import App from './App.vue';
import Toaster from "@meforma/vue-toaster";

import './assets/tailwind.css'; // Import Tailwind CSS
import '@cyhnkckali/vue3-color-picker/dist/style.css';
import './assets/toaster.css';

createApp(App).use(Toaster, {
  position: 'top-right',
  duration: 3000,
  maxToasts: 3,
}).mount('#app');
