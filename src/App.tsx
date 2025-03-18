import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home";

import Product from "./pages/Products";
import NotFound from "./pages/NotFound";
import Layout from "./Layout/Layout";
import Sale from "./pages/Sale";
import History from "./pages/History";
import Setting from "./pages/Setting";
import Registor from "./pages/Registor";
import Login from "./pages/Login";
import { useAuth } from "./hooks/useAuth";

// App component that wraps all routes in the Layout component.
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        } >
          <Route index element={<Home />} />
          <Route path="/sales" element={<Sale />} />
          <Route path="/products" element={<Product />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Setting />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/registor" element={<Registor />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  const loggedInUser = isLoggedIn();

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default App;
