import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import './css/booking-style.css';

const monthsUA = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];
function BookingPage({ setUser }) {
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const location = useLocation();
    const apartment = location.state?.apartment;
    const arrivalDate = location.state?.arrivalDate;
    const departureDate = location.state?.departureDate;
    const guestsSummary = location.state?.guestsSummary;
    const totalPrice = location.state?.totalPrice;
    const [user, setLocalUser] = useState(null);
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        fetch("/api/countries")
            .then(res => res.json())
            .then(data => setCountries(data))
            .catch(error => console.error('Помилка:', error));
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setLocalUser(parsedUser);
        } else {
            navigate('/');
        }
    }, []);

    const formatCardNumber = (value) => {
        return value
            .replace(/\D/g, "") // удаляем всё, кроме цифр
            .replace(/(.{4})/g, "$1 ") // добавляем пробел после каждых 4 цифр
            .trim(); // убираем лишний пробел в конце
    };

    const handleCardInputChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setCardNumber(formatted);
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length >= 3) {
            value = value.slice(0, 2) + " / " + value.slice(2);
        }
        setExpiry(value);
    };

    const handleCvvChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 3) setCvv(value);
    };

    const handlePostalCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 5) {
            setPostalCode(value);
        }
    };

    const formatDate = (isoDate) => {
        const [year, month, day] = isoDate.split("-");
        return `${parseInt(day)} ${monthsUA[parseInt(month) - 1]}`;
    };

    function getWeekday(dateString) {
        if (!dateString) return "";

        const days = ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
        const date = new Date(dateString);
        return days[date.getDay()];
    }

    return (
        <div className="main-container">
            <div className="detail-nav">
                <p className="nav">Головна</p>
                <img src="images/black-arrow.png" className="profile-arrow"></img>
                <p className="nav">Вибір житла</p>
                <img src="images/black-arrow.png" className="profile-arrow"></img>
                <p className="nav">Інформація про житло</p>
                <img src="images/black-arrow.png" className="profile-arrow"></img>
                <p className="nav" style={{ fontWeight: "100" }}><u>Бронювання</u></p>
            </div>
            <h2 className='page-header1'>Запит на бронювання</h2>

            <div className="book-container">
                <div className="small-container">
                    <h2 className='container-header'>Оплатити за допомогою</h2>
                    <div className="payment-container">
                        {[1, 2].map((id) => (
                            <div key={id} className="payment-item" onClick={() => setSelectedPayment(id)}
                                style={{ border: selectedPayment === id ? "2px solid #E84E0F" : "1px solid #A0A0A0", cursor: "pointer", }} >
                                <img src={`images/card-image${id}.svg`} style={{ width: "70px", height: "50px" }} />
                            </div>
                        ))}
                    </div>
                    <div className='input-container' style={{ marginTop: "10px" }}>
                        <p className='input-header'>Номер карти</p>
                        <input type="text" className="book-input" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={handleCardInputChange} maxLength={19} required />
                    </div>
                    <div className='input-container' style={{ marginTop: "10px", display: "flex", flexDirection: "row", gap: "20px" }}>
                        <div>
                            <p className='input-header'>Термін дії</p>
                            <input type="text" className="book-input" placeholder="MM / YY" value={expiry} onChange={handleExpiryChange} maxLength={7} required />
                        </div>

                        <div>
                            <p className='input-header'>Код безпеки</p>
                            <input type="text" className="book-input" placeholder="CVV" value={cvv} onChange={handleCvvChange} maxLength={4} required />
                        </div>
                    </div>

                    <div className='input-container' style={{ marginTop: "10px" }}>
                        <p className='input-header'>Індекс</p>
                        <input type="text" className="book-input" placeholder="Введіть поштовий індекс" value={postalCode} onChange={handlePostalCodeChange} maxLength={5} required />
                    </div>

                    <div className='input-container' style={{ marginTop: "10px" }}>
                        <p className='input-header'>Країна</p>
                        <select className="book-input" required>
                            <option value="">Оберіть країну</option>
                            {countries.slice().sort((a, b) => a.countryName.localeCompare(b.countryName)).map(country => (
                                <option key={country.countryID}>
                                        {country.countryName}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                <div className="small-container">
                    <h2 className='container-header'>Напишіть господарю</h2>
                    <p className='container-subheader'>Залишення повідомлення збільшує ймовірність того,<br></br>що ваш запит буде схвалено.</p>
                    <div className='t'>
                        <div className="profile-picture-wrapper">
                            <img src="images/owner-pfp.jpg" className="picture" />
                        </div>

                        <div className='t2'>
                            <p className="user-name">Lucía Herrera</p>
                            <p className="languages">Володіє: шведською, англійською мовами</p>
                        </div>

                    </div>

                    <div className='input-container' style={{ marginTop: "10px" }}>
                        <p className='input-header'>Повідомлення</p>
                        <textarea className="book-input" placeholder="Введіть ваше повідомлення" style={{ height: "300px", resize: "none", padding: "10px", boxSizing: "border-box" }} />
                    </div>
                </div>

                <div className="big-container">
                    <div className="main-container">
                        <div className="photo-container">
                            <img src={`/images/${apartment?.apartmentPhoto}`} className="ap-photo" />
                            <div className="more-photo-btn">
                                <img src="images/photo-icon.png" style={{ width: "27px", height: "27px" }}></img>
                                <p className="text">27+</p>
                            </div>
                        </div>

                        <div className="ap-info-group">
                            <h2 className="ap-name">{apartment?.apartmentName}</h2>
                            <p className="ap-loc">{apartment?.apartmentCountry}, {apartment?.apartmentLocation}</p>

                            <div className="review-group">
                                <img src="images/rate-icon.png" className="icon"></img>
                                <p>{apartment?.apartmentRate}</p>
                                <p className='reviews'>(176 відгуків)</p>
                            </div>
                        </div>

                        <div className="booking-info">
                            <div className="book-group">
                                <p className='header'>Реєстрація:</p>
                                <p className='subheader'>{getWeekday(arrivalDate)}, {formatDate(arrivalDate)}, 13:00</p>
                            </div>

                            <div className="book-group">
                                <p className='header'>Оформити замовлення:</p>
                                <p className='subheader'>{getWeekday(departureDate)}, {formatDate(departureDate)}, 10:00</p>
                            </div>

                            <div className="book-group">
                                <p className='header'>Гості:</p>
                                <p className='subheader'>{guestsSummary}</p>
                            </div>
                        </div>

                        <button className="promocode-btn">Використати промокод</button>

                        <div className="total-group">
                            <p className="text">Всього:</p>
                            <div className="price">
                                <h5 className="text">{totalPrice} €</h5>
                            </div>
                        </div>
                    </div>
                    <div className="help-btn">
                        <img src="images/help-icon.png" className="icon" />
                        <p className="text">Допомога</p>
                    </div>
                </div>
            </div>

            <div className="block-container">
                <div className="block-elem">
                    <img src="images/canscel-icon.svg" className="icon" />
                    <h3 className="header">Безкоштовне скасування<br></br>бронювання до 21 червня</h3>
                </div>
                <div className="block-elem">
                    <img src="images/soon-icon.svg" className="icon" />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <h3 className="header">Дійте швидко!</h3>
                        <p className="text">Ціна та наявність можуть змінюватися.</p>
                    </div>
                </div>
            </div>

            <div className="note-container">
                <h3 className="header">Зручності</h3>
                <p className="note">Ми просимо всіх гостей пам’ятати кілька простих правил належної поведінки гостя.</p>
                <div className="row-container">
                    <p className="el">• Дотримуйтеся правил дому</p>
                    <p className="el">• Ставтеся до помешкання господаря як до власної оселі</p>
                </div>
            </div>

            <div className="approve-container">
                <img src="images/approve-icon.svg" className="icon" />
                <p className="text">Ваше бронювання не буде підтверджене, поки господар не прийме ваш запит (протягом 24 годин).<br></br>До того часу кошти з вас не стягнуть.</p>
            </div>

            <div className="container-2">
                <p className="text-2">Натискаючи на кнопку нижче, я приймаю умови <u>(Правила дому господаря, Основні правила для гостей, Правила повторного бронювання<br></br>
                    та повернення коштів Dwell)</u>, які Dwell може застосовувати в разі моєї відповідальності за нанесення збитків <u>(стягнути кошти відповідно<br></br>
                        до мого способу оплати)</u>. Я погоджуюся сплатити повну вказану суму, якщо господар прийме мій запит на бронювання.</p>
                <p className="text-2">Я також приймаю оновлені <u style={{ color: "#E84E0F" }}>Умови обслуговування</u>, <u style={{ color: "#E84E0F" }}>Умови здійснення платежів</u> і визнаю <u style={{ color: "#E84E0F" }}>Політику конфіденційності</u>.</p>
            </div>

            <button className="book-btn">Надіслати запит на бронювання</button>
        </div>
    );
}

export default BookingPage;