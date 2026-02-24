<template>
  <div>
    <nav class="navbar">
      <div class="navbar-left-group">
        <div class="navbar-left">
          <router-link to="/" class="logo">
            <img src="../assets/photos/KOMA Logo.png" alt="KOMA Clothing Co. Logo">
          </router-link>
        </div>
        <div class="navbar-center">
          <ul class="nav-links">
            <li><router-link to="/">HOME</router-link></li>
            <li><router-link to="/about">ABOUT</router-link></li>
            <li><router-link to="/shop">SHOP</router-link></li>
            <li><router-link to="/product" class="active">PRODUCT</router-link></li>
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
          <a href="#" @click.prevent="handleWishlist" title="Wishlist"><i class="far fa-heart"></i></a>
          <a href="#" @click.prevent="handleOrders" title="My Orders/Cart"><i class="fas fa-shopping-bag"></i></a>
        </div>
      </div>
    </nav>


    <section class="hero">
      <div class="hero-overlay">
        <img src="../assets/photos/Koma logo white.png" alt="KOMA Logo White" class="hero-logo">
        <router-link to="/shop" class="shop-now">SHOP NOW</router-link>
      </div>
    </section>


    <section class="new-arrival">
      <h2 class="section-title">NEW<br>ARRIVAL</h2>

      <div class="arrival-gallery">
        <div class="arrival-item"><img src="../assets/photos/arrival1.png" alt="Brown Shirt"></div>
        <div class="arrival-item"><img src="../assets/photos/arrival2.png" alt="Olive Shirt"></div>
        <div class="arrival-item"><img src="../assets/photos/arrival3.png" alt="Black Shirt"></div>
      </div>

      <p class="arrival-text">KEEP ON MOVING AHEAD — GOOD THINGS HAPPEN SLOWLY.</p>
      <router-link to="/shop" class="go-to-shop">Go To Shop</router-link>
    </section>

    <hr class="section-divider">

    <section class="product-available">
      <h2 class="section-title">PRODUCT<br>AVAILABLE</h2>

      <div class="product-grid">
        <img src="../assets/photos/product1.png" alt="Black Jacket">
        <img src="../assets/photos/product2.png" alt="White Shirt">
        <img src="../assets/photos/product3.png" alt="Black Hoodie">
        <img src="../assets/photos/product4.png" alt="Black Shorts">
        <img src="../assets/photos/product5.png" alt="Cap">
        <img src="../assets/photos/product6.png" alt="Gray Jacket">
        <img src="../assets/photos/product7.png" alt="Green Shirt">
        <img src="../assets/photos/product8.png" alt="Black Pants">
      </div>

      <router-link to="/shop" class="go-to-shop">Go To Shop</router-link>
    </section>
    
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

                <!-- NEW: quantity controls + remove -->
                <div class="quantity-controls" style="margin-top:8px;align-items:center;">
                  <button class="qty-btn" @click="decrement(item)" aria-label="Decrease">-</button>
                  <span class="qty">{{ item.quantity || 1 }}</span>
                  <button class="qty-btn" @click="increment(item)" aria-label="Increase">+</button>

                  <button class="remove-btn" @click="removeItem(item)" title="Remove" style="margin-left:12px;">
                    Remove
                  </button>
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
            <img src="../assets/photos/KOMA Logo.png" alt="KOMA Footer Logo">
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
  // Open the sidebar after adding an item
  openSidebar()
}

async function increment(item) {
  await updateCartItemQuantity(item.cartId, +1)
  // refresh UI
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
@import "../assets/css/product-style.css";
/* --- NEW STYLES FOR CART SIDEBAR (Copied from Shop.vue) --- */
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
    width: 350px; /* Adjust width as needed */
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

.item-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
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

/* small styles for quantity controls */
.quantity-controls{display:flex;align-items:center;gap:8px;margin-top:8px}
.qty-btn{width:30px;height:30px;border-radius:6px;border:none;background:#f3f4f6;cursor:pointer;font-weight:700}
.qty{min-width:28px;text-align:center;display:inline-block}
.remove-btn{background:transparent;border:none;color:#b91c1c;cursor:pointer;padding:6px;font-size:13px}
</style>