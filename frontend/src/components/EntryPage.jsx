import './EntryPage.css';
import GameGrid from './GameGrid';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../constants';
import { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

// Create a context for navbar visibility
import { createContext, useContext } from 'react';
export const NavbarContext = createContext({ navbarVisible: false, setNavbarVisible: () => {} });
export const useNavbar = () => useContext(NavbarContext);

const EntryPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { setNavbarVisible } = useNavbar();
    
    useEffect(() => {
        // Check if user has seen the animation before
        const hasSeenAnimation = localStorage.getItem('hasSeenAnimation');
        
        // Hide navbar initially
        setNavbarVisible(false);
        
        // Check if user is logged in
        setIsLoggedIn(AuthService.isLoggedIn());
        
        if (!hasSeenAnimation) {
            // First visit - show full animation
            // Save that user has seen the animation
            localStorage.setItem('hasSeenAnimation', 'true');
            
            // Show logo animation for 4 seconds
            const timer1 = setTimeout(() => {
                setLoading(false);
            }, 4000);
            
            // After logo animation, fade in the rest of the content
            const timer2 = setTimeout(() => {
                setShowContent(true);
            }, 4500);
            
            // Show navbar 1 second after logo animation completes
            const timer3 = setTimeout(() => {
                setNavbarVisible(true);
            }, 5000);
            
            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        } else {
            // Returning visit - skip animation
            setLoading(false);
            setShowContent(true);
            
            // Show navbar with a small delay for smooth transition
            const timer = setTimeout(() => {
                setNavbarVisible(true);
            }, 500);
            
            return () => {
                clearTimeout(timer);
            };
        }
    }, [setNavbarVisible]);
    
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
                {!isLoggedIn && (
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
                )}
                
                {/* Scroll indicator */}
                <div 
                    className={`scroll-indicator ${showContent ? 'fade-in' : 'hidden'}`}
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                ></div>
            </div>
            
            {isLoggedIn && (
                <div className={showContent ? 'fade-in' : 'hidden'}>
                    <GameGrid />
                </div>
            )}
            
            <div className={`scroll-to-top ${showContent ? 'fade-in' : 'hidden'}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                ↑
            </div>
            
            {/* Reset animation button */}
            <div 
                className={`reset-animation ${showContent ? 'fade-in' : 'hidden'}`}
                onClick={() => {
                    localStorage.removeItem('hasSeenAnimation');
                    window.location.reload();
                }}
                title="Ponovno prikaži animaciju"
            >
                ↻
            </div>
        </div>
    );
};

export default EntryPage;
