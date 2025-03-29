import './css/profile-style.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfilePage({ setUser }) {
    const navigate = useNavigate();
    const [user, setLocalUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setLocalUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, []);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate('/login');
    };

    return (
        <div className="clinic_version" style={{ overflow: 'hidden' }}>
            <div className="container" style={{ marginTop: '150px' }}>
                <div className="profile-nav col-md-3">
                    <div className="user-heading">
                        <img src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" alt="User avatar" />
                        <h1 style={{ color: '#fff', marginTop: '10px' }}>{user?.userName || user?.adminName || 'User not found'}</h1>
                        <p>{user?.emailAddress || user?.adminLogin || 'No email available'}</p>
                    </div>
                    <button
                        style={{ outline: 'none', marginTop: '25px', position: 'relative', left: '70px' }}
                        onClick={handleLogout}
                        className="btn-light btn-brd effect-1"
                    >
                        Log out
                    </button>
                </div>

                <div className="profile-info col-md-9">
                    <div className="panel">
                        <div className="bio-graph-heading">
                            User Profile
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
