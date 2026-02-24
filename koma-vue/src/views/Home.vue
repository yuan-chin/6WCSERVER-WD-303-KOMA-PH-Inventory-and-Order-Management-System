<template>
  <div class="home">
    <h1>Welcome to KOMA Clothing Co.</h1>
    <p>Your one-stop shop for the latest fashion trends.</p>
    <router-link to="/shop" class="btn-shop">Shop Now</router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
  text-align: center;
  padding: 20px;
}

.btn-shop {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #0f1724;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}

.btn-shop:hover {
  background-color: #1e293b;
}
</style>