<template>
  <div>
    <nav class="navbar">
      <div class="navbar-left-group">
        <div class="navbar-left">
          <router-link to="/" class="logo">
            <img src="../assets/photos/KOMA Logo.png" alt="KOMA Clothing Co. Logo" />
          </router-link>
        </div>

        <div class="navbar-center">
          <ul class="nav-links">
            <li><router-link to="/">HOME</router-link></li>
            <li><router-link to="/about">ABOUT</router-link></li>
            <li><router-link to="/shop" class="active">SHOP</router-link></li>
            <li><router-link to="/product">PRODUCT</router-link></li>
            <li><router-link to="/feature">FEATURE</router-link></li>
          </ul>
        </div>
      </div>

      <div class="navbar-right">
        <div class="nav-icons">
          <div class="user-dropdown">
            <a href="#" id="userIcon"><i class="far fa-user"></i></a>
            <div class="dropdown-content" id="userDropdownContent">
              <RouterLink to="/signin" class="login-option">Log In</RouterLink>
              <RouterLink to="/profile" class="logged-in-option" style="display: none;">Profile</RouterLink>
              <RouterLink to="/" class="logged-in-option logout-btn" style="display: none;">Log Out</RouterLink>
            </div>
          </div>

          <a href="#" @click.prevent="handleWishlist" title="Wishlist">
            <i class="far fa-heart"></i>
          </a>

          <a href="#" @click.prevent="handleOrders" title="My Orders/Cart">
            <i class="fas fa-shopping-bag"></i>
          </a>
        </div>
      </div>
    </nav>

    <main>
      <section class="hero">
        <img src="../assets/photos/unnamed.png" alt="KOMA V1 Collection" />
        <div class="hero-content">
          <h1 class="brand">KOMA</h1>
          <p>V1 COLLECTION</p>
        </div>
      </section>

      <section class="products">
        <div class="product-grid v1">
          <div v-for="(product, i) in v1Products" :key="i" class="product-card">
            <img :src="product.image" :alt="product.name" />
            <h3>{{ product.name }}</h3>
            <p>{{ product.price }} PHP</p>
            <div class="product-actions">
              <button class="btn-buy" @click="handleBuyNowClick(product)">BUY NOW</button>
              <button class="btn-wishlist" @click="handleAddToWishlistClick(product)">
                <i class="far fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="drift-hero">
        <img src="../assets/photos/Gemini_Generated_Image_54ga2b54ga2b54ga.png" alt="Drift Collection Banner" />
      </section>

      <section class="products">
        <div class="product-grid drift">
          <div v-for="(product, i) in driftProducts" :key="i" class="product-card">
            <img :src="product.image" :alt="product.name" />
            <h4>{{ product.name }}</h4>
            <p>{{ product.price }} PHP</p>
            <div class="product-actions">
              <button class="btn-buy" @click="handleBuyNowClick(product)">BUY NOW</button>
              <button class="btn-wishlist" @click="handleAddToWishlistClick(product)">
                <i class="far fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
    
    <div v-if="isCartSidebarOpen" class="cart-overlay" @click="handleOrders"></div>

    <aside :class="['cart-sidebar', { 'open': isCartSidebarOpen }]">
      <div class="sidebar-header">
        <h2>Your Cart ({{ cartItems.length }})</h2>
        <button class="close-btn" @click="handleOrders">
          &times;
        </button>
      </div>
      <div v-if="cartItems.length === 0" class="empty-cart-message">
        Your cart is empty.
      </div>
      <div v-else class="sidebar-content">
        <div v-for="item in cartItems" :key="item.cartId || item.id" class="cart-item">
            <img :src="item.image" :alt="item.name" class="item-image"/>
            <div class="item-details">
                <p class="item-name">{{ item.name }}</p>
                <p class="item-price">{{ item.price }} PHP</p>

                <div class="quantity-controls">
                  <button class="qty-btn" @click="decrement(item)" aria-label="Decrease">-</button>
                  <span class="qty">{{ item.quantity || 1 }}</span>
                  <button class="qty-btn" @click="increment(item)" aria-label="Increase">+</button>
                  <button class="remove-btn" @click="removeItem(item)" title="Remove">Remove</button>
                </div>
            </div>
        </div>
      </div>
      <div v-if="cartItems.length > 0" class="sidebar-footer">
        <button class="checkout-btn" @click="goToCheckoutPage">
            PROCEED TO CHECKOUT
        </button>
        <button class="view-orders-btn" @click="goToOrdersPage">
            VIEW MY ORDERS
        </button>
      </div>
    </aside>

    <footer class="main-footer">
      <div class="footer-top">
        <div class="footer-left">
          <router-link to="/" class="footer-logo">
            <img src="../assets/photos/KOMA Logo.png" alt="KOMA Clothing Co. Footer Logo" />
          </router-link>
          <ul class="footer-nav-links">
            <li><router-link to="/">HOME</router-link></li>
            <li><router-link to="/about">ABOUT</router-link></li>
            <li><router-link to="/shop">SHOP</router-link></li>
            <li><router-link to="/product">PRODUCT</router-link></li>
            <li><router-link to="/feature">FEATURE</router-link></li>
          </ul>
        </div>
        <div class="footer-right">
          <div class="social-icons">
            <a href="https://www.facebook.com/" target="_blank"><i class="fab fa-facebook"></i></a>
            <a href="https://www.instagram.com/" target="_blank"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy;2025 KOMA PH. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  setupNavbarLogic, 
  goToWishlist, 
  handleAddToWishlist, 
  handleBuyNow,
  useCartSidebarLogic, 
  v1Products,           
  driftProducts,        
  updateCartItemQuantity,
  removeCartItem
} from '../assets/js/script.js'

const router = useRouter()

const { 
  isCartSidebarOpen, 
  cartItems, 
  handleOrders, 
  goToCheckoutPage, 
  goToOrdersPage,
  openSidebar,
  reloadCart
} = useCartSidebarLogic(ref, computed, router) 

onMounted(() => {
  setupNavbarLogic(router)
})

function handleWishlist() {
  goToWishlist(router)
}

function handleAddToWishlistClick(product) {
  handleAddToWishlist(router, product)
}

function handleBuyNowClick(product) {
  handleBuyNow(router, product)
  openSidebar()
}

async function increment(item) {
  await updateCartItemQuantity(item.cartId, +1)
  reloadCart()
}

async function decrement(item) {
  const qty = Number(item.quantity || 1)
  if (qty <= 1) {
    await removeCartItem(item.cartId)
  } else {
    await updateCartItemQuantity(item.cartId, -1)
  }
  reloadCart()
}

async function removeItem(item) {
  if (!confirm('Remove this item from cart?')) return
  await removeCartItem(item.cartId)
  reloadCart()
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap");
@import "../assets/css/shop-style.css";

.quantity-controls{display:flex;align-items:center;gap:8px;margin-top:8px}
.qty-btn{width:30px;height:30px;border-radius:6px;border:none;background:#f3f4f6;cursor:pointer;font-weight:700}
.qty{min-width:28px;text-align:center;display:inline-block}
.remove-btn{background:transparent;border:none;color:#b91c1c;cursor:pointer;padding:6px;font-size:13px}
</style>