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
    const [errors, setErrors] = useState({});
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        const trimmedUsername = username.trim();
        if (!trimmedUsername) {
            newErrors.username = 'Username is required';
        } else if (trimmedUsername.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (trimmedUsername.length > 50) {
            newErrors.username = 'Username must not exceed 50 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        if (errors.username) {
            setErrors(prev => ({ ...prev, username: null }));
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: null }));
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: null }));
        }
        if (errors.confirmPassword && value === confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: null }));
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (errors.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: null }));
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
            const response = await api.post('/auth/signup', {
                username: username.trim(),
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
            toast.success('Account created successfully! Welcome!');
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
            toast.error(errorMessage);

            if (error.response?.data?.message) {
                const message = error.response.data.message.toLowerCase();
                if (message.includes('username')) {
                    setErrors(prev => ({ ...prev, username: error.response.data.message }));
                } else if (message.includes('email')) {
                    setErrors(prev => ({ ...prev, email: error.response.data.message }));
                } else if (message.includes('password')) {
                    setErrors(prev => ({ ...prev, password: error.response.data.message }));
                }
            }
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
                        onChange={handleUsernameChange}
                        maxLength={50}
                        style={{
                            ...inputStyle,
                            border: errors.username ? '1px solid #e74c3c' : inputStyle.border
                        }}
                        placeholder="Enter your username (min 3 characters)"
                    />
                    {errors.username && (
                        <p style={{ color: '#e74c3c', fontSize: '0.75rem', marginTop: '4px', marginBottom: 0 }}>
                            {errors.username}
                        </p>
                    )}
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        style={{
                            ...inputStyle,
                            border: errors.email ? '1px solid #e74c3c' : inputStyle.border
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
                    <label style={labelStyle}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        style={{
                            ...inputStyle,
                            border: errors.password ? '1px solid #e74c3c' : inputStyle.border
                        }}
                        placeholder="At least 8 characters"
                    />
                    {errors.password && (
                        <p style={{ color: '#e74c3c', fontSize: '0.75rem', marginTop: '4px', marginBottom: 0 }}>
                            {errors.password}
                        </p>
                    )}
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        style={{
                            ...inputStyle,
                            border: errors.confirmPassword ? '1px solid #e74c3c' : inputStyle.border
                        }}
                        placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                        <p style={{ color: '#e74c3c', fontSize: '0.75rem', marginTop: '4px', marginBottom: 0 }}>
                            {errors.confirmPassword}
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
