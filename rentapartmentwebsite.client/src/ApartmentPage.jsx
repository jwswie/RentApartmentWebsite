import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useSearchParams, useParams, useNavigate } from 'react-router-dom';
import './css/apartment-style.css';

function ApartmentPage() {
    const { country } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialCategory = searchParams.get('category');
    const [allApartments, setAllApartments] = useState([]);
    const [apartments, setApartments] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [showMore, setShowMore] = useState(false);

    //#region SortVariables
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [sortOption, setSortOption] = useState(null);
    const getSortedApartments = () => {
        let sorted = [...apartments];
        switch (sortOption) {
            case "rate":
                sorted.sort((a, b) => b.apartmentRate - a.apartmentRate);
                break;
            case "priceHigh":
                sorted.sort((a, b) => b.apartmentPrice - a.apartmentPrice);
                break;
            case "priceLow":
                sorted.sort((a, b) => a.apartmentPrice - b.apartmentPrice);
                break;
            default:
                break;
        }
        return sorted;
    };
    const sortedApartments = getSortedApartments();
    //#endregion

    const visibleApartments = showAll ? sortedApartments : sortedApartments.slice(0, 12);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    //#region SectionVariables
    const [activeSection, setActiveSection] = useState("Категорії житла");
    const housingRef = useRef();
    const directionRef = useRef();
    const starsRef = useRef();
    const priceRef = useRef();
    const amenitiesRef = useRef();
    const safetyRef = useRef();
    const accessRef = useRef();
    //#endregion

    const rightFilterRef = useRef();
    const [activeType, setActiveType] = useState('night');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(2500);
    const directions = [ 'Місто', 'Культура', 'Сім’я', 'Розкіш', 'Природа', 'Оздоровлення', 'Активний відпочинок', 'Романтика', 'Екзотика', 'Розслаблення', ];
    const amenities = [ 'Холодильник', 'Гідромасажна ванна', 'Wi-Fi', 'Сауна', 'Двоспальне ліжко', 'Басейн', 'Кондиціонер', 'Сад або задній двір', 'Гриль', 'Тераса', 'Балкон', 'ТБ', 'Постільна білизна', 'Камін', 'Пральна машинка', 'Сушарка', 'Мікрохвильова піч', 'Духовка', 'Електрична піч', 'Посудомийна машина', 'Дитяче ліжко', 'Праска', 'Дитячий стільчик', 'Прасувальна дошка' ];
    const displayed = showMore ? directions : directions.slice(0, 6);
    const displayedAmenities = showMore ? amenities : amenities.slice(0, 6);

    //#region CheckboxVariables
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedStars, setSelectedStars] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [selectedDirections, setSelectedDirections] = useState([]);
    const [selectedAccessibilities, setSelectedAccessibilities] = useState([]);
    const [selectedSafeties, setSelectedSafeties] = useState([]);
    //#endregion

    const fetchApartments = async () => {
        try {
            const response = await fetch("/api/apartment");
            if (!response.ok) throw new Error('Не вдалося завантажити житло');
            const data = await response.json();
            const filtered = country ? data.filter(ap => ap.apartmentCountry === decodeURIComponent(country)) : data;
            setAllApartments(filtered);
            setApartments(filtered);

            if (initialCategory) {
                setSelectedCategories([initialCategory]);
                const categoryFiltered = filtered.filter(ap => ap.categories?.includes(initialCategory));
                setApartments(categoryFiltered);
            }
        } catch (error) {
            console.error('Помилка:', error);
        }
    };

    useEffect(() => {
        fetchApartments();
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (initialCategory) {
            setSelectedCategories([initialCategory]);
            const categoryFiltered = allApartments.filter(ap => ap.categories?.includes(initialCategory));
            setApartments(categoryFiltered);

            navigate("/apartments", { replace: true });
        }
    }, [initialCategory, allApartments]);

    const toggleShowAll = () => {
        setShowAll(prev => !prev);
    };
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
    const handleCheckboxChange = (value, stateSetter) => {
        stateSetter(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
    };

    const applyFilters = () => {
        const filtered = allApartments.filter(ap => {
            const byCategory = selectedCategories.length === 0 || selectedCategories.some(cat =>
                ap.categories && ap.categories.includes(cat)
            );
            const byStars = selectedStars.length === 0 || selectedStars.some(star => {
                const starNum = parseInt(star, 10);
                return ap.apartmentRate >= starNum && ap.apartmentRate < starNum + 1;
            });
            const byDirections = selectedDirections.length === 0 || selectedDirections.some(dir => ap.apartmentName.includes(dir));
            const byAmenities =
                selectedAmenities.length === 0 ||
                selectedAmenities.every(f => ap.amenities?.includes(f));

            const byAccess = selectedAccessibilities.length === 0;
            const bySafety = selectedSafeties.length === 0;
            const byPrice = ap.apartmentPrice >= minPrice && ap.apartmentPrice <= maxPrice;

            return byCategory && byStars && byDirections && byAmenities && byAccess && bySafety && byPrice;
        });

        setApartments(filtered);
        setIsFilterOpen(false);
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedStars([]);
        setSelectedAmenities([]);
        setSelectedDirections([]);
        setSelectedAccessibilities([]);
        setSelectedSafeties([]);
        setMinPrice(0);
        setMaxPrice(2500);
        setApartments(allApartments);
    };

    useEffect(() => {
        if (!isFilterOpen) return;

        const container = rightFilterRef.current;
        if (!container) return;

        const handleScroll = () => {
            const sections = container.querySelectorAll(".category-container[data-section]");

            let closestSection = null;
            let minDistance = Infinity;

            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                const containerTop = container.getBoundingClientRect().top;
                const distance = Math.abs(rect.top - containerTop);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestSection = section;
                }
            });

            if (closestSection) {
                const sectionName = closestSection.getAttribute("data-section");
                setActiveSection(sectionName);
            }
        };

        container.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => container.removeEventListener("scroll", handleScroll);
    }, [isFilterOpen]); // Отображение выбранной категории фильтров

    const scrollToRef = (ref) => {
        const container = rightFilterRef.current;
        const target = ref.current;

        if (container && target) {
            const containerTop = container.getBoundingClientRect().top;
            const targetTop = target.getBoundingClientRect().top;
            const scrollOffset = targetTop - containerTop + container.scrollTop;
            container.scrollTo({ top: scrollOffset, behavior: "smooth", });
        }
    }; // Прокрутка right-filter-container до нужной категории фильтров

    return (
        <div className="main-container">
            <div className="apartment-header">
                <div className="apartment-nav">
                    <p className="nav" onClick={() => navigate('/')}>Головна</p>
                    <img src="/images/black-arrow.png" className="nav-arrow"></img>
                    <p className="nav" style={{ fontWeight: "100" }}><u>Вибір житла</u></p>
                </div>
                <h2>Вибір житла</h2>
            </div>

            <div className="apartment-banner">
                <div className="banner-container">
                    <img src="/images/apartment-banner.png" className="banner-img"></img>
                    <div className="search-container">
                        <div className="search-item item-1">
                            <img src="/images/search-icon1.png" className="label-search" />
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
                            <img src="/images/search-icon3.png" style={{ marginLeft: "5px" }} className="label-search" />
                            <div className="label-group">
                                <h6 className="label-title">Гості</h6>
                                <p className="label-subtitle" style={{ whiteSpace: "nowrap" }}>Хто вирушає з вами?</p>
                            </div>
                        </div>

                        <div className="search-app-btn">
                            <img src="/images/search-icon.svg" style={{ width: "25px", height: "25px" }} className="btn-search" />
                        </div>
                    </div>
                </div>
            </div>

            <div className='apartment-search'>
                <div className="sort-btn" onClick={toggleSort}>
                    <p className="text">Сортувати за {sortOption === "rate" ? "популярним" : sortOption === "priceHigh" ? "найдорожчими" : sortOption === "priceLow" ? "найдешевшими" : "рекомендаціями"}</p>
                    <img className="icon" style={{ transform: isSortOpen ? "rotate(270deg)" : "rotate(90deg)", transition: "transform 0.3s" }} src="/images/orange-arrow.png" />
                </div>
                <div className="map-btn">
                    <img className="icon" src="/images/map-icon.png" />
                    <p className="text">Перейти до карти</p>
                </div>

                <div className="filter-btn" onClick={toggleFilter}>
                    <img className="filter-icon" src="/images/filter-icon.png" />
                    <p className="text">Фільтри</p>
                    <img className="icon" style={{ transform: isFilterOpen ? "rotate(270deg)" : "rotate(90deg)", transition: "transform 0.3s" }} src="/images/orange-arrow.png" />
                </div>
            </div>

            {isSortOpen && (
                <div className="sort-window">
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
                        <div className="sort-item"> <p className="text">Найкращими відгуками</p> </div>
                        <div className="sort-item"> <p className="text">Знижками</p> </div>
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
                            <div className={activeSection === 'Особливості та зручності' ? "filter-item-active" : "filter-item"} onClick={() => scrollToRef(amenitiesRef)}><p className="text">Особливості та зручності</p></div>
                            <div className={activeSection === 'Безпека' ? "filter-item-active" : "filter-item"} onClick={() => scrollToRef(safetyRef)}><p className="text">Безпека</p></div>
                            <div className={activeSection === 'Доступність' ? "filter-item-active" : "filter-item"} onClick={() => scrollToRef(accessRef)}><p className="text">Доступність</p></div>
                        </div>

                        <div className="right-filter-container" ref={rightFilterRef}>
                            <div className="category-container" ref={housingRef} data-section="Категорії житла">
                                <h2>Категорії житла</h2>
                                <div className='checkbox-container'>
                                    <label> <input className='checkbox-square' type="checkbox" name="category" value="house" checked={selectedCategories.includes("Будинок")} onChange={() => handleCheckboxChange("Будинок", setSelectedCategories)} /> Будинок </label>
                                    <label> <input className='checkbox-square' type="checkbox" name="category" value="apartment" checked={selectedCategories.includes("Апартаменти")} onChange={() => handleCheckboxChange("Апартаменти", setSelectedCategories)} /> Апартаменти </label>
                                    <label> <input className='checkbox-square' type="checkbox" name="category" value="cottage" checked={selectedCategories.includes("Котедж")} onChange={() => handleCheckboxChange("Котедж", setSelectedCategories)} /> Котедж </label>
                                    <label> <input className='checkbox-square' type="checkbox" name="category" value="villa" checked={selectedCategories.includes("Вілла")} onChange={() => handleCheckboxChange("Вілла", setSelectedCategories)} /> Вілла </label>
                                    <label> <input className='checkbox-square' type="checkbox" name="category" value="glamping" checked={selectedCategories.includes("Глемпінг")} onChange={() => handleCheckboxChange("Глемпінг", setSelectedCategories)} /> Глемпінг </label>
                                    <label> <input className='checkbox-square' type="checkbox" name="category" value="townhouse" checked={selectedCategories.includes("Таунхаус")} onChange={() => handleCheckboxChange("Таунхаус", setSelectedCategories)} /> Таунхаус </label>
                                    <label> <input className='checkbox-square' type="checkbox" name="category" value="chalet" checked={selectedCategories.includes("Шале")} onChange={() => handleCheckboxChange("Шале", setSelectedCategories)} /> Шале </label>
                                    <label> <input className='checkbox-square' type="checkbox" name="category" value="camping" checked={selectedCategories.includes("Кемпінг")} onChange={() => handleCheckboxChange("Кемпінг", setSelectedCategories)} /> Кемпінг </label>
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
                                    <label> <input className='checkbox-square' type="checkbox" value="2" checked={selectedStars.includes("2")} onChange={() => handleCheckboxChange("2", setSelectedStars)} /> 2 <img src="/images/rate-icon.png" className="icon" /></label>
                                    <label> <input className='checkbox-square' type="checkbox" value="3" checked={selectedStars.includes("3")} onChange={() => handleCheckboxChange("3", setSelectedStars)} /> 3 <img src="/images/rate-icon.png" className="icon" /> </label>
                                    <label> <input className='checkbox-square' type="checkbox" value="4" checked={selectedStars.includes("4")} onChange={() => handleCheckboxChange("4", setSelectedStars)} /> 4 <img src="/images/rate-icon.png" className="icon" /> </label>
                                    <label> <input className='checkbox-square' type="checkbox" value="5" checked={selectedStars.includes("5")} onChange={() => handleCheckboxChange("5", setSelectedStars)} /> 5 <img src="/images/rate-icon.png" className="icon" /> </label>
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

                            <div className="category-container" ref={amenitiesRef} data-section="Особливості та зручності">
                                <h2>Особливості та зручності</h2>

                                <div className="checkbox-grid" style={{ columnGap: "40px" }}>
                                    {displayedAmenities.map((item, index) => (
                                        <label key={index} style={{ whiteSpace: "nowrap" }}>
                                            <input
                                                className="checkbox-square"
                                                type="checkbox"
                                                value={item}
                                                checked={selectedAmenities.includes(item)}
                                                onChange={(e) => {
                                                    const { value, checked } = e.target;
                                                    setSelectedAmenities(prev =>
                                                        checked ? [...prev, value] : prev.filter(f => f !== value)
                                                    );
                                                }}
                                            />
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
                        <div className="clear-btn" onClick={clearFilters}>
                            <p>Скинути все</p>
                        </div>
                        <div className="apply-btn" onClick={applyFilters}>
                            <p>Застосувати</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="apartment-block">
                <div className="apartment-container">
                    {visibleApartments.map((apartment, index) => (
                        <div className="apartment-item" key={index}>
                            <img src={`/images/${apartment.apartmentPhoto}`} className="apartment-img" />
                            <div className="favourite">
                                <img src="/images/favourite-icon.png" className="favourite-btn" />
                            </div>
                            <div className="info">
                                <h4 className="header">{apartment.apartmentName}</h4>
                                <h4 className="sub-header">{apartment.apartmentCountry}, {apartment.apartmentLocation}</h4>
                                <div className="container" style={apartment.apartmentName.length < 25 ? { top: '20px' } : {}} >

                                    <h4 className="price-big">€ {apartment.apartmentPrice}</h4>
                                    <p className='price-small'>/ ніч</p>
                                    <Link to={`/apartment/${apartment.apartmentID}`} state={{ apartment }} className="more-button-group" >
                                        <p>Детальніше</p>
                                        <img src="/images/arrow.svg" className="icon"></img>
                                    </Link>
                                </div>
                                <div className="review-container">
                                    <div className='rate-group'>
                                        <img src="/images/rate-icon.png" className="icon"></img>
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
                    <img src="/images/profile-arrow.png" style={{ transform: showAll ? 'rotate(-90deg)' : 'rotate(90deg)', marginLeft: '10px' }} />
                </button>
            </div>
        </div>
    );
}

export default ApartmentPage;