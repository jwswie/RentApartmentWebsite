import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/not-found-style.css';

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className='not-found-container' style={{ marginBottom: "370px" }}>
            <h1 className="big-header">404</h1>
            <h2 className="small-header">Упс! Щось пішло не так...</h2>
            <p className="sub-header">
                Сторінку, яку ви шукали, не знайдено або видалено.<br />
                Бажаєте перейти на головну сторінку чи повернутися на попередню?
            </p>

            <div className="buttons-group">
                <Link to="/"><button className="home-btn">На головну</button></Link>
                <button className="prev-btn" onClick={() => navigate(-1)}>На попередню</button>
            </div>
        </div>
    );
}

export default NotFoundPage;