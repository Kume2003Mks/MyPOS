import Database from "@tauri-apps/plugin-sql";
import { invoke } from "@tauri-apps/api/core";
import { Role, User } from "../types/type";
import { CreateUserDto, UpdateUserDto } from "../types/dto";

export class UserController {
    private db: Database | null = null;

    constructor() {
        this.initDB();
    }

    private async initDB() {
        if (!this.db) {
            this.db = await Database.load("sqlite:database.db");
        }
    }

    // **สมัครสมาชิก (Register)**
    async register(userData: CreateUserDto): Promise<boolean> {
        await this.initDB();
        try {
            const { username, password, full_name, role_id } = userData;

            // ตรวจสอบว่ามี username ซ้ำหรือไม่
            const existingUser = await this.db!.select<{ count: number }[]>(
                "SELECT COUNT(*) as count FROM users WHERE username = ?",
                [username]
            );

            if (existingUser[0]?.count > 0) {
                console.error("Username already exists.");
                return false;
            }

            // เข้ารหัสรหัสผ่าน
            const hashedPassword = await invoke<string>('hash_password', {
                password,
                cost: 10
            });

            // เพิ่มผู้ใช้ใหม่
            await this.db!.execute(
                "INSERT INTO users (username, password, full_name, role_id) VALUES (?, ?, ?, ?)",
                [username, hashedPassword, full_name, role_id]
            );
            console.log("Register Success");
            return true;
        } catch (err) {
            console.error("Error registering user:", err);
            return false;
        }
    }

    // **เข้าสู่ระบบ (Login)**
    async login(username: string, password: string): Promise<boolean> {
        await this.initDB();
        try {
            const users = await this.db!.select<User[]>(
                "SELECT * FROM users WHERE username = ?",
                [username]
            );

            if (users.length === 0) {
                return false; // ไม่พบผู้ใช้
            }

            const user = users[0];

            // เรียกใช้ Tauri command สำหรับตรวจสอบรหัสผ่าน
            const isPasswordValid = await invoke<boolean>('verify_password', {
                password,
                hash: user.password
            });

            if (!isPasswordValid) {
                return false;
            }

            // เก็บข้อมูล user ลงใน Session Storage
            sessionStorage.setItem("user", JSON.stringify({
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                role_id: user.role_id
            }));


            return true;
        } catch (err) {
            console.error("Error logging in:", err);
            return false;
        }
    }

    // **ออกจากระบบ (Logout)**
    logout(): void {
        sessionStorage.removeItem("user");
    }

    // **เช็คสถานะการล็อกอิน**
    isLoggedIn(): boolean {
        return sessionStorage.getItem("user") !== null;
    }

    // **ดึงข้อมูลผู้ใช้จาก Session Storage**
    getLoggedInUser(): User | null {
        const userData = sessionStorage.getItem("user");
        return userData ? JSON.parse(userData) : null;
    }

    // **อัปเดตข้อมูลผู้ใช้**
    async updateUser(userId: number, updateData: UpdateUserDto): Promise<boolean> {
        await this.initDB();

        try {
            // ตรวจสอบว่า user มีอยู่หรือไม่
            const existingUser = await this.db!.select<{ count: number }[]>(
                "SELECT COUNT(*) as count FROM users WHERE id = ?",
                [userId]
            );

            if (existingUser[0]?.count === 0) {
                console.error("User not found.");
                return false; // ไม่มี user
            }

            const fields: string[] = [];
            const values: any[] = [];

            // ตรวจสอบ username ซ้ำ
            if (updateData.username) {
                const usernameCheck = await this.db!.select<{ count: number }[]>(
                    "SELECT COUNT(*) as count FROM users WHERE username = ? AND id != ?",
                    [updateData.username, userId]
                );

                if (usernameCheck[0]?.count > 0) {
                    console.error("Username already taken.");
                    return false;
                }

                fields.push("username = ?");
                values.push(updateData.username);
            }

            if (updateData.full_name) {
                fields.push("full_name = ?");
                values.push(updateData.full_name);
            }

            if (updateData.role_id !== undefined) {
                fields.push("role_id = ?");
                values.push(updateData.role_id);
            }

            // เข้ารหัสรหัสผ่านหากมีการส่งมา
            if (updateData.password !== undefined) {
                try {
                    const password = updateData.password;
                    const hashedPassword = await invoke<string>('hash_password', {
                        password,
                        cost: 10
                    });
                    fields.push("password = ?");
                    values.push(hashedPassword);
                } catch (err) {
                    console.error("Error hashing password:", err);
                    return false;
                }
            }

            if (fields.length === 0) {
                console.error("No fields to update.");
                return false;
            }

            values.push(userId);

            // อัปเดตข้อมูล
            await this.db!.execute(
                `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
                values
            );

            return true;
        } catch (err) {
            console.error("Error updating user:", err);
            return false;
        }
    }

    // **ลบผู้ใช้**
    async deleteUser(userId: number): Promise<boolean> {
        await this.initDB();
        try {
            await this.db!.execute("DELETE FROM users WHERE id = ?", [userId]);
            return true;
        } catch (err) {
            console.error("Error deleting user:", err);
            return false;
        }
    }

    async hasUsers(): Promise<boolean> {
        await this.initDB();
        try {
            const result = await this.db!.select<{ count: number }[]>(
                "SELECT COUNT(*) as count FROM users"
            );
            return result[0]?.count > 0;
        } catch (err) {
            console.error("Error checking users:", err);
            throw new Error("Failed to check users.");
        }
    }

    async getRoles(): Promise<Role[]> {
        await this.initDB();
        try {
            return await this.db!.select("SELECT * FROM roles");
        } catch (err) {
            console.error("Error fetching roles:", err);
            throw new Error("Failed to fetch roles.");
        }
    }
}
