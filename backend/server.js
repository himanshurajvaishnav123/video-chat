const express = require('express');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const roomRoutes = require('./routes/roomRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api', roomRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
