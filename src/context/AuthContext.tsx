import { createContext, useState, useEffect, ReactNode, useRef, useCallback, useMemo } from 'react';
import { CreateUserDto } from '../types/dto';
import { UserController } from '../lib/UserController';
import { User } from '../types/type';

// กำหนดประเภทของ Context
interface AuthContextType {
    user: User | null;
    isLoggedIn: () => boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (userData: CreateUserDto) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    
    // ใช้ useRef เพื่อเก็บ instance เดียวของ UserController ตลอดการทำงาน
    const userController = useRef(new UserController()).current;

    useEffect(() => {
        let isMounted = true;

        const checkInitialAuth = async () => {
            try {

                // ตรวจสอบ sessionStorage สำหรับผู้ใช้ที่ล็อกอินอยู่
                const storedUser = sessionStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser) as User;
                    if (isMounted) setUser(parsedUser);
                }
            } catch (error) {
                console.error('ข้อผิดพลาดในการตรวจสอบสถานะล็อกอิน:', error);
                sessionStorage.removeItem('user');
            }
        };

        checkInitialAuth();
        return () => { isMounted = false; }; // ป้องกันการอัปเดต state เมื่อ component ถูกลบออก
    }, [userController]);

    // ฟังก์ชันล็อกอิน (ใช้ useCallback เพื่อป้องกันการสร้างฟังก์ชันใหม่ทุกครั้งที่เรนเดอร์)
    const login = useCallback(async (username: string, password: string): Promise<boolean> => {
        try {

            const isLoginSuccess = await userController.login(username, password);
            if (!isLoginSuccess) return false;

            const loggedInUser = userController.getLoggedInUser();
            if (!loggedInUser) {
                console.error('ล็อกอินไม่สำเร็จ: ไม่พบข้อมูลผู้ใช้');
                return false;
            }

            setUser(loggedInUser);
            sessionStorage.setItem('user', JSON.stringify(loggedInUser));
            return true;
        } catch (error) {
            console.error('ข้อผิดพลาดในการล็อกอิน:', error);
            return false;
        }
    }, [userController]);

    // ฟังก์ชันล็อกเอาท์
    const logout = useCallback(() => {

        userController.logout();
        setUser(null);

    }, []);

    // ฟังก์ชันสมัครสมาชิก
    const register = useCallback(async (userData: CreateUserDto): Promise<boolean> => {
        try {
            const isRegisterSuccess = await userController.register(userData);
            return isRegisterSuccess; // อัปเดตสถานะเมื่อมีผู้ใช้ในระบบ
        } catch (error) {
            console.error('ข้อผิดพลาดในการสมัครสมาชิก:', error);
            return false;
        }
    }, [userController]);

    const isLoggedIn = useCallback(() => {
        try {
            const isLoggedIn = userController.isLoggedIn();
            return isLoggedIn;
        } catch (error) {
            console.error('ข้อผิดพลาดในการตรวจสอบสถานะล็อกอิน:', error);
            return false;
        }
    }, [userController]);

    // Memoize ค่า context เพื่อป้องกันการเรนเดอร์ที่ไม่จำเป็น
    const contextValue = useMemo(() => ({
        user,
        isLoggedIn, // หาสถานะล็อกอินจาก user object
        login,
        logout,
        register,
    }), [user, login, logout, register]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};