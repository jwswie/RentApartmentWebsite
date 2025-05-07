import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/country-style.css';

function CountriesPage() {

    const [countries, setCountries] = useState([]);
    const [showAll, setShowAll] = useState(false);

    const fetchCountries = async () => {
        try {
            const response = await fetch("/api/countries");
            if (!response.ok) {
                throw new Error('Не вдалося завантажити країни');
            }
            const data = await response.json();
            setCountries(data);
        } catch (error) {
            console.error('Помилка:', error);
        }
    };

    useEffect(() => {
        fetchCountries();
        window.scrollTo(0, 0);
    }, []);

    const visibleCountries = showAll ? countries : countries.slice(0, 16);
    const toggleShowAll = () => setShowAll(prev => !prev);

    return (
        <div className="main-container">

            <div className="countries-header">
                <div className="countries-nav">
                    <p className="nav">Головна</p>
                    <img src="images/black-arrow.png" className="nav-arrow"></img>
                    <p className="nav" style={{ fontWeight: "100" }}><u>Країни</u></p>
                </div>
                <h2>Вибір країни</h2>
            </div>

            <div className='country-search'>
                <div className="search-container">
                    <form>
                        <input type="text" className="country-input" placeholder="Введіть потрібну країну" required />
                        <div className="country-search-btn">
                            <img src="images/search-icon.svg" style={{ width: "23px", height: "23px" }} />
                        </div>
                    </form>
                </div>

                <div className="map-btn">
                    <img className="icon" src="images/map-icon.png" />
                    <p className="text">Перейти до карти</p>
                </div>

                <div className="sort-btn">
                    <p className="text">Сортувати за популярністю</p>
                    <img className="icon" style={{ transform: "rotate(90deg) " }} src="images/orange-arrow.png" />
                </div>
            </div>

            <div className="country-block">
                <div className="country-container">
                    {visibleCountries.map((country, index) => (
                        <div className="country-item" key={index}>
                            <div className="country-img-wrapper">
                                <img
                                    src={`images/${country.countryPhoto}`}
                                    alt={country.countryName}
                                    className="country-img"
                                />
                            </div>
                            <div className="country-info">
                                <h4 className="header">{country.countryName}</h4>
                                <h4 className="sub-header">Від 98 €</h4>
                                <div className="more-button-group">
                                    <p>Детальніше</p>
                                    <img src="images/arrow.svg" className="icon" alt="arrow" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="more-btn" onClick={toggleShowAll}>
                    {showAll ? 'Переглянути менше' : 'Переглянути більше'}
                    <img
                        src="images/profile-arrow.png"
                        style={{
                            transform: showAll ? 'rotate(-90deg)' : 'rotate(90deg)',
                            marginLeft: '10px'
                        }}
                        alt="arrow"
                    />
                </button>
            </div>
        </div>
    );
}

export default CountriesPage;