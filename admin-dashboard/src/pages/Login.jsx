
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import coverImage from '../assets/coverImage.png'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/admin/login', { email, password });
    
            console.log("Login response:", response.data); // Debugging
    
            if (response.data.token) {
                localStorage.setItem('adminToken', response.data.token);
                navigate('/dashboard');
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            alert(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };
    

    return (
        <div className="login-page" style={{
            backgroundImage: `url(${coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="login-popup">
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="text" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
