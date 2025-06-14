import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
    const [reviews, setReviews] = useState([]);
    //#region Slider variables
    const sliderRef = useRef();
    const slider2Ref = useRef();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentSlide2, setCurrentSlide2] = useState(0);
    const totalSlides = reviews.length;
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
    const [apartments, setApartments] = useState([]);
    const [allReviews, setAllReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`/api/reviews/apartment/${apartment.apartmentID}`);
                const data = await response.json();
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        if (apartment?.apartmentID) {
            fetchReviews();
        }
    }, [apartment]);

    useEffect(() => {
        const fetchAllReviews = async () => {
            try {
                const response = await fetch('/api/reviews');
                const data = await response.json();
                setAllReviews(data);
            } catch (error) {
                console.error("Error fetching all reviews:", error);
            }
        };

        fetchAllReviews();
    }, []);

    const getReviewCount = (apartmentID) => {
        return allReviews.filter(review => review.apartmentID === apartmentID).length;
    };

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
                guestsBlock.style.top = `1010px`;
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

    const getGuestsSummary = () => {
        const parts = [];

        if (adults > 0) {
            parts.push(`${adults} ${adults === 1 ? 'гість' : (adults <= 4 ? 'гостя' : 'гостей')}`);
        }

        if (children > 0) {
            parts.push(`${children} ${children === 1 ? 'дитина' : (children <= 4 ? 'дитини' : 'дітей')}`);
        }

        if (pets > 0) {
            parts.push(`${pets} ${pets === 1 ? 'домашня тварина' : 'домашнi тварини'}`);
        }

        return parts.length > 0 ? parts.join(', ') : 'Хто вирушає з вами?';
    };

    useEffect(() => {
        fetch("/api/apartment")
            .then((res) => res.json())
            .then((data) => setApartments(data.slice(0, 6)))
            .catch((err) => console.error("Помилка завантаження:", err));
    }, []);

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
                            <p className="label-subtitle" style={{ whiteSpace: "nowrap" }}>{getGuestsSummary()}</p>
                        </div>
                    </div>

                    <button className="search-btn"
                        onClick={() => {
                            if (!arrivalDate || !departureDate) {
                                alert("Будь ласка, вкажіть дати приїзду та виїзду");
                                return;
                            }

                            navigate('/book', {state: {apartment, arrivalDate, departureDate, guestsSummary: getGuestsSummary(), totalPrice }});}}>Перевірити наявність</button>

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
                    <Slider
                        ref={sliderRef}
                        slidesToShow={2.5}
                        slidesToScroll={1}
                        initialSlide={0}
                        infinite={false}
                        className="review-carousel"
                        beforeChange={(oldIndex, newIndex) => setCurrentSlide(newIndex)}
                    >
                        {reviews.map((review, index) => (
                            <div className="slider-item" key={index}>
                                <div className="top-container">
                                    <div className="user-block">
                                        <div className="profile-picture-wrapper">
                                            <img src={review.userPhoto || "/images/no-pfp.svg"}  className="picture" />
                                        </div>
                                        <div className="text-wrapper">
                                            <p className="user-name">{review.userName}</p>
                                            <p className="time" style={{ whiteSpace: "nowrap" }}>{new Date(review.reviewDate).toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className='mark-group'>
                                        <img src="/images/rate-icon.png" className="icon" />
                                        <p>{review.reviewRate.toFixed(1)}</p>
                                    </div>
                                </div>
                                <div className='text-container'>
                                    <p>{review.reviewText}</p>
                                </div>
                            </div>
                        ))}
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
                    {apartments.map((apartment, index) => (
                        <div className="recomended-item" key={index}>
                            <img src={`/images/${apartment.apartmentPhoto}`} className="recomended-img" />
                            <div className="favourite">
                                <img src="/images/favourite-icon.png" className="favourite-btn" />
                            </div>
                            <div className="apartment-info">
                                <h4 className="header">{apartment.apartmentName}</h4>
                                <h4 className="sub-header">{apartment.apartmentCountry}, {apartment.apartmentLocation}</h4>
                                <div className="container">
                                    <h4 className="price-big">€ {apartment.apartmentPrice}</h4>
                                    <p className='price-small'>/ ніч</p>
                                    <Link to={`/apartment/${apartment.apartmentID}`} state={{ apartment }} className="more-button-group" onClick={() => window.scrollTo(0, 0)}>
                                        <p>Детальніше</p>
                                        <img src="/images/arrow.svg" className="icon"></img>
                                    </Link>
                                </div>
                                <div className="review-container">
                                    <div className='rate-group'>
                                        <img src="/images/rate-icon.png" className="icon" />
                                        <p>{apartment.apartmentRate.toFixed(1)}</p>
                                    </div>
                                    <p className='reviews'>({getReviewCount(apartment.apartmentID)} відгуків)</p>
                                </div>
                            </div>
                        </div>
                    ))}
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