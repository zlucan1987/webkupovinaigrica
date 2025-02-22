import React from 'react';
import { Link } from 'react-router-dom';
import './EntryPage.css';
import { FaUsers, FaBook } from 'react-icons/fa';

function EntryPage() {
    return (
        <div className="entry-page">
            <div className="entry-content">
                <div className="welcome-messages">
                    <div className="welcome-top">WELCOME, FEEL FREE TO TEST IT OUT !!!</div>
                    <h1>Dobrodošli u Web Kupovinu Igrica!</h1>
                </div>
                <p>Odaberite opciju:</p>
                <div className="entry-buttons">
                    <Link to="/kupci" className="entry-button">
                        <FaUsers className="entry-icon" /> Kupci
                    </Link>
                    <Link to="/swagger" className="entry-button">
                        <FaBook className="entry-icon" /> Swagger
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default EntryPage;