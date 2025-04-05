
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
                        <img src="images/wish-icon.svg" alt="Wish image" className="icon" style={{ width: "26px", height: "26px" }}></img>

                        {user ? (
                            <Link to="/profile" state={{ user: user }}><img src="images/profile-icon.svg" alt="Profile image" className="icon" style={{ width: "24px", height: "24px" }}></img></Link>
                        ) : (
                            <Link to="/login"><img src="images/profile-icon.svg" alt="Profile image" className="icon" style={{ width: "24px", height: "24px" }}></img></Link>
                        )}

                        <img src="images/menu-icon.svg" alt="Menu image" className="icon" style={{ width: "24px", height: "24px" }}></img>
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