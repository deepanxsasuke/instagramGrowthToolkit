const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order Endpoint
app.post('/api/create-order', async (req, res) => {
  try {
    const options = {
      amount: 4900, // ₹49 in paise (amount must be in smallest currency unit)
      currency: "INR",
      receipt: "receipt_order_" + Math.random().toString(36).substring(7),
    };
    
    const order = await razorpay.orders.create(options);
    
    if (!order) {
      return res.status(500).send("Error creating order");
    }
    
    res.json(order);
  } catch (error) {
    console.error("Error generating order:", error);
    res.status(500).send(error);
  }
});

// Verify Payment Endpoint
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
