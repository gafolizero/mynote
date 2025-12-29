import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });

            const token = response.data.data.token;
            const user = response.data.data.user;

            if (!token) {
                return toast.error("Server error: Token not received");
            }

            login(user, token);

            toast.success('Welcome back!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{ 
            maxWidth: '400px', 
            margin: '100px auto', 
            padding: '30px', 
            border: '1px solid #DCD6F7', 
            borderRadius: '12px',
            background: '#F4EEFF',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
            <h2 style={{ color: '#424874', marginBottom: '20px' }}>Login to MyNote</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ color: '#424874', display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ 
                            width: '100%', 
                            padding: '10px', 
                            marginTop: '5px',
                            border: '1px solid #DCD6F7',
                            borderRadius: '8px',
                            background: '#F4EEFF',
                            color: '#424874',
                            outline: 'none'
                        }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ color: '#424874', display: 'block', marginBottom: '5px', fontWeight: '500' }}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ 
                            width: '100%', 
                            padding: '10px', 
                            marginTop: '5px',
                            border: '1px solid #DCD6F7',
                            borderRadius: '8px',
                            background: '#F4EEFF',
                            color: '#424874',
                            outline: 'none'
                        }}
                    />
                </div>
                <button type="submit" style={{ 
                    width: '100%', 
                    padding: '12px', 
                    background: '#DCD6F7', 
                    color: '#424874', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px'
                }}>
                    Login
                </button>
            </form>
            <div style={{ marginTop: '20px', textAlign: 'center', color: '#8B96C7' }}>
                <p>Don't have an account? <Link to="/signup" style={{ color: '#424874', textDecoration: 'none', fontWeight: '500' }}>Sign up here</Link></p>
            </div>
        </div>
    );
};

export default Login;

