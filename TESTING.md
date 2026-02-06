# Manual Testing Checklist

## ✓ Completed Tests

### 1. Server Startup
- ✓ Server starts successfully on port 3000
- ✓ Database initialized with default categories
- ✓ Environment variables loaded correctly

### 2. Database
- ✓ SQLite database created (expenses.db)
- ✓ Tables created: expenses, categories
- ✓ Default categories inserted (9 categories)
- ✓ Indexes created for performance

### 3. Basic Functionality
- ✓ Home page loads correctly (GET /)
- ✓ Add expense form accessible (GET /add)
- ✓ Create expense works (POST /add)
- ✓ Data persists in database
- ✓ Expenses display on home page
- ✓ Summary page accessible (GET /summary)

### 4. Data Validation
- ✓ Expenses are stored with correct data types
- ✓ Dates are formatted correctly
- ✓ Amounts are stored as decimals

## Test Results

**Database Content:**
```
6|Test4|90.0|ค่าเดินทาง|2026-02-06|2026-02-06 03:52:03
2|lunch|85.5|อาหาร|2026-02-06|2026-02-06 03:51:50
1|ค่าอาหารเช้า|85.5|อาหาร|2026-02-06|2026-02-06 03:51:45
5|Test3|80.0|ค่าเดินทาง|2026-02-05|2026-02-06 03:52:03
4|Test2|70.0|ค่าเดินทาง|2026-02-04|2026-02-06 03:52:03
```

**Summary Statistics:**
- Total expenses: ฿471.00
- Categories with data: อาหาร, ค่าเดินทาง
- Number of transactions: 6

## Next Steps for Manual Testing

1. **Edit Functionality**
   - Navigate to home page
   - Click "แก้ไข" on any expense
   - Modify values and save
   - Verify changes appear on home page

2. **Delete Functionality** 
   - Click "ลบ" on any expense
   - Confirm deletion dialog
   - Verify expense is removed

3. **Filter by Date**
   - Select date range on home page
   - Click "กรอง"
   - Verify only expenses in range appear

4. **Filter by Category**
   - Select category dropdown
   - Click "กรอง"
   - Verify only expenses in that category appear

5. **Summary Reports**
   - Click "สรุปรายงาน"
   - Test "วันนี้", "สัปดาห์นี้", "เดือนนี้" buttons
   - Test custom date range
   - Verify totals by category are correct
   - Check percentage calculations

6. **Responsive Design**
   - Resize browser window to mobile size
   - Verify layout adapts correctly
   - Test all functionality on mobile view

7. **Error Handling**
   - Try to access non-existent expense ID
   - Submit form with missing fields
   - Submit negative amount
   - Verify error page displays

## How to Run Manual Tests

1. Start the server:
   ```bash
   npm run dev
   ```

2. Open browser to: http://localhost:3000

3. Follow the test steps above and verify each feature works as expected.
