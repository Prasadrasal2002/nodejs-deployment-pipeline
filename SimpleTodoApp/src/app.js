const express = require('express');
const path = require('path');
const fs = require('fs');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
