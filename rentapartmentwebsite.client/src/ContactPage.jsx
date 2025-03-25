import './css/bootstrap.min.css';
import './css/font-awesome.min.css';
import React, { useEffect } from 'react';

function ContactPage() {

    useEffect(() => {
        function myMap() {
            const mapProp = {
                center: new window.google.maps.LatLng(50.450001, 30.523333), // Задаёт центр карты (Киев)
                zoom: 5,
            };
            new window.google.maps.Map(document.getElementById("googleMap"), mapProp); // Создаёт карту внутри элемента <div id="googleMap">
        }

        const script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCNUPWkb4Cjd7Wxo-T4uoUldFjoiUA1fJc&callback=myMap";
        script.async = true;
        script.defer = true; // Скрипт выполнится только после загрузки страницы
        window.myMap = myMap; // Делаем функцию myMap() глобальной
        document.body.appendChild(script);
    }, []);

    return (
        <div className="clinic_version">
            <div className="section" style={{ marginTop: '100px' }}>
                <div className="heading">
                    <h2>Contact Page</h2>
                </div>

                <div className="contact-section">
                    <div id="googleMap" style={{ width: '100%', height: '450px' }}></div>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;