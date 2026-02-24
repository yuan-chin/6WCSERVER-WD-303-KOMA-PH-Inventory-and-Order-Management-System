<template>
  <div class="checkout-page">
    <nav class="navbar">
      <router-link to="/" class="logo"><img src="../assets/photos/KOMA Logo.png" alt="KOMA" /></router-link>
    </nav>

    <main class="checkout-main">
      <h1>Checkout</h1>

      <section class="checkout-grid">
        <form class="shipping-form" @submit.prevent="placeOrder">
          <h2>Shipping Information</h2>

          <label>
            Full name
            <input v-model="form.name" type="text" required />
          </label>

          <label>
            Contact number
            <input v-model="form.contact" type="tel" required />
          </label>

          <label>
            Shipping address
            <textarea v-model="form.address" rows="3" required></textarea>
          </label>

          <label>
            Payment method
            <select v-model="form.paymentMethod" required>
              <option value="cod">Cash on Delivery</option>
              <option value="gcash">GCash</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </label>

          <button class="place-order-btn" type="submit" :disabled="isSubmitting || !cartItems.length">
            {{ isSubmitting ? 'Placing order...' : 'Place Order' }}
          </button>
        </form>

        <aside class="order-summary">
          <h2>Order Summary</h2>

          <div v-if="!cartItems.length" class="empty">Your cart is empty.</div>

          <div v-else class="items-list">
            <div v-for="item in cartItems" :key="item.cartId" class="summary-item">
              <img v-if="item.image" :src="item.image" :alt="item.name" />
              <div class="summary-body">
                <div class="title-row">
                  <div class="name">{{ item.name }}</div>
                  <div class="price">{{ formatPrice(item.price) }}</div>
                </div>

                <div class="controls-row">
                  <div class="quantity-controls">
                    <button type="button" class="qty" @click="decrement(item)">-</button>
                    <span class="qty-label">{{ item.quantity || 1 }}</span>
                    <button type="button" class="qty" @click="increment(item)">+</button>
                  </div>

                  <button type="button" class="remove-link" @click="removeItemConfirm(item)">Remove</button>
                </div>
              </div>
            </div>
          </div>

          <div class="totals">
            <div class="row"><span>Subtotal</span><strong>{{ formatPrice(subtotal) }}</strong></div>
            <div class="row"><span>Shipping</span><strong>{{ formatPrice(shipping) }}</strong></div>
            <div class="row total"><span>Total</span><strong>{{ formatPrice(total) }}</strong></div>
          </div>
        </aside>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const API_URL = import.meta.env.VITE_API_URL
import {
  useCartSidebarLogic,
  updateCartItemQuantity,
  removeCartItem,
  getUserData
} from '../assets/js/script.js'

const router = useRouter()
const { cartItems, reloadCart } = useCartSidebarLogic(ref, computed, router)

// Form state
const form = ref({
  name: '',
  contact: '',
  address: '',
  paymentMethod: 'cod'
})

const isSubmitting = ref(false)
const shipping = ref(60) // flat shipping fee; adjust as needed

onMounted(() => {
  reloadCart()
  // if user is logged in, try to prefill name/contact from stored user
  const info = getUserData()
  if (info && info.user) {
    form.value.name = (info.user.firstName && info.user.lastName) ? `${info.user.firstName} ${info.user.lastName}` : (info.user.username || form.value.name)
    form.value.contact = info.user.contact || info.user.phone || form.value.contact
    // catch user's saved address and prefill shipping address
    form.value.address = info.user.address || info.user.addressLine || info.user.location || form.value.address
  }
})

const subtotal = computed(() => {
  try {
    return (cartItems.value || []).reduce((s, it) => s + (Number(it.price || 0) * (Number(it.quantity || 1))), 0)
  } catch (e) { return 0 }
})

const total = computed(() => subtotal.value + (Number(shipping.value) || 0))

function formatPrice(p) {
  if (p == null) return '₱0'
  return `₱${Number(p).toLocaleString()}`
}

async function increment(item) {
  if (!item || !item.cartId) return
  await updateCartItemQuantity(item.cartId, +1)
  reloadCart()
}

async function decrement(item) {
  if (!item || !item.cartId) return
  const qty = Number(item.quantity || 1)
  if (qty <= 1) {
    await removeCartItem(item.cartId)
  } else {
    await updateCartItemQuantity(item.cartId, -1)
  }
  reloadCart()
}

