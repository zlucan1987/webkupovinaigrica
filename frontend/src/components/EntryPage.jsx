import './EntryPage.css';
import GameGrid from './GameGrid';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../constants';
import { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const EntryPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    useEffect(() => {
        // Check if user is logged in
        setIsLoggedIn(AuthService.isLoggedIn());
        
        // Show logo animation for 2 seconds
        const timer1 = setTimeout(() => {
            setLoading(false);
        }, 2000);
        
        // After logo animation, fade in the rest of the content
        const timer2 = setTimeout(() => {
            setShowContent(true);
        }, 2500);
        
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);
    
    return (
        <div className="entry-page">
            <div className={`welcome-section ${!loading ? 'animation-complete' : ''}`}>
                <div className="logo-container">
                    <img 
                        src="/logooo.png" 
                        alt="Web Kupovina Igrica Logo" 
                        className={`logo-image ${loading ? 'logo-intro' : ''}`} 
                    />
                    <div className={`welcome-text ${showContent ? 'fade-in' : 'hidden'}`}>
                        Dobrodošli u Web Kupovinu Igrica
                    </div>
                </div>
                <p className={`welcome-description ${showContent ? 'fade-in' : 'hidden'}`}>
                    Vaša destinacija za kupovinu najnovijih i najpopularnijih igrica po najboljim cijenama.
                </p>
                <div className={`action-buttons ${showContent ? 'fade-in' : 'hidden'}`}>
                    <Button 
                        variant="primary" 
                        size="lg" 
                        className="action-button"
                        onClick={() => navigate(RouteNames.PROIZVOD_PREGLED)}
                    >
                        Pregledaj igrice
                    </Button>
                    <Button 
                        variant="outline-primary" 
                        size="lg" 
                        className="action-button"
                        onClick={() => navigate('/register')}
                    >
                        Registriraj se
                    </Button>
                </div>
            </div>
            
            {isLoggedIn && (
                <div className={showContent ? 'fade-in' : 'hidden'}>
                    <GameGrid />
                </div>
            )}
            
            <div className={`scroll-to-top ${showContent ? 'fade-in' : 'hidden'}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                ↑
            </div>
        </div>
    );
};

export default EntryPage;
