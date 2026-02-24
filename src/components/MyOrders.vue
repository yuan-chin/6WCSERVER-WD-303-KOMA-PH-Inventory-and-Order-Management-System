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
          <li class="active"><RouterLink to="/myorders">My Orders</RouterLink></li>
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
            <h1 class="title">My Orders</h1>
            <p class="subtitle">{{ orders.length }} order<span v-if="orders.length !== 1">s</span></p>
          </div>
        </div>

        <div class="actions">
          <button class="btn primary" @click="$router.push('/shop')">Continue Shopping</button>
        </div>
      </header>

      <section class="wishlist-grid">
        <div v-if="isLoading" class="empty-state">
          Loading...
        </div>

        <div v-else-if="!orders.length" class="empty-state">
          <img src="../assets/photos/product3.png" alt="empty" class="empty-illustration" />
          <h3>No orders yet</h3>
          <p>Your recent purchases will appear here.</p>
          <button class="btn primary" @click="$router.push('/shop')">Shop Now</button>
        </div>

        <div v-else class="grid">
          <article v-for="(order, idx) in orders" :key="order.orderId || order.id || idx" class="card">
            <div class="card-body" style="padding:16px;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
                <div style="flex:1;min-width:0">
                  <h3 class="product-name" style="margin-bottom:6px">Order {{ order.orderId || order.id || ('#KMP-' + (100 + idx)) }}</h3>
                  <div style="color:#7a7a86;font-size:13px;margin-bottom:8px">
                    {{ order.item || (order.meta && order.meta.item) || '—' }}
                  </div>

                  <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:10px">
                    <div style="font-size:13px;color:#7a7a86">
                      Date: <strong style="color:#0f1724">{{ formatDate(order.date) }}</strong>
                    </div>
                    <div style="font-size:13px;color:#7a7a86">
                      Total: <strong style="color:#0f1724">{{ formatPrice(order.meta?.total || order.total) }}</strong>
                    </div>
                    <div style="font-size:13px;">
                      Status: <span :class="statusClass(order.status)" style="font-weight:600">{{ order.status || 'Processing' }}</span>
                    </div>
                  </div>
                </div>

                <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
                  <button class="btn add" @click="viewOrder(order)" aria-label="View order">
                    <i class="fas fa-eye"></i>
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getUserData, fetchOrders, logout } from '../assets/js/script.js';

const router = useRouter();
const orders = ref([]);
const isLoading = ref(true);

function statusClass(status) {
  if (!status) return '';
  const s = String(status).toLowerCase();
  if (s.includes('processing')) return 'processing';
  if (s.includes('shipped')) return 'shipped';
  if (s.includes('delivered')) return 'delivered';
  return '';
}

function formatDate(d) {
  const date = new Date(d);
  if (isNaN(date)) return d || '';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatPrice(p) {
  if (!p) return '';
  try { return `₱${Number(p).toLocaleString()}` } catch { return p; }
}

async function loadOrders() {
  const info = getUserData();
  if (!info || !info.id) {
    router.push('/signin');
    return;
  }
  isLoading.value = true;
  orders.value = await fetchOrders(info.id);
  isLoading.value = false;
}

function viewOrder(order) {
  alert(`Viewing details for ${order.orderId || order.id || 'Order'}`);
}

function logoutHandler() {
  logout(router);
}

onMounted(() => {
  loadOrders();
});
</script>

<style scoped>
@import "../assets/css/profile-style.css";
</style>

