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
            <li><RouterLink to="/about" class="active">ABOUT</RouterLink></li>
            <li><RouterLink to="/shop">SHOP</RouterLink></li>
            <li><RouterLink to="/product">PRODUCT</RouterLink></li>
            <li><RouterLink to="/feature">FEATURE</RouterLink></li>
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

          <!-- Cart removed: link to My Orders instead -->
          <router-link to="/myorders" title="My Orders">
            <i class="fas fa-box-open"></i>
          </router-link>
        </div>
      </div>
    </nav>

    <main>
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            About KOMA PH
          </h1>
          <p class="hero-text">
            Founded with passion and driven by creativity, KOMA PH is a Filipino streetwear brand redefining modern style and local pride. We create clothing that tells stories — made for dreamers, movers, and changemakers. Each piece represents the perfect blend of comfort, culture, and confidence.
          </p>
          <RouterLink to="/shop" class="shop-button">
            🛒 Shop Our Collection
          </RouterLink>
        </div>
        
        <div class="hero-image-placeholder">
          <img src="../assets/photos/About hero.jpg" alt="About KOMA Image" class="hero-image">
        </div>
      </section>

      <section class="core-values-section">
        <h2 class="section-title">
          Our Core Values
        </h2>

        <div class="values-grid">
          <div class="value-card">
            <h3>Quality First</h3>
            <p>We prioritize high standards in every fabric, stitch, and finish — because you deserve nothing less than the best.</p>
          </div>
          <div class="value-card">
            <h3>Customer Focus</h3>
            <p>Your satisfaction is our mission. We listen, adapt, and constantly improve to meet your needs and exceed expectations.</p>
          </div>
          <div class="value-card">
            <h3>Sustainability</h3>
            <p>We believe in fashion that respects the planet — striving for eco-friendly practices in sourcing and packaging</p>
          </div>
          <div class="value-card">
            <h3>Community First</h3>
            <p>We're powered by people. Our community guides our journey, not the other way around</p>
          </div>
        </div>

        <p class="section-tagline">
          At KOMA PH, we're more than just a brand — we're a community that celebrates style, creativity, and self-expression. Join us on this exciting journey and discover your next favorite look.
        </p>
      </section>

      <section class="koma-lifestyle-section">
        <h2 class="lifestyle-title"> The KOMA Lifestyle </h2>
        <div class="lifestyle-card">
          <p> Living the KOMA lifestyle means owning your voice, expressing yourself, and moving with purpose. Our pieces are made for movement — from city streets to campus walks, late-night sessions to early grind. We dress the doers, the creators, the dreamers. </p>
          <p> We believe fashion isn’t about fitting in — it’s about standing tall in who you are. Wear what speaks for you, not what silences you. That’s the KOMA way. </p>
        </div>
      </section>

      <section class="different-section">
        <h2 class="different-title">
          What Makes Us Different
        </h2>
        <div class="different-card">
          <p>
            We don’t follow trends — we set them. KOMA PH is a space for those who dare to create their own path. We design for those who aren’t afraid to stand out, speak up, and show out. We’re not just about clothes — we’re about culture, connection, and confidence.
          </p>
          <p>
            With every drop, every release, and every campaign, we’re redefining what it means to be a local streetwear brand. Bold looks, limited runs, no fluff — just real style for real people.
          </p>
        </div>
      </section>

      <section class="final-cta-section">
        <h2 class="cta-tagline">
          Be bold. Be real. Be KOMA PH.
        </h2>
        <RouterLink to="/shop" class="explore-button">
          🛍️ Explore Our Products
        </RouterLink>
      </section>
    </main>

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
        <p>&copy;2025 KOMA PH. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
// keep only navbar & wishlist helpers — cart removed like Index.vue
import { 
  setupNavbarLogic, 
  goToWishlist 
} from '../assets/js/script.js'

const router = useRouter()

onMounted(() => {
  setupNavbarLogic(router)
})

function handleWishlist() {
  goToWishlist(router)
}
</script>

<style scoped>
@import "../assets/css/about-style.css";

/* cart styles removed (cart-sidebar / cart-overlay) */
</style>