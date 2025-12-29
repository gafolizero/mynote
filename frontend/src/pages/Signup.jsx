import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }

        if (password.length < 8) {
            return toast.error('Password must be at least 8 characters');
        }

        if (username.length < 3) {
            return toast.error('Username must be at least 3 characters');
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/signup', { 
                username, 
                email, 
                password 
            });

            const token = response.data.data.token;
            const user = response.data.data.user;

            if (!token) {
                return toast.error("Server error: Token not received");
            }

            login(user, token);

            toast.success('Account created successfully! Welcome!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        marginTop: '5px',
        boxSizing: 'border-box',
        border: '1px solid #DCD6F7',
        borderRadius: '8px',
        background: '#F4EEFF',
        color: '#424874',
        outline: 'none'
    };

    const labelStyle = {
        color: '#424874',
        display: 'block',
        marginBottom: '5px',
        fontWeight: '500'
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
            <h2 style={{ color: '#424874', marginBottom: '10px' }}>Create Account</h2>
            <p style={{ color: '#8B96C7', marginBottom: '20px' }}>Join MyNote to start organizing your notes</p>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength={3}
                        maxLength={50}
                        style={inputStyle}
                        placeholder="Enter your username"
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                        placeholder="Enter your email"
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        style={inputStyle}
                        placeholder="At least 8 characters"
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={inputStyle}
                        placeholder="Confirm your password"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        width: '100%', 
                        padding: '12px', 
                        background: loading ? '#A6B1E1' : '#DCD6F7', 
                        color: '#424874', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                    }}
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
            <div style={{ marginTop: '20px', textAlign: 'center', color: '#8B96C7' }}>
                <p>Already have an account? <Link to="/login" style={{ color: '#424874', textDecoration: 'none', fontWeight: '500' }}>Login here</Link></p>
            </div>
        </div>
    );
};

export default Signup;
