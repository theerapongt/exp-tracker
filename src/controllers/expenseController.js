const expenseModel = require('../models/expense');

const expenseController = {
  // Show home page with all expenses
  showHomePage(req, res) {
    try {
      const expenses = expenseModel.getAllExpenses();
      const total = expenseModel.getTotalExpenses();
      const categories = expenseModel.getAllCategories();

      res.render('index', {
        title: 'รายการรายจ่าย',
        expenses,
        total,
        categories,
        filter: {}
      });
    } catch (error) {
      console.error('Error in showHomePage:', error);
      res.status(500).render('error', { error: error.message });
    }
  },

  // Show add expense form
  showAddForm(req, res) {
    try {
      const categories = expenseModel.getAllCategories();
      const today = new Date().toISOString().split('T')[0];
      
      res.render('add', {
        title: 'เพิ่มรายจ่าย',
        categories,
        today
      });
    } catch (error) {
      console.error('Error in showAddForm:', error);
      res.status(500).render('error', { error: error.message });
    }
  },

  // Create new expense
  createExpense(req, res) {
    try {
      const { description, amount, category, date } = req.body;

      // Validation
      if (!description || !amount || !category || !date) {
        return res.status(400).render('error', { 
          error: 'กรุณากรอกข้อมูลให้ครบถ้วน' 
        });
      }

      if (parseFloat(amount) <= 0) {
        return res.status(400).render('error', { 
          error: 'จำนวนเงินต้องมากกว่า 0' 
        });
      }

      const expenseData = {
        description: description.trim(),
        amount: parseFloat(amount),
        category,
        date
      };

      expenseModel.createExpense(expenseData);
      res.redirect('/');
    } catch (error) {
      console.error('Error in createExpense:', error);
      res.status(500).render('error', { error: error.message });
    }
  },

  // Show edit expense form
  showEditForm(req, res) {
    try {
      const { id } = req.params;
      const expense = expenseModel.getExpenseById(id);

      if (!expense) {
        return res.status(404).render('error', { 
          error: 'ไม่พบรายจ่ายที่ต้องการแก้ไข' 
        });
      }

      const categories = expenseModel.getAllCategories();

      res.render('edit', {
        title: 'แก้ไขรายจ่าย',
        expense,
        categories
      });
    } catch (error) {
      console.error('Error in showEditForm:', error);
      res.status(500).render('error', { error: error.message });
    }
  },

  // Update expense
  updateExpense(req, res) {
    try {
      const { id } = req.params;
      const { description, amount, category, date } = req.body;

      // Validation
      if (!description || !amount || !category || !date) {
        return res.status(400).render('error', { 
          error: 'กรุณากรอกข้อมูลให้ครบถ้วน' 
        });
      }

      if (parseFloat(amount) <= 0) {
        return res.status(400).render('error', { 
          error: 'จำนวนเงินต้องมากกว่า 0' 
        });
      }

      const expenseData = {
        description: description.trim(),
        amount: parseFloat(amount),
        category,
        date
      };

      const updated = expenseModel.updateExpense(id, expenseData);

      if (!updated) {
        return res.status(404).render('error', { 
          error: 'ไม่พบรายจ่ายที่ต้องการแก้ไข' 
        });
      }

      res.redirect('/');
    } catch (error) {
      console.error('Error in updateExpense:', error);
      res.status(500).render('error', { error: error.message });
    }
  },

  // Delete expense
  deleteExpense(req, res) {
    try {
      const { id } = req.params;
      const deleted = expenseModel.deleteExpense(id);

      if (!deleted) {
        return res.status(404).render('error', { 
          error: 'ไม่พบรายจ่ายที่ต้องการลบ' 
        });
      }

      res.redirect('/');
    } catch (error) {
      console.error('Error in deleteExpense:', error);
      res.status(500).render('error', { error: error.message });
    }
  },

  // Filter expenses
  filterExpenses(req, res) {
    try {
      const { startDate, endDate, category } = req.query;
      let expenses;
      let total;

      if (startDate && endDate) {
        expenses = expenseModel.getExpensesByDateRange(startDate, endDate);
        total = expenseModel.getTotalByDateRange(startDate, endDate);
      } else if (category) {
        expenses = expenseModel.getExpensesByCategory(category);
        total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      } else {
        return res.redirect('/');
      }

      const categories = expenseModel.getAllCategories();

      res.render('index', {
        title: 'รายการรายจ่าย',
        expenses,
        total,
        categories,
        filter: { startDate, endDate, category }
      });
    } catch (error) {
      console.error('Error in filterExpenses:', error);
      res.status(500).render('error', { error: error.message });
    }
  },

  // Show summary page
  showSummary(req, res) {
    try {
      const { startDate, endDate, period } = req.query;
      let start, end;
      const today = new Date();

      // Calculate date range based on period
      if (period === 'today') {
        start = end = today.toISOString().split('T')[0];
      } else if (period === 'week') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        start = weekStart.toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
      } else if (period === 'month') {
        start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
      } else if (startDate && endDate) {
        start = startDate;
        end = endDate;
      } else {
        // Default to current month
        start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
      }

      const summaryByCategory = expenseModel.getSummaryByCategory(start, end);
      const totalExpenses = expenseModel.getTotalByDateRange(start, end);

      res.render('summary', {
        title: 'สรุปรายจ่าย',
        summaryByCategory,
        totalExpenses,
        startDate: start,
        endDate: end,
        period: period || 'custom'
      });
    } catch (error) {
      console.error('Error in showSummary:', error);
      res.status(500).render('error', { error: error.message });
    }
  }
};

module.exports = expenseController;
