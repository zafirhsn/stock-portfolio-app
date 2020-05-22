import Login from './pages/Login.vue';
import Register from './pages/Register.vue';
import Home from './pages/Home.vue';
import Transactions from './pages/Transactions.vue';


export const routes = [
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/home', name: 'home', component: Home },
  { path: '/transactions', name: 'transactions', component: Transactions },
  { path: '*', component: Login}
]