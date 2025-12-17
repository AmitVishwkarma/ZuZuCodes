import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './ResetPassword.css'; 

function ResetPassword() {
    const [resetInfo, setResetInfo] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResetInfo(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, otp, newPassword, confirmPassword } = resetInfo;
        
        if (!email || !otp || !newPassword || !confirmPassword) {
            return handleError('All fields are required');
        }
        
        if (newPassword !== confirmPassword) {
            return handleError('Passwords do not match');
        }
        
        try {
            const url = `http://localhost:8000/auth/reset-password`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    otp,
                    newPassword
                })
            });
            const result = await response.json();
            const { success, message, error } = result;
            
            if (response.ok && success) {
                handleSuccess(message || 'Password reset successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details || 'Validation error');
            } else {
                handleError(message || 'Failed to reset password. Check your OTP and email.');
            }
        } catch {
            handleError('Something went wrong. Please try again later.');
        }
    }

    return (
        <div className="auth-container">
            <ToastContainer />
            <div className="auth-card">
                <h2 className="auth-title">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label className="auth-label">Email</label>
                        <input
                            className="auth-input" 
                            type="email"
                            name="email"
                            value={resetInfo.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="auth-label">OTP</label>
                        <input
                            className="auth-input" 
                            type="text"
                            name="otp"
                            value={resetInfo.otp}
                            onChange={handleChange}
                            placeholder="Enter OTP received in email"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="auth-label">New Password</label>
                        <input
                            className="auth-input" 
                            type="password"
                            name="newPassword"
                            value={resetInfo.newPassword}
                            onChange={handleChange}
                            placeholder="Enter new password"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="auth-label">Confirm Password</label>
                        <input
                            className="auth-input"
                            type="password"
                            name="confirmPassword"
                            value={resetInfo.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                        />
                    </div>
                    
                    <button type="submit" className="auth-button btn-primary">Reset Password</button>
                    
                    <div className="auth-links">
                        <Link to="/login" className="auth-link">Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword