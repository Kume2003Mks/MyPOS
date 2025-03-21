// หมวดหมู่สินค้า
export type Category = {
    id: number;
    name: string;
    description?: string;
};

// สินค้า
export type Product = {
    id: number;
    name: string;
    description?: string;
    cat_id?: number;
    barcode?: string;
    c_price: number;
    s_price: number;
    qty: number;
    img_path?: string;
    r_status: 'active' | 'inactive';
    created_at: string; // ISO Date format
    updated_at: string; // ISO Date format
};

// สิทธิ์การใช้งาน
export type Role = {
    id: number;
    name: string;
    description?: string;
    create_prod: boolean; // สิทธิ์การสร้างสินค้า
    read_prod: boolean;   // สิทธิ์การดูสินค้า
    update_prod: boolean; // สิทธิ์การแก้ไขสินค้า
    delete_prod: boolean; // สิทธิ์การลบสินค้า
    create_sale: boolean; // สิทธิ์การสร้างการขาย
    read_sale: boolean;   // สิทธิ์การดูการขาย
    update_sale: boolean; // สิทธิ์การแก้ไขการขาย
    delete_sale: boolean; // สิทธิ์การลบการขาย
    db_access: boolean;   // สิทธิ์การเข้าถึงฐานข้อมูล
    role_access: boolean; // สิทธิ์การเข้าถึงบทบาท
    user_access: boolean; // สิทธิ์การเข้าถึงผู้ใช้
};

// ผู้ใช้งาน
export type User = {
    id: number;
    username: string;
    password: string;
    full_name: string;
    role_id: number;
    created_at: string; // ISO Date format
    updated_at: string; // ISO Date format
};

// ลูกค้า
export type Customer = {
    id: number;
    full_name: string;
    phone?: string;
    email?: string;
    addr?: string;
    created_at: string; // ISO Date format
};

// บิลขายสินค้า
export type Sale = {
    id: number;
    user_id?: number;
    cust_id?: number;
    total: number;
    discount: number;
    note?: string;
    pay_method: string;
    created_at: string; // ISO Date format
};

// รายการสินค้าในบิล
export type SaleItem = {
    id: number;
    sale_id?: number;
    prod_id?: number;
    qty: number;
    u_price: number;
    t_price: number;
};

// ข้อมูลการชำระเงิน
export type Payment = {
    id: number;
    sale_id?: number;
    paid: number;
    change: number;
    pay_method: string;
    created_at: string; // ISO Date format
};
