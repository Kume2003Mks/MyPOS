import { Outlet } from "react-router";
import Styles from "./Layout.module.scss";
import Navigation from "../components/Navigation/Navigation";

const Layout = () => {
    return (
        <main className={Styles.layout}>
            <Navigation />
            <section className={Styles.content}>
                <Outlet />
            </section>
        </main>
    );
};

export default Layout;