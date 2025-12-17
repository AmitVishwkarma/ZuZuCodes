import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        id: '',
        name: '',
        description: '',
        price: ''
    });

    // Fetch all products
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const url = "http://localhost:8000/products";
            const response = await fetch(url);
            const result = await response.json();
            if (result.success) {
                setProducts(result.products);
            } else {
                setProducts(result); // Fallback for current API structure
            }
        } catch {
            handleError('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // Handle form submission for adding/editing product
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, description, price } = currentProduct;
        
        if (!name || !description || !price) {
            return handleError('All fields are required');
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
            
            if (result.success) {
                handleSuccess(isEditing ? 'Product updated successfully' : 'Product added successfully');
                resetForm();
                fetchProducts();
            } else {
                handleError(result.message || 'Operation failed');
            }
        } catch {
            handleError('Something went wrong');
        }
    }

    // Handle product deletion
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
            
            if (result.success) {
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
        <div className="container">
            <ToastContainer />
            <h2>{isEditing ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="form">
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
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={currentProduct.price}
                        onChange={handleChange}
                        placeholder="Enter product price"
                    />
                </div>
                <div className="form-buttons">
                    <button type="submit" className="btn-primary">
                        {isEditing ? 'Update Product' : 'Add Product'}
                    </button>
                    {isEditing && (
                        <button type="button" className="btn-secondary" onClick={resetForm}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <h2>Product List</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : products.length === 0 ? (
                <p>No products found</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(products) && products.map(product => (
                            <tr key={product._id || product.id}>
                                <td>{product.name}</td>
                                <td>{product.description || '-'}</td>
                                <td>${product.price}</td>
                                <td>
                                    <button 
                                        className="btn-edit" 
                                        onClick={() => handleEdit(product)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn-delete" 
                                        onClick={() => handleDelete(product._id || product.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default ProductManagement