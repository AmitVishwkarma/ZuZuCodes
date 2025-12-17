// Home.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import './Home.css'; // Don't forget to import the CSS file!

function Home({ setAuth }) {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    
    // Fetch logged-in user on mount
    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setAuth(false);
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }

    const fetchProducts = async () => {
        try {
            const url = "http://localhost:8000/products";
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await fetch(url, headers);
            // Check for unauthorized access, etc.
            if (response.status === 401 || response.status === 403) {
                handleError('Session expired. Please log in again.');
                handleLogout(); // Automatically log out on token error
                return;
            }
            const result = await response.json();
            console.log(result);
            setProducts(result);
        } catch (err) {
            handleError('Failed to fetch products.');
            console.error(err);
        }
    }
    
    // Fetch products on mount
    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <div className="home-container">
            <ToastContainer />
            <nav className="navbar">
                <span className="welcome-message">Welcome **{loggedInUser}**</span>
                <div className="nav-links">
                    <Link to="/users" className="nav-link">Manage Users</Link>
                    <Link to="/products" className="nav-link">Manage Products</Link>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>
            
            <div className="content-area">
                <h2 className="product-title">Products</h2>
                <div className="products-grid">
                    {/* Interactive part: Displaying product cards */}
                    {Array.isArray(products) && products.length > 0 ? (
                        products.map((item, index) => (
                            <div key={index} className="product-card">
                                <h3>{item.name}</h3>
                                <p className="description">{item.description || 'No description available'}</p>
                                <p className="price">Price: **${item.price}**</p>
                                {/* Optional: Add an interactive button to buy/view product */}
                                <button className="view-product-btn">View Details</button>
                            </div>
                        ))
                    ) : (
                        <p className="no-products-message">No products available</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home;