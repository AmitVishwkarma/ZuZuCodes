// Login.js
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './Login.css'; // Don't forget to import the CSS file!

function Login({ setAuth }) {

    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('Email and password are required')
        }
        try {
            const url = `http://localhost:8000/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, token, user, error } = result;
            if (success) {
                handleSuccess(message);
                setAuth(true);
                localStorage.setItem('token', token);
                // Assuming user object has a name property
                localStorage.setItem('loggedInUser', user.name); 
                setTimeout(() => {
                    navigate('/home')
                }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
        } catch {
            handleError('Something went wrong');
        }
    }

    return (
        <div className='login-container'>
            <ToastContainer />
            <div className='login-card'> {/* Changed to login-card for better styling */}
                <h1 className='login-title'>Welcome Back!</h1>
                <form onSubmit={handleLogin} className='login-form'>
                    <div className='form-group'>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={loginInfo.email}
                            onChange={handleChange}
                            placeholder="ram@example.com"
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={loginInfo.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className='login-btn'>Login</button>
                </form>
                <div className="auth-links">
                    <Link to="/forgot-password" className='forgot-link'>Forgot Password?</Link>
                    <p className='signup-text'>
                        Don't have an account? 
                        <Link to="/signup" className='signup-link'> Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login