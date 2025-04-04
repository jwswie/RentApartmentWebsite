import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "./css/personal-data.css";

const AddPersonalData = ({ setUser }) => {
    const [user, setLocalUser] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        birthDate: '',
        country: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setLocalUser(parsedUser);
        } else {
            navigate('/login');
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const birthDate = new Date(formData.birthDate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        if (age < 18) {
            alert("You must be at least 18 years old.");
            return;
        }

        console.log("Submitted Data:", formData);
        alert("Data saved successfully!");
    };

    return (
        <div className="admin-container" style={{ position: "relative", top: '150px', marginBottom: '100px' }}>
            <div className="sidebar">
                <div>
                    <div className="menu-item"> Personal Details </div>
                    <div className="menu-item"> Payment Methods </div>
                </div>
            </div>

            <div className="content">
                <h2>Personal Details</h2>
                <form onSubmit={handleSubmit} className="form-container">
                    <div className="row">
                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={user?.userName || formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user?.emailAddress || formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Birth Date</label>
                        <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Country</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-btn">Save</button>
                </form>
            </div>
        </div>
    );
};

export default AddPersonalData;
