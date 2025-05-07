import React, { useState, useEffect } from 'react';
import './css/country-style.css';

function CountriesPage() {
    const [countries, setCountries] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        fetch("/api/countries")
            .then(res => res.json())
            .then(data => setCountries(data))
            .catch(error => console.error('Помилка:', error));
        window.scrollTo(0, 0);
    }, []);

    const visibleCountries = showAll ? countries : countries.slice(0, 16);

    const handleSearch = (e) => {
        e.preventDefault();
        const results = countries.filter(country =>
            country.countryName.toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
        setSearchResults(results);
    };

    const displayedCountries = searchResults.length > 0 ? searchResults : visibleCountries;

    const toggleShowAll = () => setShowAll(prev => !prev);

    return (
        <div className="main-container">
            <div className="countries-header">
                <div className="countries-nav">
                    <p className="nav">Головна</p>
                    <img src="images/black-arrow.png" className="nav-arrow" alt="arrow" />
                    <p className="nav" style={{ fontWeight: "100" }}><u>Країни</u></p>
                </div>
                <h2>Вибір країни</h2>
            </div>

            <div className='country-search'>
                <div className="search-container">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="country-input"
                            placeholder="Введіть потрібну країну"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            required
                        />
                        <button type="submit" className="country-search-btn">
                            <img src="images/search-icon.svg" alt="search" style={{ width: "23px", height: "23px" }} />
                        </button>
                    </form>
                </div>

                <div className="map-btn">
                    <img className="icon" src="images/map-icon.png" alt="map" />
                    <p className="text">Перейти до карти</p>
                </div>

                <div className="sort-btn">
                    <p className="text">Сортувати за популярністю</p>
                    <img className="icon" style={{ transform: "rotate(90deg)" }} src="images/orange-arrow.png" alt="sort" />
                </div>
            </div>

            <div className="country-block">
                <div className="country-container">
                    {displayedCountries.map((country, index) => (
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

                {searchResults.length === 0 && (
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
                )}
            </div>
        </div>
    );
}

export default CountriesPage;
