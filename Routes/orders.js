const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const User = require('../models/User');

// Route handlers
router.get('/me/:uid',  async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findOne({ uid });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const orders = await Order.find({ user: user._id })
            .select('orderAmount orderStatus createdAt items totalAmount')
            .sort({ createdAt: -1 });

        res.json({ 
            success: true, 
            orders,
            count: orders.length 
        });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching orders' 
        });
    }
});

// Single export for router
module.exports = router;

