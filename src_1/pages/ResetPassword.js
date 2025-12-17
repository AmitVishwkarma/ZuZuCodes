import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

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
            
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
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
        <div className="auth-container">
            <ToastContainer />
            <div className="auth-form">
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={resetInfo.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label>OTP</label>
                        <input
                            type="text"
                            name="otp"
                            value={resetInfo.otp}
                            onChange={handleChange}
                            placeholder="Enter OTP received in email"
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={resetInfo.newPassword}
                            onChange={handleChange}
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={resetInfo.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                        />
                    </div>
                    <button type="submit" className="auth-button">Reset Password</button>
                    <div className="auth-links">
                        <Link to="/login">Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword