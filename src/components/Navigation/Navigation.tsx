import { NavLink } from "react-router";
import { FaTachometerAlt, FaShoppingCart, FaBox, FaCog, FaHistory } from "react-icons/fa";
import Styles from "./Navigation.module.scss";

//create data object for navigation
const navItems = [
    { to: "/", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/sales", label: "Sales", icon: <FaShoppingCart /> },
    { to: "/products", label: "Products", icon: <FaBox /> },
    { to: "/history", label: "History", icon: <FaHistory /> },
    //{ to: "/customers", label: "Customers", icon: <FaUsers /> },
    { to: "/settings", label: "Settings", icon: <FaCog /> },
];

const Navigation = () => {
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
        </nav>
    );
}

export default Navigation;
