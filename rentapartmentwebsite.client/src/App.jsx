
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
function ProfileProtectedRoute({ user, children }) {
    if (!user) {
        return <SuccessPage />
    }
    return children;
}
    const [user, setUser] = useState(() => {
    const closeModal = () => {
        setEditingAdminName(null);

    };

    const handleSave = async () => {
        try {
            let url = `/api/admins/${editingAdminName.adminID}`;
            let method = "PUT";
            let body = { ...editingAdminName };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error("Failed to update data");

            const updatedUser = await response.json();

            closeModal();

            setLocalUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

        } catch (error) {
            alert("Error updating data:", error);
        }
    };

    const handlePasswordSave = async () => {
        try {
            if (!editingAdminPassword || !editingAdminPassword.password) {
                alert("Please enter a password");
                return;
            }
function AdminProtectedRoute({ user, children }) {
    if (!user || !("adminLogin" in user)) {
        return <SuccessPage />;
    }
    return children;
}
        if (newUser) {
function UserProtectedRoute({ user, children }) {
    if (!user || !("emailAddress" in user)) {
        return <SuccessPage />;
    }
    return children;
}
        } else {
function App() {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');
    return (
        <div className="App">
            {!isAdminPage && (
                /* <nav className="navbar navbar-custom navbar-fixed-top">
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
        <div className="App">
            {!isAdminPage && (
                /* <nav className="navbar navbar-custom navbar-fixed-top">
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
                 </nav>*/

                <nav className="navbar">
                    <div className="container">
                        <img src="images/logo.png" alt="Logo image" className="logo"></img>
                    </div>

                    <div className="navigation">
                        <p className={location.pathname === "/" ? "nav-active" : "nav-li"}><Link to="/">Home</Link></p>
                        <p className={location.pathname === "/about" ? "nav-active" : "nav-li"}><Link to="/about">About Us</Link></p>
                        <p className="nav-li"><Link to="/about">Apartments</Link></p>
                        <p className="nav-li"><Link to="/about">Countries</Link></p>
                        <p className={location.pathname === "/contact" ? "nav-active" : "nav-li"}><Link to="/contact">Contact</Link></p>
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
                            <Link to="/profile" state={{ user: user }}><img src="images/profile-icon.svg" alt="Profile image" className="icon" style={{ width: "24px", height: "24px" }}></img></Link>
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
                <Route path="/contact" element={<ContactPage />} />
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