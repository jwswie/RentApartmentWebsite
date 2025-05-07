import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/apartment-style.css';
function ApartmentPage() {

    const [apartments, setApartments] = useState([]);
    const [showAll, setShowAll] = useState(false);

    const fetchApartments = async () => {
        try {
            const response = await fetch("/api/apartment");
            if (!response.ok) {
                throw new Error('Не вдалося завантажити житло');
            }
            const data = await response.json();
            setApartments(data);
        } catch (error) {
            console.error('Помилка:', error);
        }
    };

    useEffect(() => {
        fetchApartments();
        window.scrollTo(0, 0);
    }, []);

    
    const visibleApartments = showAll ? apartments : apartments.slice(0, 12);
    const toggleShowAll = () => setShowAll(prev => !prev);

    return (
        <div className="main-container">

            <div className="apartment-header">
                <div className="apartment-nav">
                    <p className="nav">Головна</p>
                    <img src="images/black-arrow.png" className="nav-arrow"></img>
                    <p className="nav" style={{ fontWeight: "100" }}><u>Вибір житла</u></p>
                </div>
                <h2>Вибір житла</h2>
            </div>

            <div className="apartment-banner">
                <div className="banner-container">
                    <img src="images/apartment-banner.png" alt="Home banner image" className="banner-img"></img>
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

                        <div className="search-app-btn">
                            <img src="images/search-icon.svg" style={{ width: "25px", height: "25px" }} alt="Search button image" className="btn-search" />
                        </div>
                    </div>
                </div>
            </div>

            <div className='apartment-search'>
                <div className="sort-btn">
                    <p className="text">Сортувати за рекомендаціями</p>
                    <img className="icon" style={{ transform: "rotate(90deg) " }} src="images/orange-arrow.png" />
                </div>
                <div className="map-btn">
                    <img className="icon" src="images/map-icon.png" />
                    <p className="text">Перейти до карти</p>
                </div>

                <div className="filter-btn">
                    <img className="filter-icon" src="images/filter-icon.png" />
                    <p className="text">Фільтри</p>
                    <img className="icon" style={{ transform: "rotate(90deg) " }} src="images/orange-arrow.png" />
                </div>
            </div>

            <div className="apartment-block">
                <div className="apartment-container">
                    {visibleApartments.map((apartment, index) => (
                        <div className="apartment-item" key={index}>
                            <img src={`images/${apartment.apartmentPhoto}`} alt="Apartment Photo" className="apartment-img" />
                            <div className="favourite">
                                <img src="images/favourite-icon.png" alt="Favourite btn" className="favourite-btn" />
                            </div>
                            <div className="info">
                                <h4 className="header">{apartment.apartmentName}</h4>
                                <h4 className="sub-header">{apartment.apartmentCountry}, {apartment.apartmentLocation}</h4>
                                <div className="container" style={apartment.apartmentName.length < 25 ? { top: '20px' } : {}} >

                                    <h4 className="price-big">€ {apartment.apartmentPrice}</h4>
                                    <p className='price-small'>/ ніч</p>
                                    <div className='more-button-group'>
                                        <p>Детальніше</p>
                                        <img src="images/arrow.svg" className="icon"></img>
                                    </div>
                                </div>
                                <div className="review-container">
                                    <div className='rate-group'>
                                        <img src="images/rate-icon.png" className="icon"></img>
                                        <p>{apartment.apartmentRate}</p>
                                    </div>
                                    <p className='reviews'>(176 відгуків)</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="more-btn" onClick={toggleShowAll}>
                    {showAll ? 'Переглянути менше' : 'Переглянути більше'}
                    <img src="images/profile-arrow.png" style={{ transform: showAll ? 'rotate(-90deg)' : 'rotate(90deg)', marginLeft: '10px' }} />
                </button>
            </div>
        </div>
    );
}

export default ApartmentPage;