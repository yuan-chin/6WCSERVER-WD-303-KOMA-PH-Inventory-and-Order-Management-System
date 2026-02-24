<template>
  <div class="wishlist-page">
    <aside class="sidebar">
      <RouterLink to="/" class="logo-link">
        <img src="../assets/photos/KOMA logo white.png" alt="KOMA Logo" class="koma-logo-img" />
      </RouterLink>

      <nav class="main-nav">
        <ul>
          <li><RouterLink to="/">Home</RouterLink></li>
          <li><RouterLink to="/profile">Profile</RouterLink></li>
          <li><RouterLink to="/myorders">My Orders</RouterLink></li>
          <li class="active"><RouterLink to="/wishlist">Wishlist</RouterLink></li>
          <li><a href="#">Settings</a></li>
          <li><button class="logout-btn" @click="logoutHandler">Logout</button></li>
        </ul>
      </nav>
    </aside>

    <main class="content">
      <header class="content-header">
        <div class="user-block">
          <div class="user-avatar-small"></div>
          <div class="user-info">
            <h1 class="title">Your Wishlist</h1>
            <p class="subtitle">{{ wishlist.length }} item<span v-if="wishlist.length !== 1">s</span></p>
          </div>
        </div>

        <div class="actions">
          <button class="btn primary" @click="$router.push('/shop')">Continue Shopping</button>
        </div>
      </header>

      <section class="wishlist-grid">
        <div v-if="isLoading" class="loading">Loading...</div>

        <div v-else-if="!wishlist.length" class="empty-state">
          <img src="../assets/photos/product3.png" alt="empty" class="empty-illustration" />
          <h3>Your wishlist is empty</h3>
          <p>Tap the heart on products to save them for later.</p>
          <button class="btn primary" @click="$router.push('/shop')">Shop Now</button>
        </div>

        <div v-else class="grid">
          <article v-for="(item, index) in wishlist" :key="item.productId || index" class="card">
            <div class="card-media" :style="{ backgroundImage: `url(${item.image || noImage})` }"></div>

            <div class="card-body">
              <h3 class="product-name">{{ item.name }}</h3>
              <div class="meta-row">
                <span class="price">{{ formatPrice(item.price) }}</span>
                <div class="card-actions">
                  <button class="btn add" @click="handleAddToCart(item)" aria-label="Add to cart">
                    <i class="fas fa-cart-plus" aria-hidden="true"></i>
                  </button>
                  <button class="btn remove" @click="handleRemove(item.productId)" aria-label="Remove">
                    <i class="fas fa-trash" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserData, fetchWishlist, removeWishlist, addToCart, logout } from '../assets/js/script.js'

const router = useRouter()
const wishlist = ref([])
const isLoading = ref(true)
const userId = ref(null)
const noImage = new URL('../assets/photos/product3.png', import.meta.url).href

function formatPrice(p) {
  if (p == null) return ''
  try { return `₱${Number(p).toLocaleString()}` } catch { return p }
}

async function loadWishlist() {
  const info = getUserData()
  if (!info || !info.id) {
    router.push('/signin')
    return
  }
  userId.value = info.id
  isLoading.value = true
  wishlist.value = await fetchWishlist(userId.value)
  isLoading.value = false
}

async function handleRemove(productId) {
  if (!userId.value) return
  try {
    await removeWishlist(userId.value, productId)
    wishlist.value = await fetchWishlist(userId.value)
  } catch (e) {
    console.error(e)
    alert('Could not remove item from wishlist.')
  }
}

function handleAddToCart(item) {
  addToCart(item)
}

function logoutHandler() {
  logout(router)
}

onMounted(() => {
  loadWishlist()
})
</script>

<style scoped>
@import "../assets/css/profile-style.css";
</style>
