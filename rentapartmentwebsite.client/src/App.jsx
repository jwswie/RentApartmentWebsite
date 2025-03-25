import './css/bootstrap.min.css';
import './css/font-awesome.min.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';

function App() {
    const location = useLocation();

    return (
        <div className="App">
            <nav className="navbar navbar-custom navbar-fixed-top">
                <div className="top-area">
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
                        </ul>
                    </div>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
            </Routes>

            <div className="copyright-area">
                <div className="container">
                    <div className="col-md-8">
                        <p>Website Footer</p>
                    </div>
                </div>
            </div>
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
