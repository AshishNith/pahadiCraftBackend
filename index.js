const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const dotenv = require('dotenv');
const createOrder = require('./Routes/createOrder');
const verifyPayment = require('./Routes/verifyPayment');
const orders = require('./Routes/orders');
const userRoute = require('./Routes/user.route');
const mongoose = require('mongoose');
require('dotenv').config();

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));




const app = express();
app.use(cors({
  origin: ['https://thepahadicraft.com/', 'https://www.thepahadicraft.com/', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// // Add static file serving
// app.use(express.static('public'));

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use('/api/create-order', createOrder);
app.use('/api/verify-payment', verifyPayment);
app.use('/api/orders', orders);
app.use('/api/user', userRoute);
app.get('/', (req, res) => {
  console.log('Root route hit');
  res.send('Welcome to the Pahadi Craft API');
});
// app.use("/api/chat", chatRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
