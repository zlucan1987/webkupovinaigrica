import './EntryPage.css';
import GameGrid from './GameGrid';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../constants';

const EntryPage = () => {
    const navigate = useNavigate();
    
    return (
        <div className="entry-page">
            <div className="welcome-section">
                <div className="logo-container">
                    <img src="/logooo.png" alt="Web Kupovina Igrica Logo" className="logo-image" />
                    <div className="welcome-text">Dobrodošli u Web Kupovinu Igrica</div>
                </div>
                <p className="welcome-description">
                    Vaša destinacija za kupovinu najnovijih i najpopularnijih igrica po najboljim cijenama.
                </p>
                <div className="action-buttons">
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
            
            <GameGrid />
            
            <div className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                ↑
            </div>
        </div>
    );
};

export default EntryPage;
