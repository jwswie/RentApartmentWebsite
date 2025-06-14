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

    //#region SortVariables
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [sortOption, setSortOption] = useState(null);
    const getSortedCountries = () => {
        let sorted = [...countries];

        if (sortOption === "priceHigh" || sortOption === "priceLow") {
            const comparator = {
                priceHigh: (a, b) => (minPrices[b.countryName] || 0) - (minPrices[a.countryName] || 0),
                priceLow: (a, b) => (minPrices[a.countryName] || 0) - (minPrices[b.countryName] || 0),
            }[sortOption];

            sorted.sort(comparator);
        }

        return sorted;
    };

    const displayedCountries = searchResults.length > 0 ? searchResults : getSortedCountries().slice(0, showAll ? countries.length : 16);
    //#endregion

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

    const toggleSort = () => setIsSortOpen(prev => !prev);

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
                <div className="sort-btn" onClick={toggleSort}>
                    <p className="text">Сортувати за {sortOption === "rate" ? "популярним" : sortOption === "priceHigh" ? "найдорожчими" : sortOption === "priceLow" ? "найдешевшими" : "рекомендаціями"}</p>
                    <img className="icon" style={{ transform: isSortOpen ? "rotate(270deg)" : "rotate(90deg)", transition: "transform 0.3s" }} src="/images/orange-arrow.png" />
                </div>

                {isSortOpen && (
                    <div className="sort-window" style={{ left: "0px", top: "100px", width: "240px", height: "200px" }}>
                        <div className="sort-container">
                            <div className={`sort-item ${sortOption === "rate" ? "active" : ""}`} onClick={() => { setSortOption("rate"); setIsSortOpen(false); }} >
                                <p className="text">Популярним</p>
                            </div>
                            <div className={`sort-item ${sortOption === "default" || sortOption === null ? "active" : ""}`} onClick={() => { setSortOption("default"); setIsSortOpen(false); }} >
                                <p className="text">Рекомендаціями</p>
                            </div>
                            <div className={`sort-item ${sortOption === "priceHigh" ? "active" : ""}`} onClick={() => { setSortOption("priceHigh"); setIsSortOpen(false); }} >
                                <p className="text">Найдорожчими цінами</p>
                            </div>
                            <div className={`sort-item ${sortOption === "priceLow" ? "active" : ""}`} onClick={() => { setSortOption("priceLow"); setIsSortOpen(false); }} >
                                <p className="text">Найдешевшими цінами</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="country-search-container">
                    <form onSubmit={handleSearch}>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="country-input"
                                placeholder="Введіть потрібну країну"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                required
                            />
                            <div className="map-btn">
                                <img className="icon" src="images/map-icon.png" />
                                <p className="text">Перейти до карти</p>
                            </div>
                        </div>

                        <button type="submit" className="country-search-btn">
                            <img src="images/search-icon.svg" style={{ width: "23px", height: "23px" }} />
                        </button>
                    </form>
                </div>

            </div>

            <div className="country-block">
                <div className="country-container">
                    {displayedCountries.map((country, index) => (
                        <div className="country-item" key={index}>
                            <div className="country-img-wrapper">
                                <img src={`images/${country.countryPhoto}`} className="country-img" />
                            </div>
                            <div className="country-info">
                                <h4 className="header">{country.countryName}</h4>
                                <h4 className="sub-header"> {minPrices[country.countryName] ? `Від ${minPrices[country.countryName]} €` : 'Немає даних'} </h4>
                                <div className="more-button-group" onClick={() => handleCountryClick(country.countryName)}>
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