// Core API base
const API_BASE = import.meta.env.VITE_API_URL

let _wishlistCache = { ids: [], ts: 0, inFlight: null }
const WISHLIST_TTL = 5000 // ms - cache duration to avoid frequent network calls

/**
 * Fetch cart from server for a user
 */
export async function fetchCart(userId) {
  if (!userId) return []
  try {
    const res = await fetch(`${API_BASE}/users/${userId}/cart`)
    if (!res.ok) throw new Error('Failed to fetch cart')
    const data = await res.json()
    return data.cart || []
  } catch (e) {
    console.error('fetchCart error:', e)
    return []
  }
}

export function useCartSidebarLogic(ref, computed, router) {
  const isCartSidebarOpen = ref(false)

  function loadCartFromStorage() {
    try {
      const cart = JSON.parse(localStorage.getItem('userCart') || '[]')
      return Array.isArray(cart) ? cart : []
    } catch (e) {
      console.error('Error parsing cart data from localStorage:', e)
      return []
    }
  }

  // reactive cart list (keeps UI in sync when localStorage changes)
  const cartItems = ref(loadCartFromStorage())

  // reload the reactive cart ref from server (if logged in) or localStorage
  async function reloadCart() {
    try {
      const info = getUserData()
      if (info && info.id) {
        const serverCart = await fetchCart(info.id)
        cartItems.value = serverCart
        try { localStorage.setItem('userCart', JSON.stringify(serverCart)) } catch {}
      } else {
        cartItems.value = loadCartFromStorage()
      }
    } catch (e) {
      console.error('reloadCart error:', e)
      cartItems.value = loadCartFromStorage()
    }
  }

  // initial load
  reloadCart().catch(()=>{})

  // listen for custom event so other helpers can notify updates
  window.addEventListener('koma_cart_updated', () => { reloadCart().catch(()=>{}) })
  // also listen for native storage event (other tabs)
  window.addEventListener('storage', (e) => {
    if (e.key === 'userCart' || e.key === 'currentUser' || e.key === 'isLoggedIn') reloadCart().catch(()=>{})
  })

  // Toggles the sidebar visibility with a login check
  function handleOrders() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
        // navigate to signin rather than blocking alert
        if (router && typeof router.push === 'function') router.push('/signin')
        return
    }
    isCartSidebarOpen.value = !isCartSidebarOpen.value
  }

  // Routes to checkout page (and closes sidebar)
  function goToCheckoutPage() {
      isCartSidebarOpen.value = false
      if (router && typeof router.push === 'function') {
        router.push('/checkout')
      } else {
        window.location.href = '/#/checkout'
      }
  }

  // Routes to the orders page (and closes sidebar)
  function goToOrdersPage() {
      isCartSidebarOpen.value = false
      if (router && typeof router.push === 'function') router.push('/myorders')
      else window.location.href = '/#/myorders'
  }

  // Expose function to allow Shop.vue to open the sidebar after 'Buy Now'
  function openSidebar() {
      isCartSidebarOpen.value = true
  }

  // expose reload so callers can force a refresh if needed
  return {
    isCartSidebarOpen,
    cartItems,
    handleOrders,
    goToCheckoutPage,
    goToOrdersPage,
    openSidebar,
    reloadCart
  }
}

// Export Product Data
export const v1Products = [
  { id: 'v1-hoodie-o', image: new URL("../photos/hoodie.png", import.meta.url).href, name: "V1 Hoodie / ONYX", price: 1500 },
  { id: 'v1-jacket-o', image: new URL("../photos/varsity.png", import.meta.url).href, name: "V1 Jacket / ONYX", price: 2000 },
  { id: 'v1-jorts-o', image: new URL("../photos/jorts.png", import.meta.url).href, name: "V1 Jorts / ONYX", price: 1200 },
  { id: 'v1-cap-o', image: new URL("../photos/cap.png", import.meta.url).href, name: "V1 Cap / ONYX", price: 1000 },
  { id: 'v1-hoodie-g', image: new URL("../photos/greyhoodie.png", import.meta.url).href, name: "V1 Hoodie / GREY", price: 1500 },
  { id: 'v1-cargo-o', image: new URL("../photos/cargo.png", import.meta.url).href, name: "V1 Cargo / ONYX", price: 1200 },
];

