const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// Home page - list all expenses
router.get('/', expenseController.showHomePage);

// Filter expenses
router.get('/filter', expenseController.filterExpenses);

// Show add form
router.get('/add', expenseController.showAddForm);

// Create new expense
router.post('/add', expenseController.createExpense);

// Show edit form
router.get('/edit/:id', expenseController.showEditForm);

// Update expense
router.post('/edit/:id', expenseController.updateExpense);

// Delete expense
router.post('/delete/:id', expenseController.deleteExpense);

// Summary page
router.get('/summary', expenseController.showSummary);

module.exports = router;
