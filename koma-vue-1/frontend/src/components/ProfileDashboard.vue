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
  isAdmin: { type: Boolean, default: false }, // New field for admin
  wishlist: [...],
  orders: [...],
  cart: [...]
});