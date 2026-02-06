const db = require('../db');

const expenseModel = {
  // Get all expenses ordered by date (newest first)
  getAllExpenses() {
    const stmt = db.prepare(`
      SELECT * FROM expenses 
      ORDER BY date DESC, created_at DESC
    `);
    return stmt.all();
  },

  // Get expense by ID
  getExpenseById(id) {
    const stmt = db.prepare('SELECT * FROM expenses WHERE id = ?');
    return stmt.get(id);
  },

  // Get expenses by date range
  getExpensesByDateRange(startDate, endDate) {
    const stmt = db.prepare(`
      SELECT * FROM expenses 
      WHERE date BETWEEN ? AND ?
      ORDER BY date DESC, created_at DESC
    `);
    return stmt.all(startDate, endDate);
  },

  // Get expenses by category
  getExpensesByCategory(category) {
    const stmt = db.prepare(`
      SELECT * FROM expenses 
      WHERE category = ?
      ORDER BY date DESC, created_at DESC
    `);
    return stmt.all(category);
  },

  // Create new expense
  createExpense(data) {
    const stmt = db.prepare(`
      INSERT INTO expenses (description, amount, category, date)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.description,
      data.amount,
      data.category,
      data.date
    );
    return result.lastInsertRowid;
  },

  // Update expense
  updateExpense(id, data) {
    const stmt = db.prepare(`
      UPDATE expenses 
      SET description = ?, amount = ?, category = ?, date = ?
      WHERE id = ?
    `);
    const result = stmt.run(
      data.description,
      data.amount,
      data.category,
      data.date,
      id
    );
    return result.changes > 0;
  },

  // Delete expense
  deleteExpense(id) {
    const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  // Get total by date range
  getTotalByDateRange(startDate, endDate) {
    const stmt = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM expenses 
      WHERE date BETWEEN ? AND ?
    `);
    return stmt.get(startDate, endDate).total;
  },

  // Get summary by category
  getSummaryByCategory(startDate = null, endDate = null) {
    let query = `
      SELECT 
        category,
        COUNT(*) as count,
        SUM(amount) as total
      FROM expenses
    `;
    
    const params = [];
    if (startDate && endDate) {
      query += ' WHERE date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
    
    query += ' GROUP BY category ORDER BY total DESC';
    
    const stmt = db.prepare(query);
    return params.length > 0 ? stmt.all(...params) : stmt.all();
  },

  // Get all categories
  getAllCategories() {
    const stmt = db.prepare('SELECT name FROM categories ORDER BY name');
    return stmt.all().map(row => row.name);
  },

  // Get total of all expenses
  getTotalExpenses() {
    const stmt = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM expenses');
    return stmt.get().total;
  },

  // Get expenses count
  getExpensesCount() {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM expenses');
    return stmt.get().count;
  }
};

module.exports = expenseModel;
