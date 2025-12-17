// ForgotPassword.js
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './ForgotPassword.css'; // Import the new Auth CSS file

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            return handleError('Email is required');
        }
        try {
            const url = `http://localhost:8000/auth/forgot-password`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            const result = await response.json();
            const { success, message, error } = result;
            
            if (response.ok && success) {
                handleSuccess(message || 'OTP sent successfully!');
                setIsOtpSent(true);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details || 'Validation error');
            } else {
                handleError(message || 'Failed to send OTP. User not found or server error.');
            }
        } catch {
            handleError('Something went wrong. Please try again later.');
        }
    }

    return (
        // Use auth-container for full screen dark background
        <div className="auth-container">
            <ToastContainer />
            {/* auth-card for the interactive, centered form box */}
            <div className="auth-card">
                <h2 className="auth-title">Forgot Password</h2>
                
                {!isOtpSent ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="auth-label">Email</label>
                            <input
                                className="auth-input"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your registered email"
                            />
                        </div>
                        {/* Interactive button */}
                        <button type="submit" className="auth-button btn-primary">Send OTP</button>
                        
                        <div className="auth-links">
                            {/* Interactive link */}
                            <Link to="/login" className="auth-link">Back to Login</Link>
                        </div>
                    </form>
                ) : (
                    <div className="success-message">
                        <p>✅ OTP has been sent to **{email}**. Please check your inbox to continue.</p>
                        {/* Interactive link button */}
                        <Link to="/reset-password" className="auth-button btn-success">
                            Go to Reset Password
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword