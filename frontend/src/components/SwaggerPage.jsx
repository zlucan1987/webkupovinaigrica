import React, { useRef, useEffect } from 'react';

function SwaggerPage() {
    const iframeRef = useRef(null);

    useEffect(() => {
        if (iframeRef.current) {
            const iframe = iframeRef.current;
            const setIframeHeight = () => {
                try {
                    iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
                } catch (e) {
                    iframe.style.height = window.innerHeight + 'px';
                }
            };

            iframe.onload = setIframeHeight;
            setIframeHeight();
        }
    }, []);

    return (
        <div style={{ textAlign: 'center' }}>
            <h1 style={{
                background: 'linear-gradient(to right, #00c6ff, #0072ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                fontSize: '3em',
                fontWeight: 'bold',
                margin: '20px 0'
            }}>
                Swagger UI
            </h1>
            <iframe
                ref={iframeRef}
                src="https://lucko1987vk-001-site1.ktempurl.com/swagger"
                title="Swagger UI"
                width="100%" 
                style={{ border: 'none', pointerEvents: 'auto' }}
            />
        </div>
    );
}

export default SwaggerPage;