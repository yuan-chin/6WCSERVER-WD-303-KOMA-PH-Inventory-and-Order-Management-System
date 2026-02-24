<template>
  <div class="wishlist-page">
    <aside class="sidebar">
      <RouterLink to="/" class="logo-link">
        <img src="../assets/photos/KOMA logo white.png" alt="KOMA Logo" class="koma-logo-img" />
      </RouterLink>

      <nav class="main-nav">
        <ul>
          <li><RouterLink to="/">Home</RouterLink></li>
          <li class="active"><RouterLink to="/profile">Profile</RouterLink></li>
          <li><RouterLink to="/myorders">My Orders</RouterLink></li>
          <li><RouterLink to="/wishlist">Wishlist</RouterLink></li>
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
            <h1 class="title">{{ userName }}</h1>
            <p class="subtitle">{{ userEmail }}</p>
          </div>
        </div>

        <div class="actions">
          <button class="btn primary" @click="$router.push('/shop')">Continue Shopping</button>
        </div>
      </header>

      <section style="display:flex;gap:16px;margin-bottom:18px;">
        <div class="card" style="flex:1;padding:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-size:12px;color:#7a7a86">Total Orders</div>
              <div style="font-weight:700;font-size:20px">{{ orders.length }}</div>
            </div>
            <i class="fas fa-box-open" style="font-size:28px;color:#dce34d"></i>
          </div>
        </div>

        <div class="card" style="flex:1;padding:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-size:12px;color:#7a7a86">Wishlist Items</div>
              <div style="font-weight:700;font-size:20px">{{ wishlist.length }}</div>
            </div>
            <i class="fas fa-heart" style="font-size:28px;color:#ff6b9a"></i>
          </div>
        </div>

        <div class="card" style="flex:1;padding:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-size:12px;color:#7a7a86">Reward Points</div>
              <div style="font-weight:700;font-size:20px">320</div>
            </div>
            <i class="fas fa-trophy" style="font-size:28px;color:#b8c13a"></i>
          </div>
        </div>
      </section>

      <!-- Profile edit card -->
      <section class="card" style="padding:16px;margin-bottom:18px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <h3>Profile Information</h3>
          <div>
            <button v-if="!editing" class="btn" @click="startEdit">Edit</button>
            <button v-else class="btn" @click="cancelEdit">Cancel</button>
          </div>
        </div>

        <div v-if="!editing">
          <p><strong>Name:</strong> {{ profile.firstName || '' }} {{ profile.lastName || '' }}</p>
          <p><strong>Email:</strong> {{ profile.email || '' }}</p>
          <p><strong>Contact:</strong> {{ profile.contact || '' }}</p>
          <p><strong>Address:</strong> {{ profile.address || '' }}</p>
        </div>

        <form v-else @submit.prevent="saveProfile" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <input v-model="form.firstName" placeholder="First name" />
          <input v-model="form.lastName" placeholder="Last name" />
          <input v-model="form.email" placeholder="Email" type="email" />
          <input v-model="form.contact" placeholder="Contact" />
          <input v-model="form.username" placeholder="Username" />
          <input v-model="form.address" placeholder="Address" />
          <input v-model="form.password" placeholder="New password (leave blank to keep)" type="password" />
          <div style="grid-column:1/-1;display:flex;gap:8px;justify-content:flex-end">
            <button type="button" class="btn" @click="cancelEdit">Cancel</button>
            <button type="submit" class="btn primary" :disabled="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
          </div>
        </form>
      </section>

      <!-- Recent orders -->
      <section class="wishlist-grid" style="margin-bottom:18px;">
        <div class="card" style="padding:16px;">
          <h3 style="margin-bottom:12px">Recent Orders</h3>
          <div v-if="orders.length">
            <table style="width:100%;border-collapse:collapse">
              <thead>
                <tr>
                  <th style="text-align:left;padding:8px 6px">Order #</th>
                  <th style="text-align:left;padding:8px 6px">Item</th>
                  <th style="text-align:left;padding:8px 6px">Status</th>
                  <th style="text-align:left;padding:8px 6px">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(o, idx) in orders" :key="o.orderId || idx">
                  <td style="padding:8px 6px">{{ o.orderId || ('#KMP-' + (100 + idx)) }}</td>
                  <td style="padding:8px 6px">{{ o.item || (o.meta && o.meta.item) || '—' }}</td>
                  <td :class="statusClass(o.status)" style="padding:8px 6px">{{ o.status || 'Processing' }}</td>
                  <td style="padding:8px 6px">{{ formatDate(o.date) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else style="color:#7a7a86;padding:12px">No recent orders</div>
        </div>
      </section>

      <!-- Wishlist (re-using wishlist design) -->
      <section class="wishlist-grid">
        <div class="grid" v-if="wishlist.length">
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

        <div v-else class="empty-state">
          <img src="../assets/photos/product3.png" alt="empty" class="empty-illustration" />
          <h3>Your wishlist is empty</h3>
          <p>Tap the heart on products to save them for later.</p>
          <button class="btn primary" @click="$router.push('/shop')">Shop Now</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserData, fetchWishlist, fetchOrders, removeWishlist, addToCart, logout } from '../assets/js/script.js'
const API_URL = import.meta.env.VITE_API_URL

const router = useRouter()
const userName = ref('Guest')
const userEmail = ref('Not Signed In')
const wishlist = ref([])
const orders = ref([])
const noImage = new URL('../assets/photos/product3.png', import.meta.url).href

const profile = ref({})
const editing = ref(false)
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  contact: '',
  address: '',
  username: '',
  password: ''
})
const saving = ref(false)

