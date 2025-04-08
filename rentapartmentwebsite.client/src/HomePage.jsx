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
        </div>
    );
}

export default HomePage;