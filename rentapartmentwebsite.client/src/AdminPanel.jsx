import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./css/admin-style.css";

const AdminPanel = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [users, setUsers] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    ]);
    const [menu, setMenu] = useState({ users: false, apartments: false });

    const toggleMenu = (menuName) => {
        setMenu((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (roleFilter ? user.role === roleFilter : true)
    );

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
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                />
                <div className="menu-item" onClick={() => toggleMenu("users")}>
                    Users ▼
                </div>
                {menu.users && (
                    <div className="submenu">
                        <div>All Users</div>
                        <div>Site Admins</div>
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
                <h2 style={{ margin: '20px' }}>Admin Panel</h2>
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                        <option value="">Filter by role</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>
                    <button className="add-btn">+ Add</button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button className="edit-btn">Edit</button>
                                    <button className="delete-btn">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;
