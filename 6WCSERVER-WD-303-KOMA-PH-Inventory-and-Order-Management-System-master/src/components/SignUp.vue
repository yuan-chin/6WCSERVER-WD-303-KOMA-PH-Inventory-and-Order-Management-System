<template>
  <div class="auth-wrapper">
    <div class="auth-card reverse">
      <!-- RIGHT: IMAGE -->
      <div class="auth-right">
        <div class="overlay">
          <h3>JOIN THE KOMA COMMUNITY</h3>
          <p>Redefining streetwear from Pampanga to the world.</p>
        </div>
      </div>

      <!-- LEFT: SIGN UP FORM -->
      <div class="auth-left">
        <router-link to="/" class="auth-logo-link">
          <img src="../assets/photos/KOMA Logo.png" alt="KOMA Logo" class="auth-logo" />
        </router-link>

        <h2>Create Account</h2>

        <form class="auth-form" @submit.prevent="handleSignUp">
          <div class="form-row">
            <div class="floating-group">
              <input type="text" id="firstName" v-model="firstName" placeholder=" " required />
              <label for="firstName">First Name</label>
            </div>
            <div class="floating-group">
              <input type="text" id="lastName" v-model="lastName" placeholder=" " required />
              <label for="lastName">Last Name</label>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group" style="flex: 1;">
              <label>Gender</label>
              <div class="gender-group">
                <label><input type="radio" value="Male" v-model="gender" /> Male</label>
                <label><input type="radio" value="Female" v-model="gender" /> Female</label>
              </div>
            </div>

            <div class="form-group" style="flex: 1;">
              <label>Date of Birth</label>
              <input type="date" v-model="dob" required />
            </div>
          </div>

          <div class="floating-group">
            <input type="text" v-model="address" placeholder=" " required />
            <label>Address</label>
          </div>

          <div class="floating-group">
            <input type="tel" v-model="contact" placeholder=" " required />
            <label>Contact No.</label>
          </div>

          <div class="floating-group">
            <input type="email" v-model="email" placeholder=" " required />
            <label>Email</label>
          </div>

          <div class="form-row">
            <div class="floating-group">
              <input type="text" v-model="username" placeholder=" " required />
              <label>Username</label>
            </div>

            <div class="floating-group">
              <input type="password" v-model="password" placeholder=" " required />
              <label>Password</label>
            </div>
          </div>

          <button type="submit" class="auth-btn">Sign Up</button>

          <p class="switch-link">
            Already a member? <router-link to="/signin">Sign In</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
const API_URL = import.meta.env.VITE_API_URL

export default {
  name: "SignUpPage",
  data() {
    return {
      firstName: "",
      lastName: "",
      gender: "",
      dob: "",
      address: "",
      contact: "",
      email: "",
      username: "",
      password: "",
    };
  },
  methods: {
    async handleSignUp() {
      try {
        const res = await fetch(`${API_URL}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: this.firstName,
            lastName: this.lastName,
            gender: this.gender,
            dob: this.dob,
            address: this.address,
            contact: this.contact,
            email: this.email,
            username: this.username,
            password: this.password,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Account created successfully!");
          this.$router.push("/signin");
        } else {
          alert(data.message || "Failed to register.");
        }
      } catch (err) {
        alert("Error: " + err.message);
      }
    },
  },
};
</script>

<style scoped>
@import "../assets/css/login-style.css";
</style>
