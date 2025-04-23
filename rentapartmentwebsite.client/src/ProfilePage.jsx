import './css/profile-style.css';
import React, { Link, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfilePage({ setUser }) {
    const navigate = useNavigate();
    const [user, setLocalUser] = useState(null);
    const [adminRole, setAdminRole] = useState(null);
    const [editingAdminName, setEditingAdminName] = useState(null);
    const [editingUserName, setEditingUserName] = useState(null);
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
        setEditingUserName(null);

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

            closeAdminModal();

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

            closeAdminModal();

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
                <img src="images/pfp.jpg" alt="PFP image" className="profile-pictire"></img>
                <p className="user-name">{user?.userName || user?.adminName || 'User not found'}</p>
                <p className="role">{adminRole ? adminRole : "Гість"}</p>
                <div className="edit-name-button">
                    <img src="images/edit-icon.svg" alt="Edit image" className="edit-pictire"
                        onClick={() => {
                            if (adminRole) {
                                setEditingAdminName(user);
                            } else {
                                setEditingUserName(user);
                            }
                        }} />
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
                        <h1 className="header">100%</h1>
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
                    <img src="images/user-info-icon1.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Більярд</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/user-info-icon2.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Відеоігри</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/user-info-icon3.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Гастрономія</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/user-info-icon4.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Гумор</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/user-info-icon5.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Жива музика</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/user-info-icon6.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Кава</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/user-info-icon7.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Кіно</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/user-info-icon8.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Подорожі</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/user-info-icon8.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Піші прогулянки</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/user-info-icon8.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Технології</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/user-info-icon8.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Читання</p>
                </div>
                <div className="interests-info-item">
                    <img src="images/user-info-icon8.png" alt="Icon image" className="info-icon"></img>
                    <p className="sub-header">Шопінг</p>
                </div>
            </div>

            {editingAdminName !== null || editingUserName !== null && (
                <div className="modal-window">
                    <div className="edit-photo-name">
                        <img src="images/cross.png" alt="Cross image" className="close-btn" onClick={closeModal}></img>
                        <header>Редагування даних</header>
                        <div class="upload-photo-container">
                            <img src="images/pfp.jpg" alt="PFP image" className="edit-photo"></img>
                            <p className="note-text">Доступний розмір файлу не більше 6 МБ<br></br>у форматі JPEG, PNG або GIF.</p>
                            <input type="submit" className="upload-button" value="Завантажити фото" />
                            <div className='btn-border'>
                                <img src="images/delete-photo-icon.png" alt="delete image" className="delete-photo"></img>
                            </div>

                            <form>
                                <p className="form-header">Ім’я</p>
                                <input type="text" className="form-input" value={editingUserName.userName} placeholder="Введіть і'мя" required />

                                <p className="form-header">Прізвище</p>
                                <input type="text" className="form-input" placeholder="Введіть прізвище" required />
                                <input type="submit" className="button" value="Зберегти зміни" />
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
        //<div className="clinic_version" style={{ overflow: 'hidden' }}>
        //    <div className="container" style={{ marginTop: '150px' }}>
        //        <div className="profile-nav col-md-3">
        //            <div className="user-heading">
        //                <img src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" alt="User avatar" />
        //                <h1 style={{ color: '#fff', marginTop: '10px' }}>{user?.userName || user?.adminName || 'User not found'}</h1>
        //                <p>{user?.emailAddress || user?.adminLogin || 'No data available'}</p>
        //            </div>
        //            <button
        //                style={{ outline: 'none', marginTop: '25px', position: 'relative', left: '70px' }}
        //                onClick={handleLogout}
        //                className="btn-light btn-brd effect-1"
        //            >
        //                Log out
        //            </button>

        //            {adminRole != null && (
        //                <button style={{ outline: 'none', marginTop: '25px', position: 'relative', left: '70px' }}
        //                    onClick={handleAdminPanel} className="btn-light btn-brd effect-1" > Admin Panel </button>
        //            )}

        //        </div>

        //        <div className="profile-info col-md-9">
        //            <div className="panel">
        //                {adminRole != null ? (
        //                    <>
        //                        <div className="bio-graph-heading">
        //                            Administrator Personal Profile
        //                        </div>
        //                        <div className="bio-graph-info" style={{ marginTop: '25px' }}>
        //                            <div className="row">
        //                                <div className="bio-row">
        //                                    <p><span>Full Name </span>: {user.adminName}</p>
        //                                </div>
        //                                <div className="bio-row">
        //                                    <p><span>Login </span>: {user.adminLogin}</p>
        //                                </div>
        //                                <div className="bio-row">
        //                                    <p><span>Role</span>: {adminRole}</p>
        //                                </div>
        //                            </div>
        //                        </div>
        //                    </>
        //                ) : (
        //                    <>
        //                        <div className="bio-graph-heading">
        //                            User Personal Profile
        //                        </div>
        //                        <div className="bio-graph-info" style={{ marginTop: '25px' }}>
        //                            <div className="row">
        //                                <div className="col-md-6" onClick={() => navigate('/personal')}>
        //                                    <div className="panel">
        //                                        <div className="panel-body">
        //                                            <div className="bio-desk">
        //                                                <h4>Complete your profile</h4>
        //                                            </div>
        //                                        </div>
        //                                    </div>
        //                                </div>
        //                            </div>
        //                        </div>
        //                    </>
        //                )}

        //            </div>

        //            {adminRole != null && (
        //                <div className="row">
        //                    <div className="col-md-6" onClick={() => setEditingAdminName(user)}>
        //                        <div className="panel">
        //                            <div className="panel-body">
        //                                <div className="bio-desk">
        //                                    <h4>Change Name</h4>
        //                                </div>
        //                            </div>
        //                        </div>
        //                    </div>

        //                    <div className="col-md-6" onClick={() => setEditingAdminPassword(user)}>
        //                        <div className="panel">
        //                            <div className="panel-body">
        //                                <div className="bio-desk">
        //                                    <h4>Change Password</h4>
        //                                </div>
        //                            </div>
        //                        </div>
        //                    </div>
        //                </div>
        //            )}
        //        </div>

        //        {editingAdminName !== null && (
        //            <div className="modal">
        //                <div className="modal-content">
        //                    <h3>Change Name</h3>
        //                    <label>Name:</label>
        //                    <input required type="text" value={editingAdminName.adminName} onChange={(e) => { setEditingAdminName({ ...editingAdminName, adminName: e.target.value }); }} />
        //                    <button onClick={handleSave} className="save-btn">Save</button>
        //                    <button onClick={closeModal} className="cancel-btn">Cancel</button>
        //                </div>
        //            </div>
        //        )}

        //        {editingAdminPassword !== null && (
        //            <div className="modal">
        //                <div className="modal-content">
        //                    <h3>Change Password</h3>
        //                    <label>Password:</label>
        //                    <input required type="text" onChange={(e) => { setEditingAdminPassword({ ...editingAdminPassword, password: e.target.value }); }} />
        //                    <button onClick={handlePasswordSave} className="save-btn">Save</button>
        //                    <button onClick={closeModal} className="cancel-btn">Cancel</button>
        //                </div>
        //            </div>
        //        )}
        //    </div>
        //</div>
    );
}

export default ProfilePage;