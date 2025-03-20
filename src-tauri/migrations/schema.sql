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

-- แก้ไขตาราง roles เพื่อรวมสิทธิ์การเข้าถึง
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,  -- คำอธิบายบทบาท
    create_prod BOOLEAN NOT NULL DEFAULT 0,  -- สิทธิ์การสร้างสินค้า
    read_prod BOOLEAN NOT NULL DEFAULT 0,  -- สิทธิ์การดูสินค้า
    update_prod BOOLEAN NOT NULL DEFAULT 0,  -- สิทธิ์การแก้ไขสินค้า
    delete_prod BOOLEAN NOT NULL DEFAULT 0,  -- สิทธิ์การลบสินค้า
    create_sale BOOLEAN NOT NULL DEFAULT 0,  -- สิทธิ์การสร้างการขาย
    read_sale BOOLEAN NOT NULL DEFAULT 0,  -- สิทธิ์การดูการขาย
    update_sale BOOLEAN NOT NULL DEFAULT 0,  -- สิทธิ์การแก้ไขการขาย
    delete_sale BOOLEAN NOT NULL DEFAULT 0,  -- สิทธิ์การลบการขาย
    db_access BOOLEAN NOT NULL DEFAULT 0, -- สิทธิ์การเข้าถึงฐานข้อมูล
    role_access BOOLEAN NOT NULL DEFAULT 0, -- สิทธิ์การเข้าถึงบทบาท
    user_access BOOLEAN NOT NULL DEFAULT 0 -- สิทธิ์การเข้าถึงผู้ใช้
);

-- เพิ่มบทบาทเริ่มต้นพร้อมสิทธิ์ที่เกี่ยวข้อง
INSERT INTO roles (id, name, description, create_prod, read_prod, update_prod, delete_prod, create_sale, read_sale, update_sale, delete_sale, db_access, role_access, user_access) VALUES
    (1, 'Admin', 'ผู้ดูแลระบบ: สิทธิ์ทั้งหมด', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),  -- Admin: สิทธิ์ทั้งหมด
    (2, 'Manager', 'ผู้จัดการ: ดูแลการขายและสต๊อก', 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0),  -- Manager: ดูแลการขายและสต๊อก
    (3, 'Accountant', 'นักบัญชี: ดูแลการเงิน', 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0),  -- Accountant: ดูแลการเงิน
    (4, 'Stock', 'สต๊อก: จัดการคลังสินค้า', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0),  -- Stock: จัดการคลังสินค้า
    (5, 'Cashier', 'แคชเชียร์: รับชำระเงินจากลูกค้า', 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0);  -- Cashier: รับชำระเงินจากลูกค้า

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
