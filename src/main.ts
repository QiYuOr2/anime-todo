import { createApp } from 'vue';
import FectIcon from '@fect-ui/vue-icons';
import App from './App.vue';
import router from './router';
import './modules/common/styles/theme.css';

createApp(App).use(router).use(FectIcon).mount('#app');
