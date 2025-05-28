import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/apartment-detail-style.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function chunkArray(array, size) {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
        chunked.push(array.slice(i, i + size));
    }
    return chunked;
}

const monthsUA = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];

function ApartmentDetailPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const apartment = state?.apartment;
    const [showMore, setShowMore] = useState(false);
    const [showMore2, setShowMore2] = useState(false);
    const [showGuestsInfo, setShowGuestsInfo] = useState(false);
    //#region Slider variables
    const sliderRef = useRef();
    const slider2Ref = useRef();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentSlide2, setCurrentSlide2] = useState(0);
    const totalSlides = 7;
    const totalSlides2 = 6;
    const slidesToShow = 2.5;
    const slidesToShow2 = 3;
    //#endregion
    const [arrivalDate, setArrivalDate] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [pets, setPets] = useState(0);
    const totalPrice = apartment.apartmentPrice * adults;


    const handleDateChange1 = (e) => {
        setArrivalDate(e.target.value);
    };

    const handleDateChange2 = (e) => {
        setDepartureDate(e.target.value);
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return "Додайте дату";
        const [year, month, day] = isoDate.split("-");
        return `${parseInt(day)} ${monthsUA[parseInt(month) - 1]}`;
    };

    useEffect(() => {
        const navbar = document.getElementById("detailNavbar");
        const orderBlock = document.getElementById("orderBlock");
        const carousel = document.getElementById("carouselBlock");

        const initialNavbarOffset = navbar.offsetTop;

        const handleScroll = () => {
            const scrollY = window.scrollY;

            if (scrollY >= initialNavbarOffset) {
                navbar.classList.add("sticky");
            } else {
                navbar.classList.remove("sticky");
            }

            const orderHeight = orderBlock.offsetHeight;
            const carouselTop = carousel.getBoundingClientRect().top + scrollY;
            const stopPoint = carouselTop - orderHeight - 70;

            if (scrollY >= stopPoint) {
                orderBlock.classList.remove("sticky-order");
                orderBlock.classList.add("stopped-order");
                orderBlock.style.top = `${stopPoint}px`;
            } else if (scrollY >= initialNavbarOffset) {
                orderBlock.classList.add("sticky-order");
                orderBlock.classList.remove("stopped-order");
                orderBlock.style.top = `125px`;
            } else {
                orderBlock.classList.remove("sticky-order", "stopped-order");
                orderBlock.style.top = `850px`;
            }  
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!showGuestsInfo) return;

        const guestsBlock = document.getElementById("guestsBlock");
        const navbar = document.getElementById("detailNavbar");
        const carousel = document.getElementById("carouselBlock");

        if (!guestsBlock || !navbar || !carousel) return;

        const initialNavbarOffset = navbar.offsetTop;

        const handleGuestsScroll = () => {
            const scrollY = window.scrollY;
            const guestsHeight = guestsBlock.offsetHeight;
            const carouselTop = carousel.getBoundingClientRect().top + scrollY;
            const stopPointGuests = carouselTop - guestsHeight - 70;

            if (scrollY >= stopPointGuests) {
                guestsBlock.classList.remove("sticky-guests");
                guestsBlock.classList.add("stop-guests");
                guestsBlock.style.top = `${stopPointGuests}px`;
            } else if (scrollY >= initialNavbarOffset) {
                guestsBlock.classList.add("sticky-guests");
                guestsBlock.classList.remove("stop-guests");
                guestsBlock.style.top = `300px`;
            } else {
                guestsBlock.classList.remove("sticky-guests", "stop-guests");
                guestsBlock.style.top = `850px`;
            }
        };

        window.addEventListener("scroll", handleGuestsScroll);
        handleGuestsScroll(); // вызвать сразу для корректного положения

        return () => {
            window.removeEventListener("scroll", handleGuestsScroll);
        };
    }, [showGuestsInfo]);

    const increment = (setter, value, max = 10) => {
        if (value < max) setter(value + 1);
    };

    const decrement = (setter, value, min = 0) => {
        if (value > min) setter(value - 1);
    };


    return (
        <div className="main-container">
            <div className="detail-nav">
                <p className="nav" onClick={() => navigate('/')}>Головна</p>
                <img src="/images/black-arrow.png" className="profile-arrow"></img>
                <p className="nav" onClick={() => navigate('/apartments')}>Вибір житла</p>
                <img src="/images/black-arrow.png" className="profile-arrow"></img>
                <p className="nav" style={{ fontWeight: "100" }}><u>Інформація про житло</u></p>
            </div>

            <div className="detail-photo-container">
                <img src={`/images/${apartment.apartmentPhoto}`} className="main-photo" />
                <div className="other-photo-container">
                    <img src="/images/other-image1.jpg" className="other-photo"></img>
                    <img src="/images/other-image2.jpg" className="other-photo"></img>
                    <img src="/images/other-image3.jpg" className="other-photo"></img>
                    <img src="/images/other-image4.jpg" className="other-photo"></img>

                    <div className="more-photo-btn">
                        <img src="/images/photo-icon.png" className="icon"></img>
                        <p className="text">23+</p>
                    </div>
                </div>
            </div>

            <nav className="ap-detail-navbar" id="detailNavbar">
                <div className="navigation">
                    <p className="nav-active">Огляд</p>
                    <p className="nav-li">Зручності</p>
                    <p className="nav-li">Розташування</p>
                    <p className="nav-li">Політики</p>
                    <p className="nav-li">Господар</p>
                </div>

                <div className="button-container">
                    <div className="circle">
                        <img src="/images/share-icon.png" className="circle-icon" />
                    </div>
                    <div className="circle">
                        <img src="/images/favourite-icon.png" className="circle-icon" />
                    </div>
                </div>
            </nav>

            <div className="order-block" id="orderBlock">
                <div className="main-block">
                    <h3 className="order-header">Додайте дати, щоб дізнатися загальну ціну!</h3>
                    <div className="date-group">
                        <div className="date-search-item">
                            <input type="date" className="date-picker" min={new Date().toISOString().split("T")[0]} value={arrivalDate} onChange={handleDateChange1} style={{ transform: "scaleX(-1)" }} />
                            <div className="label-group" style={{ position: "relative", left: "-110px", whiteSpace: "nowrap" }}>
                                <h6 className="label-title">Прибуття</h6>
                                <p className="label-subtitle">{formatDate(arrivalDate)}</p>
                            </div>
                        </div>

                        <div className="date-search-item">
                            <input type="date" className="date-picker" min={arrivalDate || new Date().toISOString().split("T")[0]} value={departureDate} onChange={handleDateChange2} style={{ transform: "scaleX(-1)" }} />
                            <div className="label-group" style={{ position: "relative", left: "-110px", whiteSpace: "nowrap" }}>
                                <h6 className="label-title">Виїзд</h6>
                                <p className="label-subtitle">{formatDate(departureDate)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="search-item" onClick={() => setShowGuestsInfo(prev => !prev)}>
                        <img src="/images/search-icon3.png" style={{ marginLeft: "5px" }} className="label-search" />
                        <div className="label-group">
                            <h6 className="label-title">Гості</h6>
                            <p className="label-subtitle" style={{ whiteSpace: "nowrap" }}>Хто вирушає з вами?</p>
                        </div>
                    </div>

                    <button className="search-btn">Перевірити наявність</button>

                    <div className="total-group">
                        <p className="text">Всього:</p>
                        <div className="price">
                            <p>від</p>
                            <h5 className="text">{totalPrice} €</h5>
                        </div>
                    </div>

                    <div className="text-group">
                        <p className="text">Приймаються банківські карти:</p>
                        <div className="cards">
                            <img src="/images/card-image1.svg" className="card-img" />
                            <img src="/images/card-image2.svg" className="card-img" />
                        </div>
                    </div>
                </div>
                <div className="help-btn">
                    <img src="/images/help-icon.png" className="icon" />
                    <p className="text">Допомога</p>
                </div>
            </div>

            {showGuestsInfo && (
                <div className="guests-info" id="guestsBlock">
                    <div className="guests-container">
                        <div className="guests-block">
                            <div className="header-group">
                                <h6 className="title">Дорослі:</h6>
                                <p className="subtitle">Вік: від 18 до 65 років</p>
                            </div>

                            <div className="guests-button-group" style={{ left: "35px" }}>
                                <div className="btn" onClick={() => decrement(setAdults, adults, 1)}>
                                    <p className="text">-</p>
                                </div>
                                <p className="amount">{adults}</p>
                                <div className="btn" onClick={() => increment(setAdults, adults)}>
                                    <p className="text">+</p>
                                </div>
                            </div>
                        </div>
                        <div className="guests-block">
                            <div className="header-group">
                                <h6 className="title">Діти:</h6>
                                <p className="subtitle">Вік: від 1 до 17 років</p>
                            </div>

                            <div className="guests-button-group" style={{ left: "43px" }}>
                                <div className="btn" onClick={() => decrement(setChildren, children)}>
                                    <p className="text">-</p>
                                </div>
                                <p className="amount">{children}</p>
                                <div className="btn" onClick={() => increment(setChildren, children)}>
                                    <p className="text">+</p>
                                </div>
                            </div>
                        </div>
                        <div className="guests-block">
                            <div className="header-group">
                                <h6 className="title">Домашні тварини:</h6>
                                <p className="subtitle">Кількість: від 0 до 4</p>
                            </div>

                            <div className="guests-button-group">
                                <div className="btn" onClick={() => decrement(setPets, pets)}>
                                    <p className="text">-</p>
                                </div>
                                <p className="amount">{pets}</p>
                                <div className="btn" onClick={() => increment(setPets, pets, 4)}>
                                    <p className="text">+</p>
                                </div>
                            </div>
                        </div>
                        <button className="save-btn" onClick={() => setShowGuestsInfo(prev => !prev)}>Зберегти</button>
                    </div>
                </div>

            )}

            <div className="name-info">
                <h1 className="name">{apartment.apartmentName}</h1>
                <div className="location">
                    <img src="/images/search-icon1.png" className="icon"></img>
                    <p className="text">{apartment.apartmentCountry}, {apartment.apartmentLocation}</p>
                </div>
            </div>

            <div className="general-info">
                <div className="item">
                    <img src="/images/general-icon1.png" className="icon"></img>
                    <p className="text">{apartment.apartmentArea} м²</p>
                </div>
                <div className="item">
                    <img src="/images/general-icon2.png" className="icon"></img>
                    <p className="text">{apartment.apartmentCapacity} гостей</p>
                </div>
                <div className="item">
                    <img src="/images/general-icon3.png" className="icon"></img>
                    <p className="text">{apartment.bedroom} спальні</p>
                </div>
                <div className="item">
                    <img src="/images/general-icon4.png" className="icon"></img>
                    <p className="text">{apartment.bathroom} ванна кімната</p>
                </div>
            </div>

            <div className="text-info">
                <h3 className="header">Все про це перебування</h3>
                <p className="text">Інформація про житловий блок</p>
                <p className="text">Ласкаво просимо до Танне Скогсвіка, розташованого за 17 км на південь від Вернамо та лише за 30 метрів від озера Флорен.<br></br>Тут ви маєте доступ до приватного пірсу та човна, що ідеально підходить для купання, риболовлі або спокійної прогулянки<br></br>по воді.</p>
                <p className="text">Будинок комфортний та добре обладнаний для спокійного відпочинку. У вітальні є затишний диван-ліжко, а з закритої<br></br>веранди відкривається чудовий вид на озеро. Повністю обладнана кухня має місце для спільних обідів та прямий вихід<br></br>на простору терасу, де ви можете насолоджуватися свіжим повітрям та природою.</p>
                <p className="show-more" onClick={() => setShowMore(prev => !prev)}>
                    {showMore ? 'Показати менше' : 'Показати більше'}
                </p>
            </div>

            <div className="amenties-container">
                <h2>Зручності</h2>
                <div className='row-container'>
                    {chunkArray(apartment.amenities, 3).map((group, i) => (
                        <div className='container' key={i}>
                            {group.map((amenity, j) => (
                                <label key={j}>{amenity}</label>
                            ))}
                        </div>
                    ))}
                </div>
                <p className="show-more" onClick={() => setShowMore2(prev => !prev)}>
                    {showMore2 ? 'Показати менше' : 'Показати більше'}
                </p>
            </div>

            <div className="location-info">
                <h2>Розташування</h2>

                <div className="map-wrapper">
                    <img src="/images/map-image.png" className="map-image" />
                    <div className="map-btn">
                        <img src="/images/map-icon1.png" className="icon" />
                        <p className="text">Перейти до карти</p>
                    </div>
                </div>

                <div className="row-container">
                    <h6 className="text">Що поруч:</h6>
                    <div className="near-container">
                        {apartment.infrastructures && apartment.infrastructures.length > 0 ? (
                            apartment.infrastructures.map((item, index) => (
                                <p className="near" key={index}>
                                    • {item.infrastructureDistance} {item.measureUnit} до {item.infrastructureName}
                                </p>
                            ))
                        ) : (
                            <p className="near">Немає даних про інфраструктуру</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="rules-info">
                <h2>Правила дому</h2>
                <div className="rules-container">
                    <div className="rules-item">
                        <img src="/images/rules-icon1.png" className="icon" />
                        <h6 className='header'>Події</h6>
                        <p className="text">{apartment.allowedEvents}</p>
                    </div>
                    <div className="rules-item">
                        <img src="/images/rules-icon2.png" className="icon" />
                        <h6 className='header'>Діти</h6>
                        <p className="text">{apartment.allowedChildren}</p>
                    </div>
                    <div className="rules-item">
                        <img src="/images/rules-icon3.png" className="icon" />
                        <h6 className='header'>Домашні тварини</h6>
                        <p className="text">{apartment.allowedPets}</p>
                    </div>
                    <div className="rules-item">
                        <img src="/images/rules-icon4.png" className="icon" />
                        <h6 className='header'>Куріння</h6>
                        <p className="text">{apartment.allowedSmoking}</p>
                    </div>
                </div>
            </div>

            <div className="damage-info">
                <h2>Пошкодження та непередбачені випадки</h2>
                <p>Ви несете відповідальність за будь-які пошкодження орендованого майна, завдані вами або вашою групою під час вашого перебування.</p>
            </div>

            <div className="text-info" style={{ top: "40px" }}>
                <h3 className="header">Важлива інформація</h3>
                <div style={{ display: "flex", flexDirection: "row", gap: "80px" }}>
                    <div className="col-container">
                        <h5>Потрібно знати:</h5>
                        <p style={{ marginTop: "20px" }} className="text">За додаткових осіб може стягуватися плата,<br></br>яка залежить від політики готелю</p>
                        <p style={{ marginTop: "20px" }} className="text">Під час реєстрації заїзду може знадобитися посвідчення<br></br>особи державного зразка з фотографією та кредитна<br></br>картка, дебетова картка або готівкова застава на<br></br>випадок непередбачених витрат</p>
                        <p className="show-more">Показати більше</p>
                    </div>
                    <div className="col-container">
                        <h5>Потрібно знати:</h5>
                        <p style={{ marginTop: "20px" }} className="text">Згідно з національним законодавством, сума готівкових<br></br>операцій у цьому помешканні не може перевищувати<br></br>1000 євро; для отримання додаткової інформації, будь<br></br>ласка, зв'яжіться з адміністрацією, використовуючи<br></br>інформацію з підтвердження бронювання</p>
                        <p className="show-more">Показати більше</p>
                    </div>
                </div>
            </div>

            <div className="owner-info">
                <h2>Познайомтеся з господарем</h2>
                <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                    <div className="owner-item">
                        <div className="owner-block">
                            <div className="profile-picture-wrapper">
                                <img src="/images/owner-pfp.jpg" className="picture" />
                            </div>

                            <p className="user-name">Lucía Herrera</p>
                            <p className="role">Господар</p>
                        </div>
                    </div>
                    <div className="owner-item">
                        <div style={{ display: "flex", flexDirection: "row", gap: "40px", justifyContent: "center", paddingTop: "50px" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                                <h5 className='owner-header'>54</h5>
                                <p className="owner-subheader">Відгуків<br></br>від гостей</p>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                                <h5 className='owner-header'>3</h5>
                                <p className="owner-subheader">Роки<br></br>прийому гостей</p>
                            </div>
                        </div>
                    </div>

                    <div className="owner-item-1">
                        <h5 className='header'>Відомості про господаря:</h5>
                        <p className="subheader">• Швидкість відповіді: 100%</p>
                        <p className="subheader">• Відповідає протягом години</p>
                        <button className="contact-btn">Зв'язатися</button>
                    </div>
                </div>
            </div>

            <div className='review-block' >
                <div className="slider-wrapper">
                    <Slider ref={sliderRef} slidesToShow={2.5} slidesToScroll={1} initialSlide={0} infinite={false} className="review-carousel" beforeChange={(oldIndex, newIndex) => setCurrentSlide(newIndex)}>
                        <div className="slider-item">
                            <div className="top-container">
                                <div className="user-block">
                                    <div className="profile-picture-wrapper">
                                        <img src="/images/owner-pfp.jpg" className="picture" />
                                    </div>

                                    <div className="text-wrapper">
                                        <p className="user-name">John Reynolds</p>
                                        <p className="time">Червень 2023</p>
                                    </div>
                                </div>

                                <div className='mark-group'>
                                    <img src="/images/rate-icon.png" className="icon"></img>
                                    <p>5,0</p>
                                </div>
                            </div>
                            <div className='text-container'>
                                <p>Гостинність на найвищому рівні. Все було підготовлено заздалегідь, чисто і затишно. Господарка відповіла на всі наші питання, навіть допомогла викликати таксі. Відчував себе як удома. Рекомендую всім, хто цінує комфорт і щирість у спілкуванні</p>
                            </div>
                        </div>
                        <div className="slider-item">
                            <div className="top-container">
                                <div className="user-block">
                                    <div className="profile-picture-wrapper">
                                        <img src="/images/owner-pfp.jpg" className="picture" />
                                    </div>

                                    <div className="text-wrapper">
                                        <p className="user-name">Emily Carter</p>
                                        <p className="time">Березень 2024</p>
                                    </div>
                                </div>

                                <div className='mark-group'>
                                    <img src="/images/rate-icon.png" className="icon"></img>
                                    <p>4,6</p>
                                </div>
                            </div>
                            <div className='text-container'>
                                <p>Квартира дуже простора і світла. Господарка завжди була на зв’язку, підказала гарні ресторани поблизу. Єдине — трохи шумно вранці через будівництво поруч, але це не зіпсувало враження. Усе інше було чудово. Дякую за прийом!</p>
                            </div>
                        </div>
                        <div className="slider-item">
                            <div className="top-container">
                                <div className="user-block">
                                    <div className="profile-picture-wrapper">
                                        <img src="/images/owner-pfp.jpg" className="picture" />
                                    </div>

                                    <div className="text-wrapper">
                                        <p className="user-name">Alejandro Torres</p>
                                        <p className="time">Травень 2022</p>
                                    </div>
                                </div>

                                <div className='mark-group'>
                                    <img src="/images/rate-icon.png" className="icon"></img>
                                    <p>5,0</p>
                                </div>
                            </div>
                            <div className='text-container'>
                                <p>Мені сподобалося буквально все: чистота, порядок, запах свіжої постільної білизни. Дуже приємно, коли видно, що господар дійсно дбає про комфорт гостей. Отримав чіткі інструкції, ключі передали вчасно. Без сумніву повернуся сюди ще раз.</p>
                            </div>
                        </div>
                        <div className="slider-item">
                            <div className="top-container">
                                <div className="user-block">
                                    <div className="profile-picture-wrapper">
                                        <img src="/images/owner-pfp.jpg" className="picture" />
                                    </div>

                                    <div className="text-wrapper">
                                        <p className="user-name">Natalie Moore</p>
                                        <p className="time">Серпень 2023</p>
                                    </div>
                                </div>

                                <div className='mark-group'>
                                    <img src="/images/rate-icon.png" className="icon"></img>
                                    <p>5,0</p>
                                </div>
                            </div>
                            <div className='text-container'>
                                <p>Дуже спокійне місце, саме те, що мені було потрібно. Усе відповідало опису. Господарка дуже уважна — навіть залишила невеликий подарунок. Приємно, коли про тебе так піклуються. Житло виглядає ще краще, ніж на фото. Абсолютно задоволена!</p>
                            </div>
                        </div>
                        <div className="slider-item">
                            <div className="top-container">
                                <div className="user-block">
                                    <div className="profile-picture-wrapper">
                                        <img src="/images/owner-pfp.jpg" className="picture" />
                                    </div>

                                    <div className="text-wrapper">
                                        <p className="user-name">Martin Klein</p>
                                        <p className="time">Лютий 2022</p>
                                    </div>
                                </div>

                                <div className='mark-group'>
                                    <img src="/images/rate-icon.png" className="icon"></img>
                                    <p>4,2</p>
                                </div>
                            </div>
                            <div className='text-container'>
                                <p>Житло було нормальне, але трохи прохолодне вночі. Добре, що дали додаткову ковдру. В іншому все ок. Господарка відповідальна, зустріла особисто. Мені не вистачило чайника, але це дрібниці. Загалом чудовий варіант на кілька днів.</p>
                            </div>
                        </div>
                        <div className="slider-item">
                            <div className="top-container">
                                <div className="user-block">
                                    <div className="profile-picture-wrapper">
                                        <img src="/images/owner-pfp.jpg" className="picture" />
                                    </div>

                                    <div className="text-wrapper">
                                        <p className="user-name">Sofia Evans</p>
                                        <p className="time">Квітень 2024</p>
                                    </div>
                                </div>

                                <div className='mark-group'>
                                    <img src="/images/rate-icon.png" className="icon"></img>
                                    <p>5,0</p>
                                </div>
                            </div>
                            <div className='text-container'>
                                <p>Абсолютно ідеально! Зустріли тепло, все підготовлено до приїзду. Місце дуже зручне для прогулянок, господарка порадила круті місця, яких не знайдеш у гуглі. Відчувала себе в безпеці й комфорті. Дуже вдячна за турботу та атмосферу.</p>
                            </div>
                        </div>
                        <div className="slider-item">
                            <div className="top-container">
                                <div className="user-block">
                                    <div className="profile-picture-wrapper">
                                        <img src="/images/owner-pfp.jpg" className="picture" />
                                    </div>

                                    <div className="text-wrapper">
                                        <p className="user-name">Oleg Romanov</p>
                                        <p className="time">Жовтень 2022</p>
                                    </div>
                                </div>

                                <div className='mark-group'>
                                    <img src="/images/rate-icon.png" className="icon"></img>
                                    <p>4,7</p>
                                </div>
                            </div>
                            <div className='text-container'>
                                <p>Гарне співвідношення ціни та якості. Є все необхідне для короткострокового перебування. Господарка ввічлива та пунктуальна. Єдине — хотілося б трохи більше посуду, бо ми готували самі. А так усе пройшло добре, претензій нема.</p>
                            </div>
                        </div>
                    </Slider>
                </div>

                <div className="carousel-btns">
                    <p className="show-more">Показати більше</p>
                    <div style={{ display: "flex", flexDirection: "row", gap: "60px" }}>
                        <div className="carousel-btn"
                            onClick={() => currentSlide > 0 && sliderRef.current.slickPrev()}
                            style={{
                                border: currentSlide === 0 ? "2px solid #A0A0A0" : "2px solid #E84E0F",
                                cursor: currentSlide === 0 ? "default" : "pointer"
                            }} >
                            <img src={currentSlide === 0 ? "/images/gray-arrow.png" : "/images/orange-arrow.png"} style={{ transform: "scaleX(-1)" }} className="arrow-btn" />
                        </div>

                        <div className="carousel-btn"
                            onClick={() => { if (currentSlide < totalSlides - slidesToShow) { sliderRef.current.slickNext(); } }}
                            style={{ border: currentSlide >= totalSlides - slidesToShow ? "2px solid #A0A0A0" : "2px solid #E84E0F", cursor: currentSlide >= totalSlides - slidesToShow ? "default" : "pointer" }} >
                            <img src={ currentSlide >= totalSlides - slidesToShow ? "/images/gray-arrow.png" : "/images/orange-arrow.png" } className="arrow-btn" />
                        </div>

                    </div>
                </div>
            </div>

            <div className='carousel-block' id="carouselBlock">
                <div className="apartments-carousel-block">
                    <h3 className="header">Схоже житло</h3>
                </div>
                <Slider ref={slider2Ref} slidesToShow={3} slidesToScroll={1} initialSlide={0} infinite={false} className="apartment-carousel" beforeChange={(oldIndex, newIndex) => setCurrentSlide2(newIndex)}>
                    <div className="recomended-item">
                        <img src="/images/apartment-image2.png" alt="Apartment Photo" className="recomended-img" />
                        <div className="favourite">
                            <img src="/images/favourite-icon.png" className="favourite-btn" />
                        </div>
                        <div className="apartment-info">
                            <h4 className="header">Charmant appartement<br></br>au cœur du Marais</h4>
                            <h4 className="sub-header">Франція, Париж, Le Marais</h4>
                            <div className="container" style={{top: "0px"} }>
                                <h4 className="price-big">€ 123</h4>
                                <p className='price-small'>/ ніч</p>
                                <div className='more-button-group' onClick={() => navigate('/detail')}>
                                    <p>Детальніше</p>
                                    <img src="/images/arrow.svg" className="icon" />
                                </div>
                            </div>
                            <div className="review-container">
                                <div className='rate-group'>
                                    <img src="/images/rate-icon.png" className="icon" />
                                    <p>2,3</p>
                                </div>
                                <p className='reviews'>(176 відгуків)</p>
                            </div>
                        </div>
                    </div>
                    <div className="recomended-item">
                        <img src="/images/apartment-image2.png" alt="Apartment Photo" className="recomended-img" />
                        <div className="favourite">
                            <img src="/images/favourite-icon.png" className="favourite-btn" />
                        </div>
                        <div className="apartment-info">
                            <h4 className="header">Charmant appartement<br></br>au cœur du Marais</h4>
                            <h4 className="sub-header">Франція, Париж, Le Marais</h4>
                            <div className="container" style={{ top: "0px" }}>
                                <h4 className="price-big">€ 123</h4>
                                <p className='price-small'>/ ніч</p>
                                <div className='more-button-group' onClick={() => navigate('/detail')}>
                                    <p>Детальніше</p>
                                    <img src="/images/arrow.svg" className="icon" />
                                </div>
                            </div>
                            <div className="review-container">
                                <div className='rate-group'>
                                    <img src="/images/rate-icon.png" className="icon" />
                                    <p>2,3</p>
                                </div>
                                <p className='reviews'>(176 відгуків)</p>
                            </div>
                        </div>
                    </div>
                    <div className="recomended-item">
                        <img src="/images/apartment-image2.png" alt="Apartment Photo" className="recomended-img" />
                        <div className="favourite">
                            <img src="/images/favourite-icon.png" className="favourite-btn" />
                        </div>
                        <div className="apartment-info">
                            <h4 className="header">Charmant appartement<br></br>au cœur du Marais</h4>
                            <h4 className="sub-header">Франція, Париж, Le Marais</h4>
                            <div className="container" style={{ top: "0px" }}>
                                <h4 className="price-big">€ 123</h4>
                                <p className='price-small'>/ ніч</p>
                                <div className='more-button-group' onClick={() => navigate('/detail')}>
                                    <p>Детальніше</p>
                                    <img src="/images/arrow.svg" className="icon" />
                                </div>
                            </div>
                            <div className="review-container">
                                <div className='rate-group'>
                                    <img src="/images/rate-icon.png" className="icon" />
                                    <p>2,3</p>
                                </div>
                                <p className='reviews'>(176 відгуків)</p>
                            </div>
                        </div>
                    </div>
                    <div className="recomended-item">
                        <img src="/images/apartment-image2.png" alt="Apartment Photo" className="recomended-img" />
                        <div className="favourite">
                            <img src="/images/favourite-icon.png" className="favourite-btn" />
                        </div>
                        <div className="apartment-info">
                            <h4 className="header">Charmant appartement<br></br>au cœur du Marais</h4>
                            <h4 className="sub-header">Франція, Париж, Le Marais</h4>
                            <div className="container" style={{ top: "0px" }}>
                                <h4 className="price-big">€ 123</h4>
                                <p className='price-small'>/ ніч</p>
                                <div className='more-button-group' onClick={() => navigate('/detail')}>
                                    <p>Детальніше</p>
                                    <img src="/images/arrow.svg" className="icon" />
                                </div>
                            </div>
                            <div className="review-container">
                                <div className='rate-group'>
                                    <img src="/images/rate-icon.png" className="icon" />
                                    <p>2,3</p>
                                </div>
                                <p className='reviews'>(176 відгуків)</p>
                            </div>
                        </div>
                    </div>
                    <div className="recomended-item">
                        <img src="/images/apartment-image2.png" alt="Apartment Photo" className="recomended-img" />
                        <div className="favourite">
                            <img src="/images/favourite-icon.png" className="favourite-btn" />
                        </div>
                        <div className="apartment-info">
                            <h4 className="header">Charmant appartement<br></br>au cœur du Marais</h4>
                            <h4 className="sub-header">Франція, Париж, Le Marais</h4>
                            <div className="container" style={{ top: "0px" }}>
                                <h4 className="price-big">€ 123</h4>
                                <p className='price-small'>/ ніч</p>
                                <div className='more-button-group' onClick={() => navigate('/detail')}>
                                    <p>Детальніше</p>
                                    <img src="/images/arrow.svg" className="icon" />
                                </div>
                            </div>
                            <div className="review-container">
                                <div className='rate-group'>
                                    <img src="/images/rate-icon.png" className="icon" />
                                    <p>2,3</p>
                                </div>
                                <p className='reviews'>(176 відгуків)</p>
                            </div>
                        </div>
                    </div>
                    <div className="recomended-item">
                        <img src="/images/apartment-image2.png" alt="Apartment Photo" className="recomended-img" />
                        <div className="favourite">
                            <img src="/images/favourite-icon.png" className="favourite-btn" />
                        </div>
                        <div className="apartment-info">
                            <h4 className="header">Charmant appartement<br></br>au cœur du Marais</h4>
                            <h4 className="sub-header">Франція, Париж, Le Marais</h4>
                            <div className="container" style={{ top: "0px" }}>
                                <h4 className="price-big">€ 123</h4>
                                <p className='price-small'>/ ніч</p>
                                <div className='more-button-group' onClick={() => navigate('/detail')}>
                                    <p>Детальніше</p>
                                    <img src="/images/arrow.svg" className="icon" />
                                </div>
                            </div>
                            <div className="review-container">
                                <div className='rate-group'>
                                    <img src="/images/rate-icon.png" className="icon" />
                                    <p>2,3</p>
                                </div>
                                <p className='reviews'>(176 відгуків)</p>
                            </div>
                        </div>
                    </div>
                </Slider>

                <div className="carousel-btns">
                    <div className="carousel-btn"
                        onClick={() => currentSlide2 > 0 && slider2Ref.current.slickPrev()}
                        style={{ border: currentSlide2 === 0 ? "2px solid #A0A0A0" : "2px solid #E84E0F", cursor: currentSlide2 === 0 ? "default" : "pointer" }} >
                        <img src={currentSlide2 === 0 ? "/images/gray-arrow.png" : "/images/orange-arrow.png"} style={{ transform: "scaleX(-1)" }} className="arrow-btn" />
                    </div>

                    <div className="carousel-btn"
                        onClick={() => { if (currentSlide2 < totalSlides2 - slidesToShow2) { slider2Ref.current.slickNext(); } }}
                        style={{ border: currentSlide2 >= totalSlides2 - slidesToShow2 ? "2px solid #A0A0A0" : "2px solid #E84E0F", cursor: currentSlide2 >= totalSlides2 - slidesToShow2 ? "default" : "pointer" }} >
                        <img src={currentSlide2 >= totalSlides2 - slidesToShow2 ? "/images/gray-arrow.png" : "/images/orange-arrow.png"} className="arrow-btn" />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ApartmentDetailPage;