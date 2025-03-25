import './css/bootstrap.min.css';
import './css/font-awesome.min.css';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {

    return (
        <div className="clinic_version">
            <div className="section" style={{ marginTop: '100px' }}>
                <div className="container">
                    <div className="heading">
                        <h2>Main Page</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;