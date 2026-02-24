<template>
  <div>
    <nav class="navbar">
      <div class="navbar-left-group">
        <div class="navbar-left">
          <RouterLink to="/" class="logo">
            <img src="../assets/photos/KOMA Logo.png" alt="KOMA Clothing Co. Logo" />
          </RouterLink>
        </div>
        <div class="navbar-center">
          <ul class="nav-links">
            <li><RouterLink to="/">HOME</RouterLink></li>
            <li><RouterLink to="/about">ABOUT</RouterLink></li>
            <li><RouterLink to="/shop">SHOP</RouterLink></li>
            <li><RouterLink to="/product">PRODUCT</RouterLink></li>
            <li><RouterLink to="/feature" class="active">FEATURE</RouterLink></li>
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
      <div class="feature-wrapper">
        
        <section class="collection-title-section">
          <h1 class="collection-title">FEATURED COLLECTIONS</h1>
          <p class="italic-subtitle">A look back at our most iconic drops and collaborations.</p>
        </section>

        <div class="top-content-grid">
          <div class="grid-item item-1">
            <img src="../assets/photos/F1.jpg" alt="V1 Collection" />
          </div>
          <div class="grid-item item-2">
            <img src="../assets/photos/F2.jpg" alt="Drift Collection" />
          </div>
          <div class="grid-item item-3">
            <img src="../assets/photos/F3.jpg" alt="Placeholder" />
          </div>
        </div>

        <div class="intro-text-block">
          <p class="intro-text">
            THE DRIFT COLLECTION EXPLORES MOVEMENT, FREEDOM, AND EVERYDAY MOMENTS <span class="long-dash">—</span> CRAFTED WITH TIMELESS STREETWEAR DESIGNS.
          </p>
        </div>

        <div class="large-center-image">
          <img src="../assets/photos/F4.jpg" alt="The V1 Collection: The Foundation" />
        </div>
        
        <div class="main-text-block">
            <p class="main-eyebrow">OUR INAUGURAL COLLECTION</p>
            <h2 class="main-heading">BUILT FOR MOTION. MADE TO LAST.</h2>
            <p class="main-eyebrow">
              CRAFTED FROM A HEAVYWEIGHT COTTON BLEND ENGINEERED FOR LASTING COMFORT AND SHAPE RETENTION. REINFORCED STITCHING THROUGHOUT FOR ENDURING STREET PERFORMANCE.
            </p>
        </div>

        <div class="bottom-images-cta">
          <div class="bottom-image-item">
            <img src="../assets/photos/F5.jpg" alt="DRIFT: Movement & Color" />
          </div>
          <div class="bottom-image-item">
            <img src="../assets/photos/F6.jpg" alt="DRIFT Close-up" />
          </div>
          <div class="cta-container">
            <RouterLink to="/shop" class="cta">EXPLORE ALL COLLECTIONS</RouterLink>
          </div>
        </div>

      </div>
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
        <div v-for="(item, index) in cartItems" :key="item.cartId || index" class="cart-item">
            <div class="item-details">
                <p class="item-name">{{ item.name }}</p>
                <p class="item-price">{{ item.price }} PHP</p>
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
          <RouterLink to="/" class="footer-logo">
            <img src="../assets/photos/KOMA Logo.png" alt="KOMA Clothing Co. Footer Logo" />
          </RouterLink>
          <ul class="footer-nav-links">
            <li><RouterLink to="/">HOME</RouterLink></li>
            <li><RouterLink to="/about">ABOUT</RouterLink></li>
            <li><RouterLink to="/shop">SHOP</RouterLink></li>
            <li><RouterLink to="/product">PRODUCT</RouterLink></li>
            <li><RouterLink to="/feature">FEATURE</RouterLink></li>
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
        <p>&copy; 2025 KOMA PH. All rights reserved.</p>
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
  useCartSidebarLogic // Imported for cart functionality
} from '../assets/js/script.js'

const router = useRouter()

// Initialize Cart Sidebar Logic
// Assumes useCartSidebarLogic is a custom composable that returns the necessary refs and functions.
const { 
  isCartSidebarOpen, 
  cartItems, 
  handleOrders, 
  goToCheckoutPage, 
  goToOrdersPage 
} = useCartSidebarLogic(ref, computed, router)

onMounted(() => {
  setupNavbarLogic(router)
})

function handleWishlist() {
  goToWishlist(router)
}
</script>

<style scoped>
/* Assuming feature-style.css contains the styles for the main content, navbar, and footer */
@import "../assets/css/feature-style.css";

/* --- NEW STYLES FOR CART SIDEBAR --- */
.cart-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    transition: opacity 0.3s ease;
}

.cart-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 350px; 
    height: 100%;
    background-color: white;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
    display: flex;
    flex-direction: column;
}

.cart-sidebar.open {
    transform: translateX(0);
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #eee;
}

.sidebar-header h2 {
    margin: 0;
    font-size: 1.2em;
    font-family: 'Playfair Display', serif;
}

.close-btn {
    background: none;
    border: none;
    font-size: 2em;
    cursor: pointer;
    line-height: 1;
}

.sidebar-content {
    flex-grow: 1;
    padding: 15px;
    overflow-y: auto;
}

.empty-cart-message {
    padding: 20px 15px;
    text-align: center;
    color: #666;
}

.sidebar-footer {
    padding: 15px;
    border-top: 1px solid #eee;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.checkout-btn, .view-orders-btn {
    width: 100%;
    padding: 12px;
    font-weight: bold;
    cursor: pointer;
    border: 1px solid black;
    transition: background-color 0.2s;
}

.checkout-btn {
    background-color: black;
    color: white;
}

.checkout-btn:hover {
    background-color: #333;
}

.view-orders-btn {
    background-color: white;
    color: black;
}

.view-orders-btn:hover {
    background-color: #f5f5f5;
}

/* Cart Item Styles */
.cart-item {
    display: flex;
    margin-bottom: 15px;
    gap: 10px;
    align-items: center;
    border-bottom: 1px dashed #eee;
    padding-bottom: 15px;
}

.cart-item:last-child {
    border-bottom: none;
}

.item-details {
    flex-grow: 1;
}

.item-name {
    font-weight: 600;
    margin: 0 0 5px 0;
}

.item-price {
    color: #555;
    margin: 0;
}
</style>