import './css/bootstrap.min.css';
import './css/font-awesome.min.css';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function AboutPage() {

    return (
        <div className="clinic_version">
            <div className="section" style={{ marginTop: '100px' }}>
                <div className="container">
                    <div className="heading">
                        <h2>About Page</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;