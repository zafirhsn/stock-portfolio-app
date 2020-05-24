import Login from './pages/Login.vue';
import Register from './pages/Register.vue';
import Home from './pages/Home.vue';
import Transactions from './pages/Transactions.vue';


export const routes = [
  { path: '/login', name: 'login', component: Login, 
    beforeEnter(to, from, next) {
      if (sessionStorage.getItem("token") && sessionStorage.getItem("user") && sessionStorage.getItem('symbols')) {
        next('/home');
      } else {
        next();
      }
    }
  },
  { path: '/register', name: 'register', component: Register },
  { path: '/home', name: 'home', component: Home, 
    beforeEnter(to, from, next) {
      if (!sessionStorage.getItem("token") || !sessionStorage.getItem("user") || !sessionStorage.getItem('symbols')) {
        next('/login')
      } else {
        next();
      }
    }
  },
  { path: '/transactions', name: 'transactions', component: Transactions,
    beforeEnter(to, from, next) {
      if (!sessionStorage.getItem("token") || !sessionStorage.getItem("user") || !sessionStorage.getItem('symbols')) {
        next('/login')
      } else {
        next();
      }
    }
  },
  { path: '*', component: Login}
]