export const driftProducts = [
  { id: 'drift-white', image: new URL("../photos/white.png", import.meta.url).href, name: "DRIFT / White", price: 750 },
  { id: 'drift-earth', image: new URL("../photos/earth.png", import.meta.url).href, name: "DRIFT / Earth", price: 750 },
  { id: 'drift-moss', image: new URL("../photos/moss.png", import.meta.url).href, name: "DRIFT / Moss", price: 750 },
  { id: 'drift-noir', image: new URL("../photos/noir.png", import.meta.url).href, name: "DRIFT / Noir", price: 750 },
];

// ---------------- Navbar & user helpers ----------------

export function setupNavbarLogic(router) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  const userIconLink = document.getElementById('userIcon')
  const dropdownContent = document.getElementById('userDropdownContent')

  userIconLink?.addEventListener('click', (event) => {
    event.preventDefault()
    dropdownContent?.classList.toggle('show')
  })

  window.addEventListener('click', (event) => {
    if (!userIconLink?.contains(event.target) && !dropdownContent?.contains(event.target)) {
      dropdownContent?.classList.remove('show')
    }
  })

  const loginOption = document.querySelector('.login-option')
  const loggedInOptions = document.querySelectorAll('.logged-in-option')

  if (isLoggedIn) {
    loginOption?.setAttribute('style', 'display: none;')
    loggedInOptions.forEach(opt => opt.setAttribute('style', 'display: block;'))
  } else {
    loginOption?.setAttribute('style', 'display: block;')
    loggedInOptions.forEach(opt => opt.setAttribute('style', 'display: none;'))
  }

  const logoutBtn = document.querySelector('.logout-btn')
  logoutBtn?.addEventListener('click', (e) => {
    e.preventDefault()
    try {
      logout(router)
    } catch (err) {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('username')
      window.location.reload()
    }
  })
}

export function goToWishlist(router) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  if (isLoggedIn) router.push('/wishlist')
  else {
    if (router && typeof router.push === 'function') router.push('/signin')
  }
}

// Handles adding a product to the wishlist (server)
export async function handleAddToWishlist(router, product) {
  const info = getUserData();
  const isLoggedIn = info && info.id;

  if (!isLoggedIn) {
    if (router && typeof router.push === 'function') router.push('/signin');
    return false;
  }

  const userId = info.id;
  const payload = {
    productId: product.id || product.productId || String(Date.now()),
    name: product.name || product.title || 'Unnamed Product',
    image: product.image || product.img || '',
    price: product.price ?? null
  };

  try {
    const res = await fetch(`${API_BASE}/users/${userId}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to add to wishlist');
    }

    try { window.dispatchEvent(new Event('koma_wishlist_updated')) } catch(e){}
    return true;
  } catch (e) {
    console.error('handleAddToWishlist error:', e);
    return false;
  }
}

// ---------------- Cart helpers ----------------

// helper: POST cart change to server (server merges by productId)
async function postCartToServer(userId, payload) {
  const res = await fetch(`${API_BASE}/users/${userId}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({}));
    throw new Error(err.message || 'Failed to update cart on server');
  }
  const data = await res.json();
  return data.cart || [];
}

