import { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProizvodService from '../services/ProizvodService';
import { getGameImage, getRandomRating, hasDiscount, getDiscountPercentage } from '../utils/imageUtils';
import { useCart } from '../context/CartContext';
import './GameGrid.css';

const GameGrid = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            try {
                const data = await ProizvodService.get();
                
                // Dodaj dodatne informacije igricama (slike, ocjene, popuste)
                const enhancedGames = data.map(game => ({
                    ...game,
                    imageUrl: getGameImage(game.nazivIgre), // Dohvaća odgovarajuću sliku prema nazivu igrice
                    rating: getRandomRating(),
                    discount: hasDiscount() ? getDiscountPercentage() : null
                }));
                
                setGames(enhancedGames);
            } catch (error) {
                console.error('Error fetching games:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchGames();
    }, []);
    
    const handleGameClick = (game) => {
        navigate(`/proizvodi/${game.sifra}`);
    };
    
    const handleAddToCart = (e, game) => {
        e.stopPropagation();
        addToCart(game);
    };
    
    const renderRatingStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={i <= rating ? 'star filled' : 'star'}>
                    ★
                </span>
            );
        }
        return stars;
    };
    
    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Učitavanje igrica...</p>
            </div>
        );
    }
    
    return (
        <div className="game-grid">
            <h2 className="section-title">Naše igrice</h2>
            <Row xs={1} md={2} lg={4} className="g-4">
                {games.map((game) => (
                    <Col key={game.sifra}>
                        <Card 
                            className="game-card" 
                            onClick={() => handleGameClick(game)}
                        >
                            <div className="image-container">
                                <Card.Img 
                                    variant="top" 
                                    src={game.imageUrl} 
                                    alt={game.nazivIgre}
                                />
                                <div className="rating">
                                    {renderRatingStars(game.rating)}
                                </div>
                                {game.discount && (
                                    <Badge 
                                        bg="danger" 
                                        className="discount-badge"
                                    >
                                        -{game.discount}%
                                    </Badge>
                                )}
                            </div>
                            <Card.Body>
                                <Card.Title>{game.nazivIgre}</Card.Title>
                                <div className="price-container">
                                    {game.discount ? (
                                        <>
                                            <span className="original-price">
                                                {game.cijena.toFixed(2)} €
                                            </span>
                                            <span className="discounted-price">
                                                {(game.cijena * (1 - game.discount / 100)).toFixed(2)} €
                                            </span>
                                        </>
                                    ) : (
                                        <span className="price">
                                            {game.cijena.toFixed(2)} €
                                        </span>
                                    )}
                                </div>
                                <Button 
                                    variant="primary" 
                                    className="add-to-cart-btn"
                                    onClick={(e) => handleAddToCart(e, game)}
                                >
                                    Dodaj u košaricu
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default GameGrid;
