import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./css/admin-style.css";

const AdminPanel = ({ setUser }) => {
    const [user, setLocalUser] = useState(null);
    const [menu, setMenu] = useState({ users: false, apartments: false });
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [countries, setCountries] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [addingData, setAddingData] = useState(false);
    const [newData, setNewData] = useState({});
    const [currentDataType, setCurrentDataType] = useState(null);
    const [adminRole, setAdminRole] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [tableSearchQuery, setTableSearchQuery] = useState("");
    const [filter, setFilter] = useState('');
    const navigate = useNavigate();

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

    const fetchCountries = async () => {
        try {
            setAdmins([]);
            setUsers([]);
            setCountries([]);
            const response = await fetch("/api/countries");
            if (!response.ok) {
                throw new Error("Failed to fetch countries");
            }
            const data = await response.json();
            setCountries(data);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    };

    const renderFormFields = (type) => {
        const fields = [
            { label: "Name", value: newData.name, onChange: (e) => setNewData({ ...newData, name: e.target.value }) },
            { label: type === "Admin" ? "Login" : "Email", value: newData.email, onChange: (e) => setNewData({ ...newData, email: e.target.value }) },
        ];

        if (type === "Admin") {
            fields.push(
                { label: "Password", value: newData.password, onChange: (e) => setNewData({ ...newData, password: e.target.value }) },
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

        if (!window.confirm("Ви впевнені, що хочете видалити цей запис?")) return;

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
            const url = currentDataType === "Admin" ? "/api/admins/add-admin" : "/api/users/signup";
            const dataToSend = {};
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (currentDataType === "User") {

                if (!emailPattern.test(newData.email)) {
                    alert("Будь ласка, перевірте правильність введеної адреси електронної пошти");
                    return;
                }

                try {
                    const checkResponse = await fetch(`/api/users/check-email/${newData.email}`);
                    if (checkResponse.ok) {
                        const exists = await checkResponse.json();
                        if (exists) {
                            alert('Електронна адреса вже зареєстрована');
                            return;
                        }
                    }
                } catch (error) {
                    alert('Помилка при перевірці пошти');
                    return;
                }

                dataToSend.userName = newData.name;
                dataToSend.emailAddress = newData.email;
            }

            if (currentDataType === "Admin") {
                dataToSend.adminName = newData.name;

                if (!/^org_|^site_/.test(newData.email)) {
                    alert("Логін адміністратора повинен починатися з 'org_' або 'site_''");
                    return;
                }

                try {
                    const checkResponse = await fetch(`/api/admins/check-login/${newData.email}`);
                    if (checkResponse.ok) {
                        const exists = await checkResponse.json();
                        if (exists) {
                            alert('Логін вже зареєстрований');
                            return;
                        }
                    }
                } catch (error) {
                    alert('Помилка при перевірці логіну');
                    return;
                }

                dataToSend.adminLogin = newData.email;

                try {
                    const response = await fetch(`/api/admins/convert-password?password=${encodeURIComponent(newData.password)}`);

                    if (!response.ok) {
                        alert("Не вдалося конвертувати пароль. Спробуйте ще раз");
                        return;
                    }

                    const { passwordHash, salt } = await response.json();
                    dataToSend.hashedPassword = passwordHash;
                    dataToSend.salt = salt;
                } catch (error) {
                    alert("Помилка при конвертації пароля");
                    return;
                }
            }

            console.log(dataToSend)
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
            alert("Error adding data:", error);
        }
    };

    const menuItems = [
        { key: "users", label: "Users" },
        { key: "apartments", label: "Apartments" },
        { key: "countries", label: "Країни" },
    ];

    const filteredMenuItems = menuItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getFilteredTableData = () => {
        let filteredData = [];

        if (users.length > 0) {
            filteredData = users.filter(u =>
                u.userName.toLowerCase().includes(tableSearchQuery.toLowerCase())
            );
        } else if (admins.length > 0) {
            filteredData = admins.filter(a =>
                a.adminName.toLowerCase().includes(tableSearchQuery.toLowerCase())
            );
        } else if (countries.length > 0) {
            filteredData = countries.filter(c =>
                c.countryName.toLowerCase().includes(tableSearchQuery.toLowerCase())
            );
        }

        const sortData = (key, order = 'asc') => {
            return filteredData.sort((a, b) => {
                const valA = a[key].toLowerCase();
                const valB = b[key].toLowerCase();
                return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            });
        };

        if (filteredData.length > 0) {
            switch (filter) {
                case 'nameAToZ':
                    filteredData = sortData(users.length > 0 ? 'userName' : 'adminName', 'asc');
                    break;
                case 'nameZToA':
                    filteredData = sortData(users.length > 0 ? 'userName' : 'adminName', 'desc');
                    break;
                case 'emailAToZ':
                    if (users.length > 0) filteredData = sortData('emailAddress', 'asc');
                    break;
                case 'emailZToA':
                    if (users.length > 0) filteredData = sortData('emailAddress', 'desc');
                    break;
                case 'loginAToZ':
                    if (admins.length > 0) filteredData = sortData('adminLogin', 'asc');
                    break;
                case 'loginZToA':
                    if (admins.length > 0) filteredData = sortData('adminLogin', 'desc');
                    break;
                default:
                    break;
            }
        }

        return filteredData;
    };

    const handleFilterChange = (filterOption) => {
        setFilter(filterOption);
    };

    const filteredData = getFilteredTableData();

    return (
        <div className="admin-container">
            <div className="sidebar">
                <div className="sidebar-footer">
                    <Link to="/profile" className="avatar-link">
                        <img src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" className="avatar-img" />
                    </Link>
                </div>
                <input type="text" className="search-input" placeholder="Пошук..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                {filteredMenuItems.map(item => (
                    <div key={item.key}>
                        {item.label == "Країни" ? (
                            <div className="menu-item" onClick={fetchCountries}>
                                {item.label}
                            </div>
                        ) : (
                            <div className="menu-item" onClick={() => toggleMenu(item.key)}>
                                {item.label} ▼
                            </div>
                        )}
                        {menu[item.key] && item.key === "users" && (
                            <div className="submenu">
                                <div style={{ cursor: "pointer" }} onClick={fetchUsers}>Користувачі</div>
                                <div style={{ cursor: "pointer" }} onClick={fetchAdmins}>Адміністратори</div>
                            </div>
                        )}
                        {menu[item.key] && item.key === "apartments" && (
                            <div className="submenu">
                                <div>Все житло</div>
                                <div>Заброньоване</div>
                                <div>Вільне</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="content">
                {users.length > 0 ? (
                    <>
                        <h2 style={{ margin: "20px", marginLeft: "0px" }}>Users</h2>
                        <div className="filters">
                            <input style={{ color: "black" }} type="text" placeholder="Пошук за іменем..." value={tableSearchQuery} onChange={(e) => setTableSearchQuery(e.target.value)} />
                            <select onChange={(e) => handleFilterChange(e.target.value)}>
                                <option value="">Фільтри</option>
                                <option value="nameAToZ">Ім'я, А до Я</option>
                                <option value="nameZToA">Ім'я, Я до А</option>
                                <option value="emailAToZ">Пошта, А до Я</option>
                                <option value="emailZToA">Пошта, Я до А</option>
                            </select>
                            <button className="add-btn" onClick={() => handleAdd("User")}>+ Додати</button>
                        </div>
                    </>
                ) : admins.length > 0 ? (
                    <>
                        <h2 style={{ margin: "20px", marginLeft: "0px" }}>Admins</h2>
                        <div className="filters">
                            <input style={{ color: "black" }} type="text" placeholder="Пошук за іменем..." value={tableSearchQuery} onChange={(e) => setTableSearchQuery(e.target.value)} />
                            <select onChange={(e) => handleFilterChange(e.target.value)}>
                                <option value="">Фільтри</option>
                                <option value="nameAToZ">Ім'я, А до Я</option>
                                <option value="nameZToA">Ім'я, Я до А</option>
                                <option value="loginAToZ">Логін, А до Я</option>
                                <option value="loginZToA">Логін, Я до А</option>
                            </select>
                            {adminRole != "Site Admin" && (
                                <button className="add-btn" onClick={() => handleAdd("Admin")}>+ Додати</button>
                            )}

                        </div>
                    </>
                    ) : countries.length > 0 ? (
                        <>
                            <h2 style={{ margin: "20px", marginLeft: "0px" }}>Countries</h2>
                            <div className="filters">
                                <input style={{ color: "black" }} type="text" placeholder="Пошук за назвою..." value={tableSearchQuery} onChange={(e) => setTableSearchQuery(e.target.value)} />
                                <select onChange={(e) => handleFilterChange(e.target.value)}>
                                    <option value="">Фільтри</option>
                                    <option value="nameAToZ">Назва, А до Я</option>
                                    <option value="nameZToA">Назва, Я до А</option>
                                </select>
                                <button className="add-btn" onClick={() => handleAdd("Admin")}>+ Додати</button>

                            </div>
                        </>
                    ) : (
                    <>
                        <h2 style={{ margin: "20px", marginLeft: "0px" }}>Панель адміністратора</h2>
                        <div className="filters">
                            <input type="text" placeholder="Пошук..." />
                            <select>
                                <option value="">Фільтри</option>
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
                                <th>Дії</th>
                            </tr>
                        ) : admins.length > 0 ? (
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Login</th>
                                <th>Password</th>
                                {adminRole != "Site Admin" && (<th>Дії</th>)}

                            </tr>
                            ) : countries.length > 0 ? (
                                <tr>
                                    <th>ID</th>
                                    <th>CountryName</th>
                                    <th>CountryPhoto</th>
                                    <th>Дії</th>
                                </tr>
                            ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}>Даних не знайдено</td>
                            </tr>
                        )}

                    </thead>
                    <tbody>
                        {Array.isArray(filteredData) && users.length > 0 && filteredData.length > 0 ? (
                            filteredData.map((user) => (
                                <tr key={user.userID}>
                                    <td>{user.userID}</td>
                                    <td>{user.userName}</td>
                                    <td>{user.emailAddress}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => setEditingUser(user)}>Редагувати</button>
                                        <button className="delete-btn" onClick={() => handleDelete(user.userID, "user")}>Видалити</button>
                                    </td>
                                </tr>
                            ))
                        ) : Array.isArray(filteredData) && admins.length > 0 && filteredData.length > 0 ? (
                            filteredData.map((admin) => (
                                <tr key={admin.adminID}>
                                    <td>{admin.adminID}</td>
                                    <td>{admin.adminName}</td>
                                    <td>{admin.adminLogin}</td>
                                    <td>{admin.hashedPassword}</td>
                                    {adminRole !== "Site Admin" && (
                                        <td>
                                            <button className="edit-btn" onClick={() => setEditingAdmin(admin)}>Редагувати</button>
                                            <button className="delete-btn" onClick={() => handleDelete(admin.adminID, "admin")}>Видалити</button>
                                        </td>
                                    )}
                                </tr>
                            ))
                            ) : Array.isArray(filteredData) && countries.length > 0 && filteredData.length > 0 ? (
                                filteredData.map((country) => (
                                    <tr key={country.countryID}>
                                        <td>{country.countryID}</td>
                                        <td>{country.countryName}</td>
                                        <td>{country.countryPhoto}</td>
                                        <td>
                                            <button className="edit-btn" onClick={() => setEditingAdmin(country)}>Редагувати</button>
                                            <button className="delete-btn" onClick={() => handleDelete(country.countryID, "admin")}>Видалити</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center" }}>Даних не знайдено</td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

            {(editingUser !== null || editingAdmin !== null) && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Редагувати {editingUser ? "User" : "Admin"}</h3>
                        <label>Name:</label>
                        <input required type="text" value={editingUser ? editingUser.userName : editingAdmin.adminName}
                            onChange={(e) => {
                                if (editingUser) {
                                    setEditingUser({ ...editingUser, userName: e.target.value });
                                } else {
                                    setEditingAdmin({ ...editingAdmin, adminName: e.target.value });
                                }
                            }}
                        />
                        <label>Email/Login:</label>
                        <input required type="text" value={editingUser ? editingUser.emailAddress : editingAdmin.adminLogin}
                            onChange={(e) => {
                                if (editingUser) {
                                    setEditingUser({ ...editingUser, emailAddress: e.target.value });
                                } else {
                                    setEditingAdmin({ ...editingAdmin, adminLogin: e.target.value });
                                }
                            }}
                        />
                        <button onClick={handleSave} className="save-btn">Зберегти</button>
                        <button onClick={closeModal} className="cancel-btn">Скасувати</button>
                    </div>
                </div>
            )}

            {addingData && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Додати нове значення {currentDataType}</h3>

                        {renderFormFields(currentDataType)}

                        <button onClick={handleAddData}>Зберегти</button>
                        <button onClick={closeModal}>Скасувати</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;