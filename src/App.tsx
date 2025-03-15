import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";

import Product from "./pages/Products";
import NotFound from "./pages/NotFound";
import Layout from "./Layout/Layout";
import Sale from "./pages/Sale";
import History from "./pages/History";
import Setting from "./pages/Setting";
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="/sales" element={<Sale />} />
          <Route path="/products" element={<Product />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Setting />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
