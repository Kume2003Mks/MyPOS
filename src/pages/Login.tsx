import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import { UserController } from '../lib/UserController';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUsers, setHasUsers] = useState(false);

  useEffect(() => {
    const checkUsers = async () => {
      try {
        const controller = new UserController();
        const hasUsers = await controller.hasUsers();
        setHasUsers(hasUsers);
      } catch (err) {
        console.error('Failed to check users:', err);
      }
    };
    checkUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const isSuccess = await login(formData.username, formData.password);

      if (isSuccess) {
        navigate('/'); // ไปหน้าหลักหลังล็อกอินสำเร็จ
      } else {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการล็อกอิน');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>เข้าสู่ระบบ</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>อีเมล:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>รหัสผ่าน:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={isLoading ? 'loading' : ''}
        >
          {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>

      {!hasUsers &&
        <div className="register-link">
          ยังไม่มีบัญชี? <a href="/registor">สมัครสมาชิก</a>
        </div>
      }

    </div>
  );
};

export default Login;