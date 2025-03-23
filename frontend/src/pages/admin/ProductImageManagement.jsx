import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import ProizvodService from '../../services/ProizvodService';
import ImageUploader from '../../components/ImageUploader';
import { getGameImage, refreshProductImage } from '../../utils/imageUtils';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

const ProductImageManagement = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Provjeri je li korisnik admin
        if (!AuthService.hasRole('Admin')) {
            navigate('/');
            return;
        }
        
        // Dohvati proizvode
        const fetchProducts = async () => {
            const response = await ProizvodService.get();
            if (Array.isArray(response)) {
                setProducts(response);
            }
        };
        
        fetchProducts();
    }, [navigate]);

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setSuccess('');
        setError('');
    };

    // Funkcija za čišćenje cache-a slika
    const clearImageCache = () => {
        if (!selectedProduct) return;
        
        console.log(`Osvježavanje cache-a za sliku proizvoda ID: ${selectedProduct.sifra}`);
        
        // Koristimo novu funkciju za osvježavanje slike proizvoda u cache-u
        refreshProductImage(selectedProduct.sifra);
    };
    
    // Funkcija za provjeru je li slika stvarno uploadana na server
    const verifyImageUploaded = async (productId) => {
        try {
            const imageUrl = `/slike/proizvodi/${productId}.png?t=${new Date().getTime()}`;
            
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    console.log(`Slika za proizvod ID ${productId} uspješno verificirana na serveru`);
                    resolve(true);
                };
                img.onerror = () => {
                    console.error(`Slika za proizvod ID ${productId} nije pronađena na serveru nakon uploada`);
                    resolve(false);
                };
                img.src = imageUrl;
            });
        } catch (error) {
            console.error('Greška prilikom verifikacije slike:', error);
            return false;
        }
    };

    const handleImageUpload = async (base64Image) => {
        if (!selectedProduct) return;
        
        try {
            setLoading(true);
            setError('');
            
            console.log(`Započinjem upload slike za proizvod ID: ${selectedProduct.sifra}`);
            
            // Uploadamo sliku
            const result = await ProizvodService.postaviSliku(selectedProduct.sifra, base64Image);
            
            if (!result.greska) {
                // Verificiraj je li slika stvarno uploadana
                const isUploaded = await verifyImageUploaded(selectedProduct.sifra);
                
                if (isUploaded) {
                    setSuccess(`Slika za proizvod "${selectedProduct.nazivIgre}" uspješno postavljena!`);
                    
                    // Čistimo cache slika
                    clearImageCache();
                    
                    // Ažuriramo prikaz bez potrebe za refreshom cijele stranice
                    // Umjesto toga, samo osvježimo sliku
                    const imageElement = document.getElementById(`product-image-${selectedProduct.sifra}`);
                    if (imageElement) {
                        const newSrc = `/slike/proizvodi/${selectedProduct.sifra}.png?t=${new Date().getTime()}`;
                        imageElement.src = newSrc;
                    }
                } else {
                    setError('Slika je uploadana, ali nije pronađena na serveru. Molimo pokušajte ponovno.');
                }
            } else {
                setError(result.poruka || 'Došlo je do greške prilikom uploada slike');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Došlo je do greške prilikom uploada slike');
        } finally {
            setLoading(false);
        }
    };

    // Stil za bijeli tekst
    const whiteTextStyle = { color: 'white' };

    return (
        <Container className="py-5">
            <h2 className="mb-4" style={whiteTextStyle}>Upravljanje slikama proizvoda</h2>
            
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Row>
                <Col md={4}>
                    <h4 style={whiteTextStyle}>Odaberite proizvod</h4>
                    <div className="product-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {products.map(product => (
                            <Card 
                                key={product.sifra}
                                className={`mb-2 ${selectedProduct?.sifra === product.sifra ? 'border-primary' : ''}`}
                                onClick={() => handleProductSelect(product)}
                                style={{ cursor: 'pointer', backgroundColor: 'transparent' }}
                            >
                                <Card.Body>
                                    <Card.Title style={whiteTextStyle}>{product.nazivIgre}</Card.Title>
                                    <Card.Text style={whiteTextStyle}>
                                        Cijena: {product.cijena.toFixed(2)} €
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </Col>
                
                <Col md={8}>
                    {selectedProduct ? (
                        <div>
                            <h4 style={whiteTextStyle}>Slika za proizvod: {selectedProduct.nazivIgre}</h4>
                            
                            <div className="current-image mb-4">
                                <h5 style={whiteTextStyle}>Trenutna slika</h5>
                                <img 
                                    id={`product-image-${selectedProduct.sifra}`}
                                    src={`/slike/proizvodi/${selectedProduct.sifra}.png?t=${new Date().getTime()}`}
                                    alt={selectedProduct.nazivIgre}
                                    onError={(e) => {
                                        console.log(`Slika nije pronađena za proizvod: ${selectedProduct.nazivIgre} (ID: ${selectedProduct.sifra}), koristi se fallback slika`);
                                        e.target.onerror = null;
                                        e.target.src = getGameImage(selectedProduct.nazivIgre);
                                    }}
                                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                                />
                                <Button 
                                    variant="outline-info" 
                                    size="sm" 
                                    className="mt-2"
                                    onClick={() => {
                                        const imageElement = document.getElementById(`product-image-${selectedProduct.sifra}`);
                                        if (imageElement) {
                                            const newSrc = `/slike/proizvodi/${selectedProduct.sifra}.png?t=${new Date().getTime()}`;
                                            imageElement.src = newSrc;
                                        }
                                    }}
                                >
                                    <i className="bi bi-arrow-clockwise"></i> Osvježi sliku
                                </Button>
                            </div>
                            
                            <div className="upload-new-image">
                                <h5 style={whiteTextStyle}>Uploadaj novu sliku</h5>
                                <ImageUploader 
                                    onImageUpload={handleImageUpload} 
                                    aspectRatio={16/9}
                                    maxWidth={1200}
                                    maxHeight={675}
                                />
                                {loading && (
                                    <div className="text-center mt-2">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Učitavanje...</span>
                                        </div>
                                        <p style={whiteTextStyle}>Uploadam sliku...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-5">
                            <h4 style={whiteTextStyle}>Odaberite proizvod za upravljanje slikom</h4>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ProductImageManagement;
