import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import CategoryManagement from "./pages/Categories";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import "./app.css";
import SubCategories from "./pages/SubCategories";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Header from "./components/Header";
import Orders from "./pages/Orders";
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/dashboard/categories"
            element={<CategoryManagement />}
          />
          <Route path="/dashboard/subcategories" element={<SubCategories />} />
          <Route path="/dashboard/products" element={<Products />} />
          <Route path="/dashboard/users" element={<Users />} />
          <Route path="/dashboard/orders" element={<Orders />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
