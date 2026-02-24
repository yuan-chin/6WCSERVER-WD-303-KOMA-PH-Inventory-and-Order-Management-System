### Step 1: Update the User Schema

First, you need to modify the user schema in your `server.js` file to include an `isAdmin` field. This field will help you identify whether a user has admin privileges.

```javascript
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: String,
  dob: String,
  address: String,
  contact: String,
  email: String,
  username: String,
  password: String, // will be hashed
  isAdmin: { type: Boolean, default: false }, // New field for admin status
  wishlist: [...],
  orders: [...],
  cart: [...]
});
```

### Step 2: Create Admin Account

You can create an admin account by adding a new endpoint in your `server.js` file. This endpoint will allow you to create a user with admin privileges.

```javascript
app.post("/admin/signup", async (req, res) => {
  try {
    const { firstName, lastName, gender, dob, address, contact, email, username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const newAdmin = new User({
      firstName,
      lastName,
      gender,
      dob,
      address,
      contact,
      email,
      username,
      password: hashedPassword,
      isAdmin: true, // Set isAdmin to true
      wishlist: [],
      orders: []
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin account created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

### Step 3: Admin Authentication

You may want to create a separate login endpoint for admins or modify the existing login endpoint to check for admin status.

```javascript
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !user.isAdmin) return res.status(404).json({ message: "Admin not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    // Login successful: return the user object (excluding the password hash)
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({ message: "Admin login successful", user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

### Step 4: Admin Dashboard

You will need to create a new Vue component for the admin dashboard where the admin can manage stock and create new products. Here’s a basic structure for the `AdminDashboard.vue` component:

```vue
<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <button @click="showAddProductForm = !showAddProductForm">
      {{ showAddProductForm ? 'Cancel' : 'Add New Product' }}
    </button>

    <div v-if="showAddProductForm">
      <form @submit.prevent="addProduct">
        <input v-model="newProduct.name" placeholder="Product Name" required />
        <input v-model="newProduct.price" type="number" placeholder="Price" required />
        <input v-model="newProduct.image" placeholder="Image URL" required />
        <button type="submit">Add Product</button>
      </form>
    </div>

    <h2>Current Products</h2>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{ product.name }} - {{ product.price }} PHP
        <button @click="deleteProduct(product.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchProducts, createProduct, deleteProduct } from '../assets/js/script.js';

const products = ref([]);
const newProduct = ref({ name: '', price: '', image: '' });
const showAddProductForm = ref(false);

async function loadProducts() {
  products.value = await fetchProducts();
}

async function addProduct() {
  await createProduct(newProduct.value);
  newProduct.value = { name: '', price: '', image: '' }; // Reset form
  loadProducts(); // Reload products
}

async function deleteProduct(productId) {
  await deleteProduct(productId);
  loadProducts(); // Reload products
}

onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
/* Add your styles here */
</style>
```

### Step 5: Update Frontend Logic

You will need to implement the functions `fetchProducts`, `createProduct`, and `deleteProduct` in your `script.js` file to handle API calls for managing products.

### Step 6: Protect Admin Routes

Make sure to protect your admin routes by checking if the user is an admin before allowing access to the admin dashboard.

### Conclusion

With these steps, you will have created an admin account system that allows for managing stock and creating new products in your Koma Vue application. Make sure to test the functionality thoroughly to ensure everything works as expected.