// add item to local cart (used by components) — merges duplicates
export async function addToCart(item) {
  const info = getUserData();
  const userId = info && info.id;
  const productId = item.id || item.productId || null;

  const payload = {
    cartId: item.cartId || (String(Date.now()) + Math.random().toString(36).slice(2,8)),
    productId,
    name: item.name,
    image: item.image || item.img || '',
    price: item.price ?? null,
    quantity: item.quantity || 1
  };

  if (userId) {
    try {
      const serverCart = await postCartToServer(userId, payload);
      try { localStorage.setItem('userCart', JSON.stringify(serverCart)) } catch (e) {}
      try { window.dispatchEvent(new Event('koma_cart_updated')) } catch (e) {}
      return true;
    } catch (err) {
      console.error('addToCart server error:', err);
    }
  }

  try {
    const raw = JSON.parse(localStorage.getItem('userCart') || '[]');
    const cart = Array.isArray(raw) ? raw : [];
    let existing = null;
    if (productId) existing = cart.find(c => c.productId === productId);
    if (!existing) existing = cart.find(c => (c.name && payload.name && c.name === payload.name));

    if (existing) {
      existing.quantity = (Number(existing.quantity) || 1) + (Number(payload.quantity) || 1);
    } else {
      cart.push({ ...payload, cartId: payload.cartId });
    }

    localStorage.setItem('userCart', JSON.stringify(cart));
    try { window.dispatchEvent(new Event('koma_cart_updated')) } catch (e) {}
    return true;
  } catch (e) {
    console.error('addToCart error:', e);
    return false;
  }
}

// handleBuyNow now merges duplicates instead of creating another entry
export async function handleBuyNow(router, product) {
  const info = getUserData();
  const userId = info && info.id;

  if (!userId) {
    if (router && typeof router.push === 'function') router.push('/signin');
    return;
  }

  const payload = {
    cartId: String(Date.now()) + Math.random().toString(36).slice(2,8),
    productId: product.id || product.productId || null,
    name: product.name || product.title || 'Unnamed Product',
    image: product.image || product.img || '',
    price: product.price ?? null,
    quantity: 1
  };

  try {
    const serverCart = await postCartToServer(info.id, payload);
    try { localStorage.setItem('userCart', JSON.stringify(serverCart)) } catch (e) {}
    try { window.dispatchEvent(new Event('koma_cart_updated')) } catch (e) {}
  } catch (err) {
    console.error('handleBuyNow server error:', err);
    try {
      let cart = JSON.parse(localStorage.getItem('userCart') || '[]');
      const existing = payload.productId ? cart.find(c => c.productId === payload.productId) : cart.find(c => c.name === payload.name);
      if (existing) existing.quantity = (Number(existing.quantity) || 1) + 1;
      else cart.push({ ...payload, cartId: payload.cartId });
      localStorage.setItem('userCart', JSON.stringify(cart));
      try { window.dispatchEvent(new Event('koma_cart_updated')) } catch (e) {}
    } catch (e2) {
      console.error('handleBuyNow fallback error:', e2);
    }
  }
}

// ---------------- User helpers ----------------

export function getUserData() {
  try {
    const candidateKeys = ['currentUser', 'user', 'loggedUser', 'loggedInUser', 'current_user'];
    let raw = null;
    for (const k of candidateKeys) {
      const v = localStorage.getItem(k);
      if (v) { raw = v; break; }
    }

    if (!raw) {
      const name = localStorage.getItem('username');
      const email = localStorage.getItem('email');
      const id = localStorage.getItem('userId') || localStorage.getItem('_id');
      if (!name && !email && !id) return null;
      return { raw: null, user: { username: name, email }, id };
    }

    let parsed = null;
    try { parsed = JSON.parse(raw) } catch { parsed = raw }

    if (parsed && typeof parsed === 'object' && parsed.user) parsed = parsed.user
    if (typeof parsed === 'string') {
      const id = localStorage.getItem('userId') || localStorage.getItem('_id');
      return { raw, user: { username: parsed }, id }
    }

    const id = parsed && (parsed._id || parsed.id) ? (parsed._id || parsed.id) : (localStorage.getItem('userId') || localStorage.getItem('_id'));
    return { raw, user: parsed, id };
  } catch (e) {
    console.error("getUserData error:", e);
    return null;
  }
}

// ---------------- Wishlist helpers ----------------

export async function fetchWishlist(userId) {
  if (!userId) return [];
  try {
    const res = await fetch(`${API_BASE}/users/${userId}/wishlist`);
    if (!res.ok) throw new Error('Failed to fetch wishlist');
    const data = await res.json();
    return data.wishlist || [];
  } catch (e) {
    console.error("fetchWishlist error:", e);
    return [];
  }
}

