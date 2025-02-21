import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaBook } from 'react-icons/fa';

function EntryPage() {
  return (
    <div className="entry-page">
      <div className="entry-content">
        <h1>Dobrodošli u Web Kupovinu Igrica!</h1>
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