import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authAPI, handleAPIError } from '../services/apiService';

function LoginPage() {
    const navigate = useNavigate();
    const { loginAdmin } = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Username dan password harus diisi');
            return;
        }

        try {
            const response = await authAPI.login(username, password);
            if (response.data && response.data.success) {
                loginAdmin();
                navigate('/');
            } else {
                setError(response.data?.message || 'Username atau password salah');
            }
        } catch (err) {
            const errDetails = handleAPIError(err);
            setError(errDetails.message || 'Gagal menghubungi server');
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                padding: '20px',
            }}
        >
            {/* Login Card */}
            <div
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    padding: '50px 40px',
                    borderRadius: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: '#1e293b',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                {/* Logo Section */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        marginBottom: '40px',
                    }}
                >
                    <div
                        style={{
                            width: '50px',
                            height: '50px',
                            background:
                                'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                        }}
                    >
                        🌿
                    </div>
                    <div>
                        <div
                            style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                color: '#ffffff',
                            }}
                        >
                            Smart Greenhouse
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            FIK UPNVJ
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h1
                    style={{
                        textAlign: 'center',
                        fontSize: '28px',
                        fontWeight: '700',
                        marginBottom: '30px',
                        color: '#ffffff',
                    }}
                >
                    LOGIN OPERATOR
                </h1>

                {/* Error Message */}
                {error && (
                    <div
                        style={{
                            padding: '12px',
                            marginBottom: '20px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            fontSize: '14px',
                            fontWeight: '500',
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin}>
                    {/* Username Input */}
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                color: '#ffffff',
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'all 0.3s ease',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#10b981';
                                e.target.style.backgroundColor =
                                    'rgba(16, 185, 129, 0.05)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor =
                                    'rgba(255, 255, 255, 0.1)';
                                e.target.style.backgroundColor =
                                    'rgba(255, 255, 255, 0.05)';
                            }}
                        />
                    </div>

                    {/* Password Input */}
                    <div style={{ marginBottom: '30px' }}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                color: '#ffffff',
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'all 0.3s ease',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#10b981';
                                e.target.style.backgroundColor =
                                    'rgba(16, 185, 129, 0.05)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor =
                                    'rgba(255, 255, 255, 0.1)';
                                e.target.style.backgroundColor =
                                    'rgba(255, 255, 255, 0.05)';
                            }}
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '8px',
                            border: 'none',
                            background:
                                'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow =
                                '0 10px 25px rgba(16, 185, 129, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        Login
                    </button>
                </form>

                {/* Demo Credentials */}
                <div
                    style={{
                        marginTop: '30px',
                        padding: '15px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        fontSize: '12px',
                        color: '#cbd5e1',
                    }}
                >
                    <div
                        style={{
                            fontWeight: '600',
                            marginBottom: '8px',
                            color: '#3b82f6',
                        }}
                    >
                        Demo Credentials:
                    </div>
                    <div>Username: admin</div>
                    <div>Password: 123456</div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
