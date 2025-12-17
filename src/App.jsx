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
import Header from './test/Header.jsx';
import Hero from './test/Hero.jsx';
import Slider from './test/Slider.jsx';
import Card from './test/Card.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  return (
    <div className="App">
      <Header/>
      <Hero />
      <Slider />
      <Card />

    </div>
  );
}

export default App
