import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/apartment-detail-style.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ApartmentDetailPage() {
    const [showMore, setShowMore] = useState(false);
    const [showMore2, setShowMore2] = useState(false);
    const sliderRef = useRef();
    const slider2Ref = useRef();
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 7;
    const slidesToShow = 2.5;

    /*useEffect(() => {
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
            const stopPoint = carouselTop - orderHeight - 20;

            if (scrollY >= stopPoint) {
                orderBlock.classList.remove("sticky-order");
                orderBlock.classList.add("stopped-order");
                orderBlock.style.top = `${stopPoint}px`;
            } else if (scrollY >= initialNavbarOffset) {
                orderBlock.classList.add("sticky-order");
                orderBlock.classList.remove("stopped-order");
                orderBlock.style.top = `95px`;
            } else {
                orderBlock.classList.remove("sticky-order", "stopped-order");
                orderBlock.style.top = `830px`;
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);*/

    return (
        <div className="main-container">
            <div className="detail-nav">
                <p className="nav" onClick={() => navigate('/')}>Головна</p>
                <img src="images/black-arrow.png" className="profile-arrow"></img>
                <p className="nav" onClick={() => navigate('/apartments')}>Вибір житла</p>
                <img src="images/black-arrow.png" className="profile-arrow"></img>
                <p className="nav" style={{ fontWeight: "100" }}><u>Інформація про житло</u></p>
            </div>

            <div className="detail-photo-container">
                <img src="images/apartment-image1.png" className="main-photo"></img>
                <div className="other-photo-container">
                    <img src="images/other-image1.jpg" className="other-photo"></img>
                    <img src="images/other-image2.jpg" className="other-photo"></img>
                    <img src="images/other-image3.jpg" className="other-photo"></img>
                    <img src="images/other-image4.jpg" className="other-photo"></img>

                    <div className="more-photo-btn">
                        <img src="images/photo-icon.png" className="icon"></img>
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
                        <img src="images/share-icon.png" className="circle-icon" />
                    </div>
                    <div className="circle">
                        <img src="images/favourite-icon.png" className="circle-icon" />
                    </div>
                </div>
            </nav>

            <div className="order-block" id="orderBlock">
                <div className="main-block">
                    <h3 className="order-header">Додайте дати, щоб дізнатися загальну ціну!</h3>
                    <div className="date-group">
                        <div className="search-item" style={{ width: "190px" }}>
                            <input style={{ transform: "scaleX(-1)" }} type="date" className="date-picker" />
                            <div className="label-group" style={{ position: "relative", left: "-120px", whiteSpace: "nowrap" }}>
                                <h6 className="label-title">Прибуття</h6>
                                <p className="label-subtitle">Додайте дату</p>
                            </div>
                        </div>

                        <div className="search-item" style={{ width: "190px" }}>
                            <input style={{ transform: "scaleX(-1)" }} type="date" className="date-picker" />
                            <div className="label-group" style={{ position: "relative", left: "-120px", whiteSpace: "nowrap" }}>
                                <h6 className="label-title">Виїзд</h6>
                                <p className="label-subtitle">Додайте дату</p>
                            </div>
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
                        <p className="text">Перевірити наявність</p>
                    </div>

                    <div className="total-group">
                        <p className="text">Всього:</p>
                        <div className="price">
                            <p>від</p>
                            <h5 className="text">142 €</h5>
                        </div>
                    </div>

                    <div className="text-group">
                        <p className="text">Приймаються банківські карти:</p>
                        <div className="cards">
                            <img src="images/card-image1.svg" className="card-img" />
                            <img src="images/card-image2.svg" className="card-img" />
                        </div>
                    </div>
                </div>
                <div className="help-btn">
                    <img src="images/help-icon.png" className="icon" />
                    <p className="text">Допомога</p>
                </div>
            </div>

            <div className="name-info">
                <h1 className="name">Hus med grillterrass i Joncheping County</h1>
                <div className="location">
                    <img src="images/search-icon1.png" className="icon"></img>
                    <p className="text">Швеція, Округ Йончепінг, Tånnö</p>
                </div>
            </div>

            <div className="general-info">
                <div className="item">
                    <img src="images/general-icon1.png" className="icon"></img>
                    <p className="text">60 м²</p>
                </div>
                <div className="item">
                    <img src="images/general-icon2.png" className="icon"></img>
                    <p className="text">4 гостей</p>
                </div>
                <div className="item">
                    <img src="images/general-icon3.png" className="icon"></img>
                    <p className="text">2 спальні</p>
                </div>
                <div className="item">
                    <img src="images/general-icon4.png" className="icon"></img>
                    <p className="text">1 ванна кімната</p>
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
                    <div className='container'>
                        <label>Камін</label>
                        <label>Кухня</label>
                        <label>Басейн</label>
                    </div>

                    <div className='container'>
                        <label>Пральна машина</label>
                        <label>Відкритий простір</label>
                        <label>Паркування</label>
                    </div>

                    <div className='container'>
                        <label>Праска</label>
                        <label>Прасувальна дошка</label>
                        <label>Велосипеди</label>
                    </div>
                </div>
                <p className="show-more" onClick={() => setShowMore2(prev => !prev)}>
                    {showMore2 ? 'Показати менше' : 'Показати більше'}
                </p>
            </div>

            <div className="location-info">
                <h2>Розташування</h2>

                <div className="map-wrapper">
                    <img src="images/map-image.png" className="map-image" />
                    <div className="map-btn">
                        <img src="images/map-icon1.png" className="icon" />
                        <p className="text">Перейти до карти</p>
                    </div>
                </div>

                <div className="row-container">
                    <h6 className="text">Що поруч:</h6>
                    <div className="near-container">
                        <p className="near">• 70 км до аеропорту</p>
                        <p className="near">• 17 км до ресторану</p>
                        <p className="near">• 20 м до озера</p>
                        <p className="near">• 60 м до пляжу</p>
                    </div>
                </div>
            </div>

            <div className="rules-info">
                <h2>Правила дому</h2>
                <div className="rules-container">
                    <div className="rules-item">
                        <img src="images/rules-icon1.png" className="icon" />
                        <h6 className='header'>Події</h6>
                        <p className="text">Дозволені заходи: сімейні зустрічі та дні народження</p>
                    </div>
                    <div className="rules-item">
                        <img src="images/rules-icon2.png" className="icon" />
                        <h6 className='header'>Діти</h6>
                        <p className="text">Дозволено дітям: віком від 1 до 17 років</p>
                    </div>
                    <div className="rules-item">
                        <img src="images/rules-icon3.png" className="icon" />
                        <h6 className='header'>Домашні тварини</h6>
                        <p className="text">Дозволено з домашніми тваринами: собаки та коти вагою до 22 кг</p>
                    </div>
                    <div className="rules-item">
                        <img src="images/rules-icon4.png" className="icon" />
                        <h6 className='header'>Куріння</h6>
                        <p className="text">Куріння дозволено: у спеціально відведених місцях</p>
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
                                <img src="images/owner-pfp.jpg" className="picture" />
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
                    <Slider ref={sliderRef} slidesToShow={2.5} slidesToScroll={1} initialSlide={0} infinite={false} className="review-carousel" beforeChange={(oldIndex, newIndex) => setCurrentSlide(newIndex)}>
                        <div className="slider-item">
                            <div className="top-container">
                                <div className="user-block">
                                    <div className="profile-picture-wrapper">
                                        <img src="images/owner-pfp.jpg" className="picture" />
                                    </div>

                                    <div className="text-wrapper">
                                        <p className="user-name">John Reynolds</p>
                                        <p className="time">Червень 2023</p>
                                    </div>
                                </div>

                                <div className='mark-group'>
                                    <img src="images/rate-icon.png" className="icon"></img>
                                    <p>5,0</p>
                                </div>
                            </div>
                            <div className='text-container'>
                                <p>Гостинність на найвищому рівні. Все було підготовлено заздалегідь, чисто і затишно. Господарка відповіла на всі наші питання, навіть допомогла викликати таксі. Відчував себе як удома. Рекомендую всім, хто цінує комфорт і щирість у спілкуванні</p>
                            </div>
                        </div>
                        <div className="slider-item">
                            <div className="top-container">
                                <div className="user-block">
                                    <div className="profile-picture-wrapper">
                                        <img src="images/owner-pfp.jpg" className="picture" />
                                    </div>

                                    <div className="text-wrapper">
                                        <p className="user-name">Emily Carter</p>
                                        <p className="time">Березень 2024</p>
                                    </div>
                                </div>

                                <div className='mark-group'>
                                    <img src="images/rate-icon.png" className="icon"></img>
                                    <p>4,6</p>
                                </div>
                            </div>
                            <div className='text-container'>
                                <p>Квартира дуже простора і світла. Господарка завжди була на зв’язку, підказала гарні ресторани поблизу. Єдине — трохи шумно вранці через будівництво поруч, але це не зіпсувало враження. Усе інше було чудово. Дякую за прийом!</p>
                            </div>
                        </div>
                        <div className="slider-item">
                            <div className="top-container">
                                <div className="user-block">
                                    <div className="profile-picture-wrapper">
                                        <img src="images/owner-pfp.jpg" className="picture" />
                                    </div>

                                    <div className="text-wrapper">
                                        <p className="user-name">Alejandro Torres</p>
                                        <p className="time">Травень 2022</p>
                                    </div>
                                </div>

                                <div className='mark-group'>
                                    <img src="images/rate-icon.png" className="icon"></img>
                                    <p>5,0</p>
                                </div>
                            </div>
                            <div className='text-container'>
                                <p>Мені сподобалося буквально все: чистота, порядок, запах свіжої постільної білизни. Дуже приємно, коли видно, що господар дійсно дбає про комфорт гостей. Отримав чіткі інструкції, ключі передали вчасно. Без сумніву повернуся сюди ще раз.</p>
                            </div>
                        </div>
                        <div className="slider-item">
                            <div className="top-container">
                                <div className="user-block">
                                    <div className="profile-picture-wrapper">
                                        <img src="images/owner-pfp.jpg" className="picture" />
                                    </div>

                                    <div className="text-wrapper">
                                        <p className="user-name">Natalie Moore</p>
                                        <p className="time">Серпень 2023</p>
                                    </div>
                                </div>

                                <div className='mark-group'>
                                    <img src="images/rate-icon.png" className="icon"></img>
                                    <p>5,0</p>
                                </div>
                            </div>
                            <div className='text-container'>
                                <p>Дуже спокійне місце, саме те, що мені було потрібно. Усе відповідало опису. Господарка дуже уважна — навіть залишила невеликий подарунок. Приємно, коли про тебе так піклуються. Житло виглядає ще краще, ніж на фото. Абсолютно задоволена!</p>
                            </div>
                        </div>
                        <div className="slider-item">
                            <div className="top-container">
                                <div className="user-block">
                                    <div className="profile-picture-wrapper">
                                        <img src="images/owner-pfp.jpg" className="picture" />
                                    </div>

                                    <div className="text-wrapper">
                                        <p className="user-name">Martin Klein</p>
                                        <p className="time">Лютий 2022</p>
                                    </div>
                                </div>

                                <div className='mark-group'>
                                    <img src="images/rate-icon.png" className="icon"></img>
                                    <p>4,2</p>
                                </div>
                            </div>
                            <div className='text-container'>
                                <p>Житло було нормальне, але трохи прохолодне вночі. Добре, що дали додаткову ковдру. В іншому все ок. Господарка відповідальна, зустріла особисто. Мені не вистачило чайника, але це дрібниці. Загалом чудовий варіант на кілька днів.</p>
                            </div>
                        </div>
                        <div className="slider-item">
                            <div className="top-container">
                                <div className="user-block">
                                    <div className="profile-picture-wrapper">
                                        <img src="images/owner-pfp.jpg" className="picture" />
                                    </div>

                                    <div className="text-wrapper">
                                        <p className="user-name">Sofia Evans</p>
                                        <p className="time">Квітень 2024</p>
                                    </div>
                                </div>

                                <div className='mark-group'>
                                    <img src="images/rate-icon.png" className="icon"></img>
                                    <p>5,0</p>
                                </div>
                            </div>
                            <div className='text-container'>
                                <p>Абсолютно ідеально! Зустріли тепло, все підготовлено до приїзду. Місце дуже зручне для прогулянок, господарка порадила круті місця, яких не знайдеш у гуглі. Відчувала себе в безпеці й комфорті. Дуже вдячна за турботу та атмосферу.</p>
                            </div>
                        </div>
                        <div className="slider-item">
                            <div className="top-container">
                                <div className="user-block">
                                    <div className="profile-picture-wrapper">
                                        <img src="images/owner-pfp.jpg" className="picture" />
                                    </div>

                                    <div className="text-wrapper">
                                        <p className="user-name">Oleg Romanov</p>
                                        <p className="time">Жовтень 2022</p>
                                    </div>
                                </div>

                                <div className='mark-group'>
                                    <img src="images/rate-icon.png" className="icon"></img>
                                    <p>4,7</p>
                                </div>
                            </div>
                            <div className='text-container'>
                                <p>Гарне співвідношення ціни та якості. Є все необхідне для короткострокового перебування. Господарка ввічлива та пунктуальна. Єдине — хотілося б трохи більше посуду, бо ми готували самі. А так усе пройшло добре, претензій нема.</p>
                            </div>
                        </div>
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
                            <img src={currentSlide === 0 ? "images/gray-arrow.png" : "images/orange-arrow.png"} style={{ transform: "scaleX(-1)" }} className="arrow-btn" />
                        </div>

                        <div className="carousel-btn"
                            onClick={() => { if (currentSlide < totalSlides - slidesToShow) { sliderRef.current.slickNext(); } }}
                            style={{ border: currentSlide >= totalSlides - slidesToShow ? "2px solid #A0A0A0" : "2px solid #E84E0F", cursor: currentSlide >= totalSlides - slidesToShow ? "default" : "pointer" }} >
                            <img src={ currentSlide >= totalSlides - slidesToShow ? "images/gray-arrow.png" : "images/orange-arrow.png" } className="arrow-btn" />
                        </div>

                    </div>
                </div>
            </div>

            <div className='carousel-block' id="carouselBlock">
                <div className="apartments-carousel-block">
                    <h3 className="header">Схоже житло</h3>
                </div>
                <Slider ref={slider2Ref} slidesToShow={3} slidesToScroll={1} initialSlide={0} infinite={false} className="apartment-carousel">
                    <div className="recomended-slider-item">
                        <img src="images/apartment-image1.png" alt="Apartment Photo" className="recomended-img" />
                        <div className="favourite">
                            <img src="images/favourite-icon.png" alt="Favourite btn" className="favourite-btn" />
                        </div>
                        <div className="apartment-info">
                            <h4 className="header">Hus med grillterrass<br></br>i Joncheping County</h4>
                            <h4 className="sub-header">Швеція, Округ Йончепінг, Tånnö</h4>
                            <div className="container">
                                <h4 className="price-big">$ 142</h4>
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
                    <div className="recomended-slider-item">
                        <img src="images/apartment-image2.png" alt="Apartment Photo" className="recomended-img" />
                        <div className="favourite">
                            <img src="images/favourite-icon.png" alt="Favourite btn" className="favourite-btn" />
                        </div>
                        <div className="apartment-info">
                            <h4 className="header">Charmant appartement<br></br>au cœur du Marais</h4>
                            <h4 className="sub-header">Франція, Париж, Le Marais</h4>
                            <div className="container">
                                <h4 className="price-big">$ 250</h4>
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
                    <div className="recomended-slider-item">
                        <img src="images/apartment-image3.png" alt="Apartment Photo" className="recomended-img" />
                        <div className="favourite">
                            <img src="images/favourite-icon.png" alt="Favourite btn" className="favourite-btn" />
                        </div>
                        <div className="apartment-info">
                            <h4 className="header">Elegante Wohnung<br></br>am Kurfürstendamm</h4>
                            <h4 className="sub-header">Німеччина, Берлін, Charlottenburg</h4>
                            <div className="container">
                                <h4 className="price-big">$ 220</h4>
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

                    <div className="recomended-slider-item">
                        <img src="images/apartment-image1.png" alt="Apartment Photo" className="recomended-img" />
                        <div className="favourite">
                            <img src="images/favourite-icon.png" alt="Favourite btn" className="favourite-btn" />
                        </div>
                        <div className="apartment-info">
                            <h4 className="header">Hus med grillterrass<br></br>i Joncheping County</h4>
                            <h4 className="sub-header">Швеція, Округ Йончепінг, Tånnö</h4>
                            <div className="container">
                                <h4 className="price-big">$ 142</h4>
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
                    <div className="recomended-slider-item">
                        <img src="images/apartment-image2.png" alt="Apartment Photo" className="recomended-img" />
                        <div className="favourite">
                            <img src="images/favourite-icon.png" alt="Favourite btn" className="favourite-btn" />
                        </div>
                        <div className="apartment-info">
                            <h4 className="header">Charmant appartement<br></br>au cœur du Marais</h4>
                            <h4 className="sub-header">Франція, Париж, Le Marais</h4>
                            <div className="container">
                                <h4 className="price-big">$ 250</h4>
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
                    <div className="recomended-slider-item">
                        <img src="images/apartment-image3.png" alt="Apartment Photo" className="recomended-img" />
                        <div className="favourite">
                            <img src="images/favourite-icon.png" alt="Favourite btn" className="favourite-btn" />
                        </div>
                        <div className="apartment-info">
                            <h4 className="header">Elegante Wohnung<br></br>am Kurfürstendamm</h4>
                            <h4 className="sub-header">Німеччина, Берлін, Charlottenburg</h4>
                            <div className="container">
                                <h4 className="price-big">$ 220</h4>
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
                </Slider>

                <div className="carousel-btns">
                    <div className="carousel-btn" onClick={() => slider2Ref.current.slickPrev()}>
                        <img src="images/orange-arrow.png" style={{ transform: "scaleX(-1)" }} alt="Prev" className="arrow-btn" />
                    </div>
                    <div className="carousel-btn" onClick={() => slider2Ref.current.slickNext()}>
                        <img src="images/orange-arrow.png" alt="Next" className="arrow-btn" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApartmentDetailPage;