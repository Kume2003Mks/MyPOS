// DTO สำหรับหมวดหมู่สินค้า
export type CreateCategoryDto = {
    name: string;
    description?: string;
};

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

// DTO สำหรับสินค้า
export type CreateProductDto = {
    name: string;
    description?: string;
    cat_id?: number;
    barcode?: string;
    c_price: number;
    s_price: number;
    qty?: number;
    img_path?: string;
    r_status?: 'active' | 'inactive';
};

export type UpdateProductDto = Partial<CreateProductDto>;

// DTO สำหรับสิทธิ์การใช้งาน
export type CreateRoleDto = {
    name: string;
    description?: string;
};

export type UpdateRoleDto = Partial<CreateRoleDto>;

// DTO สำหรับผู้ใช้งาน
export type CreateUserDto = {
    username: string;
    password: string;
    full_name: string;
    role_id?: number;
};

export type UpdateUserDto = Partial<CreateUserDto>;

// DTO สำหรับลูกค้า
export type CreateCustomerDto = {
    full_name: string;
    phone?: string;
    email?: string;
    addr?: string;
};

export type UpdateCustomerDto = Partial<CreateCustomerDto>;

// DTO สำหรับบิลขายสินค้า
export type CreateSaleDto = {
    user_id?: number;
    cust_id?: number;
    total: number;
    discount?: number;
    note?: string;
    pay_method: string;
};

export type UpdateSaleDto = Partial<CreateSaleDto>;

// DTO สำหรับรายการสินค้าในบิล
export type CreateSaleItemDto = {
    sale_id: number;
    prod_id: number;
    qty: number;
    u_price: number;
    t_price: number;
};

export type UpdateSaleItemDto = Partial<CreateSaleItemDto>;

// DTO สำหรับข้อมูลการชำระเงิน
export type CreatePaymentDto = {
    sale_id: number;
    paid: number;
    change: number;
    pay_method: string;
};

export type UpdatePaymentDto = Partial<CreatePaymentDto>;
