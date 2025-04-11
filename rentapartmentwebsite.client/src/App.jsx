import './css/login-style.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import LoginPage from './LoginPage';
import SuccessPage from './SuccessPage';
import ProfilePage from './ProfilePage';
import AdminPanel from './AdminPanel';
import AddPersonalData from './AddPersonalData';

function ProfileProtectedRoute({ user, children }) {
    if (!user) {
        return <SuccessPage />
    }
    return children;
}

function AdminProtectedRoute({ user, children }) {
    if (!user || !("adminLogin" in user)) {
        return <SuccessPage />;
    }
    return children;
}

function UserProtectedRoute({ user, children }) {
    if (!user || !("emailAddress" in user)) {
        return <SuccessPage />;
    }
    return children;
}

function App() {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');
    const [isRegisterWindow, setIsRegisterWindow] = useState(null);

    const [fullName, setFullName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [tempUser, setTempUser] = useState(null);
    const [tempVerificationCode, setTempVerificationCode] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const resetModal = () => {
        setIsRegisterWindow(false);
        setTempVerificationCode(null);
        setErrorMessage('');
        setIsVerifying(false);
        setIsAdmin(false);
        setFullName('');
        setEmailAddress('');
        setPassword('');
        setVerificationCode('');
    };

    const updateUser = (newUser) => {
        setUser(newUser);
        if (newUser) {
            localStorage.setItem("user", JSON.stringify(newUser));
        } else {
            localStorage.removeItem("user");
        }
    };

    const handleSignup = async (event) => {
        event.preventDefault(); // Предотвращаем обновление страницы
        setErrorMessage('');

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailAddress)) {
            setErrorMessage("Please check if the email address you've entered is correct");
            return;
        }

        try {
            const checkResponse = await fetch(`/api/users/check-email/${emailAddress}`); // Посылаем запрос на сервер и ждём ответ
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

        try {
            const codeResponse = await fetch(`/api/users/send-code/${emailAddress}`);
            if (!codeResponse.ok) {
                setErrorMessage('Failed to send verification code. Try again');
                return;
            }

            const { verificationCode } = await codeResponse.json();
            setTempVerificationCode(verificationCode);
            setIsVerifying(true);
            return;
        } catch (error) {
            setErrorMessage('Error sending verification code');
            return;
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
                    setTempVerificationCode(verificationCode);
                    const user = await userResponse.json();
                    setTempUser(user);
                }
                else {
                    setErrorMessage('Email not found. Please sign up');
                    return;
                }
            }

            const adminResponse = await fetch(`/api/admins/login/${emailAddress}`);
            if (adminResponse.ok) {
                setIsAdmin(true);
            }
            return;

        } catch (error) {
            setErrorMessage('Error logging in');
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
                localStorage.setItem("user", JSON.stringify(admin));
                resetModal();
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

        if (verificationCode === tempVerificationCode && fullName == '') { // Если совпал код, но имя не было введено (Log In)
            setUser(tempUser);
            localStorage.setItem("user", JSON.stringify(tempUser));
            resetModal();
            navigate('/profile');
        }
        else if (verificationCode === tempVerificationCode && fullName != '') { // Если совпал код и имя было введено (Sign In)
            const userData = { userName: fullName, emailAddress };
            try {
                const response = await fetch('/api/users/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }, // Отправляемые данные в формате JSON
                    body: JSON.stringify(userData), // Превращаем объект userData в строку JSON
                });

                if (response.ok) {
                    const result = await response.json();
                    setUser(result);
                    resetModal();
                    navigate('/profile');
                } else {
                    setErrorMessage('Failed to register user');
                }
            } catch (error) {
                setErrorMessage('Error signing up');
            }

        } else {
            setErrorMessage('Invalid verification code!');
        }
    };

    return (
        <div className="App">
            {!isAdminPage && (
                <nav className="navbar">
                    <div className="container">
                        <Link to="/"><img src="images/logo.png" alt="Logo image" className="logo"></img></Link>
                    </div>

                    <div className="navigation">
                        <p className={location.pathname === "/" ? "nav-active" : "nav-li"}><Link to="/">Головна</Link></p>
                        <p className={location.pathname === "/about" ? "nav-active" : "nav-li"}><Link to="/about">Про нас</Link></p>
                        <p className="nav-li"><Link to="/about">Житло</Link></p>
                        <p className="nav-li"><Link to="/about">Країни</Link></p>
                        <p className={location.pathname === "/contact" ? "nav-active" : "nav-li"}><Link to="/contact">Контакти</Link></p>
                    </div>

                    <div className="icon-container">
                        <img src="images/wish-icon.svg" onClick={() => setIsRegisterWindow(true)} alt="Wish image" className="icon" style={{ width: "26px", height: "26px" }}></img>

                        {user ? (
                            <Link to="/profile" state={{ user: user }}><img src="images/profile-icon.svg" alt="Profile image" className="icon" style={{ width: "24px", height: "24px" }}></img></Link>
                        ) : (
                            <Link to="/login"><img src="images/profile-icon.svg" alt="Profile image" className="icon" style={{ width: "24px", height: "24px" }}></img></Link>
                        )}

                        <img src="images/menu-icon.svg" alt="Menu image" className="icon" style={{ width: "24px", height: "24px" }}></img>
                    </div>
                </nav>
            )}

            {isRegisterWindow && (
                <div>
                    <div className="login-container">
                        <input type="checkbox" id="check" />
                        <div className="login form">
                            <header>Login</header>
                            {!tempVerificationCode && !isAdmin ? (
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
            )}

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage setUser={updateUser} />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/admin" element={<AdminProtectedRoute user={user}><AdminPanel setUser={updateUser} /></AdminProtectedRoute>} />
                <Route path="/profile" element={<ProfileProtectedRoute user={user}><ProfilePage setUser={updateUser} /></ProfileProtectedRoute>} />
                <Route path="/personal" element={<UserProtectedRoute user={user}><AddPersonalData setUser={updateUser} /></UserProtectedRoute>} />
            </Routes>

            {/*{!isAdminPage && (
                <div className="copyright-area" style={{ backgroundColor: '#d44007' }}>
                    <div className="container">
                        <div className="col-md-8">
                           <p>Website Footer</p>
                        </div>
                    </div>
                </div>
            )}*/}
        </div>
    );
}


export default function WrappedApp() {
    return (
        <Router>
            <App />
        </Router>
    );
}