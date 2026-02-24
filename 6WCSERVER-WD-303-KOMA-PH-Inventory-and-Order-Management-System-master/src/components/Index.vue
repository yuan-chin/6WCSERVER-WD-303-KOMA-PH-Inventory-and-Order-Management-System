<template>
  <body>
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
              <li><router-link to="/" class="active">HOME</router-link></li>
              <li><router-link to="/about">ABOUT</router-link></li>
              <li><router-link to="/shop">SHOP</router-link></li>
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

            <!-- Cart removed: link to My Orders instead -->
            <router-link to="/myorders" title="My Orders">
              <i class="fas fa-box-open"></i>
            </router-link>
          </div>
        </div>
      </nav>

      <section class="hero-section">
        <h1 class="hero-tagline-top">KEEP ON MOVING AHEAD</h1>
        <div class="hero-divider"></div>

        <div class="hero-content">
          <div class="hero-left">
            <img
              src="../assets/photos/Ate.png"
              alt="Model wearing KOMA streetwear"
              class="hero-image"
            />
          </div>
          <div class="hero-right">
            <div class="hero-text-box">
              <h2>FILIPINO <br /> STREETWEAR <br /> REDEFINED</h2>
              <router-link to="/shop" class="shop-now-button">SHOP NOW</router-link>
            </div>
          </div>
        </div>
      </section>

      <section class="about-section">
        <h2>About KOMA PH</h2>
        <p>
          KOMA PH is a local streetwear brand blending modern fashion and Filipino identity.
          We focus on comfort, minimalist style, and sustainability — made with passion in Pampanga.
        </p>
        <router-link to="/about" class="learn-more-btn">Learn More</router-link>
      </section>

      <section class="new-arrivals">
        <h2 class="section-title">New Arrivals</h2>

        <div class="product-grid">
          <div class="product-card">
            <img
              src="../assets/photos/P1.jpg"
              alt="Black Koma Embroidered Sweatshirt"
              class="product-image"
            />
          </div>
          <div class="product-card">
            <img
              src="../assets/photos/P2.jpg"
              alt="Brown Koma Drift T-Shirt Back"
              class="product-image"
            />
          </div>
          <div class="product-card">
            <img
              src="../assets/photos/P3.jpg"
              alt="Black Koma Oversized Hoodie"
              class="product-image"
            />
          </div>
        </div>

        <router-link to="/shop" class="view-all-button">View All Products</router-link>
      </section>

      <section class="testimonials">
        <h2>💬 What People Say</h2>

        <div class="testimonial-container">
          <div class="testimonial">
            <p>🔥 Love the fit and quality. Proud to wear local!</p>
            <span>— @juanstyle</span>
          </div>

          <div class="testimonial">
            <p>Smooth transaction! Shirt fits perfectly.</p>
            <span>— @maria.ph</span>
          </div>

          <div class="testimonial">
            <p>Comfy fabric and fast delivery 🚚✨</p>
            <span>— @trendscout</span>
          </div>
        </div>
      </section>

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
  </body>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
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
@import "../assets/css/index-style.css";

/* cart removed — no cart-overlay or cart-sidebar styles */
</style>