function statusClass(status) {
  if (!status) return ''
  const s = String(status).toLowerCase()
  if (s.includes('processing')) return 'processing'
  if (s.includes('shipped')) return 'shipped'
  if (s.includes('delivered')) return 'delivered'
  return ''
}

function formatDate(d) {
  const date = new Date(d)
  if (isNaN(date)) return d || ''
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatPrice(p) {
  if (p == null) return ''
  try { return `₱${Number(p).toLocaleString()}` } catch { return p }
}

async function loadProfileData() {
  const info = getUserData()
  if (!info) return
  const user = info.user || {}
  const id = info.id
  profile.value = user
  if (user.firstName && user.lastName) userName.value = `${user.firstName} ${user.lastName}`
  else if (user.username) userName.value = user.username
  if (user.email) userEmail.value = user.email

  if (id) {
    wishlist.value = await fetchWishlist(id)
    orders.value = await fetchOrders(id)
  } else {
    wishlist.value = JSON.parse(localStorage.getItem('userWishlist') || '[]')
  }
}

function startEdit() {
  editing.value = true
  form.value.firstName = profile.value.firstName || ''
  form.value.lastName = profile.value.lastName || ''
  form.value.email = profile.value.email || ''
  form.value.contact = profile.value.contact || ''
  form.value.address = profile.value.address || ''
  form.value.username = profile.value.username || ''
  form.value.password = ''
}

function cancelEdit() {
  editing.value = false
  form.value.password = ''
}

async function saveProfile() {
  const info = getUserData()
  const id = info && info.id
  if (!id) {
    alert('Please sign in to update profile.')
    router.push('/signin')
    return
  }
  saving.value = true
  try {
    const payload = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      contact: form.value.contact,
      address: form.value.address,
      username: form.value.username
    }
    if (form.value.password && form.value.password.trim()) payload.password = form.value.password

    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const err = await res.json().catch(()=>({}))
      throw new Error(err.message || 'Failed to update profile')
    }
    const data = await res.json()
    const updated = data.user
    // update localStorage to keep UI helpers in sync
    try {
      localStorage.setItem('currentUser', JSON.stringify({ user: updated, id: updated._id || updated.id }))
      localStorage.setItem('loggedInUser', JSON.stringify(updated))
      if (updated._id || updated.id) localStorage.setItem('userId', updated._id || updated.id)
      if (updated.username) localStorage.setItem('username', updated.username)
      if (updated.email) localStorage.setItem('email', updated.email)
    } catch (e) { /* ignore storage errors */ }

    editing.value = false
    await loadProfileData()
    alert('Profile updated.')
  } catch (e) {
    console.error(e)
    alert('Could not update profile.')
  } finally {
    saving.value = false
  }
}

async function handleRemove(productId) {
  const info = getUserData()
  const id = info && info.id
  if (!id) return
  try {
    await removeWishlist(id, productId)
    wishlist.value = await fetchWishlist(id)
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
  loadProfileData()
})
</script>

<style scoped>
@import "../assets/css/profile-style.css";
</style>