export async function reloadWishlist(userId) {
  // use in-memory cache + TTL + single in-flight promise
  try {
    const now = Date.now()
    if (_wishlistCache.inFlight) {
      return _wishlistCache.inFlight
    }
    if (_wishlistCache.ts && (now - _wishlistCache.ts) < WISHLIST_TTL && Array.isArray(_wishlistCache.ids)) {
      // return cached
      try { localStorage.setItem('userWishlist', JSON.stringify(_wishlistCache.ids)) } catch {}
      return _wishlistCache.ids
    }

    _wishlistCache.inFlight = (async () => {
      try {
        const info = userId ? { id: userId } : getUserData()
        if (info && info.id) {
          const list = await fetchWishlist(info.id)
          const ids = (Array.isArray(list) ? list : []).map(i => i.productId || i.product_id || i.id || i._id).filter(Boolean)
          _wishlistCache.ids = ids
          _wishlistCache.ts = Date.now()
          try { localStorage.setItem('userWishlist', JSON.stringify(ids)) } catch {}
          try { window.dispatchEvent(new Event('koma_wishlist_updated')) } catch {}
          return ids
        } else {
          const raw = localStorage.getItem('userWishlist') || '[]'
          try { const parsed = JSON.parse(raw); _wishlistCache.ids = Array.isArray(parsed) ? parsed : []; _wishlistCache.ts = Date.now(); return _wishlistCache.ids } catch { _wishlistCache.ids = []; return [] }
        }
      } finally {
        _wishlistCache.inFlight = null
      }
    })()

    return await _wishlistCache.inFlight
  } catch (e) {
    console.error('reloadWishlist error:', e)
    return []
  }
}

