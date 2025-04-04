import './css/bootstrap.min.css';
import './css/font-awesome.min.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import LoginPage from './LoginPage';
import SuccessPage from './SuccessPage';
import ProfilePage from './ProfilePage';
import AdminPanel from './AdminPanel';

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

function App() {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const updateUser = (newUser) => {
        setUser(newUser);
        if (newUser) {
            localStorage.setItem("user", JSON.stringify(newUser));
        } else {
            localStorage.removeItem("user");
        }
    };

    return (
        <div className="App">
            {!isAdminPage && (
                <nav className="navbar navbar-custom navbar-fixed-top">
                    <div className="top-area" style={{ backgroundColor: '#d44007' }}>
                        <div className="container">
                            <div className="col-sm-6">
                                <p>Website Header</p>
                            </div>
                        </div>
                    </div>

                    <div className="container navigation">
                        <div className="navbar-collapse navbar-right">
                            <ul className="nav navbar-nav">
                                <li className={location.pathname === "/" ? "active" : ""}>
                                    <Link to="/">Home</Link>
                                </li>
                                <li className={location.pathname === "/about" ? "active" : ""}>
                                    <Link to="/about">About Us</Link>
                                </li>
                                <li className={location.pathname === "/contact" ? "active" : ""}>
                                    <Link to="/contact">Contact</Link>
                                </li>
                                <li className={location.pathname === "/login" || location.pathname === "/profile" ? "active" : ""}>
                                    {user ? (
                                        <Link to="/profile" state={{ user: user }}>{user.userName || user.adminName}</Link>
                                    ) : (
                                        <Link to="/login">Log In</Link>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            )}

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage setUser={updateUser} />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/admin" element={<AdminProtectedRoute user={user}><AdminPanel setUser={updateUser} /></AdminProtectedRoute>} />
                <Route path="/profile" element={<ProfileProtectedRoute user={user}><ProfilePage setUser={updateUser} /></ProfileProtectedRoute>} />
            </Routes>

            {!isAdminPage && (
                <div className="copyright-area" style={{ backgroundColor: '#d44007' }}>
                    <div className="container">
                        <div className="col-md-8">
                            <p>Website Footer</p>
                        </div>
                    </div>
                </div>
            )}
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