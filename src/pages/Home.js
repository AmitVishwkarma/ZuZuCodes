import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Home({ setAuth }) {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    
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
            const result = await response.json();
            console.log(result);
            setProducts(result);
        } catch (err) {
            handleError(err);
        }
    }
    
    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <div>
            <ToastContainer />
            <nav className="navbar">
                <h1>Welcome {loggedInUser}</h1>
                <div className="nav-links">
                    <Link to="/users" className="nav-link">Manage Users</Link>
                    <Link to="/products" className="nav-link">Manage Products</Link>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>
            
            <div className="product-list">
                <h2>Products</h2>
                <div className="products">
                    {Array.isArray(products) && products.length > 0 ? (
                        products.map((item, index) => (
                            <div key={index} className="product-card">
                                <h3>{item.name}</h3>
                                <p>{item.description || 'No description available'}</p>
                                <p className="price">Price: ${item.price}</p>
                            </div>
                        ))
                    ) : (
                        <p>No products available</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home