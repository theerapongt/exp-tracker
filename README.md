# 💰 Expense Tracker

เว็บแอปพลิเคชันสำหรับบันทึกรายจ่ายประจำวัน สร้างด้วย Node.js, Express, EJS และ SQLite

## คุณสมบัติ

- ✅ บันทึกรายจ่ายประจำวัน (วันที่, รายการ, หมวดหมู่, จำนวนเงิน)
- ✅ แก้ไขและลบรายการรายจ่าย
- ✅ กรองรายการตามวันที่และหมวดหมู่
- ✅ สรุปรายงานรายจ่ายตามช่วงเวลา (วันนี้, สัปดาห์นี้, เดือนนี้)
- ✅ แสดงสถิติยอดรวมแบ่งตามหมวดหมู่
- ✅ Responsive design สำหรับใช้งานบนมือถือ

## เทคโนโลยี

- **Backend**: Node.js + Express.js
- **Frontend**: EJS Templates
- **Database**: SQLite (better-sqlite3)
- **Styling**: Custom CSS

## การติดตั้ง

### ความต้องการของระบบ

- Node.js 14+ 
- npm หรือ yarn

### ขั้นตอนการติดตั้ง

1. Clone repository
```bash
git clone https://github.com/theerapongt/exp-tracker.git
cd exp-tracker
```

2. ติดตั้ง dependencies
```bash
npm install
```

3. สร้างไฟล์ `.env` (หรือใช้ `.env.example`)
```bash
cp .env.example .env
```

4. เริ่มต้นใช้งาน

**Development mode (auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

5. เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

## โครงสร้างโปรเจค

```
exp-tracker/
├── src/
│   ├── app.js                 # Express app setup
│   ├── db.js                  # SQLite database initialization
│   ├── controllers/
│   │   └── expenseController.js
│   ├── models/
│   │   └── expense.js
│   ├── routes/
│   │   └── expenses.js
│   └── views/
│       ├── index.ejs          # หน้าแสดงรายการรายจ่าย
│       ├── add.ejs            # ฟอร์มเพิ่มรายจ่าย
│       ├── edit.ejs           # ฟอร์มแก้ไขรายจ่าย
│       ├── summary.ejs        # หน้าสรุปรายงาน
│       └── error.ejs          # หน้า error
├── public/
│   └── css/
│       └── style.css          # Custom styles
├── .env                       # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## การใช้งาน

### เพิ่มรายจ่าย
1. คลิกปุ่ม "เพิ่มรายจ่าย"
2. กรอกข้อมูล: วันที่, รายการ, หมวดหมู่, จำนวนเงิน
3. คลิก "บันทึก"

### แก้ไข/ลบรายจ่าย
- คลิกปุ่ม "แก้ไข" ในรายการที่ต้องการแก้ไข
- คลิกปุ่ม "ลบ" เพื่อลบรายการ

### กรองรายการ
- เลือกวันที่เริ่มต้น-สิ้นสุด หรือหมวดหมู่
- คลิก "กรอง"

### ดูสรุปรายงาน
- คลิก "สรุปรายงาน" ที่เมนู
- เลือกช่วงเวลา: วันนี้, สัปดาห์นี้, เดือนนี้ หรือกำหนดเอง
- ดูยอดรวมและสถิติแบ่งตามหมวดหมู่

## หมวดหมู่เริ่มต้น

- อาหาร
- ค่าเดินทาง
- ช้อปปิ้ง
- ค่าบ้าน
- ค่าน้ำค่าไฟ
- บันเทิง
- สุขภาพ
- การศึกษา
- อื่นๆ

## Environment Variables

```
PORT=3000                      # พอร์ตที่เซิร์ฟเวอร์จะรัน
NODE_ENV=development           # โหมดการทำงาน (development/production)
DATABASE_PATH=./expenses.db    # ที่อยู่ไฟล์ฐานข้อมูล SQLite
```

## License

ISC