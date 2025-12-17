import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import UserManagement from './pages/UserManagement.jsx';
import ProductManagement from './pages/ProductManagement.jsx';
import Toast from './components/Toast.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  return (
    <div className="App">
      <Toast />
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/home"
            element={isAuthenticated ? <Home setAuth={setAuth} /> : <Navigate to="/login" />}
          />
          <Route
            path="/users"
            element={isAuthenticated ? <UserManagement /> : <Navigate to="/login" />}
          />
          <Route
            path="/products"
            element={isAuthenticated ? <ProductManagement /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App
