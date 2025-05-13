import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './css/apartment-style.css';
function ApartmentPage() {

    const [apartments, setApartments] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const visibleApartments = showAll ? apartments : apartments.slice(0, 12);
    const [showMore, setShowMore] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("Категорії житла");
    const housingRef = useRef();
    const directionRef = useRef();
    const starsRef = useRef();
    const priceRef = useRef();
    const featuresRef = useRef();
    const safetyRef = useRef();
    const accessRef = useRef();
    const rightFilterRef = useRef();
    const [activeType, setActiveType] = useState('night');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(2500);
    const directions = [
        'Місто', 'Культура', 'Сім’я', 'Розкіш', 'Природа',
        'Оздоровлення', 'Активний відпочинок', 'Романтика', 'Екзотика', 'Розслаблення',
    ];

    const directions2 = [
        'Холодильник', 'Гідромасажна ванна', 'Wi-Fi', 'Сауна', 'Двоспальне ліжко',
        'Басейн', 'Кондиціонер', 'Сад або задній двір', 'Гриль', 'Тераса', 'Балкон', 'ТБ', 'Постільна білизна', 'Камін',
        'Пральна машинка', 'Сушарка', 'Мікрохвильова піч', 'Духовка', 'Електрична піч', 'Посудомийна машина', 'Дитяче ліжко', 'Праска',
        'Дитячий стільчик', 'Прасувальна дошка'
    ];
    const displayed = showMore ? directions : directions.slice(0, 6);
    const displayed2 = showMore ? directions2 : directions2.slice(0, 6);

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

    const toggleShowAll = () => setShowAll(prev => !prev);
    const toggleSort = () => setIsSortOpen(prev => !prev);
    const toggleFilter = () => setIsFilterOpen(prev => !prev);
    const handleMinChange = (e) => {
        const value = Math.min(Number(e.target.value), maxPrice - 1);
        setMinPrice(value);
    };

    const handleMaxChange = (e) => {
        const value = Math.max(Number(e.target.value), minPrice + 1);
        setMaxPrice(value);
    };

    useEffect(() => {
        const container = rightFilterRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.getAttribute("data-section"));
                        console.log(activeSection)
                        console.log(entry.target.getAttribute("data-section"))
                    }
                });
            },
            { root: container, threshold: 0.3 }
        );

        const sections = container.querySelectorAll(".category-container[data-section]");
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const scrollToRef = (ref) => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

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
                <div className="sort-btn" onClick={toggleSort}>
                    <p className="text">Сортувати за рекомендаціями</p>
                    <img className="icon" style={{ transform: isSortOpen ? "rotate(270deg)" : "rotate(90deg)", transition: "transform 0.3s" }} src="images/orange-arrow.png" />
                </div>
                <div className="map-btn">
                    <img className="icon" src="images/map-icon.png" />
                    <p className="text">Перейти до карти</p>
                </div>

                <div className="filter-btn" onClick={toggleFilter}>
                    <img className="filter-icon" src="images/filter-icon.png" />
                    <p className="text">Фільтри</p>
                    <img className="icon" style={{ transform: isFilterOpen ? "rotate(270deg)" : "rotate(90deg)", transition: "transform 0.3s" }} src="images/orange-arrow.png" />
                </div>
            </div>

            {isSortOpen && (
                <div className="sort-window">
                    <div className="sort-container">
                        <div className="sort-item"><p className="text">Популярним</p></div>
                        <div className="sort-item"><p className="text">Рекомендаціями</p></div>
                        <div className="sort-item"><p className="text">Найдорожчими цінами</p></div>
                        <div className="sort-item"><p className="text">Найдешевшими цінами</p></div>
                        <div className="sort-item"><p className="text">Найкращими відгуками</p></div>
                        <div className="sort-item"><p className="text">Знижками</p></div>
                    </div>
                </div>
            )}

            {isFilterOpen && (
                <div className="filter-window">
                    <div className="content-container">
                        <div className="left-filter-container">
                            <div className={activeSection === 'Категорії житла' ? "filter-item-active" : "filter-item"} onClick={() => scrollToRef(housingRef)}><p className="text">Категорії житла</p></div>
                            <div className={activeSection === 'Напрямки' ? "filter-item-active" : "filter-item"} onClick={() => scrollToRef(directionRef)}><p className="text">Напрямки</p></div>
                            <div className={activeSection === 'Кількість зірок' ? "filter-item-active" : "filter-item"} onClick={() => scrollToRef(starsRef)}><p className="text">Кількість зірок</p></div>
                            <div className={activeSection === 'Ціна' ? "filter-item-active" : "filter-item"} onClick={() => scrollToRef(priceRef)}><p className="text">Ціна</p></div>
                            <div className={activeSection === 'Особливості та зручності' ? "filter-item-active" : "filter-item"} onClick={() => scrollToRef(featuresRef)}><p className="text">Особливості та зручності</p></div>
                            <div className={activeSection === 'Безпека' ? "filter-item-active" : "filter-item"} onClick={() => scrollToRef(safetyRef)}><p className="text">Безпека</p></div>
                            <div className={activeSection === 'Доступність' ? "filter-item-active" : "filter-item"} onClick={() => scrollToRef(accessRef)}><p className="text">Доступність</p></div>
                        </div>

                        <div className="right-filter-container" ref={rightFilterRef}>
                            <div className="category-container" ref={housingRef} data-section="Категорії житла">
                                <h2>Категорії житла</h2>
                                <div className='checkbox-container'>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="house" /> Будинок</label>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="apartment" /> Апартаменти</label>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="cottage" /> Котедж</label>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="villa" /> Вілла</label>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="glamping" /> Глемпінг</label>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="townhouse" /> Таунхаус</label>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="chalet" /> Шале</label>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="camping" /> Кемпінг</label>
                                </div>
                            </div>

                            <div className='underline'> </div>

                            <div className="category-container" style={{ marginTop: "-20px" }} ref={directionRef} data-section="Напрямки">
                                <h2>Напрямки</h2>

                                <div className="checkbox-grid" style={{ columnGap: "35px", marginTop: "10px" }}>
                                    {displayed.map((item, index) => (
                                        <label key={index} style={{ whiteSpace: "nowrap" }}>
                                            <input className="checkbox-square" type="checkbox" />
                                            {item}
                                        </label>
                                    ))}
                                </div>

                                <p className="more-text" onClick={() => setShowMore(prev => !prev)}>
                                    {showMore ? 'Показати менше' : 'Показати більше'}
                                </p>
                            </div>

                            <div className='underline' style={{ marginTop: "50px" }}> </div>

                            <div className="category-container" ref={starsRef} data-section="Кількість зірок">
                                <h2>Кількість зірок</h2>
                                <div className='checkbox-container' style={{ height: "140px" }}>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="2" /> 2 <img src="images/rate-icon.png" className="icon"></img></label>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="3" /> 3 <img src="images/rate-icon.png" className="icon"></img></label>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="4" /> 4 <img src="images/rate-icon.png" className="icon"></img></label>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="5" /> 5 <img src="images/rate-icon.png" className="icon"></img></label>
                                </div>
                            </div>

                            <div className='underline' style={{ top: "-20px" }}> </div>

                            <div className="category-container" ref={priceRef} data-section="Ціна" style={{ top: "-20px" }}>
                                <h2>Ціна</h2>
                                <div className="switch-container">
                                    <div className={activeType === 'night' ? 'active-btn' : 'unactive-btn'} onClick={() => setActiveType('night')} >
                                        <p className="text">Ціна за ніч</p>
                                    </div>
                                    <div className={activeType === 'total' ? 'active-btn' : 'unactive-btn'} onClick={() => setActiveType('total')} >
                                        <p className="text">Загальна ціна</p>
                                    </div>
                                </div>

                                <div className='text-container'>
                                    <p className="text">Мін.</p>
                                    <p className="text">Макс.</p>
                                </div>

                                <div className="switch-container" style={{ background: "none", top: "0px" }}>
                                    <input type="number" className="price-input" value={minPrice} onChange={handleMinChange} min="0" max={maxPrice - 1} />
                                    <input type="number" className="price-input" value={maxPrice} onChange={handleMaxChange} min={minPrice + 1} max="2500" />
                                </div>

                                <div className="slider-container">
                                    <div className="slider-track" style={{ background: `linear-gradient( to right, #E6E6E6 0%, #E6E6E6 ${minPrice / 25}%, #E84E0F ${minPrice / 25}%, #E84E0F ${maxPrice / 25}%, #E6E6E6 ${maxPrice / 25}%, #E6E6E6 100% )`, }} />
                                    <input type="range" min="0" max="2500" value={minPrice} onChange={handleMinChange} className="slider-thumb" />
                                    <input type="range" min="0" max="2500" value={maxPrice} onChange={handleMaxChange} className="slider-thumb" />
                                </div>

                            </div>

                            <div className='underline' style={{ marginTop: "15px" }}> </div>

                            <div className="category-container" ref={featuresRef} data-section="Особливості та зручності">
                                <h2>Особливості та зручності</h2>

                                <div className="checkbox-grid" style={{ columnGap: "40px" }}>
                                    {displayed2.map((item, index) => (
                                        <label key={index} style={{ whiteSpace: "nowrap" }}>
                                            <input className="checkbox-square" type="checkbox" />
                                            {item}
                                        </label>
                                    ))}
                                </div>

                                <p className="more-text" onClick={() => setShowMore(prev => !prev)}>
                                    {showMore ? 'Показати менше' : 'Показати більше'}
                                </p>
                            </div>

                            <div className='underline' style={{ marginTop: "50px" }}> </div>

                            <div className="category-container" style={{ marginTop: "-20px" }} ref={safetyRef} data-section="Безпека">
                                <h2>Безпека</h2>
                                <div className='checkbox-container' style={{ height: "50px" }}>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="2" /> Детектор диму</label>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="3" /> Детектор чадного газу</label>
                                </div>
                            </div>

                            <div className='underline' style={{ marginTop: "50px" }}> </div>

                            <div className="category-container" style={{ marginTop: "-20px" }} ref={accessRef} data-section="Доступність">
                                <h2>Доступність</h2>
                                <div className='checkbox-container' style={{ height: "150px" }}>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="house" /> Доступ для інвалідних візків</label>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="apartment" /> Шлях до входу без сходів</label>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="cottage" /> Ліфт</label>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="villa" /> Паркування</label>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="glamping" /> В’їздний пандус</label>
                                    <label><input className='checkbox-square' type="checkbox" name="category" value="townhouse" /> Шлях до подорожей</label>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="bottom-filter-container">
                        <div className="clear-btn">
                            <p>Скинути все</p>
                        </div>
                        <div className="apply-btn">
                            <p>Застосувати</p>
                        </div>
                    </div>
                </div>
            )}

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