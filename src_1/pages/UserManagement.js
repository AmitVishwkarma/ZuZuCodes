import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        id: '',
        name: '',
        email: ''
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
                body: JSON.stringify(isEditing ? { name, email } : { ...currentUser, password: '12345' })
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
            email: user.email
        });
    }

    // Reset form
    const resetForm = () => {
        setIsEditing(false);
        setCurrentUser({
            id: '',
            name: '',
            email: ''
        });
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="container">
            <ToastContainer />
            <h2>{isEditing ? 'Edit User' : 'Add User'}</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={currentUser.name}
                        onChange={handleChange}
                        placeholder="Enter name"
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={currentUser.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                    />
                </div>
                {!isEditing && (
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={currentUser.password}
                            onChange={handleChange}
                            placeholder="Default: 12345"
                            disabled
                        />
                    </div>
                )}
                <div className="form-buttons">
                    <button type="submit" className="btn-primary">
                        {isEditing ? 'Update User' : 'Add User'}
                    </button>
                    {isEditing && (
                        <button type="button" className="btn-secondary" onClick={resetForm}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <h2>User List</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : users.length === 0 ? (
                <p>No users found</p>
            ) : (
                <table className="table">
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
                                <td>
                                    <button 
                                        className="btn-edit" 
                                        onClick={() => handleEdit(user)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn-delete" 
                                        onClick={() => handleDelete(user._id)}
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

export default UserManagement