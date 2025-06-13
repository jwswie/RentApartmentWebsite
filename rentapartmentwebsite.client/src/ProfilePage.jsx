import './css/profile-style.css';
import React, { Link, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfilePage({ setUser }) {
    const navigate = useNavigate();
    const [user, setLocalUser] = useState(null);
    const [adminRole, setAdminRole] = useState(null);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [editingAdminPassword, setEditingAdminPassword] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setLocalUser(parsedUser);

            if ("adminLogin" in parsedUser) {
                if (parsedUser.adminLogin.includes("org")) {
                    setAdminRole("Головний адміністратор");
                } else if (parsedUser.adminLogin.includes("site")) {
                    setAdminRole("Адміністратор");
                }
            }
        } else {
            navigate('/');
        }
    }, []);

    const closeModal = () => {
        setEditingAdmin(null);
        setEditingUser(null);

    };

    const handleEditUserSave = async () => {
        try {
            const response = await fetch(`/api/users/${editingUser.userID}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...editingUser }),
            });

            if (!response.ok) throw new Error("Failed to update data");

            const updatedUser = await response.json();

            closeModal();

            setLocalUser(updatedUser);
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

        } catch (error) {
            alert("Помилка оновлення даних:", error);
        }
    };

    const handleEditAdminSave = async () => {
        try {
            if (!editingAdmin || !editingAdmin.adminName || !editingAdmin.hashedPassword) {
                alert("Будь ласка, введіть ім’я та пароль");
                return;
            }

            let url = `/api/admins/new-password/${editingAdmin.adminID}`;
            let method = "PUT";
            let body = { password: editingAdmin.hashedPassword };

            const password_response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!password_response.ok) throw new Error("Failed to update password");

            const response = await fetch(`/api/admins/${editingAdmin.adminID}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...editingAdmin }),
            });

            if (!response.ok) throw new Error("Помилка при збереженні");

            const updatedAdmin = await response.json();
            closeModal();
            setLocalUser(updatedAdmin);
            setUser(updatedAdmin);
            localStorage.setItem("user", JSON.stringify(updatedAdmin));
        } catch (error) {
            alert("Помилка збереження даних адміністратора:", error.message);
        }
    };

    const handlePhotoUpload = (event) => {
        const file = event.target.files[0]; // Считываем файл, выбранный пользователем
        if (!file) return;

        const maxSizeInBytes = 6 * 1024 * 1024;

        if (file.size > maxSizeInBytes) {
            alert('Розмір файлу не повинен перевищувати 6 МБ');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file); // Читаем как base64

        reader.onloadend = () => {
            const base64 = reader.result.split(',')[1]; // Отрезаем "data:image/***;base64,"
            const updated = {
                ...editingUser,
                photoBase64: base64,
            };

            setEditingUser(updated);
        };
    };

    const handleDeletePhoto = () => {
        if (editingUser) {
            setEditingUser({
                ...editingUser,
                photo: null,
                photoBase64: "" // ❗ явно отправляем пустую строку на сервер
            });
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

            closeAdminModal();

        } catch (error) {
            alert("Error updating password:", error);
        }
    };

    const handleAdminPanel = () => {
        navigate('/admin');
    };

    return (
        <div className="main-container" style={{ marginTop: "-20px" }}>
            <img src="images/profile-banner.png" className="profile-banner"></img>
            <div className="profile-nav">
                <p className="nav" onClick={() => navigate('/account')}>Обліковий запис</p>
                <img src="images/profile-arrow.png" className="profile-arrow"></img>
                <p className="nav" style={{ fontWeight: "100" }}><u>Профіль</u></p>
            </div>

            <div className="profile-block">
                {user?.photo ? (
                    <img src={`data:image/jpeg;base64,${user.photo}`} className="profile-pictire" />
                ) : (
                    <div className="profile-picture-wrapper">
                        <img src="images/no-pfp.png" className="no-profile-picture" />
                    </div>
                )}

                <p className="user-name">{user?.userName || user?.adminName || 'User not found'}</p>
                <p className="role">{adminRole ? adminRole : "Гість"}</p>
                {user && (
                    <div className="edit-name-button" onClick={() => {
                        adminRole ? setEditingAdmin(user) : setEditingUser(user);
                    }}>
                        <img src="images/edit-icon.svg" className="edit-pictire" />
                    </div>
                )}

            </div>

            <div className="info-profile-block">
                <div className="info-container">
                    <div className="info-item">
                        <h1 className="header">{user?.registrationDate ? new Date().getFullYear() - new Date(user.registrationDate).getFullYear() : '0'}</h1>
                        <p className="subheader">Роки на Dwell</p>
                    </div>
                    <div className="info-item">
                        <h1 className="header">0</h1>
                        <p className="subheader">Міст відвідано</p>
                    </div>
                    <div className="info-item">
                        <h1 className="header">{user?.trustRating}%</h1>
                        <p className="subheader">Довіри</p>
                    </div>
                </div>
            </div>

            <div className="about-block-header">
                <h1 className="header">Про {user?.userName || user?.adminName || 'User not found'}</h1>
                <p className="edit-button">Редагувати</p>
            </div>

            <div className="user-info">
                <div className="user-info-item">
                    <img src="images/user-info-icon1.png" className="info-icon"></img>
                    <h1 className="header">Місце проживання:</h1>
                    <p className="sub-header">Київ, Україна</p>
                </div>
                <div className="user-info-item">
                    <img src="images/user-info-icon2.png" className="info-icon"></img>
                    <h1 className="header">Навчальний заклад:</h1>
                    <p className="sub-header">КПІ ім. Ігоря Сікорського</p>
                </div>
                <div className="user-info-item">
                    <img src="images/user-info-icon3.png" className="info-icon"></img>
                    <h1 className="header">Домашні тварини:</h1>
                    <p className="sub-header">Кролик</p>
                </div>
                <div className="user-info-item">
                    <img src="images/user-info-icon4.png" className="info-icon"></img>
                    <h1 className="header">Подорож моєї мрії:</h1>
                    <p className="sub-header">Колізей у центрі Риму в Італії</p>
                </div>
                <div className="user-info-item">
                    <img src="images/user-info-icon5.png" className="info-icon"></img>
                    <h1 className="header">Моя професія:</h1>
                    <p className="sub-header">Frontend Developer</p>
                </div>
                <div className="user-info-item">
                    <img src="images/user-info-icon6.png" className="info-icon"></img>
                    <h1 className="header">Володіє такими мовами:</h1>
                    <p className="sub-header">Англійська, Українська</p>
                </div>
                <div className="user-info-item">
                    <img src="images/user-info-icon7.png" className="info-icon"></img>
                    <h1 className="header">Найбільше захоплення:</h1>
                    <p className="sub-header">Гори, море та закат</p>
                </div>
                <div className="user-info-item">
                    <img src="images/user-info-icon8.png" className="info-icon"></img>
                    <h1 className="header">Шкідливі звички:</h1>
                    <p className="sub-header">Алкоголь</p>
                </div>
            </div>

            <div className="user-bio">
                <p className="bio-text">Спокійна, охайна і ввічлива. Ціную затишок і повагу до простору інших. Часто подорожую у пошуках нових країн, де можна перезавантажитись і надихнутись. Люблю чистоту, тишу, гарну каву зранку й хороший інтернет (бо працюю онлайн). До речей ставлюсь з турботою, а до людей — з повагою. Зі мною завжди просто й комфортно!</p>
            </div>

            <div className='underline'></div>

            <div className="about-block-header" style={{ top: "65px" }}>
                <h1 className="header">Зацікавлення користувача {user?.userName || user?.adminName || 'User not found'}</h1>
                <p className="edit-button">Редагувати</p>
            </div>

            <div className="interests-info" style={{ marginBottom: "300px" }}>
                <div className="interests-info-item">
                    <img src="images/interests-icon1.png" className="info-icon"></img>
                    <p className="sub-header">Більярд</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon2.png" className="info-icon"></img>
                    <p className="sub-header">Відеоігри</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon3.png" className="info-icon"></img>
                    <p className="sub-header">Гастрономія</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon4.png" className="info-icon"></img>
                    <p className="sub-header">Гумор</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon5.png" className="info-icon"></img>
                    <p className="sub-header">Жива музика</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon6.png" className="info-icon"></img>
                    <p className="sub-header">Кава</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon7.png" className="info-icon"></img>
                    <p className="sub-header">Кіно</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon8.png" className="info-icon"></img>
                    <p className="sub-header">Подорожі</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon9.png" className="info-icon"></img>
                    <p className="sub-header">Піші прогулянки</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon10.png" className="info-icon"></img>
                    <p className="sub-header">Технології</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon11.png" className="info-icon"></img>
                    <p className="sub-header">Читання</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon12.png" className="info-icon"></img>
                    <p className="sub-header">Шопінг</p>
                </div>
            </div>

            {editingUser !== null ? (
                <div className="modal-window">
                    <div className="edit-photo-name">
                        <img src="images/cross.png" className="close-btn" onClick={closeModal} />
                        <header>Редагування даних</header>
                        <div className="upload-photo-container">
                            {editingUser.photo ? (
                                <img src={`data:image/jpeg;base64,${editingUser.photoBase64 || editingUser.photo}`} className="edit-photo" />
                            ) : (
                                <div className="profile-picture-wrapper">
                                    <img src="images/no-pfp.png" className="no-profile-picture" alt="No profile" />
                                </div>
                            )}

                            <p className="note-text"> Доступний розмір файлу не більше 6 МБ<br />у форматі JPEG, PNG або GIF. </p>
                            <label className="upload-button">
                                Завантажити фото
                                <input type="file" accept="image/jpeg, image/png, image/gif" onChange={handlePhotoUpload} className="hidden-file-input" />
                            </label>

                            <div className="btn-border" onClick={handleDeletePhoto}>
                                <img src="images/delete-photo-icon.png" className="delete-photo" alt="Delete" />
                            </div>

                            <form>
                                <p className="form-header">Ім’я</p>
                                <input
                                    required
                                    type="text"
                                    className="form-input"
                                    value={editingUser.userName}
                                    onChange={(e) => setEditingUser({ ...editingUser, userName: e.target.value })}
                                    placeholder="Введіть ім’я"
                                />

                                <p className="form-header">Прізвище</p>
                                <input
                                    required
                                    type="text"
                                    className="form-input"
                                    value={editingUser.lastName}
                                    onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                                    placeholder="Введіть прізвище"
                                />

                                <input type="button" onClick={handleEditUserSave} className="button" value="Зберегти зміни" />
                            </form>
                        </div>
                    </div>
                </div>
            ) : editingAdmin !== null ? (
                <div className="modal-window">
                        <div className="edit-photo-name" style={{ height: "500px" }}>
                            <img src="images/cross.png" className="close-btn" onClick={closeModal} />
                            <header>Редагування даних</header>
                            <div className="upload-photo-container" style={{ marginTop: "100px" }}>
                                <form>
                                    <p className="form-header">Ім’я</p>
                                    <input
                                        required
                                        type="text"
                                        className="form-input"
                                        value={editingAdmin.adminName}
                                        onChange={(e) => setEditingAdmin({ ...editingAdmin, adminName: e.target.value })}
                                        placeholder="Введіть ім’я"
                                    />

                                    <p className="form-header">Пароль</p>
                                    <input
                                        required
                                        type="text"
                                        className="form-input"
                                        onChange={(e) => setEditingAdmin({ ...editingAdmin, hashedPassword: e.target.value })}
                                        placeholder="Введіть новий пароль"
                                    />

                                    <input type="button" onClick={handleEditAdminSave} className="button" value="Зберегти зміни" />
                                </form>
                            </div>
                        </div>
                    </div>
            ) : null}

        </div>
    );
}

export default ProfilePage;