import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Role } from '../types/type';
import { UserController } from '../lib/UserController';
import { useAuth } from '../hooks/useAuth';

import PageStyle from '../assets/styles/page.module.scss';
import FormStyle from '../assets/styles/form.module.scss';

const Register: React.FC = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        password: '',
        confirmPassword: '',
        role_id: 1, // Default role: User
    });

    const [roles, setRoles] = useState<Role[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasUsers, setHasUsers] = useState(false);

    // ดึงข้อมูลบทบาทจาก API
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const controller = new UserController();
                const roles = await controller.getRoles();
                const hasUsers = await controller.hasUsers();
                setHasUsers(hasUsers);
                setRoles(roles);
            } catch (err) {
                console.error('Failed to fetch roles:', err);
            }
        };
        fetchRoles();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setError('');

        try {
            const success = await register({
                username: formData.username,
                password: formData.password,
                full_name: formData.full_name,
                role_id: Number(formData.role_id),
            });

            if (success) {
                if (!hasUsers) navigate('/login');
                else navigate('/');
            } else {
                setError('ชื่อผู้ใช้นี้ถูกใช้งานแล้ว');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการสมัครสมาชิก');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={PageStyle["page-auth-container"]}>
        <section className={FormStyle["auth-container"]}>
            <h2>{hasUsers ? 'เพิ่มผู้ใช้' : 'สร้างผู้ดูแลระบบ'}</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className={FormStyle["auth-form"]}>

                <div className={FormStyle["form-group"]}>
                    <label>ชื่อผู้ใช้</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={FormStyle["form-group"]}>
                    <label>ชื่อเต็ม</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={FormStyle["form-group"]}>
                    <label>รหัสผ่าน</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={FormStyle["form-group"]}>
                    <label>ยืนยันรหัสผ่าน</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                {roles.length > 0 && (
                    <div className={FormStyle["form-group"]}>
                        <label>บทบาท</label>
                        <select
                            name="role_id"
                            value={formData.role_id}
                            onChange={handleChange}
                            disabled={!hasUsers}
                        >
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={isLoading ? 'loading' : ''}
                >
                    {isLoading ? 'กำลังดำเนินการ...' : 'สมัครสมาชิก'}
                </button>
            </form>
            {hasUsers && <Link to='/'>ย้อนกลับ</Link>}
            
        </section>
        </main>
    );
};

export default Register;