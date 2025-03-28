import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./css/admin-style.css";
import './css/profile-style.css';

const AdminProfile = () => {
    const [admin, setAdmin] = useState({
        name: "John Doe",
        password: "********",
    });

    const [newName, setNewName] = useState(admin.name);
    const [newPassword, setNewPassword] = useState("");

    const handleSave = () => {
        if (newName.trim() === "") {
            alert("Name cannot be empty.");
            return;
        }

        setAdmin({
            ...admin,
            name: newName,
            password: newPassword ? newPassword : admin.password,
        });

        setNewPassword("");
        alert("Profile updated successfully!");
    };

    return (
        <div className="admin-container">
            <div className="sidebar">
                <div className="sidebar-footer">
                    <Link to="/profile" className="avatar-link">
                        <img
                            src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                            alt="Admin Avatar"
                            className="avatar-img"
                        />
                    </Link>
                </div>
                <Link to="/admin" className="menu-item">← Back to Dashboard</Link>
            </div>

            <div className="content">
                
                <div className="profile-info col-md-9">
                    <div className="panel">
                        <h2>Admin Profile</h2>
                        <div className="bio-graph-info" style={{ marginTop: '25px' }}>
                            <div className="row">
                                <div className="bio-row">
                                    <p><span>Full Name </span>: Bob</p>
                                </div>
                                <div className="bio-row">
                                    <p><span>Login </span>: admin1</p>
                                </div>
                                <div className="bio-row">
                                    <p><span>Role</span>: Site Admin</p>
                                </div>
                            </div>
                        </div>
                    </div>

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

                {/*<div className="profile-form">*/}
                {/*    <label>Name:</label>*/}
                {/*    <input*/}
                {/*        type="text"*/}
                {/*        value={newName}*/}
                {/*        onChange={(e) => setNewName(e.target.value)}*/}
                {/*    />*/}

                {/*    <label>New Password:</label>*/}
                {/*    <input*/}
                {/*        type="password"*/}
                {/*        placeholder="Enter new password"*/}
                {/*        value={newPassword}*/}
                {/*        onChange={(e) => setNewPassword(e.target.value)}*/}
                {/*    />*/}

                {/*    <button className="save-btn" onClick={handleSave}>Save Changes</button>*/}
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;