async function removeItemConfirm(item) {
  if (!confirm('Remove this item from cart?')) return
  await removeCartItem(item.cartId)
  reloadCart()
}

async function placeOrder() {
  const info = getUserData()
  if (!info || !info.id) {
    alert('Please sign in to place an order.')
    router.push('/signin')
    return
  }

  if (!cartItems.value.length) {
    alert('Your cart is empty.')
    return
  }

  // simple validation
  if (!form.value.name.trim() || !form.value.address.trim() || !form.value.contact.trim()) {
    alert('Please fill shipping information.')
    return
  }

  isSubmitting.value = true

  try {
    const payload = {
      orderId: `KMP-${Date.now().toString().slice(-6)}`,
      item: `Order of ${cartItems.value.length} item(s)`,
      status: 'Processing',
      meta: {
        total: total.value,
        subtotal: subtotal.value,
        shipping: shipping.value,
        items: cartItems.value,
        shippingInfo: { ...form.value },
        paymentMethod: form.value.paymentMethod
      }
    }

    // POST to backend
    const res = await fetch(`${API_URL}/users/${info.id}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const err = await res.json().catch(()=>({}))
      throw new Error(err.message || 'Failed to place order')
    }

    // on success clear cart locally and notify UI
    localStorage.setItem('userCart', JSON.stringify([]))
    try { window.dispatchEvent(new Event('koma_cart_updated')) } catch(e){}

    alert('Order placed successfully!')
    router.push('/myorders')
  } catch (e) {
    console.error('placeOrder error:', e)
    alert('Could not place order. Try again later.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.checkout-page { font-family: 'Poppins', sans-serif; padding: 24px; background:#f6f8fb; min-height:100vh }
.navbar { display:flex; align-items:center; padding-bottom:12px }
.logo img { height:40px }

.checkout-main { max-width:1100px; margin:0 auto }
.checkout-main h1{ margin:12px 0 20px }

.checkout-grid { display:grid; grid-template-columns: 1fr 420px; gap:20px; align-items:start }

.shipping-form, .order-summary { background:#fff; border-radius:12px; padding:18px; box-shadow: 0 8px 24px rgba(12,20,40,0.06) }

.shipping-form h2, .order-summary h2 { margin:0 0 12px }

.shipping-form label { display:block; margin-bottom:10px; font-size:14px; color:#333 }
.shipping-form input, .shipping-form textarea, .shipping-form select {
  width:100%; padding:10px; border:1px solid #e6e9ef; border-radius:8px; margin-top:6px; font-size:14px
}

.place-order-btn { margin-top:12px; padding:12px 16px; background:#0f1724; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:700 }
.place-order-btn:disabled { opacity:0.6; cursor:not-allowed }

.items-list { max-height:360px; overflow:auto; display:flex; flex-direction:column; gap:12px; margin-bottom:12px }
.summary-item { display:flex; gap:12px; align-items:flex-start; border-bottom:1px dashed #eee; padding-bottom:12px }
.summary-item img { width:72px; height:72px; object-fit:cover; border-radius:8px }
.summary-body { flex:1 }
.title-row { display:flex; justify-content:space-between; align-items:center; gap:8px }
.name { font-weight:700; font-size:14px }
.price { color:#444; font-weight:700 }

.controls-row { display:flex; justify-content:space-between; align-items:center; margin-top:8px }
.quantity-controls { display:flex; align-items:center; gap:8px }
.qty { width:30px; height:30px; border-radius:6px; border:none; background:#f3f4f6; cursor:pointer; font-weight:700 }
.qty-label { min-width:28px; text-align:center; display:inline-block }

.remove-link { background:transparent; border:none; color:#b91c1c; cursor:pointer }

.totals { border-top:1px solid #eee; padding-top:12px; margin-top:12px }
.totals .row { display:flex; justify-content:space-between; margin:8px 0; color:#333 }
.totals .total { font-size:18px; font-weight:800 }
.empty { color:#7a7a86; padding:12px 0 }
@media (max-width:980px) {
  .checkout-grid { grid-template-columns: 1fr; }
  .order-summary { order: -1; margin-bottom:12px }
}
</style>

