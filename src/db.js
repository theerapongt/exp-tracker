const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DATABASE_PATH || './expenses.db';
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initializeDatabase() {
  // Create categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    )
  `);

  // Create expenses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL CHECK(amount > 0),
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    )
  `);

  // Create indexes for better query performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
    CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
  `);

  // Insert default categories if table is empty
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  if (categoryCount.count === 0) {
    const insertCategory = db.prepare('INSERT INTO categories (name) VALUES (?)');
    const defaultCategories = [
      'อาหาร',
      'ค่าเดินทาง',
      'ช้อปปิ้ง',
      'ค่าบ้าน',
      'ค่าน้ำค่าไฟ',
      'บันเทิง',
      'สุขภาพ',
      'การศึกษา',
      'อื่นๆ'
    ];

    const insertMany = db.transaction((categories) => {
      for (const category of categories) {
        insertCategory.run(category);
      }
    });

    insertMany(defaultCategories);
    console.log('✓ Default categories inserted');
  }

  console.log('✓ Database initialized successfully');
}

// Initialize the database when this module is loaded
initializeDatabase();

module.exports = db;
