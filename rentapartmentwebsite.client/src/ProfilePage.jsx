import './css/profile-style.css';
import React, { Link, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function byteArrayToBase64(byteArray) {
    let binary = '';
    for (let i = 0; i < byteArray.length; i++) {
        binary += String.fromCharCode(byteArray[i]);
    }
    return window.btoa(binary);
}

function ProfilePage({ setUser }) {
    const navigate = useNavigate();
    const [user, setLocalUser] = useState(null);
    const [adminRole, setAdminRole] = useState(null);
    const [editingAdminName, setEditingAdminName] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
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

    const handlePhotoUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file); // читаем как base64

        reader.onloadend = () => {
            const base64 = reader.result.split(',')[1]; // отрезаем "data:image/png;base64,"
            const updated = {
                ...editingUser,
                photoBase64: base64, // временно храним как отдельное поле
            };

            setEditingUser(updated);
            console.log("Фотография загружена в память:", updated.photoBase64);
        };
    };

    const handleDeletePhoto = () => {
        if (editingUser) {
            setEditingUser({ ...editingUser, photo: null });
        }
        if (editingAdminName) {
            setEditingAdminName({ ...editingAdminName, photo: null });
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

    const goToAccount = () => {
        navigate('/account');
    }

    return (
        <div className="main-container" style={{ marginTop: "105px" }}>
            <img src="images/profile-banner.png" alt="Banner image" className="profile-banner"></img>
            <div className="profile-nav">
                <p className="nav" onClick={goToAccount}>Обліковий запис</p>
                <img src="images/profile-arrow.png" alt="Arrow image" className="profile-arrow"></img>
                <p className="nav" style={{ fontWeight: "100" }}><u>Профіль</u></p>
            </div>

            <div className="profile-block">
                {user?.photo ? (
                    <img
                        src={`data:image/jpeg;base64,${user.photo}`}
                        alt="Profile"
                        className="profile-pictire"
                    />
                ) : (
                    <div className="profile-picture-wrapper">
                        <img src="images/no-pfp.png" alt="No Profile" className="no-profile-picture" />
                    </div>
                )}


                <p className="user-name">{user?.userName || user?.adminName || 'User not found'}</p>
                <p className="role">{adminRole ? adminRole : "Гість"}</p>
                <div className="edit-name-button">
                    <img
                        src="images/edit-icon.svg"
                        alt="Edit image"
                        className="edit-pictire"
                        onClick={() => {
                            if (adminRole) {
                                setEditingAdminName(user);
                            } else {
                                setEditingUser(user);
                            }
                        }}
                    />
                </div>
            </div>


            <div className="info-profile-block">
                <div className="info-container">
                    <div className="info-item">
                        <h1 className="header">4</h1>
                        <p className="subheader">Роки на Dwell</p>
                    </div>
                    <div className="info-item">
                        <h1 className="header">25</h1>
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
                    <img src="images/user-info-icon1.png" alt="Icon image" className="info-icon"></img>
                    <h1 className="header">Місце проживання:</h1>
                    <p className="sub-header">Київ, Україна</p>
                </div>
                <div className="user-info-item">
                    <img src="images/user-info-icon2.png" alt="Icon image" className="info-icon"></img>
                    <h1 className="header">Навчальний заклад:</h1>
                    <p className="sub-header">КПІ ім. Ігоря Сікорського</p>
                </div>
                <div className="user-info-item">
                    <img src="images/user-info-icon3.png" alt="Icon image" className="info-icon"></img>
                    <h1 className="header">Домашні тварини:</h1>
                    <p className="sub-header">Кролик</p>
                </div>
                <div className="user-info-item">
                    <img src="images/user-info-icon4.png" alt="Icon image" className="info-icon"></img>
                    <h1 className="header">Подорож моєї мрії:</h1>
                    <p className="sub-header">Колізей у центрі Риму в Італії</p>
                </div>
                <div className="user-info-item">
                    <img src="images/user-info-icon5.png" alt="Icon image" className="info-icon"></img>
                    <h1 className="header">Моя професія:</h1>
                    <p className="sub-header">Frontend Developer</p>
                </div>
                <div className="user-info-item">
                    <img src="images/user-info-icon6.png" alt="Icon image" className="info-icon"></img>
                    <h1 className="header">Володіє такими мовами:</h1>
                    <p className="sub-header">Англійська, Українська</p>
                </div>
                <div className="user-info-item">
                    <img src="images/user-info-icon7.png" alt="Icon image" className="info-icon"></img>
                    <h1 className="header">Найбільше захоплення:</h1>
                    <p className="sub-header">Гори, море та закат</p>
                </div>
                <div className="user-info-item">
                    <img src="images/user-info-icon8.png" alt="Icon image" className="info-icon"></img>
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
                    <img src="images/interests-icon1.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Більярд</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon2.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Відеоігри</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon3.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Гастрономія</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon4.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Гумор</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon5.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Жива музика</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon6.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Кава</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon7.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Кіно</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon8.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Подорожі</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon9.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Піші прогулянки</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon10.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Технології</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon11.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Читання</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/interests-icon12.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Шопінг</p>
                </div>
            </div>

            {editingAdminName !== null || editingUser !== null && (
                <div className="modal-window">
                    <div className="edit-photo-name">
                        <img src="images/cross.png" alt="Cross image" className="close-btn" onClick={closeModal}></img>
                        <header>Редагування даних</header>
                        <div class="upload-photo-container">
                            {editingUser?.photo ? (
                                <img src={`data:image/jpeg;base64,${editingUser.photo}`} alt="PFP image" className="edit-photo"></img>
                            ) : (
                                <div className="profile-picture-wrapper">
                                    <img src="images/no-pfp.png" alt="PFP image" className="no-profile-picture" />
                                </div>
                            )}
                            
                            <p className="note-text">Доступний розмір файлу не більше 6 МБ<br></br>у форматі JPEG, PNG або GIF.</p>
                            <label className="upload-button">
                                Завантажити фото
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden-file-input"
                                />
                            </label>


                            <div className='btn-border' onClick={handleDeletePhoto}>
                                <img src="images/delete-photo-icon.png" alt="delete image" className="delete-photo"></img>
                            </div>

                            <form>
                                <p className="form-header">Ім’я</p>
                                <input required type="text" className="form-input" value={editingUser.userName} onChange={(e) => { setEditingUser({ ...editingUser, userName: e.target.value }); }} placeholder="Введіть і'мя" />

                                <p className="form-header">Прізвище</p>
                                <input type="text" className="form-input" placeholder="Введіть прізвище" required value={editingUser.lastName} onChange={(e) => { setEditingUser({ ...editingUser, lastName: e.target.value }); }} />

                                <input type="button" onClick={handleEditUserSave} className="button" value="Зберегти зміни" />
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;