import './css/home-style.css';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
function HomePage() {

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
                    <img src="images/home-page-photo.png" alt="Home banner image" className="banner-img"></img>
                    <div className="search-container">
                        <div className="search-item item-1">
                            <div className="label-group">
                                <h6 className="label-title">Куди?</h6>
                                <p className="label-subtitle">Оберіть потрібну країну</p>
                            </div>
                        </div>

                        <div className="search-item item-2">
                            <div className="label-group">
                                <h6 className="label-title">Прибуття</h6>
                                <p className="label-subtitle">Додайте дату</p>
                                <input type="date" className="date-picker" />
                            </div>
                        </div>

                        <div className="search-item item-3">
                            <div className="label-group">
                                <h6 className="label-title">Виїзд</h6>
                                <p className="label-subtitle">Додайте дату</p>
                                <input type="date" className="date-picker" />
                            </div>
                        </div>

                        <div className="search-item item-4">
                            <div className="label-group">
                                <h6 className="label-title">Гості</h6>
                                <p className="label-subtitle">Хто вирушає з вами?</p>
                            </div>
                        </div>

                        <div className="search-btn">
                            <img src="images/search-icon.svg" alt="Search button image" className="btn-search" />
                        </div>
                    </div>


                </div>
            </div>

            <div className="about-us-screen">
                <div className='side-group'>
                    <h2 className="header">Про нас</h2>
                    <p className="sub-header"><strong>Dwell</strong> — сервіс для бронювання житла, який поєднує комфорт, прозорість<br />та сучасні технології. Ми допомагаємо мандрівникам, родинам<br />і професіоналам швидко знаходити перевірене житло<br />по всій Європі</p>
                    <div className="buttons-group">
                        <button className="more-btn">Детальніше</button>
                        <div className="video-btn">
                            <div className="circle">
                                <img src="images/video-btn.png" alt="Play btn" className="play-btn" />
                            </div>
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
                            <h1 className="header" style={{ left:"75px" }}>6+</h1>
                            <p className="subheader">Років нашого досвіду</p>
                        </div>
                        <div className="about-item">
                            <h1 className="header" style={{ left: "35px" }}>9 000+</h1>
                            <p className="subheader">Бронювань щодня</p>
                        </div>
                        <div className="about-item">
                            <h1 className="header" style={{ left: "40px" }}>-25%</h1>
                            <p className="subheader">Для нових клієнтів</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="category-block">
                <h3 className="header">Популярні категорії за останній місяць</h3>
                <div className="category-container">
                    <div className="category-item">
                        <img src="images/category-photo1.png" alt="Category Photo" className="category-img" />
                        <div className="category-text">
                            <p className="text">Будинок</p>
                            <img src="images/profile-arrow.png" alt="Arrow image" className="arrow"></img>
                        </div>
                    </div>
                    <div className="category-item">
                        <img src="images/category-photo2.png" alt="Category Photo" className="category-img" />
                        <div className="category-text">
                            <p className="text" style={{ left: "100px" }}>Апартаменти</p>
                            <img src="images/profile-arrow.png" style={{ left: "calc(38% - 14px/2 + 0.5px)" }} alt="Arrow image" className="arrow"></img>
                        </div>
                    </div>
                    <div className="category-item">
                        <img src="images/category-photo3.png" alt="Category Photo" className="category-img" />
                        <div className="category-text">
                            <p className="text">Котедж</p>
                            <img src="images/profile-arrow.png" style={{ left: "calc(31% - 14px/2 + 0.5px)" }} alt="Arrow image" className="arrow"></img>
                        </div>
                    </div>
                    <div className="category-item">
                        <img src="images/category-photo4.png" alt="Category Photo" className="category-img" />
                        <div className="category-text">
                            <p className="text" style={{ left: "140px" }}>Вілла</p>
                            <img src="images/profile-arrow.png" style={{ left: "calc(31% - 14px/2 + 0.5px)" }} alt="Arrow image" className="arrow"></img>
                        </div>
                    </div>
                </div>
            </div>

            <div className="recomended-block">
                <h3 className="header">Рекомендоване житло для вас</h3>
                <div className="recomended-container">
                    <div className="recomended-item">
                        <img src="images/apartment-image1.png" alt="Apartment Photo" className="recomended-img" />
                        <div className="favourite">
                            <img src="images/favourite-icon.png" alt="Favourite btn" className="favourite-btn" />
                        </div>
                        <div className="apartment-info">
                            <h4 className="header">Hus med grillterrass<br></br>i Joncheping County</h4>
                            <h4 className="sub-header">Швеція, Округ Йончепінг, Tånnö</h4>
                            <div className="container">
                                <h4 className="price-big">€ 142</h4>
                                <p className='price-small'>/ ніч</p>
                                <div className='more-button-group'>
                                    <p>Детальніше</p>
                                    <img src="images/arrow.svg" className="icon"></img>
                                </div>
                            </div>
                            <div className="review-container">
                                <div className='rate-group'>
                                    <img src="images/rate-icon.png" className="icon"></img>
                                    <p>4,9</p>
                                </div>
                                <p className='reviews'>(176 відгуків)</p>
                            </div>
                        </div>
                    </div>



                    <div className="recomended-item">
                        <img src="images/apartment-image2.png" alt="Apartment Photo" className="recomended-img" />
                        <div className="favourite">
                            <img src="images/favourite-icon.png" alt="Favourite btn" className="favourite-btn" />
                        </div>
                        <div className="apartment-info">
                            <h4 className="header">Charmant appartement<br></br>au cœur du Marais</h4>
                            <h4 className="sub-header">Франція, Париж, Le Marais</h4>
                            <div className="container">
                                <h4 className="price-big">€ 250</h4>
                                <p className='price-small'>/ ніч</p>
                                <div className='more-button-group'>
                                    <p>Детальніше</p>
                                    <img src="images/arrow.svg" className="icon"></img>
                                </div>
                            </div>
                            <div className="review-container">
                                <div className='rate-group'>
                                    <img src="images/rate-icon.png" className="icon"></img>
                                    <p>4,8</p>
                                </div>
                                <p className='reviews' style={{ left: "8px" }}>(85 відгуків)</p>
                            </div>
                        </div>
                    </div>
                    <div className="recomended-item">
                        <img src="images/apartment-image3.png" alt="Apartment Photo" className="recomended-img" />
                        <div className="favourite">
                            <img src="images/favourite-icon.png" alt="Favourite btn" className="favourite-btn" />
                        </div>
                        <div className="apartment-info">
                            <h4 className="header">Elegante Wohnung<br></br>am Kurfürstendamm</h4>
                            <h4 className="sub-header">Німеччина, Берлін, Charlottenburg</h4>
                            <div className="container">
                                <h4 className="price-big">€ 220</h4>
                                <p className='price-small'>/ ніч</p>
                                <div className='more-button-group'>
                                    <p>Детальніше</p>
                                    <img src="images/arrow.svg" className="icon"></img>
                                </div>
                            </div>
                            <div className="review-container">
                                <div className='rate-group'>
                                    <img src="images/rate-icon.png" className="icon"></img>
                                    <p>4,7</p>
                                </div>
                                <p className='reviews' style={{ left: "8px" }}>(73 відгуків)</p>
                            </div>
                        </div>
                    </div>

                    <div className="recomended-item">
                        <img src="images/apartment-image4.png" alt="Apartment Photo" className="recomended-img" />
                        <div className="favourite">
                            <img src="images/favourite-icon.png" alt="Favourite btn" className="favourite-btn" />
                        </div>
                    </div>
                    <div className="recomended-item">
                        <img src="images/apartment-image5.png" alt="Apartment Photo" className="recomended-img" />
                        <div className="favourite">
                            <img src="images/favourite-icon.png" alt="Favourite btn" className="favourite-btn" />
                        </div>
                    </div>
                    <div className="recomended-item">
                        <img src="images/apartment-image6.png" alt="Apartment Photo" className="recomended-img" />
                        <div className="favourite">
                            <img src="images/favourite-icon.png" alt="Favourite btn" className="favourite-btn" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;