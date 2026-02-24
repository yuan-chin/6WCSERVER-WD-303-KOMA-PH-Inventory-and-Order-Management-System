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
  role: { type: String, default: 'user' }, // Add this line
  wishlist: [...],
  orders: [...],
  cart: [...]
});