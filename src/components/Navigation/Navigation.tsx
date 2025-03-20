import { NavLink } from "react-router";
import { FaTachometerAlt, FaShoppingCart, FaBox, FaCog, FaHistory, FaSignOutAlt } from "react-icons/fa";
import Styles from "./Navigation.module.scss";
import { useAuth } from "../../hooks/useAuth";

//create data object for navigation
const navItems = [
    { to: "/", label: "สรุป", icon: <FaTachometerAlt /> },
    { to: "/sales", label: "ขายสินค้า", icon: <FaShoppingCart /> },
    { to: "/products", label: "รายการสินค้า", icon: <FaBox /> },
    { to: "/history", label: "ประวัติ", icon: <FaHistory /> },
    //{ to: "/customers", label: "Customers", icon: <FaUsers /> },
    { to: "/settings", label: "ตั้งค่าระบบ", icon: <FaCog /> },
];

const Navigation = () => {

    const { logout } = useAuth();

    return (
        <nav className={Styles.sidebar}>
            <h1>POS System</h1>
            <ul>
                {navItems.map((item, index) => (
                    <li key={index}>
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                isActive ? Styles.activeLink : undefined
                            }
                        >
                            {item.icon} {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
            <button onClick={logout}>
                <FaSignOutAlt />
                <p>
                    ออกจากระบบ
                </p>
            </button>
        </nav>
    );
}

export default Navigation;
