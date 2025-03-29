import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./css/admin-style.css";

const AdminPanel = () => {
    const [menu, setMenu] = useState({ users: false, apartments: false });
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editingAdmin, setEditingAdmin] = useState(null);

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

    const handleDelete = async (id, type) => {
        const url = type === "user" ? `/api/users/${id}` : `/api/admins/${id}`;

        if (!window.confirm("Are you sure you want to delete this entry?")) return;

        try {
            const response = await fetch(url, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete");

            if (type === "user") {
                setUsers((prev) => prev.filter((user) => user.userID !== id));
            } else {
                setAdmins((prev) => prev.filter((admin) => admin.adminID !== id));
            }
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
    };

    const handleEditAdmin = (admin) => {
        setEditingAdmin(admin);
        alert("editingAdmin + " + admin)
    };

    const closeModal = () => {
        setEditingUser(null);
        setEditingAdmin(null);
    };

    const handleSave = async () => {
        try {
            let url = "";
            let method = "PUT";
            let body = {};

            if (editingUser) {
                url = `/api/users/${editingUser.userID}`;
                body = { ...editingUser };
            } else if (editingAdmin) {
                url = `/api/admins/${editingAdmin.adminID}`;
                body = { ...editingAdmin };
            }

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error("Failed to update data");

            closeModal();
            fetchUsers();
            fetchAdmins();
        } catch (error) {
            console.error("Error updating data:", error);
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
                                        <button className="edit-btn" onClick={() => handleEditUser(user)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(user.userID, "user")}>Delete</button>
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
                                        <button className="edit-btn" onClick={() => handleEditAdmin(admin)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(admin.adminID, "admin")}>Delete</button>
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

            {(editingUser !== null || editingAdmin !== null) && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit {editingUser ? "User" : "Admin"}</h3>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={editingUser ? editingUser.userName : editingAdmin.adminName}
                            onChange={(e) => {
                                if (editingUser) {
                                    setEditingUser({ ...editingUser, userName: e.target.value });
                                } else {
                                    setEditingAdmin({ ...editingAdmin, adminName: e.target.value });
                                }
                            }}
                        />
                        <label>Email/Login:</label>
                        <input
                            type="text"
                            value={editingUser ? editingUser.emailAddress : editingAdmin.adminLogin}
                            onChange={(e) => {
                                if (editingUser) {
                                    setEditingUser({ ...editingUser, emailAddress: e.target.value });
                                } else {
                                    setEditingAdmin({ ...editingAdmin, adminLogin: e.target.value });
                                }
                            }}
                        />
                        <button onClick={handleSave} className="save-btn">Save</button>
                        <button onClick={closeModal} className="cancel-btn">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;