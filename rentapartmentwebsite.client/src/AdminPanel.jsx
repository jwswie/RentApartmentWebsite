import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./css/admin-style.css";

const AdminPanel = () => {
    const [menu, setMenu] = useState({ users: false, apartments: false });
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);

    const toggleMenu = (menuName) => {
        setMenu((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
    };

    const fetchUsers = async () => {
        try {
            setUsers([]);
            setAdmins([]);
            const response = await fetch("/api/users");
            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }
            const data = await response.json();
            setUsers(data);
            console.log(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchAdmins = async () => {
        try {
            setAdmins([]);
            setUsers([]);
            const response = await fetch("/api/admins");
            if (!response.ok) {
                throw new Error("Failed to fetch admins");
            }
            const data = await response.json();
            setAdmins(data);
        } catch (error) {
            console.error("Error fetching admins:", error);
        }
    };

    return (
        <div className="admin-container">
            <div className="sidebar">
                <div className="sidebar-footer">
                    <Link to="/adminprofile" className="avatar-link">
                        <img
                            src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                            alt="User Avatar"
                            className="avatar-img"
                        />
                    </Link>
                </div>
                <input type="text" className="search-input" placeholder="Search..." />
                <div className="menu-item" onClick={() => toggleMenu("users")}>
                    Users ▼
                </div>
                {menu.users && (
                    <div className="submenu">
                        <div style={{ cursor: "pointer" }} onClick={fetchUsers}>
                            Users
                        </div>
                        <div style={{ cursor: "pointer" }} onClick={fetchAdmins}>
                            Site Admins
                        </div>
                    </div>
                )}
                <div className="menu-item" onClick={() => toggleMenu("apartments")}>
                    Apartments ▼
                </div>
                {menu.apartments && (
                    <div className="submenu">
                        <div>All Apartments</div>
                        <div>Booked</div>
                        <div>Free</div>
                    </div>
                )}
            </div>

            <div className="content">
                <h2 style={{ margin: "20px" }}>Admin Panel</h2>
                <div className="filters">
                    <input type="text" placeholder="Search users..." />
                    <select>
                        <option value="">Filter by role</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>
                    <button className="add-btn">+ Add</button>
                </div>

                <table>
                    <thead>
                        {users.length > 0 ? (
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        ) : admins.length > 0 ? (
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Login</th>
                                <th>Password</th>
                                <th>Salt</th>
                                <th>Actions</th>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}>No data found</td>
                            </tr>
                        )}

                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.userID}>
                                    <td>{user.userID}</td>
                                    <td>{user.userName}</td>
                                    <td>{user.emailAddress}</td>
                                    <td>
                                        <button className="edit-btn">Edit</button>
                                        <button className="delete-btn">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : admins.length > 0 ? (
                            admins.map((admin) => (
                                <tr key={admin.adminID}>
                                    <td>{admin.adminID}</td>
                                    <td>{admin.adminName}</td>
                                    <td>{admin.adminLogin}</td>
                                    <td>{admin.hashedPassword}</td>
                                    <td>{admin.salt}</td>
                                    <td>
                                        <button className="edit-btn">Edit</button>
                                        <button className="delete-btn">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center" }}>No data found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;