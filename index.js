const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const dotenv = require('dotenv');
const createOrder = require('./Routes/createOrder');
const verifyPayment = require('./Routes/verifyPayment');
const orders = require('./Routes/orders');
const userRoute = require('./Routes/user.route');
const mongoose = require('mongoose');
// const chatRoutes = require('./Routes/chatRoutes');
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
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://thepahadicraft.com'], // Add your frontend URLs
  credentials: true
}));
app.use(express.json());

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
// app.use("/api/chat", chatRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
