// UserManagement.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './UserManagement.css'; 

// Note: setAuth prop will need to be passed down if this component is used in a route
function UserManagement({ setAuth }) { 
    // --- Navbar State and Functions ---
    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        // You'll need to pass setAuth prop to this component to use it
        // if (setAuth) setAuth(false); 
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }
    // ----------------------------------

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        id: '',
        name: '',
        email: '',
        password: '12345'
    });

    // Fetch all users
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const url = "http://localhost:8000/auth/users";
            const response = await fetch(url, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            // Handle unauthorized/expired token just like in Home.js
            if (response.status === 401 || response.status === 403) {
                handleError('Session expired. Please log in again.');
                handleLogout(); 
                return;
            }
            const result = await response.json();
            if (result.success) {
                setUsers(result.users);
            } else {
                handleError(result.message || 'Failed to fetch users');
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
        setCurrentUser(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // Handle form submission for adding/editing user
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email } = currentUser;
        
        if (!name || !email) {
            return handleError('Name and email are required');
        }
        
        try {
            let url, method;
            if (isEditing) {
                url = `http://localhost:8000/auth/users/${currentUser.id}`;
                method = 'PUT';
            } else {
                url = `http://localhost:8000/auth/signup`;
                method = 'POST';
            }
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify(isEditing ? { name, email } : { ...currentUser, password: currentUser.password || '12345' })
            });
            
            const result = await response.json();
            
            if (result.success) {
                handleSuccess(isEditing ? 'User updated successfully' : 'User added successfully');
                resetForm();
                fetchUsers();
            } else {
                handleError(result.message || 'Operation failed');
            }
        } catch {
            handleError('Something went wrong');
        }
    }

    // Handle user deletion
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        
        try {
            const url = `http://localhost:8000/auth/users/${id}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                handleSuccess('User deleted successfully');
                fetchUsers();
            } else {
                handleError(result.message || 'Failed to delete user');
            }
        } catch {
            handleError('Something went wrong');
        }
    }

    // Set up edit mode
    const handleEdit = (user) => {
        setIsEditing(true);
        setCurrentUser({
            id: user._id,
            name: user.name,
            email: user.email,
            password: '12345'
        });
    }

    // Reset form
    const resetForm = () => {
        setIsEditing(false);
        setCurrentUser({
            id: '',
            name: '',
            email: '',
            password: '12345'
        });
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="user-container">
            <ToastContainer />
            
            {/* --- ADDED NAVBAR START --- */}
            {/* Note: Reusing Home.css classes like navbar, welcome-message, nav-links, logout-btn */}
            <nav className="navbar"> 
                <Link to="/home" className="welcome-message">Welcome **{loggedInUser}**</Link> 
                <div className="nav-links">
                    {/* Highlight the current page */}
                    <Link to="/users" className="nav-link active">Manage Users</Link> 
                    <Link to="/products" className="nav-link">Manage Products</Link>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>
            {/* --- ADDED NAVBAR END --- */}
            
            <h1 className="main-title">User Management</h1>

            <div className="content-wrapper">
                {/* User Form Section */}
                <div className="form-section">
                    <form onSubmit={handleSubmit} className="user-form">
                        <h2 className="form-title">{isEditing ? 'Edit User' : 'Add New User'}</h2>
                        
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={currentUser.name}
                                onChange={handleChange}
                                placeholder="Enter user's name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={currentUser.email}
                                onChange={handleChange}
                                placeholder="Enter user's email"
                            />
                        </div>
                        
                        {!isEditing && (
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="text"
                                    name="password"
                                    value="12345" 
                                    placeholder="Default: 12345"
                                    disabled
                                />
                            </div>
                        )}
                        
                        <div className="form-buttons">
                            <button type="submit" className={`btn ${isEditing ? 'btn-update' : 'btn-add'}`}>
                                {isEditing ? 'Update User' : 'Add User'}
                            </button>
                            {isEditing && (
                                <button type="button" className="btn btn-cancel" onClick={resetForm}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* User List Section */}
                <div className="list-section">
                    <h2 className="list-title">Registered Users</h2>
                    {isLoading ? (
                        <p className="loading-message">Loading Users...</p>
                    ) : users.length === 0 ? (
                        <p className="no-users">No registered users found.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td className="action-buttons">
                                                <button 
                                                    className="btn-action btn-edit" 
                                                    onClick={() => handleEdit(user)}
                                                    disabled={isEditing && currentUser.id === user._id}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn-action btn-delete" 
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserManagement