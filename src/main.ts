import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Views
import Welcome from './views/Welcome.vue'
import Dashboard from './views/Dashboard.vue'
import News from './views/News.vue'

const routes = [
  { path: '/', name: 'welcome', component: Welcome },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/news', name: 'news', component: News },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')