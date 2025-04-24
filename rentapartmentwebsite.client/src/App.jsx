import './css/login-style.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import LoginPage from './LoginPage';
import SuccessPage from './SuccessPage';
import AccountPage from './AccountPage';
import ProfilePage from './ProfilePage';
import AdminPanel from './AdminPanel';
import AddPersonalData from './AddPersonalData';

function ProfileProtectedRoute({ user, children }) {
    if (!user) {
        return <SuccessPage />
    }
    return children;
}

function AdminProtectedRoute({ user, children }) {
    if (!user || !("adminLogin" in user)) {
        return <SuccessPage />;
    }
    return children;
}

function UserProtectedRoute({ user, children }) {
    if (!user || !("emailAddress" in user)) {
        return <SuccessPage />;
    }
    return children;
}

function App() {
    //#region Variables
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');
    const [isRegisterWindow, setIsRegisterWindow] = useState(null);

    const [nowAuthorizing, setNowAuthorizing] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [codeArray, setCodeArray] = useState(Array(6).fill(""))
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');

    const [tempUser, setTempUser] = useState(null);
    const [tempVerificationCode, setTempVerificationCode] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    //#endregion

    useEffect(() => {
        if (resendTimer > 0) {
            const interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [resendTimer]); // Таймер для кнопки "Надіслати код перевірки ще раз"

    const resetModal = () => {
        setIsRegisterWindow(false);
        setTempVerificationCode(null);
        setErrorMessage('');
        setIsVerifying(false);
        setIsAdmin(false);
        setNowAuthorizing('');
        setEmailAddress('');
        setPassword('');
        setVerificationCode('');
        setCodeArray(Array(6).fill(""));
        setNowAuthorizing('');
    };

    const updateUser = (newUser) => {
        setUser(newUser);
        if (newUser) {
            localStorage.setItem("user", JSON.stringify(newUser));
        } else {
            localStorage.removeItem("user");
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault(); // Предотвращаем обновление страницы
        setErrorMessage('');
        setIsAdmin(false);

        try {
            const adminResponse = await fetch(`/api/admins/login/${emailAddress}`);
            if (adminResponse.ok) { // Если был введён логин админа
                setIsAdmin(true);
                setIsVerifying(true);
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailAddress)) {
                alert("Будь ласка, перевірте правильність введеної електронної адреси");
                return;
            }

            try {
                const checkResponse = await fetch(`/api/users/check-email/${emailAddress}`); // Посылаем запрос на сервер и ждём ответ
                if (checkResponse.ok) {
                    const exists = await checkResponse.json();
                    if (exists) { // Если такой адрес уже существует (Вход)
                        const userResponse = await fetch(`/api/users/login/${emailAddress}`);
                        if (userResponse.ok) {
                            const sendCodeResponse = await fetch(`/api/users/send-code/${emailAddress}`);
                            if (sendCodeResponse.ok) {
                                const { verificationCode } = await sendCodeResponse.json();
                                setTempVerificationCode(verificationCode);
                                setIsVerifying(true);
                                setNowAuthorizing('');
                                const user = await userResponse.json();
                                setTempUser(user);
                            }
                        }
                    } else { // Если такого адреса нет (Регистрация)
                        try {
                            const codeResponse = await fetch(`/api/users/send-code/${emailAddress}`);
                            if (!codeResponse.ok) {
                                alert('Не вдалося надіслати код перевірки. Спробуйте ще раз');
                                return;
                            }

                            const { verificationCode } = await codeResponse.json();
                            setTempVerificationCode(verificationCode);
                            setIsVerifying(true);
                            setNowAuthorizing("First Time");
                            return;
                        } catch (error) {
                            alert('Помилка надсилання коду перевірки');
                            return;
                        }
                    }
                }
            } catch (error) {
                alert('Помилка при перевірці електронної пошти');
                return;
            }
        } catch (error) {
            alert('Помилка при вході в систему');
        }
    };

    const handleAdminLogin = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        try {
            const response = await fetch('/api/admins/check-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailAddress, password: password }),
            });

            if (response.ok) {
                const admin = await response.json();
                setUser(admin);
                localStorage.setItem("user", JSON.stringify(admin));
                resetModal();
                navigate('/admin');
            } else {
                alert('Incorrect password!');
            }
        } catch (error) {
            alert('Error verifying password');
        }
    };

    const handleVerifyCode = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        if (verificationCode === tempVerificationCode && nowAuthorizing == '') { // Если совпал код (Вход)
            const response = await fetch('/api/users/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailAddress, code: verificationCode })
            });

            if (response.ok) {
                setUser(tempUser);
                localStorage.setItem("user", JSON.stringify(tempUser));
                resetModal();
                navigate('/account');
            } else {
                alert('Код недійсний');
            }
        }
        else if (verificationCode === tempVerificationCode && nowAuthorizing != '') { // Если совпал код (Регистрация)
            const userData = {
                userName: "Користувач",
                emailAddress,
                lastName: "",
                photo: null,
                registrationDate: new Date().toISOString(),
                trustRating: 0.0,
                biography: "",
                location: "",
                university: "",
                pets: "",
                dreamTrip: "",
                profession: "",
                hobby: "",
                badHabits: ""
            };

            try {
                const response = await fetch('/api/users/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }, // Отправляемые данные в формате JSON
                    body: JSON.stringify(userData), // Превращаем объект userData в строку JSON
                });

                if (response.ok) {
                    const result = await response.json();
                    setUser(result);
                    localStorage.setItem("user", JSON.stringify(result));
                    resetModal();
                    navigate('/profile');
                } else {
                    alert('Помилка при реєстрації');
                }
            } catch (error) {
                alert('Помилка при реєстрації');
            }

        } else {
            alert('Невірний код перевірки!');
        }
    };

    const resendVerificationCode = async () => {
        if (resendTimer > 0) return; // Защита от повторного нажатия

        try {
            const response = await fetch(`/api/users/send-code/${emailAddress}`);
            if (response.ok) {
                const { verificationCode } = await response.json();
                setTempVerificationCode(verificationCode);
                alert("Код перевірки повторно надіслано на електронну пошту.");
                setResendTimer(15);
            } else {
                alert("Не вдалося надіслати код. Спробуйте ще раз.");
            }
        } catch (error) {
            alert("Виникла помилка при повторній відправці коду.");
        }
    };


    //#region HandleCodeInput
    const handleChange = (value, index) => {
        const upperValue = value.toUpperCase();
        const updated = [...codeArray];
        updated[index] = upperValue;

        setCodeArray(updated);
        setVerificationCode(updated.join(""));

        if (upperValue && index < codeArray.length - 1) {
            const nextInput = document.getElementById(`code-input-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && codeArray[index] === "" && index > 0) {
            const prevInput = document.getElementById(`code-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("Text").toUpperCase().replace(/\s/g, "");
        if (!pastedData) return;

        const updated = [...codeArray];
        for (let i = 0; i < codeArray.length; i++) {
            updated[i] = pastedData[i] || "";
        }

        setCodeArray(updated);
        setVerificationCode(updated.join(""));

        const lastFilledIndex = Math.min(pastedData.length - 1, codeArray.length - 1);
        const nextInput = document.getElementById(`code-input-${lastFilledIndex}`);
        if (nextInput) nextInput.focus();
    };
    //#endregion

    return (
        <div className="App">
            {!isAdminPage && (
                <nav className="navbar">
                    <div className="container">
                        <Link to="/"><img src="images/logo.png" alt="Logo image" className="logo"></img></Link>
                    </div>

                    <div className="navigation">
                        <p className={location.pathname === "/" ? "nav-active" : "nav-li"}><Link to="/">Головна</Link></p>
                        <p className={location.pathname === "/about" ? "nav-active" : "nav-li"}><Link to="/about">Про нас</Link></p>
                        <p className="nav-li"><Link to="/about">Житло</Link></p>
                        <p className="nav-li"><Link to="/about">Країни</Link></p>

                    </div>

                    <div className="icon-container">
                        <img src="images/wish-icon.svg" alt="Wish image" className="icon" style={{ width: "26px", height: "26px" }}></img>

                        {user ? (
                            <Link to="/account" state={{ user: user }}><img src="images/profile-icon.svg" alt="Profile image" className="icon" style={{ width: "24px", height: "24px" }}></img></Link>
                        ) : (
                            <img src="images/profile-icon.svg" alt="Profile image" onClick={() => setIsRegisterWindow(true)} className="icon" style={{ width: "24px", height: "24px" }}></img>
                        )}

                        <img src="images/menu-icon.svg" alt="Menu image" className="icon" style={{ width: "24px", height: "24px" }}></img>
                    </div>
                </nav>
            )}

            {isRegisterWindow && (
                <div className="modal">
                    {!isAdmin && !isVerifying ? ( // Если входит пользователь и не стоит проверка кода
                        <div className="login-container">
                            <div className="login form">
                                <img src="images/cross.png" alt="Cross image" onClick={() => setIsRegisterWindow(false)} className="close-btn"></img>
                                <header>Вхід / Реєстрація</header>
                                <form onSubmit={handleLogin}>
                                    <p className="form-header">Електронна пошта</p>
                                    <input type="text" className="form-input" placeholder="Введіть електронну пошту" value={emailAddress}
                                        onChange={(e) => setEmailAddress(e.target.value)} required />
                                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                                    <input type="submit" className="button" value="Продовжити" />
                                </form>

                                <div className="divider">
                                    <span className="line"></span>
                                    <span className="text">або</span>
                                    <span className="line"></span>
                                </div>

                                <div className="other">
                                    <div className="other-item">
                                        <img src="images/google-icon.png" alt="Google image" className="other-icon"></img>
                                        <p className="other-text">Увійти з Google</p>
                                    </div>
                                    <div className="other-item">
                                        <img src="images/facebook-icon.png" alt="Facebook image" className="other-icon" style={{ width: "14px" }}></img>
                                        <p className="other-text">Увійти з Facebook</p>
                                    </div>
                                    <div className="other-item">
                                        <img src="images/apple-icon.png" alt="Apple image" className="other-icon"></img>
                                        <p className="other-text">Увійти з Apple</p>
                                    </div>
                                </div>

                                <p className="footer-text">Увійшовши або зареєструвавшись, ви приймаєте <u>Умови<br></br>та положення</u> і <u>Положення про конфіденційність</u> Dwell.</p>
                            </div>
                        </div>

                    ) : isVerifying && isAdmin ? ( // Если стоит проверка кода и входит админ

                        <div className="code-container">
                            <div className="login form">
                                <img src="images/cross.png" onClick={() => setIsRegisterWindow(false)} alt="Cross image" className="close-btn"></img>
                                <img src="images/arrow.png" onClick={() => setIsVerifying(false)} alt="Arrow image" className="back-btn"></img>
                                <header>Введіть пароль</header>
                                <form onSubmit={handleAdminLogin} style={{ marginTop: "70px" }}>
                                    <input type="password" className="form-input" placeholder="Введіть пароль" value={password}
                                        onChange={(e) => setPassword(e.target.value)} required />
                                    <input type="submit" className="button" value="Увійти як Адміністратор" />
                                </form>

                            </div>
                        </div>

                    ) : isVerifying && !isAdmin ? ( // Если стоит проверка кода и входит пользователь
                        <div className="code-container">
                            <div className="login form">
                                <img src="images/cross.png" onClick={() => setIsRegisterWindow(false)} alt="Cross image" className="close-btn"></img>
                                <img src="images/arrow.png" onClick={() => setIsVerifying(false)} alt="Arrow image" className="back-btn"></img>
                                <header id='code-header'>Введіть код перевірки</header>
                                <p className="code-header">Ми надіслали код перевірки на <b>Вашу електронну пошту</b>.<br></br>Перевірте папку з вхідними повідомленнями<br></br>та введіть код нижче.</p>
                                <p className="code-subheader">*Код підтвердження дійсний протягом 20 хвилин після його отримання.</p>
                                <form onSubmit={handleVerifyCode} style={{ marginTop: "70px" }} className="code-input-form">
                                    <div className="code-inputs">
                                        {codeArray.map((char, i) => (
                                            <input
                                                key={i}
                                                id={`code-input-${i}`}
                                                type="text"
                                                maxLength="1"
                                                className="code-input"
                                                value={char}
                                                onChange={(e) => handleChange(e.target.value, i)}
                                                onKeyDown={(e) => handleKeyDown(e, i)}
                                                onPaste={(e) => handlePaste(e)}
                                            />
                                        ))}
                                    </div>

                                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                                    <p
                                        className="resend-btn"
                                        onClick={resendVerificationCode}
                                        style={{
                                            color: resendTimer > 0 ? "#A0A0A0" : "#E84E0F",
                                            cursor: resendTimer > 0 ? "not-allowed" : "pointer",
                                            pointerEvents: resendTimer > 0 ? "none" : "auto",
                                        }}
                                    >
                                        {resendTimer > 0 ? `Надіслати код перевірки ще раз (${resendTimer}с)` : "Надіслати код перевірки ще раз"}
                                    </p>

                                    <input type="submit" className="button" value="Увійти" />
                                </form>

                            </div>
                        </div>
                    ) : null}

                </div>
            )}

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage setUser={updateUser} />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/admin" element={<AdminProtectedRoute user={user}><AdminPanel setUser={updateUser} /></AdminProtectedRoute>} />
                <Route path="/account" element={<ProfileProtectedRoute user={user}><AccountPage setUser={updateUser} /></ProfileProtectedRoute>} />
                <Route path="/profile" element={<ProfileProtectedRoute user={user}><ProfilePage setUser={updateUser} /></ProfileProtectedRoute>} />
                <Route path="/personal" element={<UserProtectedRoute user={user}><AddPersonalData setUser={updateUser} /></UserProtectedRoute>} />
            </Routes>

            {!isAdminPage && (
                <div className="footer-area">
                    <div className="container">
                        <div className="col">
                            <img src="images/footer-logo.png" alt="Logo image" className="footer-logo"></img>
                            <div className="col-group">
                                <p id='copyright'>© 2025 Dwell. Всі права захищені.</p>
                                <p className='group1-item'>Налаштування файлів cookie</p>
                                <p className='group1-item'>Конфіденційність</p>
                                <p className='group1-item'>Умови користування</p>
                            </div>

                            <div className="col-group2">
                                <p id='group-header'>Меню</p>
                                <p className='group2-item'>Головна</p>
                                <p className='group2-item'>Про нас</p>
                                <p className='group2-item'>Житло</p>
                                <p className='group2-item'>Додаток</p>
                                <p className='group2-item'>Популярні країни</p>
                                <p className='group2-item'>Інтерактивна карта</p>
                                <p className='group2-item'>Блог</p>
                            </div>

                            <div className="col-group3">
                                <p id='group-header'>Допомога</p>
                                <p className='group2-item'>Центр допомоги</p>
                                <p className='group2-item' style={{ width: "150px" }}>Найчастіші запитання</p>
                                <p className='group2-item'>Зв'язатися з нами</p>
                                <p className='group2-item'>Партнерам</p>
                                <p className='group2-item'>Господарям житла</p>
                            </div>

                            <div className="col-group4">
                                <p id='group-header'>Контакти</p>
                                <p className='group2-item'>+380 (66) 517-71-08</p>
                                <p className='group2-item'>+380 (96) 233-65-13</p>
                                <p className='group2-item'>info@dwell.com</p>
                                <p id='date' style={{ fontSize: "14px" }}>Пн - Пт 09:00 - 18:00</p>
                                <div className="icon-group">
                                    <img src="images/instagram-icon.svg" alt="Instagram image" className="group-icon"></img>
                                    <img src="images/vyber-icon.svg" alt="Vyber image" className="group-icon"></img>
                                    <img src="images/telegram-icon.svg" alt="Telegram image" className="group-icon"></img>
                                    <img src="images/facebook-icon.svg" alt="Facebook image" className="group-icon"></img>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function WrappedApp() {
    return (
        <Router>
            <App />
        </Router>
    );
}