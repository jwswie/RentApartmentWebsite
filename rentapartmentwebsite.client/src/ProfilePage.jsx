import './css/profile-style.css';
import React, { Link, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfilePage({ setUser }) {
    const navigate = useNavigate();
    const [user, setLocalUser] = useState(null);
    const [adminRole, setAdminRole] = useState(null);
    const [editingAdminName, setEditingAdminName] = useState(null);
    const [editingAdminPassword, setEditingAdminPassword] = useState(null);

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
            navigate('/');
        }
    }, []);

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

            let url = `/api/admins/new-password/${editingAdminPassword.adminID}`;
            let method = "PUT";
            let body = { password: editingAdminPassword.password };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error("Failed to update password");

            closeModal();

        } catch (error) {
            alert("Error updating password:", error);
        }
    };


    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate('/');
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
                            onClick={handleAdminPanel} className="btn-light btn-brd effect-1" > Admin Panel </button>
                    )}

                </div>

                <div className="profile-info col-md-9">
                    <div className="panel">
                        {adminRole != null ? (
                            <>
                                <div className="bio-graph-heading">
                                    Administrator Personal Profile
                                </div>
                                <div className="bio-graph-info" style={{ marginTop: '25px' }}>
                                    <div className="row">
                                        <div className="bio-row">
                                            <p><span>Full Name </span>: {user.adminName}</p>
                                        </div>
                                        <div className="bio-row">
                                            <p><span>Login </span>: {user.adminLogin}</p>
                                        </div>
                                        <div className="bio-row">
                                            <p><span>Role</span>: {adminRole}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bio-graph-heading">
                                    User Personal Profile
                                </div>
                                <div className="bio-graph-info" style={{ marginTop: '25px' }}>
                                    <div className="row">
                                        <div className="col-md-6" onClick={() => navigate('/personal')}>
                                            <div className="panel">
                                                <div className="panel-body">
                                                    <div className="bio-desk">
                                                        <h4>Complete your profile</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                    </div>

                    {adminRole != null && (
                        <div className="row">
                            <div className="col-md-6" onClick={() => setEditingAdminName(user)}>
                                <div className="panel">
                                    <div className="panel-body">
                                        <div className="bio-desk">
                                            <h4>Change Name</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6" onClick={() => setEditingAdminPassword(user)}>
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

                {editingAdminName !== null && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Change Name</h3>
                            <label>Name:</label>
                            <input required type="text" value={editingAdminName.adminName} onChange={(e) => { setEditingAdminName({ ...editingAdminName, adminName: e.target.value }); }} />
                            <button onClick={handleSave} className="save-btn">Save</button>
                            <button onClick={closeModal} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                )}

                {editingAdminPassword !== null && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Change Password</h3>
                            <label>Password:</label>
                            <input required type="text" onChange={(e) => { setEditingAdminPassword({ ...editingAdminPassword, password: e.target.value }); }} />
                            <button onClick={handlePasswordSave} className="save-btn">Save</button>
                            <button onClick={closeModal} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;