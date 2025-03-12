import { BrowserRouter as Router, Routes, Route ,Navigate } from "react-router-dom";

import Dashboard from './pages/Dashboard'
import CategoryManagement from "./pages/Categories"
import PrivateRoute from './components/PrivateRoute'
import Login from "./pages/Login";
import './app.css'
function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

          
            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/categories" element={<CategoryManagement />} />
            </Route>

          
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default App;
