import React, { Link, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/profile-style.css';

function AccountPage({ setUser }) {
    const navigate = useNavigate();
    const [user, setLocalUser] = useState(null);
    const [adminRole, setAdminRole] = useState(null);
    const [editingAdminName, setEditingAdminName] = useState(null);
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

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate('/');
    };

    const goToProfile = () => {
        navigate('/profile');
    }

    return (
        <div className="main-container">
            <div className="account-header">
                <h2>Обліковий запис</h2>
                <div className='underline'></div>
                <div className='button-group'>
                    <p className='active'>Гість</p>
                    <p>Господар</p>
                </div>
                <div className='profile-button-group'>
                    <p onClick={goToProfile}>Перейти до профілю</p>
                    <img src="images/arrow.svg" alt="Wish image" className="icon" style={{ width: "15px", height: "15px" }}></img>
                </div>
            </div>

            <div className="block-container">
                <div className='block'>
                    <img src="images/block-icon1.png" alt="Block image" className="block-icon"></img>
                    <p className='block-header'>Особисті дані</p>
                    <p className='block-subheader'>Укажіть або оновіть особисту інформацію, контактні<br></br>дані та пройдіть верифікацію</p>
                </div>

                <div className='block'>
                    <img src="images/block-icon2.png" alt="Block image" className="block-icon"></img>
                    <p className='block-header' style={{ top: "120px" }}>Безпека та налаштування</p>
                    <p className='block-subheader' style={{ top: "145px" }}>Захистіть свій обліковий запис, керуйте<br></br>особистими даними, під’єднаними сервісами<br></br>та налаштуваннями обміну даними.</p>
                </div>

                <div className='block'>
                    <img src="images/block-icon3.png" alt="Block image" className="block-icon"></img>
                    <p className='block-header'>Платежі й виплати</p>
                    <p className='block-subheader'>Переглядайте платежі, виплати, купони,<br></br>знижки та подарункові картки.</p>
                </div>

                <div className='block'>
                    <img src="images/block-icon4.png" alt="Block image" className="block-icon"></img>
                    <p className='block-header'>Загальні вподобання</p>
                    <p className='block-subheader'>Встановіть мову, валюту та часовий пояс<br></br>за замовчуванням.</p>
                </div>

                <div className='block'>
                    <img src="images/block-icon5.png" alt="Block image" className="block-icon"></img>
                    <p className='block-header'>Сповіщення</p>
                    <p className='block-subheader'>Виберіть параметри сповіщень<br></br>і спосіб зв’язку з вами.</p>
                </div>

                <div className='block'>
                    <img src="images/block-icon6.png" alt="Block image" className="block-icon"></img>
                    <p className='block-header'>Бронювання</p>
                    <p className='block-subheader'>Переглядайте ваші активні бронювання, історію<br></br>поїздок та керуйте запланованими заселеннями.</p>
                </div>

                <div className='block'>
                    <img src="images/block-icon7.png" alt="Block image" className="block-icon"></img>
                    <p className='block-header'>Робочі поїздки</p>
                    <p className='block-subheader'>Додайте робочу електронну адресу і скористайтеся<br></br>додатковими привілеями для ділових поїздок.</p>
                </div>

                <div className='block'> 
                    <img src="images/block-icon8.png" alt="Block image" className="block-icon"></img>
                    <p className='block-header'>Допомога та зворотній зв'язок</p>
                    <p className='block-subheader'>Знайдіть відповіді на часті запитання<br></br>або надішліть звернення до служби підтримки.</p>
                </div>
            </div>

            <div className="deactivate-buttons">
                <p>Бажаєте деактивувати обліковий запис?</p>
                <button className="deactivate-btn" onClick={handleLogout}>Деактивувати</button>
            </div>
        </div>
    );
}

export default AccountPage;