// optimistic toggle: update local immediately, then sync with server; revert on failure
export async function toggleWishlist(router, product) {
  const info = getUserData()
  const userId = info && info.id
  const productId = product.id || product.productId || String(Date.now())
  if (!userId) {
    if (router && typeof router.push === 'function') router.push('/signin')
    return false
  }

  // ensure local snapshot exists
  await reloadWishlist(userId).catch(()=>{})

  let current = isInWishlist(productId)
  // optimistic update in localStorage + cache + UI
  try {
    const raw = JSON.parse(localStorage.getItem('userWishlist') || '[]')
    const arr = Array.isArray(raw) ? raw.slice() : []
    if (current) {
      // remove locally
      const idx = arr.indexOf(productId)
      if (idx !== -1) arr.splice(idx, 1)
    } else {
      // add locally
      if (!arr.includes(productId)) arr.push(productId)
    }
    localStorage.setItem('userWishlist', JSON.stringify(arr))
    _wishlistCache.ids = arr
    _wishlistCache.ts = Date.now()
    try { window.dispatchEvent(new Event('koma_wishlist_updated')) } catch {}

    // perform server action in background
    if (current) {
      // remove on server
      const res = await fetch(`${API_BASE}/users/${userId}/wishlist/${encodeURIComponent(productId)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Server remove failed')
    } else {
      // add on server
      await handleAddToWishlist(router, product)
    }

    // refresh cache from server (non-blocking)
    reloadWishlist(userId).catch(()=>{})
    return !current
  } catch (err) {
    console.error('toggleWishlist error (reverting):', err)
    // revert local change on error
    try {
      const raw2 = JSON.parse(localStorage.getItem('userWishlist') || '[]')
      _wishlistCache.ids = Array.isArray(raw2) ? raw2 : []
      _wishlistCache.ts = Date.now()
      try { window.dispatchEvent(new Event('koma_wishlist_updated')) } catch {}
    } catch(_) {}
    return current
  }
}

export function isInWishlist(productId) {
  if (!productId) return false
  try {
    const raw = localStorage.getItem('userWishlist') || '[]'
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return false
    return arr.includes(productId)
  } catch (e) {
    return false
  }
}

export async function removeWishlist(userId, productId) {
  if (!userId || !productId) throw new Error('Missing ids');
  try {
    const res = await fetch(`${API_BASE}/users/${userId}/wishlist/${encodeURIComponent(productId)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to remove item');
    const data = await res.json().catch(()=>({}));
    try { window.dispatchEvent(new Event('koma_wishlist_updated')) } catch {}
    return data.wishlist || [];
  } catch (e) {
    console.error("removeWishlist error:", e);
    throw e;
  }
}

// ---------------- Orders ----------------

export async function fetchOrders(userId) {
  if (!userId) return [];
  try {
    const res = await fetch(`${API_BASE}/users/${userId}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    return (data.orders || []).slice().reverse();
  } catch (e) {
    console.error("fetchOrders error:", e);
    return [];
  }
}

// ---------------- Logout ----------------

export function logout(router) {
  const keys = [
    'isLoggedIn','username','email','currentUser','current_user','user','loggedUser','loggedInUser',
    'userId','_id','userCart','userWishlist'
  ]
  for (const k of keys) localStorage.removeItem(k)
  if (router && typeof router.push === 'function') router.push('/signin')
  else try { window.location.href = '/signin' } catch {}
  setTimeout(() => window.location.reload(), 120)
}

// ---------- CART ITEM UPDATE / REMOVE HELPERS ----------

export async function updateCartItemQuantity(cartId, delta = 0) {
  if (!cartId || !delta) return null;
  try {
    const info = getUserData();
    const userId = info && info.id;

    function readLocalCart() {
      try { return JSON.parse(localStorage.getItem('userCart') || '[]') } catch (e) { return [] }
    }

    const localCart = readLocalCart();
    const item = localCart.find(c => c.cartId === cartId);
    if (!item) return localCart;

    const newQuantity = Math.max(1, (Number(item.quantity) || 1) + Number(delta));

    if (userId) {
      const res = await fetch(`${API_BASE}/users/${userId}/cart/${encodeURIComponent(cartId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
      });
      if (!res.ok) throw new Error('Server update failed');
      const data = await res.json().catch(()=>({}));
      const serverCart = data.cart || readLocalCart();
      localStorage.setItem('userCart', JSON.stringify(serverCart));
      try { window.dispatchEvent(new Event('koma_cart_updated')) } catch {}
      return serverCart;
    }

    item.quantity = newQuantity;
    localStorage.setItem('userCart', JSON.stringify(localCart));
    try { window.dispatchEvent(new Event('koma_cart_updated')) } catch {}
    return localCart;
  } catch (e) {
    console.error('updateCartItemQuantity error:', e);
    try {
      const local = JSON.parse(localStorage.getItem('userCart') || '[]');
      const it = local.find(c => c.cartId === cartId);
      if (it) { it.quantity = Math.max(1, (Number(it.quantity)||1) + Number(delta)); localStorage.setItem('userCart', JSON.stringify(local)); try { window.dispatchEvent(new Event('koma_cart_updated')) } catch {} }
      return local;
    } catch (_) { return []; }
  }
}

export async function removeCartItem(cartId) {
  if (!cartId) return null;
  try {
    const info = getUserData();
    const userId = info && info.id;

    if (userId) {
      const res = await fetch(`${API_BASE}/users/${userId}/cart/${encodeURIComponent(cartId)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove on server');
      const data = await res.json().catch(()=>({}));
      const serverCart = data.cart || [];
      localStorage.setItem('userCart', JSON.stringify(serverCart));
      try { window.dispatchEvent(new Event('koma_cart_updated')) } catch {}
      return serverCart;
    }

    const local = JSON.parse(localStorage.getItem('userCart') || '[]');
    const updated = local.filter(i => i.cartId !== cartId);
    localStorage.setItem('userCart', JSON.stringify(updated));
    try { window.dispatchEvent(new Event('koma_cart_updated')) } catch {}
    return updated;
  } catch (e) {
    console.error('removeCartItem error:', e);
    try {
      const local = JSON.parse(localStorage.getItem('userCart') || '[]');
      const updated = local.filter(i => i.cartId !== cartId);
      localStorage.setItem('userCart', JSON.stringify(updated));
      try { window.dispatchEvent(new Event('koma_cart_updated')) } catch {}
      return updated;
    } catch (_) { return []; }
  }
}