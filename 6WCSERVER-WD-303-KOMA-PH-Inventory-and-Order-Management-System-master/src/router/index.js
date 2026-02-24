import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Index.vue'
import About from '../components/About.vue'
import Shop from '../components/Shop.vue'
import Feature from '../components/Feature.vue'
import SignIn from '../components/SignIn.vue'
import SignUp from '../components/SignUp.vue'
import ProfileDashboard from '../components/ProfileDashboard.vue'
import MyOrders from '../components/MyOrders.vue'
import Product from '../components/Product.vue'
import Wishlist from '../components/Wishlist.vue'
import Checkout from '../components/Checkout.vue'



const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/about', name: 'About', component: About },
    { path: '/shop', name: 'Shop', component: Shop },
    { path: '/feature', name: 'Feature', component: Feature },
    { path: '/signin', name: 'SignIn', component: SignIn },
    { path: '/signup', name: 'SignUp', component: SignUp },
    { path: '/profile', name: 'ProfileDashboard', component: ProfileDashboard },
    { path: '/myorders', component: MyOrders },
    { path: '/product', component: Product },
    { path: '/wishlist', component: Wishlist },
    { path: '/checkout', component: Checkout },
    
  ],
})

export default router
