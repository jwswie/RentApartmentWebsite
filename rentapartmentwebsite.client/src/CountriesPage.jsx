import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/country-style.css';

function CountriesPage() {
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const visibleCountries = showAll ? countries : countries.slice(0, 16);
    const displayedCountries = searchResults.length > 0 ? searchResults : visibleCountries;
    const [apartments, setApartments] = useState([]);
    const [minPrices, setMinPrices] = useState({});

    useEffect(() => {
        fetch("/api/countries")
            .then(res => res.json())
            .then(data => setCountries(data))
            .catch(error => console.error('Помилка:', error));

        fetch("/api/apartment")
            .then(res => res.json())
            .then(data => {
                setApartments(data);
                const prices = {};
                data.forEach(ap => {
                    if (!prices[ap.apartmentCountry] || ap.apartmentPrice < prices[ap.apartmentCountry]) {
                        prices[ap.apartmentCountry] = ap.apartmentPrice;
                    }
                });
                setMinPrices(prices);
            })
            .catch(error => console.error("Помилка завантаження житла:", error));

        window.scrollTo(0, 0);
    }, []);


    const toggleShowAll = () => setShowAll(prev => !prev);

    const handleCountryClick = (countryName) => {
        navigate(`/apartments/${encodeURIComponent(countryName)}`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const results = countries.filter(country =>
            country.countryName.toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
        setSearchResults(results);
    };

    return (
        <div className="main-container">
            <div className="countries-header">
                <div className="countries-nav">
                    <p className="nav" onClick={() => navigate('/')}>Головна</p>
                    <img src="images/black-arrow.png" className="nav-arrow" />
                    <p className="nav" style={{ fontWeight: "100" }}><u>Країни</u></p>
                </div>
                <h2>Вибір країни</h2>
            </div>

            <div className='country-search'>
                <div className="search-container">
                    <form onSubmit={handleSearch}>
                        <input type="text" className="country-input" placeholder="Введіть потрібну країну" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} required />
                        <button type="submit" className="country-search-btn">
                            <img src="images/search-icon.svg" style={{ width: "23px", height: "23px" }} />
                        </button>
                    </form>
                </div>

                <div className="map-btn">
                    <img className="icon" src="images/map-icon.png" />
                    <p className="text">Перейти до карти</p>
                </div>

                <div className="sort-btn">
                    <p className="text">Сортувати за популярністю</p>
                    <img className="icon" style={{ transform: "rotate(90deg)" }} src="images/orange-arrow.png" />
                </div>
            </div>

            <div className="country-block">
                <div className="country-container">
                    {displayedCountries.map((country, index) => (
                        <div className="country-item" key={index} onClick={() => handleCountryClick(country.countryName)}>
                            <div className="country-img-wrapper">
                                <img src={`images/${country.countryPhoto}`} className="country-img" />
                            </div>
                            <div className="country-info">
                                <h4 className="header">{country.countryName}</h4>
                                <h4 className="sub-header"> {minPrices[country.countryName] ? `Від ${minPrices[country.countryName]} €` : 'Немає даних'} </h4>
                                <div className="more-button-group">
                                    <p>Детальніше</p>
                                    <img src="images/arrow.svg" className="icon" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {searchResults.length === 0 && (
                    <button className="more-btn" onClick={toggleShowAll}>
                        {showAll ? 'Переглянути менше' : 'Переглянути більше'}
                        <img src="images/profile-arrow.png" style={{ transform: showAll ? 'rotate(-90deg)' : 'rotate(90deg)', marginLeft: '10px' }} />
                    </button>
                )}
            </div>
        </div>
    );
}

export default CountriesPage;