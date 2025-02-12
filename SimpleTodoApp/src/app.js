require('dotenv').config(); // Load environment variables

const express = require('express');
const path = require('path');
const fs = require('fs');
const todoRoutes = require('./routes/todoRoutes');
const cors = require('cors'); // Import CORS

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

// Routes
app.use('/api/todos', todoRoutes);

const PORT = process.env.PORT || 3000; // Use PORT from .env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
