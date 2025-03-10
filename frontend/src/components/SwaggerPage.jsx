import { useRef, useEffect, useState } from 'react';
import './SwaggerPage.css';

function SwaggerPage() {
    const iframeRef = useRef(null);
    const [deviceType, setDeviceType] = useState('desktop');

    // Detect device type based on screen width
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 576) {
                setDeviceType('mobile');
            } else if (width < 992) {
                setDeviceType('tablet');
            } else {
                setDeviceType('desktop');
            }
        };

        // Set initial device type
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);
        
        // Clean up event listener
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Simple height adjustment based on device type
    useEffect(() => {
        if (iframeRef.current) {
            const iframe = iframeRef.current;
            
            // Set height on load to ensure content is visible
            iframe.onload = () => {
                if (deviceType === 'desktop') {
                    iframe.style.height = '800px';
                } else if (deviceType === 'tablet') {
                    iframe.style.height = '600px';
                } else {
                    iframe.style.height = '400px';
                }
            };
        }
    }, [deviceType]);

    return (
        <div className={`swagger-container ${deviceType}`}>
            <h1 className="swagger-title">
                Swagger UI
            </h1>
            <div className="swagger-iframe-container">
                <iframe
                    ref={iframeRef}
                    src="https://www.brutallucko.online/swagger/index.html"
                    title="Swagger UI"
                    className="swagger-iframe"
                    allow="fullscreen"
                    frameBorder="0"
                />
            </div>
        </div>
    );
}

export default SwaggerPage;
