import { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/proizvodi?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };
    
    return (
        <Form onSubmit={handleSearch} className="search-form">
            <InputGroup>
                <Form.Control
                    type="text"
                    placeholder="Pretraži igrice..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <Button variant="outline-light" type="submit">
                    <i className="bi bi-search"></i>
                    Traži
                </Button>
            </InputGroup>
        </Form>
    );
};

export default SearchBar;
