# Software Design Specification (SDS)
# Expense Tracker Application

**Version:** 1.0  
**Date:** February 6, 2026  
**Author:** Development Team

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [System Architecture](#3-system-architecture)
4. [Database Design](#4-database-design)
5. [Component Design](#5-component-design)
6. [API Design](#6-api-design)
7. [Sequence Diagrams](#7-sequence-diagrams)
8. [Data Flow](#8-data-flow)
9. [User Interface Design](#9-user-interface-design)
10. [Security Considerations](#10-security-considerations)

---

## 1. Introduction

### 1.1 Purpose
เอกสารนี้อธิบายการออกแบบระบบของแอปพลิเคชัน Expense Tracker ซึ่งเป็นระบบบันทึกรายจ่ายประจำวันสำหรับผู้ใช้งานรายเดียว (Single-user application)

### 1.2 Scope
ระบบนี้ครอบคลุมการบันทึก แก้ไข ลบ และสรุปรายงานรายจ่าย พร้อมฟีเจอร์กรองข้อมูลตามวันที่และหมวดหมู่

### 1.3 Technologies
- **Backend:** Node.js + Express.js
- **Frontend:** EJS (Embedded JavaScript Templates)
- **Database:** SQLite (better-sqlite3)
- **Styling:** Custom CSS
- **Testing:** Jest + Supertest

### 1.4 Design Goals
- ✅ Simplicity - ใช้งานง่าย เข้าใจง่าย
- ✅ Performance - รวดเร็วด้วย SQLite และ synchronous operations
- ✅ Maintainability - โครงสร้างโค้ดชัดเจนตาม MVC pattern
- ✅ Reliability - มี test coverage ครอบคลุม
- ✅ Responsive - ใช้งานได้ทั้ง desktop และ mobile

---

## 2. System Overview

### 2.1 High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
    end
    
    subgraph "Application Layer"
        Express[Express Server]
        Routes[Routes Layer]
        Controllers[Controllers Layer]
        Models[Models Layer]
    end
    
    subgraph "Data Layer"
        SQLite[(SQLite Database)]
    end
    
    subgraph "View Layer"
        EJS[EJS Templates]
    end
    
    Browser -->|HTTP Request| Express
    Express --> Routes
    Routes --> Controllers
    Controllers --> Models
    Models --> SQLite
    Controllers --> EJS
    EJS -->|HTML Response| Browser
```

### 2.2 System Context

```mermaid
C4Context
    title System Context Diagram - Expense Tracker

    Person(user, "User", "บุคคลที่ต้องการบันทึกรายจ่าย")
    System(expTracker, "Expense Tracker", "ระบบบันทึกและจัดการรายจ่ายประจำวัน")
    
    Rel(user, expTracker, "Uses", "บันทึก/ดู/แก้ไข/ลบ รายจ่าย")
```

---

## 3. System Architecture

### 3.1 MVC Architecture Pattern

```mermaid
graph LR
    subgraph "View"
        V1[index.ejs]
        V2[add.ejs]
        V3[edit.ejs]
        V4[summary.ejs]
        V5[error.ejs]
    end
    
    subgraph "Controller"
        C[expenseController.js]
    end
    
    subgraph "Model"
        M[expense.js]
    end
    
    subgraph "Database"
        DB[(SQLite)]
    end
    
    V1 -.->|User Actions| C
    V2 -.->|Form Submit| C
    V3 -.->|Update| C
    V4 -.->|View Summary| C
    
    C -->|Query Data| M
    C -->|Render| V1
    C -->|Render| V2
    C -->|Render| V3
    C -->|Render| V4
    
    M -->|SQL Operations| DB
```

### 3.2 Directory Structure

```mermaid
graph TD
    Root[exp-tracker/]
    
    Root --> Src[src/]
    Root --> Public[public/]
    Root --> Tests[tests/]
    Root --> Config[Configuration Files]
    
    Src --> App[app.js]
    Src --> DB[db.js]
    Src --> Controllers[controllers/]
    Src --> Models[models/]
    Src --> Routes[routes/]
    Src --> Views[views/]
    
    Controllers --> ExpController[expenseController.js]
    Models --> ExpModel[expense.js]
    Routes --> ExpRoutes[expenses.js]
    Views --> V1[index.ejs]
    Views --> V2[add.ejs]
    Views --> V3[edit.ejs]
    Views --> V4[summary.ejs]
    Views --> V5[error.ejs]
    
    Public --> CSS[css/style.css]
    
    Tests --> TModels[models/]
    Tests --> TControllers[controllers/]
    Tests --> TIntegration[integration/]
```

---

## 4. Database Design

### 4.1 Entity Relationship Diagram

```mermaid
erDiagram
    EXPENSES ||--o{ CATEGORIES : "belongs to"
    
    EXPENSES {
        integer id PK "Primary Key, Auto-increment"
        text description "รายการรายจ่าย"
        real amount "จำนวนเงิน (> 0)"
        text category FK "หมวดหมู่"
        text date "วันที่ (YYYY-MM-DD)"
        text created_at "เวลาที่สร้าง"
    }
    
    CATEGORIES {
        integer id PK "Primary Key, Auto-increment"
        text name UK "ชื่อหมวดหมู่ (Unique)"
        text created_at "เวลาที่สร้าง"
    }
```

### 4.2 Database Schema

#### Table: `expenses`
| Column      | Type    | Constraints           | Description                    |
|-------------|---------|-----------------------|--------------------------------|
| id          | INTEGER | PRIMARY KEY, AUTOINCREMENT | รหัสรายจ่าย                    |
| description | TEXT    | NOT NULL              | รายละเอียดรายจ่าย              |
| amount      | REAL    | NOT NULL, CHECK(>0)   | จำนวนเงิน                      |
| category    | TEXT    | NOT NULL              | หมวดหมู่                       |
| date        | TEXT    | NOT NULL              | วันที่ (ISO format)            |
| created_at  | TEXT    | DEFAULT NOW           | วันเวลาที่สร้างรายการ          |

**Indexes:**
- `idx_expenses_date` on `date` - เพิ่มความเร็วในการ query ตามวันที่
- `idx_expenses_category` on `category` - เพิ่มความเร็วในการ query ตามหมวดหมู่

#### Table: `categories`
| Column      | Type    | Constraints           | Description                    |
|-------------|---------|-----------------------|--------------------------------|
| id          | INTEGER | PRIMARY KEY, AUTOINCREMENT | รหัสหมวดหมู่                  |
| name        | TEXT    | NOT NULL, UNIQUE      | ชื่อหมวดหมู่                   |
| created_at  | TEXT    | DEFAULT NOW           | วันเวลาที่สร้าง                |

**Default Categories:**
- อาหาร
- ค่าเดินทาง
- ช้อปปิ้ง
- ค่าบ้าน
- ค่าน้ำค่าไฟ
- บันเทิง
- สุขภาพ
- การศึกษา
- อื่นๆ

---

## 5. Component Design

### 5.1 Component Diagram

```mermaid
graph TB
    subgraph "Express Application"
        App[app.js<br/>Express Setup]
        Middleware[Middleware<br/>- Static Files<br/>- Body Parser<br/>- Error Handler]
    end
    
    subgraph "Routing Layer"
        Router[expenses.js<br/>Route Definitions]
    end
    
    subgraph "Controller Layer"
        Controller[expenseController.js<br/>- showHomePage<br/>- showAddForm<br/>- createExpense<br/>- showEditForm<br/>- updateExpense<br/>- deleteExpense<br/>- filterExpenses<br/>- showSummary]
    end
    
    subgraph "Model Layer"
        Model[expense.js<br/>- getAllExpenses<br/>- getExpenseById<br/>- createExpense<br/>- updateExpense<br/>- deleteExpense<br/>- getExpensesByDateRange<br/>- getSummaryByCategory<br/>- getTotalExpenses]
    end
    
    subgraph "Database Layer"
        DBInit[db.js<br/>Database Initialization]
        DB[(SQLite Database)]
    end
    
    App --> Middleware
    Middleware --> Router
    Router --> Controller
    Controller --> Model
    Model --> DBInit
    DBInit --> DB
```

### 5.2 Model Layer - expense.js

```mermaid
classDiagram
    class ExpenseModel {
        +getAllExpenses() Array~Expense~
        +getExpenseById(id) Expense
        +getExpensesByDateRange(start, end) Array~Expense~
        +getExpensesByCategory(category) Array~Expense~
        +createExpense(data) Number
        +updateExpense(id, data) Boolean
        +deleteExpense(id) Boolean
        +getTotalByDateRange(start, end) Number
        +getSummaryByCategory(start, end) Array~Summary~
        +getAllCategories() Array~String~
        +getTotalExpenses() Number
        +getExpensesCount() Number
    }
    
    class Expense {
        +Number id
        +String description
        +Number amount
        +String category
        +String date
        +String created_at
    }
    
    class Summary {
        +String category
        +Number count
        +Number total
    }
    
    ExpenseModel --> Expense : returns
    ExpenseModel --> Summary : returns
```

### 5.3 Controller Layer - expenseController.js

```mermaid
classDiagram
    class ExpenseController {
        +showHomePage(req, res)
        +showAddForm(req, res)
        +createExpense(req, res)
        +showEditForm(req, res)
        +updateExpense(req, res)
        +deleteExpense(req, res)
        +filterExpenses(req, res)
        +showSummary(req, res)
    }
    
    class ValidationHelper {
        +validateExpenseData(data) Boolean
        +validateAmount(amount) Boolean
        +validateDate(date) Boolean
    }
    
    ExpenseController ..> ValidationHelper : uses
```

---

## 6. API Design

### 6.1 Route Mapping

```mermaid
graph LR
    subgraph "HTTP Methods & Routes"
        GET1[GET /]
        GET2[GET /add]
        POST1[POST /add]
        GET3[GET /edit/:id]
        POST2[POST /edit/:id]
        POST3[POST /delete/:id]
        GET4[GET /filter]
        GET5[GET /summary]
    end
    
    subgraph "Controller Methods"
        C1[showHomePage]
        C2[showAddForm]
        C3[createExpense]
        C4[showEditForm]
        C5[updateExpense]
        C6[deleteExpense]
        C7[filterExpenses]
        C8[showSummary]
    end
    
    GET1 --> C1
    GET2 --> C2
    POST1 --> C3
    GET3 --> C4
    POST2 --> C5
    POST3 --> C6
    GET4 --> C7
    GET5 --> C8
```

### 6.2 API Endpoints

#### 6.2.1 GET / - Home Page
**Description:** แสดงรายการรายจ่ายทั้งหมด

**Response:** HTML page with expenses list

---

#### 6.2.2 GET /add - Add Expense Form
**Description:** แสดงฟอร์มเพิ่มรายจ่าย

**Response:** HTML form

---

#### 6.2.3 POST /add - Create Expense
**Description:** สร้างรายจ่ายใหม่

**Request Body:**
```javascript
{
  description: String,  // required
  amount: Number,       // required, > 0
  category: String,     // required
  date: String         // required, format: YYYY-MM-DD
}
```

**Response:** Redirect to `/`

**Validation:**
- All fields required
- Amount must be > 0
- Date must be valid format

---

#### 6.2.4 GET /edit/:id - Edit Expense Form
**Description:** แสดงฟอร์มแก้ไขรายจ่าย

**Parameters:**
- `id` - Expense ID

**Response:** HTML form with pre-filled data

**Error:** 404 if expense not found

---

#### 6.2.5 POST /edit/:id - Update Expense
**Description:** อัพเดทรายจ่าย

**Parameters:**
- `id` - Expense ID

**Request Body:** Same as POST /add

**Response:** Redirect to `/`

**Error:** 404 if expense not found

---

#### 6.2.6 POST /delete/:id - Delete Expense
**Description:** ลบรายจ่าย

**Parameters:**
- `id` - Expense ID

**Response:** Redirect to `/`

**Error:** 404 if expense not found

---

#### 6.2.7 GET /filter - Filter Expenses
**Description:** กรองรายจ่ายตามเงื่อนไข

**Query Parameters:**
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `category` - Category name

**Response:** HTML page with filtered expenses

---

#### 6.2.8 GET /summary - Summary Report
**Description:** แสดงสรุปรายงานรายจ่าย

**Query Parameters:**
- `period` - today | week | month
- `startDate` - Custom start date
- `endDate` - Custom end date

**Response:** HTML page with summary by category

---

## 7. Sequence Diagrams

### 7.1 Create Expense Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant ExpressRouter
    participant ExpenseController
    participant ExpenseModel
    participant Database
    participant EJSTemplate
    
    User->>Browser: คลิก "เพิ่มรายจ่าย"
    Browser->>ExpressRouter: GET /add
    ExpressRouter->>ExpenseController: showAddForm()
    ExpenseController->>ExpenseModel: getAllCategories()
    ExpenseModel->>Database: SELECT name FROM categories
    Database-->>ExpenseModel: categories[]
    ExpenseModel-->>ExpenseController: categories[]
    ExpenseController->>EJSTemplate: render('add', data)
    EJSTemplate-->>Browser: HTML Form
    Browser-->>User: แสดงฟอร์ม
    
    User->>Browser: กรอกข้อมูล + Submit
    Browser->>ExpressRouter: POST /add {data}
    ExpressRouter->>ExpenseController: createExpense(req, res)
    
    alt Validation Failed
        ExpenseController->>EJSTemplate: render('error')
        EJSTemplate-->>Browser: Error Page
        Browser-->>User: แสดง Error
    else Validation Success
        ExpenseController->>ExpenseModel: createExpense(data)
        ExpenseModel->>Database: INSERT INTO expenses
        Database-->>ExpenseModel: success
        ExpenseModel-->>ExpenseController: expense_id
        ExpenseController->>Browser: redirect('/')
        Browser-->>User: กลับหน้าหลัก
    end
```

### 7.2 View Expenses with Filter

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant ExpressRouter
    participant ExpenseController
    participant ExpenseModel
    participant Database
    participant EJSTemplate
    
    User->>Browser: เลือกวันที่ + หมวดหมู่
    Browser->>ExpressRouter: GET /filter?startDate=...&category=...
    ExpressRouter->>ExpenseController: filterExpenses(req, res)
    
    alt Filter by Date Range
        ExpenseController->>ExpenseModel: getExpensesByDateRange(start, end)
        ExpenseModel->>Database: SELECT * WHERE date BETWEEN ? AND ?
    else Filter by Category
        ExpenseController->>ExpenseModel: getExpensesByCategory(category)
        ExpenseModel->>Database: SELECT * WHERE category = ?
    end
    
    Database-->>ExpenseModel: expenses[]
    ExpenseModel-->>ExpenseController: expenses[]
    
    ExpenseController->>ExpenseModel: getAllCategories()
    ExpenseModel->>Database: SELECT name FROM categories
    Database-->>ExpenseModel: categories[]
    ExpenseModel-->>ExpenseController: categories[]
    
    ExpenseController->>EJSTemplate: render('index', {expenses, filter})
    EJSTemplate-->>Browser: Filtered HTML Page
    Browser-->>User: แสดงผลลัพธ์
```

### 7.3 Update Expense Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant ExpressRouter
    participant ExpenseController
    participant ExpenseModel
    participant Database
    participant EJSTemplate
    
    User->>Browser: คลิก "แก้ไข" ที่รายการ
    Browser->>ExpressRouter: GET /edit/:id
    ExpressRouter->>ExpenseController: showEditForm(req, res)
    ExpenseController->>ExpenseModel: getExpenseById(id)
    ExpenseModel->>Database: SELECT * WHERE id = ?
    Database-->>ExpenseModel: expense
    
    alt Expense Not Found
        ExpenseModel-->>ExpenseController: undefined
        ExpenseController->>EJSTemplate: render('error', 404)
        EJSTemplate-->>Browser: Error Page
    else Expense Found
        ExpenseModel-->>ExpenseController: expense
        ExpenseController->>ExpenseModel: getAllCategories()
        ExpenseModel->>Database: SELECT name FROM categories
        Database-->>ExpenseModel: categories[]
        ExpenseModel-->>ExpenseController: categories[]
        ExpenseController->>EJSTemplate: render('edit', {expense})
        EJSTemplate-->>Browser: Edit Form
    end
    
    Browser-->>User: แสดงฟอร์มแก้ไข
    User->>Browser: แก้ไขข้อมูล + Submit
    Browser->>ExpressRouter: POST /edit/:id {data}
    ExpressRouter->>ExpenseController: updateExpense(req, res)
    
    alt Validation Failed
        ExpenseController->>EJSTemplate: render('error')
        EJSTemplate-->>Browser: Error Page
    else Validation Success
        ExpenseController->>ExpenseModel: updateExpense(id, data)
        ExpenseModel->>Database: UPDATE expenses SET ... WHERE id = ?
        Database-->>ExpenseModel: success
        ExpenseModel-->>ExpenseController: true
        ExpenseController->>Browser: redirect('/')
    end
    
    Browser-->>User: กลับหน้าหลัก
```

### 7.4 Delete Expense Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant ExpressRouter
    participant ExpenseController
    participant ExpenseModel
    participant Database
    
    User->>Browser: คลิก "ลบ"
    Browser->>User: แสดง Confirm Dialog
    User->>Browser: ยืนยันการลบ
    Browser->>ExpressRouter: POST /delete/:id
    ExpressRouter->>ExpenseController: deleteExpense(req, res)
    ExpenseController->>ExpenseModel: deleteExpense(id)
    ExpenseModel->>Database: DELETE FROM expenses WHERE id = ?
    
    alt Delete Success
        Database-->>ExpenseModel: success
        ExpenseModel-->>ExpenseController: true
        ExpenseController->>Browser: redirect('/')
        Browser-->>User: กลับหน้าหลัก (รายการหาย)
    else Delete Failed
        Database-->>ExpenseModel: fail
        ExpenseModel-->>ExpenseController: false
        ExpenseController->>Browser: render('error', 404)
        Browser-->>User: แสดง Error
    end
```

### 7.5 Summary Report Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant ExpressRouter
    participant ExpenseController
    participant ExpenseModel
    participant Database
    participant EJSTemplate
    
    User->>Browser: คลิก "สรุปรายงาน"
    Browser->>ExpressRouter: GET /summary?period=month
    ExpressRouter->>ExpenseController: showSummary(req, res)
    
    Note over ExpenseController: คำนวณ date range<br/>จาก period
    
    ExpenseController->>ExpenseModel: getSummaryByCategory(start, end)
    ExpenseModel->>Database: SELECT category, COUNT(*), SUM(amount)<br/>FROM expenses<br/>WHERE date BETWEEN ? AND ?<br/>GROUP BY category
    Database-->>ExpenseModel: summaryData[]
    ExpenseModel-->>ExpenseController: summaryData[]
    
    ExpenseController->>ExpenseModel: getTotalByDateRange(start, end)
    ExpenseModel->>Database: SELECT SUM(amount)<br/>FROM expenses<br/>WHERE date BETWEEN ? AND ?
    Database-->>ExpenseModel: totalAmount
    ExpenseModel-->>ExpenseController: totalAmount
    
    ExpenseController->>EJSTemplate: render('summary', {summaryData, total})
    EJSTemplate-->>Browser: Summary HTML
    Browser-->>User: แสดงสรุปรายงาน
```

---

## 8. Data Flow

### 8.1 Overall Data Flow

```mermaid
graph TD
    A[User Input] --> B{Validation}
    B -->|Invalid| C[Error Page]
    B -->|Valid| D[Controller]
    D --> E[Model Layer]
    E --> F[(SQLite DB)]
    F --> G[Query Results]
    G --> E
    E --> D
    D --> H[EJS Template]
    H --> I[Rendered HTML]
    I --> J[Browser Display]
    J --> A
```

### 8.2 Request/Response Flow

```mermaid
flowchart LR
    subgraph Client
        A1[Browser]
    end
    
    subgraph Server
        B1[Express Middleware]
        B2[Router]
        B3[Controller]
        B4[Model]
        B5[(Database)]
        B6[View Template]
    end
    
    A1 -->|HTTP Request| B1
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B4 --> B5
    B5 -->|Data| B4
    B4 -->|Data| B3
    B3 -->|Data| B6
    B6 -->|HTML| A1
```

### 8.3 Data Processing Pipeline

```mermaid
graph LR
    subgraph Input
        I1[Form Data]
        I2[Query Params]
        I3[URL Params]
    end
    
    subgraph Processing
        P1[Parse & Validate]
        P2[Business Logic]
        P3[Database Query]
        P4[Format Results]
    end
    
    subgraph Output
        O1[HTML Page]
        O2[Redirect]
        O3[Error Page]
    end
    
    I1 --> P1
    I2 --> P1
    I3 --> P1
    P1 --> P2
    P2 --> P3
    P3 --> P4
    P4 --> O1
    P4 --> O2
    P1 -.->|Error| O3
    P2 -.->|Error| O3
    P3 -.->|Error| O3
```

---

## 9. User Interface Design

### 9.1 Page Structure

```mermaid
graph TD
    subgraph Layout
        Header[Header<br/>💰 Expense Tracker]
        Nav[Navigation<br/>รายการรายจ่าย | เพิ่มรายจ่าย | สรุปรายงาน]
        Main[Main Content]
        Footer[Footer]
    end
    
    Header --> Nav
    Nav --> Main
    Main --> Footer
    
    Main --> Page1[Index Page]
    Main --> Page2[Add Page]
    Main --> Page3[Edit Page]
    Main --> Page4[Summary Page]
```

### 9.2 Index Page (Home) Wireframe

```mermaid
graph TB
    subgraph "Index Page Layout"
        Title[รายการรายจ่ายทั้งหมด]
        
        subgraph FilterSection
            F1[วันที่เริ่มต้น]
            F2[วันที่สิ้นสุด]
            F3[หมวดหมู่]
            F4[ปุ่มกรอง]
        end
        
        Summary[ยอดรวม: ฿X,XXX.XX]
        
        subgraph ExpenseTable
            TH[วันที่ | รายการ | หมวดหมู่ | จำนวนเงิน | จัดการ]
            TR1[Row 1 Data + แก้ไข/ลบ]
            TR2[Row 2 Data + แก้ไข/ลบ]
            TR3[...]
        end
    end
    
    Title --> FilterSection
    FilterSection --> Summary
    Summary --> ExpenseTable
```

### 9.3 User Interaction Flow

```mermaid
stateDiagram-v2
    [*] --> ViewExpenses: เข้าระบบ
    
    ViewExpenses --> AddExpense: คลิก "เพิ่มรายจ่าย"
    ViewExpenses --> EditExpense: คลิก "แก้ไข"
    ViewExpenses --> DeleteExpense: คลิก "ลบ"
    ViewExpenses --> FilterExpenses: เลือกตัวกรอง
    ViewExpenses --> ViewSummary: คลิก "สรุปรายงาน"
    
    AddExpense --> ViewExpenses: บันทึกสำเร็จ
    AddExpense --> AddExpense: Error (แสดง error)
    
    EditExpense --> ViewExpenses: อัพเดทสำเร็จ
    EditExpense --> EditExpense: Error
    
    DeleteExpense --> ViewExpenses: ลบสำเร็จ
    
    FilterExpenses --> ViewExpenses: แสดงผลกรอง
    
    ViewSummary --> ViewExpenses: กลับหน้าหลัก
    ViewSummary --> ViewSummary: เปลี่ยนช่วงเวลา
```

---

## 10. Security Considerations

### 10.1 Security Measures

```mermaid
mindmap
  root((Security))
    Input Validation
      Form Validation
      Data Type Checking
      Amount > 0
      Date Format
      Required Fields
    SQL Injection Prevention
      Prepared Statements
      Parameterized Queries
      better-sqlite3
    XSS Prevention
      EJS Auto-escaping
      HTML Sanitization
    CSRF Protection
      Same-origin
      Single-user app
    Error Handling
      No Sensitive Info Leak
      Generic Error Messages
      Logging
    Data Integrity
      Database Constraints
      CHECK constraints
      NOT NULL constraints
      UNIQUE constraints
```

### 10.2 Validation Flow

```mermaid
flowchart TD
    Start[User Input] --> V1{ข้อมูลครบ?}
    V1 -->|No| E1[Error: กรอกข้อมูลให้ครบ]
    V1 -->|Yes| V2{Amount > 0?}
    V2 -->|No| E2[Error: จำนวนเงินต้องมากกว่า 0]
    V2 -->|Yes| V3{Date valid?}
    V3 -->|No| E3[Error: รูปแบบวันที่ไม่ถูกต้อง]
    V3 -->|Yes| V4{Category exists?}
    V4 -->|No| E4[Error: หมวดหมู่ไม่ถูกต้อง]
    V4 -->|Yes| Process[ประมวลผลข้อมูล]
    
    E1 --> ErrorPage[แสดง Error Page]
    E2 --> ErrorPage
    E3 --> ErrorPage
    E4 --> ErrorPage
    
    Process --> Success[บันทึกลง Database]
    Success --> Redirect[Redirect ไปหน้าหลัก]
```

---

## 11. Performance Considerations

### 11.1 Database Optimization

```mermaid
graph LR
    subgraph "Optimization Strategies"
        A[Indexes on date & category]
        B[Prepared Statements Caching]
        C[Synchronous Operations]
        D[Connection Pooling]
        E[Query Optimization]
    end
    
    subgraph "Benefits"
        F[Fast Queries]
        G[Low Latency]
        H[Efficient Memory Usage]
    end
    
    A --> F
    B --> G
    C --> G
    D --> H
    E --> F
```

### 11.2 Caching Strategy

```mermaid
graph TB
    Request[Request] --> Cache{In Cache?}
    Cache -->|Yes| Return[Return Cached]
    Cache -->|No| DB[Query Database]
    DB --> Store[Store in Cache]
    Store --> Return
    Return --> Response[Response]
```

---

## 12. Testing Strategy

### 12.1 Test Coverage

```mermaid
graph TB
    subgraph "Testing Pyramid"
        E2E[End-to-End Tests<br/>Integration Tests]
        Integration[API Tests<br/>Controller Tests]
        Unit[Model Tests<br/>Utility Tests]
    end
    
    Unit --> Integration
    Integration --> E2E
```

### 12.2 Test Flow

```mermaid
flowchart LR
    subgraph "Unit Tests"
        UT1[Model Tests]
        UT2[Controller Tests]
    end
    
    subgraph "Integration Tests"
        IT1[API Endpoint Tests]
        IT2[Database Tests]
        IT3[Full Flow Tests]
    end
    
    subgraph "Test Results"
        R1[Coverage Report]
        R2[Test Summary]
    end
    
    UT1 --> IT1
    UT2 --> IT1
    IT1 --> IT2
    IT2 --> IT3
    IT3 --> R1
    IT3 --> R2
```

---

## 13. deployment Architecture

### 13.1 Deployment Options

```mermaid
graph TB
    subgraph "Development"
        Dev[Local Machine<br/>npm run dev<br/>Port 3000]
    end
    
    subgraph "Production Options"
        P1[Traditional Server<br/>VPS/Dedicated]
        P2[Container<br/>Docker]
        P3[Platform<br/>Heroku/Railway]
    end
    
    Dev -.-> P1
    Dev -.-> P2
    Dev -.-> P3
    
    P1 --> DB1[(SQLite File)]
    P2 --> DB2[(SQLite File<br/>or External DB)]
    P3 --> DB3[(PostgreSQL<br/>for production)]
```

### 13.2 Deployment Process

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Git as Git Repository
    participant CI as CI/CD Pipeline
    participant Server as Production Server
    participant App as Application
    
    Dev->>Git: git push
    Git->>CI: Trigger build
    CI->>CI: Run tests
    CI->>CI: Build application
    
    alt Tests Pass
        CI->>Server: Deploy
        Server->>App: Start/Restart app
        App->>Server: Health check ✓
        Server->>Dev: Deployment success
    else Tests Fail
        CI->>Dev: Deployment failed
    end
```

---

## 14. Error Handling

### 14.1 Error Handling Flow

```mermaid
flowchart TD
    Start[Request] --> Process{Processing}
    
    Process -->|Success| Success[Return Success Response]
    Process -->|Error| ErrorType{Error Type?}
    
    ErrorType -->|Validation Error| E1[400 Bad Request]
    ErrorType -->|Not Found| E2[404 Not Found]
    ErrorType -->|Server Error| E3[500 Internal Server Error]
    
    E1 --> Log1[Log Error]
    E2 --> Log2[Log Warning]
    E3 --> Log3[Log Critical Error]
    
    Log1 --> Render1[Render Error Page]
    Log2 --> Render2[Render Error Page]
    Log3 --> Render3[Render Error Page]
    
    Success --> End[Response]
    Render1 --> End
    Render2 --> End
    Render3 --> End
```

---

## 15. Future Enhancements

### 15.1 Potential Features

```mermaid
mindmap
  root((Future Features))
    User Management
      Multi-user Support
      User Authentication
      User Profiles
      Shared Expenses
    Advanced Reports
      Charts & Graphs
      Export to PDF
      Monthly Reports
      Budget Analysis
    Enhanced Features
      Receipt Upload
      Image Storage
      Recurring Expenses
      Budget Alerts
      Multi-currency
    Mobile App
      React Native
      Progressive Web App
      Mobile-optimized UI
    Integrations
      Bank API
      Email Notifications
      Cloud Backup
      Data Sync
```

---

## Appendix

### A. Technology Stack Details

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Runtime | Node.js | 14+ | JavaScript runtime |
| Framework | Express.js | 4.18+ | Web framework |
| Database | SQLite | 3.x | Lightweight database |
| DB Driver | better-sqlite3 | 9.2+ | Synchronous SQLite driver |
| Templating | EJS | 3.1+ | Server-side rendering |
| Testing | Jest | 29.7+ | Testing framework |
| Testing | Supertest | 6.3+ | HTTP assertions |
| Environment | dotenv | 16.3+ | Environment variables |

### B. Coding Standards

- **Style Guide:** JavaScript Standard Style
- **Naming Convention:** camelCase for functions/variables, PascalCase for classes
- **File Organization:** MVC pattern
- **Comments:** JSDoc for functions, inline for complex logic
- **Error Handling:** Try-catch blocks, centralized error handler
- **Database:** Prepared statements only, no string concatenation

### C. Database Queries Reference

```sql
-- Get all expenses ordered by date
SELECT * FROM expenses ORDER BY date DESC, created_at DESC;

-- Get expenses by date range
SELECT * FROM expenses 
WHERE date BETWEEN ? AND ? 
ORDER BY date DESC;

-- Get summary by category
SELECT category, COUNT(*) as count, SUM(amount) as total 
FROM expenses 
WHERE date BETWEEN ? AND ? 
GROUP BY category 
ORDER BY total DESC;

-- Get total expenses
SELECT COALESCE(SUM(amount), 0) as total FROM expenses;
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-06 | Development Team | Initial SDS Document |

---

**End of Software Design Specification**