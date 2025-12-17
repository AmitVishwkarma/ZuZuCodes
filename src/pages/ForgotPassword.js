import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

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
            if (success) {
                handleSuccess(message);
                setIsOtpSent(true);
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
                <h2>Forgot Password</h2>
                {!isOtpSent ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>
                        <button type="submit" className="auth-button">Send OTP</button>
                        <div className="auth-links">
                            <Link to="/login">Back to Login</Link>
                        </div>
                    </form>
                ) : (
                    <div className="success-message">
                        <p>OTP has been sent to your email. Please check your inbox.</p>
                        <button className="auth-button" onClick={() => navigate('/reset-password', { state: { email } })}>
                            Reset Password
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword