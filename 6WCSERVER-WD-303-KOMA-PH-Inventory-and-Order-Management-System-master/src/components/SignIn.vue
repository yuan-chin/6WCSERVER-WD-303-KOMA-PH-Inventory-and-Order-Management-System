<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-left">
        <router-link to="/" class="auth-logo-link">
          <img src="../assets/photos/KOMA Logo.png" alt="KOMA Logo" class="auth-logo" />
        </router-link>

        <h2>Welcome Back</h2>
        <p class="auth-tagline">Keep on moving ahead — log in and join the movement.</p>

        <form class="auth-form" @submit.prevent="handleLogin">
          <div class="floating-group">
            <input type="text" v-model="username" placeholder=" " required />
            <label>Username</label>
          </div>

          <div class="floating-group">
            <input type="password" v-model="password" placeholder=" " required />
            <label>Password</label>
          </div>

          <button type="submit" class="auth-btn">Sign In</button>
          <p class="switch-link">
            New here? <router-link to="/signup">Create an account</router-link>
          </p>
        </form>
      </div>

      <div class="auth-right">
        <div class="overlay">
          <h3>FILIPINO STREETWEAR</h3>
          <p>Made with pride. Made for the grind.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const API_URL = import.meta.env.VITE_API_URL

export default {
  name: "SignInPage",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const res = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          // Persist useful keys for other parts of the app
          const user = data.user || {};
          const id = user._id || user.id || '';

          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', user.firstName || user.username || '');
          localStorage.setItem('userId', id);
          // store a canonical user object for helpers that attempt to parse it
          localStorage.setItem('currentUser', JSON.stringify(user));
          // some components check this key
          localStorage.setItem('loggedInUser', JSON.stringify(user));

          alert(`Welcome back, ${user.firstName || user.username || 'User'}!`);
          this.$router.push("/");
        } else {
          alert(data.message || "Login failed.");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred during login.");
      }
    }
  },
};
</script>

<style>
@import "../assets/css/login-style.css";
</style>
