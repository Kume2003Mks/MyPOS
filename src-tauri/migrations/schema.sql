-- สร้างตารางหมวดหมู่สินค้า
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- เพิ่มหมวดหมู่เริ่มต้น
INSERT INTO categories (id, name, description) VALUES
    (1, 'General', 'เบ็ดเตล็ด');

-- สร้างตารางสินค้า
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    cat_id INTEGER,
    barcode TEXT UNIQUE,
    c_price REAL NOT NULL,
    s_price REAL NOT NULL,
    qty INTEGER NOT NULL DEFAULT 0,
    img_path TEXT,
    r_status TEXT NOT NULL DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cat_id) REFERENCES categories (id) ON DELETE SET NULL
);

-- สร้างตารางสิทธิ์การใช้งาน
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- เพิ่มข้อมูลบทบาทเริ่มต้น
INSERT INTO roles (id, name, description) VALUES
    (1, 'Admin', 'System administrator with full access to all features and settings'),
    (2, 'Manager', 'Responsible for overseeing sales, inventory, and staff operations'),
    (3, 'Accountant', 'Manages financial records, transactions, and reporting'),
    (4, 'Stock', 'Manages warehouse stock, including restocking and inventory tracking'),
    (5, 'Cashier', 'Handles sales transactions and customer payments at the point of sale');

-- สร้างตารางผู้ใช้งาน
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE SET NULL
);

-- สร้างตารางลูกค้า
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE,
    email TEXT UNIQUE,
    addr TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- สร้างตารางบิลขายสินค้า
CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    cust_id INTEGER,
    total REAL NOT NULL,
    discount REAL NOT NULL DEFAULT 0,
    note TEXT,
    pay_method TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
    FOREIGN KEY (cust_id) REFERENCES customers (id) ON DELETE SET NULL
);

-- สร้างตารางรายการสินค้าในบิล
CREATE TABLE IF NOT EXISTS sale_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER,
    prod_id INTEGER,
    qty INTEGER NOT NULL CHECK (qty > 0),
    u_price REAL NOT NULL,
    t_price REAL NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales (id) ON DELETE SET NULL,
    FOREIGN KEY (prod_id) REFERENCES products (id) ON DELETE SET NULL
);

-- สร้างตารางข้อมูลการชำระเงิน
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER,
    paid REAL NOT NULL,
    change REAL NOT NULL,
    pay_method TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales (id) ON DELETE SET NULL
);
