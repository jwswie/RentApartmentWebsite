import './css/home-style.css';
import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const countries = [
    { img: "images/italy.jpg", name: "Італія" },
    { img: "images/france.jpg", name: "Франція", style: { top: "-45px", height: "450px" } },
    { img: "images/germany.jpg", name: "Німеччина", style: { top: "-40px" } },
    { img: "images/united-kingdom.png", name: "Великобританія", style: { height: "450px" } },
    { img: "images/ireland.jpg", name: "Ірландія", style: {top: "-120px", height: "450px" } },
    { img: "images/montenegro.jpg", name: "Чорногорія", style: {height: "380px" } },
    { img: "images/holland.jpg", name: "Нідерланди", style: { top: "-20px" } },
    { img: "images/chehia.jpg", name: "Чехія", style: { top: "-60px", height: "390px" } },
    { img: "images/spain.jpg", name: "Іспанія", style: { top: "-20px" } },
];
function HomePage() {
    const navigate = useNavigate();
    const sliderRef = useRef();
    const [apartments, setApartments] = useState([]);

    const handleCategoryClick = (category) => {
        navigate(`/apartments?category=${encodeURIComponent(category)}`);
    };

    const handleCountryClick = (countryName) => {
        navigate(`/apartments/${encodeURIComponent(countryName)}`);
    };

    useEffect(() => {
        fetch("/api/apartment")
            .then((res) => res.json())
            .then((data) => setApartments(data.slice(0, 6)))
            .catch((err) => console.error("Помилка завантаження:", err));
    }, []);

    return (
        <div className="main-container">
            <div className="header">
                <div className="top-header">
                    <h1 className="big-header">Найкращий</h1>
                    <div className="horizontal-group">
                        <h1 className="big-header" id="h-2">спосіб легкого</h1>
                        <p className="sub-header">Знайдіть своє житло для подорожей, ділових поїздок<br></br>та відпочинку в Європі з комфортом</p>
                    </div>
                    <h1 className="big-header">бронювання</h1>
                </div>
            </div>

            <div className="banner">
                <div className="banner-container">
                    <img src="images/home-page-photo.png" className="banner-img"/>
                    <div className="search-container">
                        <div className="search-item item-1">
                            <img src="images/search-icon1.png" className="label-search" />
                            <div className="label-group">
                                <h6 className="label-title">Куди?</h6>
                                <p className="label-subtitle">Оберіть потрібну країну</p>
                            </div>
                        </div>

                        <div className="search-item item-2">
                            <input style={{ transform: "scaleX(-1)" }} type="date" className="date-picker" />
                            <div className="label-group" style={{ position: "relative", left: "-110px", whiteSpace: "nowrap" }}>
                                <h6 className="label-title">Прибуття</h6>
                                <p className="label-subtitle">Додайте дату</p>
                            </div>
                        </div>

                        <div className="search-item item-3">
                            <input style={{ transform: "scaleX(-1)" }} type="date" className="date-picker" />
                            <div className="label-group" style={{ position: "relative", left: "-110px", whiteSpace: "nowrap" }}>
                                <h6 className="label-title">Виїзд</h6>
                                <p className="label-subtitle">Додайте дату</p>
                            </div>
                        </div>

                        <div className="search-item item-4">
                            <img src="images/search-icon3.png" style={{ marginLeft: "5px" }} className="label-search" />
                            <div className="label-group">
                                <h6 className="label-title">Гості</h6>
                                <p className="label-subtitle" style={{ whiteSpace: "nowrap" }}>Хто вирушає з вами?</p>
                            </div>
                        </div>

                        <div className="search-btn">
                            <img src="images/search-icon.svg" style={{ width: "25px", height: "25px" }} className="btn-search" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="about-us-screen">
                <div className='side-group'>
                    <h2 className="header">Про нас</h2>
                    <p className="sub-header"><strong>Dwell</strong> — сервіс для бронювання житла, який поєднує комфорт, прозорість<br />та сучасні технології. Ми допомагаємо мандрівникам, родинам<br />і професіоналам швидко знаходити перевірене житло<br />по всій Європі</p>
                    <div className="buttons-group">
                        <button className="more-btn" onClick={() => navigate('/about')}>Детальніше</button>
                        <div className="video-btn">
                            <div className="circle"> <img src="images/video-btn.png" className="play-btn" /> </div>
                            <p className="text">Подивитись відео</p>
                        </div>
                    </div>
                </div>
                <div className="about-img-wrapper">
                    <img src="images/about-us-screen.png" alt="About Banner" className="about-img" />
                </div>

                <div className="info-about-block">
                    <div className="about-container">
                        <div className="about-item">
                            <h1 className="header" style={{ left: "75px" }}>6+</h1>
                            <p className="subheader">Років нашого досвіду</p>
                        </div>
                        <div className="about-item">
                            <h1 className="header" style={{ left: "40px" }}>9 000+</h1>
                            <p className="subheader">Бронювань щодня</p>
                        </div>
                        <div className="about-item">
                            <h1 className="header" style={{ left: "50px" }}>-25%</h1>
                            <p className="subheader">Для нових клієнтів</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="category-block">
                <h3 className="header">Популярні категорії за останній місяць</h3>
                <div className="category-container">
                    {[ { name: "Будинок", img: "category-photo1.png" }, { name: "Апартаменти", img: "category-photo2.png" }, { name: "Котедж", img: "category-photo3.png" }, { name: "Вілла", img: "category-photo4.png" },
                    ].map((cat, i) => (
                        <div className="category-item" key={i}>
                            <img src={`images/${cat.img}`} className="category-img" />
                            <div className="category-text" onClick={() => handleCategoryClick(cat.name)}>
                                <p className="text">{cat.name}</p>
                                <img src="images/profile-arrow.png" className="arrow" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="recomended-block">
                <h3 className="header">Рекомендоване житло для вас</h3>
                <div className="recomended-container">
                    {apartments.map((ap, index) => (
                        <div className="recomended-item" key={index}>
                            <img src={`images/${ap.apartmentPhoto}`} className="recomended-img" />
                            <div className="favourite">
                                <img src="images/favourite-icon.png" className="favourite-btn" />
                            </div>
                            <div className="apartment-info">
                                <h4 className="header">{ap.apartmentName}</h4>
                                <h4 className="sub-header">{ap.apartmentCountry}, {ap.apartmentLocation}</h4>
                                <div className="container">
                                    <h4 className="price-big">€ {ap.apartmentPrice}</h4>
                                    <p className='price-small'>/ ніч</p>
                                    <div className='more-button-group'>
                                        <p>Детальніше</p>
                                        <img src="images/arrow.svg" className="icon" />
                                    </div>
                                </div>
                                <div className="review-container">
                                    <div className='rate-group'>
                                        <img src="images/rate-icon.png" className="icon" />
                                        <p>{ap.apartmentRate.toFixed(1)}</p>
                                    </div>
                                    <p className='reviews'>(176 відгуків)</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="more-btn" onClick={() => navigate('/apartments')}>Переглянути більше</button>
            </div>

            <div className="mobile-app-block">
                <div className='side-group'>
                    <h2 className="header">Завантажте застосунок Dwell!</h2>
                    <p className="sub-header">Плануйте свій час без зайвих турбот — відскануйте QR-код, знайдіть і забронюте житло<br></br>всього за хвилину та отримайте знижку -10% на бронювання після встановлення додатку!</p>
                    <div className="buttons-group">
                        <div className="app-btn">
                            <Link to="https://play.google.com/store/games?device=windows"><img src="images/google-play.png" className="app-img" /></Link>
                            <div className="container">
                                <p className="header">Get it on</p>
                                <h2 className="sub-header">Google Play</h2>
                            </div>
                        </div>
                        <div className="app-btn" style={{ width: "160px" }}>
                            <Link to="https://www.apple.com/app-store/"><img src="images/app-store.png" className="app-img" /></Link>
                            <div className="container">
                                <p className="header">Get it on</p>
                                <h2 className="sub-header">App Store</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <img src="images/mobile-app.png" className="app-img" />
            </div>

            <div className='carousel-block'>
                <div className="countries-carousel-block">
                    <h3 className="header">Країни</h3>
                    <p className="sub-header">Представляємо вам найулюбленіші країни наших клієнтів.<br />Якщо не знайдете потрібну, завжди можна переглянути більше!</p>
                    <button className="more-btn" onClick={() => navigate('/countries')}>Переглянути більше</button>
                </div>
                <Slider ref={sliderRef} slidesToShow={2} slidesToScroll={1} className="countries-carousel">
                    {countries.map((country, index) => (
                        <div key={index} className="slider-item">
                            <div className="carousel-img-wrapper">
                                <img src={country.img} className="carousel-img" style={country.style || {}} />
                            </div>
                            <div className="carousel-text" onClick={() => handleCountryClick(country.name)}>
                                <p className="text">{country.name}</p>
                                <img src="images/black-arrow.png" className="arrow" />
                            </div>
                        </div>
                    ))}
                </Slider>


                <div className="carousel-btns">
                    <div className="carousel-btn" onClick={() => sliderRef.current.slickPrev()}>
                        <img src="images/orange-arrow.png" style={{ transform: "scaleX(-1)" }} className="arrow-btn" />
                    </div>
                    <div className="carousel-btn" onClick={() => sliderRef.current.slickNext()}>
                        <img src="images/orange-arrow.png" className="arrow-btn" />
                    </div>
                </div>

            </div>

            <div className="category-block" style={{ marginTop: "200px", marginBottom: "200px" }}>
                <h3 className="header" style={{ left: "calc(50% - 186px /2 + 0.5px)"} }>Наш блог</h3>
                <div className="category-container">
                    <div className="category-item">
                        <div className="photo-wrapper">
                            <img src="images/blog1.png" style={{ transform: "scaleX(-1)", height: "350px", width: "520px", left: "-80px" }} className="category-img" />
                        </div>
                        
                        <div className="category-text">
                            <p className="text">Подорожі та напрямки</p>
                            <img src="images/profile-arrow.png" className="arrow"></img>
                        </div>
                    </div>
                    <div className="category-item">
                        <div className="photo-wrapper">
                            <img src="images/blog2.jpg" style={{ transform: "scaleX(-1)" }} className="category-img" />
                        </div>   
                        <div className="category-text">
                            <p className="text">Житло та інтер’єри</p>
                            <img src="images/profile-arrow.png" className="arrow"></img>
                        </div>
                    </div>
                    <div className="category-item">
                        <div className="photo-wrapper">
                            <img src="images/blog3.jpg" style={{ top: "-80px" }} className="category-img" />
                        </div>   
                        <div className="category-text">
                            <p className="text">Історії гостей</p>
                            <img src="images/profile-arrow.png" className="arrow"></img>
                        </div>
                    </div>
                    <div className="category-item">
                        <div className="photo-wrapper">
                            <img src="images/blog4.jpg" alt="Blog Photo" className="category-img" />
                        </div> 
                        <div className="category-text">
                            <p className="text" >Оновлення та новини</p>
                            <img src="images/profile-arrow.png" className="arrow"></img>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;