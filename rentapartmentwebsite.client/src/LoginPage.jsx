import './css/login-style.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setUser }) {
    const [fullName, setFullName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [tempUser, setTempUser] = useState(null);
    const [serverCode, setServerCode] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailAddress)) {
            setErrorMessage("Please check if the email address you've entered is correct");
            return;
        }

        try {
            const checkResponse = await fetch(`/api/users/check-email/${emailAddress}`);
            if (checkResponse.ok) {
                const exists = await checkResponse.json();
                if (exists) {
                    setErrorMessage('Email address already registered. Please log in');
                    return;
                }
            }
        } catch (error) {
            setErrorMessage('Error checking email');
            return;
        }

        const userData = { userName: fullName, emailAddress };

        try {
            const response = await fetch('/api/users/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const result = await response.json();
                setTempUser(result);

                try {
                    const response = await fetch(`/api/users/send-code/${emailAddress}`);
                    if (response.ok) {
                        const { verificationCode } = await response.json();
                        setServerCode(verificationCode);
                        setIsVerifying(true);
                    } else {
                        setErrorMessage('Failed to send verification code. Try again.');
                    }
                } catch (error) {
                    setErrorMessage('Error sending verification code.');
                }
            } else {
                setErrorMessage('Failed to register user');
            }
        } catch (error) {
            setErrorMessage('Error signing up');
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setIsAdmin(false);

        try {
            const userResponse = await fetch(`/api/users/login/${emailAddress}`);
            if (userResponse.ok) {
                const sendCodeResponse = await fetch(`/api/users/send-code/${emailAddress}`);
                if (sendCodeResponse.ok) {
                    const { verificationCode } = await sendCodeResponse.json();
                    setServerCode(verificationCode);
                    const user = await userResponse.json();
                    setTempUser(user);
                }
                return;
            }

            const adminResponse = await fetch(`/api/admins/login/${emailAddress}`);
            if (adminResponse.ok) {
                setIsAdmin(true);
            }
            return;
            setErrorMessage('Email not found. Please sign up.');
        } catch (error) {
            setErrorMessage('Error logging in.');
        }
    };

    const handleAdminLogin = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        try {
            const response = await fetch('/api/admins/check-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailAddress, password: password }),
            });


            if (response.ok) {
                const admin = await response.json();
                setUser(admin);
                navigate('/admin');
            } else {
                setErrorMessage('Incorrect password!');
            }
        } catch (error) {
            setErrorMessage('Error verifying password');
        }
    };

    const handleVerifyCode = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        if (verificationCode === serverCode) {
            setUser(tempUser);
            navigate('/success', { state: { message: 'You have logged in successfully' } });
        } else {
            setErrorMessage('Invalid verification code!');
        }
    };

    return (
        <div>
            <div className="login-container">
                <input type="checkbox" id="check" />
                <div className="login form">
                    <header>Login</header>
                    {!serverCode && !isAdmin ? (
                        <form onSubmit={handleLogin}>
                            <input
                                type="text"
                                placeholder="Enter your email address"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                                required
                            />
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <input type="submit" className="button" value="Log In" />
                        </form>
                    ) : isAdmin ? (
                        <form onSubmit={handleAdminLogin}>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <input type="submit" className="button" value="Login as Admin" />
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyCode}>
                            <input
                                type="text"
                                placeholder="Enter verification code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                            />
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <input type="submit" className="button" value="Verify Code" />
                        </form>
                    )}
                    <div className="signup">
                        <span className="signup"> Don't have an account? <label htmlFor="check">Signup</label>
                        </span>
                    </div>
                </div>
                <div className="registration form">
                    <header>Signup</header>
                    {!isVerifying ? (
                        <form onSubmit={handleSignup}>
                            <input type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                            <input type="text" placeholder="Enter your email address" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} required />
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <input type="submit" className="button" value="Signup" />
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyCode}>
                            <input type="text" placeholder="Enter verification code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <input type="submit" className="button" value="Verify Code" />
                        </form>
                    )}

                    <div className="signup">
                        <span className="signup">Already have an account? <label htmlFor="check">Login</label></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;