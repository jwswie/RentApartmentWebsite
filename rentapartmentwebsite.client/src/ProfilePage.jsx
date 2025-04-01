import './css/profile-style.css';
import React, { Link, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfilePage({ setUser }) {
    const navigate = useNavigate();
    const [user, setLocalUser] = useState(null);
    const [adminRole, setAdminRole] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser); 
            setLocalUser(parsedUser);

            if ("adminLogin" in parsedUser) {  
                if (parsedUser.adminLogin.includes("org")) { 
                    setAdminRole("Organisation Admin");
                } else if (parsedUser.adminLogin.includes("site")) {
                    setAdminRole("Site Admin");
                }
            }
        } else {
            navigate('/login');
        }
    }, []);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate('/login');
    };

    const handleAdminPanel = () => {
        navigate('/admin');
    };

    return (
        <div className="clinic_version" style={{ overflow: 'hidden' }}>
            <div className="container" style={{ marginTop: '150px' }}>
                <div className="profile-nav col-md-3">
                    <div className="user-heading">
                        <img src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" alt="User avatar" />
                        <h1 style={{ color: '#fff', marginTop: '10px' }}>{user?.userName || user?.adminName || 'User not found'}</h1>
                        <p>{user?.emailAddress || user?.adminLogin || 'No data available'}</p>
                    </div>
                    <button
                        style={{ outline: 'none', marginTop: '25px', position: 'relative', left: '70px' }}
                        onClick={handleLogout}
                        className="btn-light btn-brd effect-1"
                    >
                        Log out
                    </button>

                    {adminRole != null && (
                        <button style={{ outline: 'none', marginTop: '25px', position: 'relative', left: '70px' }}
                            onClick={handleAdminPanel}  className="btn-light btn-brd effect-1" > Admin Panel </button>
                    )}

                    
                </div>

                <div className="profile-info col-md-9">
                    <div className="panel">
                        <div className="bio-graph-heading">
                            Administrator Personal Profile
                        </div>
                        <div className="bio-graph-info" style={{ marginTop: '25px' }}>
                            <div className="row">
                                <div className="bio-row">
                                    <p><span>Full Name </span>: Bob</p>
                                </div>
                                <div className="bio-row">
                                    <p><span>Login </span>: org_admin</p>
                                </div>
                                <div className="bio-row">
                                    <p><span>Role</span>: {adminRole}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {adminRole != null && (
                        <div className="row">
                            <div className="col-md-6">
                                <div className="panel">
                                    <div className="panel-body">
                                        <div className="bio-desk">
                                            <h4>Change Name</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="panel">
                                    <div className="panel-body">
                                        <div className="bio-desk">
                                            <h4>Change Password</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;