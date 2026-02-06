const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const expenseRoutes = require('./routes/expenses');
app.use('/', expenseRoutes);

// Error handling middleware
app.use((req, res) => {
  res.status(404).render('error', { 
    error: 'ไม่พบหน้าที่คุณต้องการ' 
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).render('error', { 
    error: err.message || 'เกิดข้อผิดพลาด' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server is running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
