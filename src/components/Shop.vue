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

              <!-- wishlist toggle -->
              <button 
                :class="['btn-wishlist', { active: isIn(product.id) }]" 
                @click="toggleWishlistClick(product)"
                :title="isIn(product.id) ? 'Remove from wishlist' : 'Add to wishlist'">
                <i :class="isIn(product.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
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

              <!-- use same toggle + active UI as v1Products -->
              <button 
                :class="['btn-wishlist', { active: isIn(product.id) }]" 
                @click="toggleWishlistClick(product)"
                :title="isIn(product.id) ? 'Remove from wishlist' : 'Add to wishlist'">
                <i :class="isIn(product.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
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
  // handleAddToWishlist,  // not used now
  handleBuyNow,
  useCartSidebarLogic,
  v1Products,
  driftProducts,
  updateCartItemQuantity,
  removeCartItem,
  reloadWishlist,
  isInWishlist,
  toggleWishlist
} from '../assets/js/script.js'

const router = useRouter()

// --- Initialize Cart Sidebar Logic ---
const { 
  isCartSidebarOpen, 
  cartItems, 
  handleOrders, 
  goToCheckoutPage, 
  goToOrdersPage,
  openSidebar,
  reloadCart
} = useCartSidebarLogic(ref, computed, router) 
// --- End Cart Sidebar ---

onMounted(() => {
  setupNavbarLogic(router)
  loadWishlist()
  window.addEventListener('koma_wishlist_updated', loadWishlist)
})

// wishlist reactive snapshot (array of ids)
const wishlistIds = ref([])

async function loadWishlist() {
  await reloadWishlist()
  try {
    const raw = localStorage.getItem('userWishlist') || '[]'
    const parsed = JSON.parse(raw)
    wishlistIds.value = Array.isArray(parsed) ? parsed : []
  } catch {
    wishlistIds.value = []
  }
}

function handleWishlist() {
  goToWishlist(router)
}

// Use toggleWishlist for all wishlist interactions so add/remove are consistent
async function toggleWishlistClick(product) {
  await toggleWishlist(router, product)
  await loadWishlist()
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
  // if quantity is 1 -> remove
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

// helper used in template
function isIn(id) {
  if (!id) return false
  return wishlistIds.value.includes(id)
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap");
@import "../assets/css/shop-style.css";

/* small styles for quantity controls */
.quantity-controls{display:flex;align-items:center;gap:8px;margin-top:8px}
.qty-btn{width:30px;height:30px;border-radius:6px;border:none;background:#f3f4f6;cursor:pointer;font-weight:700}
.qty{min-width:28px;text-align:center;display:inline-block}
.remove-btn{background:transparent;border:none;color:#b91c1c;cursor:pointer;padding:6px;font-size:13px}

/* add simple active style */
.btn-wishlist { background:transparent; border:none; cursor:pointer; color:inherit }
.btn-wishlist .fas.fa-heart { color: #e11d48 } /* red when filled */
.btn-wishlist.active .fas.fa-heart { color: #e11d48 }
.btn-wishlist .far.fa-heart { color: #333 }
</style>