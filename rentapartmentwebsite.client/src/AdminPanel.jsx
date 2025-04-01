import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "./css/admin-style.css";

const AdminPanel = ({ setUser }) => {
    const [user, setLocalUser] = useState(null);
    const [menu, setMenu] = useState({ users: false, apartments: false });
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [addingData, setAddingData] = useState(false);
    const [newData, setNewData] = useState({});
    const [currentDataType, setCurrentDataType] = useState(null);
    const [adminRole, setAdminRole] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

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

    const renderFormFields = (type) => {
        const fields = [
            { label: "Name", value: newData.name, onChange: (e) => setNewData({ ...newData, name: e.target.value }) },
            { label: type === "Admin" ? "Login" : "Email", value: newData.email, onChange: (e) => setNewData({ ...newData, email: e.target.value }) },
        ];

        if (type === "Admin") {
            fields.push(
                { label: "Password (hashed)", value: newData.password, onChange: (e) => setNewData({ ...newData, password: e.target.value }) },
                { label: "Salt", value: newData.salt, onChange: (e) => setNewData({ ...newData, salt: e.target.value }) }
            );
        }

        return fields.map((field, index) => (
            <div key={index}>
                <label>{field.label}:</label>
                <input
                    required
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                />
            </div>
        ));
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

    const closeModal = () => {
        setEditingUser(null);
        setEditingAdmin(null);
        setAddingData(null);

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

    const handleAdd = async (type) => {
        setCurrentDataType(type);
        setAddingData(true);
    };

    const handleAddData = async () => {
        try {
            const url = currentDataType === "Admin" ? "/api/admins" : "/api/users/signup";
            const dataToSend = {};

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(newData.email)) {
                alert("Please check if the email address you've entered is correct");
                return;
            }

            if (currentDataType === "User") {
                dataToSend.userName = newData.name;
                dataToSend.emailAddress = newData.email;
            }


            if (currentDataType === "Admin") {
                dataToSend.password = newData.password;
                dataToSend.salt = newData.salt;
            }

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) throw new Error("Failed to add data");

            closeModal();
            fetchUsers();
            fetchAdmins();
        } catch (error) {
            console.error("Error adding data:", error);
        }
    };

    const menuItems = [
        { key: "users", label: "Users" },
        { key: "apartments", label: "Apartments" },
    ];

    const filteredMenuItems = menuItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-container">
            <div className="sidebar">
                <div className="sidebar-footer">
                    <Link to="/profile" className="avatar-link">
                        <img
                            src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                            alt="User Avatar"
                            className="avatar-img"
                        />
                    </Link>
                </div>
                <input
                    style={{color: "black"} }
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {filteredMenuItems.map(item => (
                    <div key={item.key}>
                        <div className="menu-item" onClick={() => toggleMenu(item.key)}>
                            {item.label} ▼
                        </div>
                        {menu[item.key] && item.key === "users" && (
                            <div className="submenu">
                                <div style={{ cursor: "pointer" }}>Users</div>
                                <div style={{ cursor: "pointer" }}>Site Admins</div>
                            </div>
                        )}
                        {menu[item.key] && item.key === "apartments" && (
                            <div className="submenu">
                                <div>All Apartments</div>
                                <div>Booked</div>
                                <div>Free</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="content">
                {users.length > 0 ? (
                    <>
                        <h2 style={{ margin: "20px" }}>Users</h2>
                        <div className="filters">
                            <input type="text" placeholder="Search user..." />
                            <select>
                                <option value="">Filter by</option>
                                <option value="ID">ID</option>
                                <option value="Name">Name</option>
                            </select>
                            <button className="add-btn" onClick={() => handleAdd("User")}>+ Add</button>
                        </div>
                    </>
                ) : admins.length > 0 ? (
                    <>
                        <h2 style={{ margin: "20px" }}>Admins</h2>
                        <div className="filters">
                            <input type="text" placeholder="Search admin..." />
                            <select>
                                <option value="">Filter by</option>
                                <option value="ID">ID</option>
                                <option value="Name">Name</option>
                                </select>
                                {adminRole != "Site Admin" && (
                                    <button className="add-btn" onClick={() => handleAdd("Admin")}>+ Add</button>
                                )}
                           
                        </div>
                    </>
                ) : (
                    <>
                        <h2 style={{ margin: "20px" }}>Admin Panel</h2>
                        <div className="filters">
                            <input type="text" placeholder="Search..." />
                            <select>
                                <option value="">Filter by</option>
                            </select>
                        </div>
                    </>
                )
                }

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
                                {adminRole != "Site Admin" && ( <th>Actions</th> )}
                                
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
                                        <button className="edit-btn" onClick={() => setEditingUser(user)}>Edit</button>
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
                                    {adminRole != "Site Admin" && (
                                        <td>
                                            <button className="edit-btn" onClick={() => setEditingAdmin(admin)}>Edit</button>
                                            <button className="delete-btn" onClick={() => handleDelete(admin.adminID, "admin")}>Delete</button>
                                        </td>
                                    )}
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
                            required
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
                            required
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

            {addingData && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Add New {currentDataType}</h3>

                        {renderFormFields(currentDataType)}

                        <button onClick={handleAddData}>Add</button>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;