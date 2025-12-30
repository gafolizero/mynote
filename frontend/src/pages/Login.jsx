import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: null }));
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const response = await api.post('/auth/login', {
                email: email.trim(),
                password
            });

            const token = response.data.data.token;
            const user = response.data.data.user;

            if (!token) {
                toast.error("Server error: Token not received");
                setLoading(false);
                return;
            }

            login(user, token);
            toast.success('Welcome back!');
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials and try again.';
            toast.error(errorMessage);

            if (error.response?.data?.message) {
                const message = error.response.data.message.toLowerCase();
                if (message.includes('email')) {
                    setErrors(prev => ({ ...prev, email: error.response.data.message }));
                } else if (message.includes('password')) {
                    setErrors(prev => ({ ...prev, password: error.response.data.message }));
                }
            }
        } finally {
            setLoading(false);
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
                        onChange={handleEmailChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginTop: '5px',
                            border: errors.email ? '1px solid #e74c3c' : '1px solid #DCD6F7',
                            borderRadius: '8px',
                            background: '#F4EEFF',
                            color: '#424874',
                            outline: 'none'
                        }}
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <p style={{ color: '#e74c3c', fontSize: '0.75rem', marginTop: '4px', marginBottom: 0 }}>
                            {errors.email}
                        </p>
                    )}
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ color: '#424874', display: 'block', marginBottom: '5px', fontWeight: '500' }}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginTop: '5px',
                            border: errors.password ? '1px solid #e74c3c' : '1px solid #DCD6F7',
                            borderRadius: '8px',
                            background: '#F4EEFF',
                            color: '#424874',
                            outline: 'none'
                        }}
                        placeholder="Enter your password"
                    />
                    {errors.password && (
                        <p style={{ color: '#e74c3c', fontSize: '0.75rem', marginTop: '4px', marginBottom: 0 }}>
                            {errors.password}
                        </p>
                    )}
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
                        fontWeight: '600',
                        fontSize: '16px',
                        transition: 'all 0.2s'
                    }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <div style={{ marginTop: '20px', textAlign: 'center', color: '#8B96C7' }}>
                <p>Don't have an account? <Link to="/signup" style={{ color: '#424874', textDecoration: 'none', fontWeight: '500' }}>Sign up here</Link></p>
            </div>
        </div>
    );
};

export default Login;

