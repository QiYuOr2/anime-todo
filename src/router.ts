import { createRouter, createWebHashHistory } from 'vue-router';
import { Router } from './modules/common/constants';

import Home from './modules/home/index.vue';
import Add from './modules/add/index.vue';
import Settings from './modules/settings/index.vue';

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: Router.Home,
      component: Home,
    },
    {
      path: '/add',
      name: Router.Add,
      component: Add,
    },
    {
      path: '/settings',
      name: Router.Settings,
      component: Settings,
    },
  ],
});
