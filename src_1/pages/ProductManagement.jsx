import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './ProductManagement.css'; 

function ProductManagement({ setAuth }) {
    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }
    // ----------------------------------
    
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        id: '',
        name: '',
        description: '',
        price: ''
    });

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const url = "http://localhost:8000/products";
            const response = await fetch(url, {
                headers: {
                    'Authorization': localStorage.getItem('token') 
                }
            });
            if (response.status === 401 || response.status === 403) {
                handleError('Session expired. Please log in again.');
                handleLogout(); 
                return;
            }
            const result = await response.json();
            
            const productList = Array.isArray(result) ? result : (result.products || []);
            setProducts(productList);

        } catch (err) {
            handleError('Failed to fetch products. Check API status.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, description, price } = currentProduct;

        if (!name || !description || !price) {
            return handleError('All fields are required');
        }
        
        if (isNaN(Number(price)) || Number(price) <= 0) {
            return handleError('Price must be a valid positive number');
        }

        try {
            let url, method;
            if (isEditing) {
                url = `http://localhost:8000/products/${currentProduct.id}`;
                method = 'PUT';
            } else {
                url = `http://localhost:8000/products`;
                method = 'POST';
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ name, description, price: Number(price) })
            });

            const result = await response.json();

            if (response.ok && result.success) { 
                handleSuccess(isEditing ? 'Product updated successfully' : 'Product added successfully');
                resetForm();
                fetchProducts();
            } else {
                handleError(result.message || 'Operation failed');
            }
        } catch {
            handleError('Something went wrong during product operation');
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const url = `http://localhost:8000/products/${id}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });

            const result = await response.json();

            if (response.ok && result.success) {
                handleSuccess('Product deleted successfully');
                fetchProducts();
            } else {
                handleError(result.message || 'Failed to delete product');
            }
        } catch {
            handleError('Something went wrong');
        }
    }

    // Set up edit mode
    const handleEdit = (product) => {
        setIsEditing(true);
        setCurrentProduct({
            id: product._id,
            name: product.name,
            description: product.description || '',
            price: product.price
        });
    }

    // Reset form
    const resetForm = () => {
        setIsEditing(false);
        setCurrentProduct({
            id: '',
            name: '',
            description: '',
            price: ''
        });
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="product-container">
            <ToastContainer />

            <nav className="navbar"> 
                <Link to="/home" className="welcome-message">Welcome **{loggedInUser}**</Link> 
                <div className="nav-links">
                    <Link to="/users" className="nav-link">Manage Users</Link> 
                    <Link to="/products" className="nav-link active">Manage Products</Link>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>
            {/* -------------------------- */}

            <h1 className="main-title">Product Management</h1>

            <div className="content-wrapper">
                <div className="form-section">
                    <form onSubmit={handleSubmit} className="product-form">
                        <h2 className="form-title">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>

                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={currentProduct.name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={currentProduct.description}
                                onChange={handleChange}
                                placeholder="Enter product description"
                                rows="4"
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label>Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={currentProduct.price}
                                onChange={handleChange}
                                placeholder="Enter product price"
                                step="0.01"
                            />
                        </div>
                        
                        <div className="form-buttons">
                            <button type="submit" className={`btn ${isEditing ? 'btn-update' : 'btn-add'}`}>
                                {isEditing ? 'Update Product' : 'Add Product'}
                            </button>
                            {isEditing && (
                                <button type="button" className="btn btn-cancel" onClick={resetForm}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Product List Section */}
                <div className="list-section">
                    <h2 className="list-title">Existing Products</h2>
                    {isLoading ? (
                        <p className="loading-message">Loading Products...</p>
                    ) : (Array.isArray(products) && products.length > 0) ? (
                        <div className="table-responsive">
                            <table className="product-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product._id}>
                                            <td>{product.name}</td>
                                            <td>₹{product.price}</td>
                                            <td>{product.description}</td>
                                            <td className="action-buttons">
                                                <button 
                                                    className="btn-action btn-edit" 
                                                    onClick={() => handleEdit(product)}
                                                    disabled={isEditing && currentProduct.id === product._id}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn-action btn-delete" 
                                                    onClick={() => handleDelete(product._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="no-products">No products found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductManagement;