import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import ProizvodService from '../../services/ProizvodService';
import ImageUploader from '../../components/ImageUploader';
import { getGameImage } from '../../utils/imageUtils';
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

    const handleImageUpload = async (base64Image) => {
        if (!selectedProduct) return;
        
        try {
            setLoading(true);
            setError('');
            
            // Uploadamo sliku
            const result = await ProizvodService.postaviSliku(selectedProduct.sifra, base64Image);
            
            if (!result.greska) {
                setSuccess(`Slika za proizvod "${selectedProduct.nazivIgre}" uspješno postavljena!`);
                
                // Ažuriramo prikaz
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
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

    return (
        <Container className="py-5">
            <h2 className="mb-4">Upravljanje slikama proizvoda</h2>
            
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Row>
                <Col md={4}>
                    <h4>Odaberite proizvod</h4>
                    <div className="product-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {products.map(product => (
                            <Card 
                                key={product.sifra}
                                className={`mb-2 ${selectedProduct?.sifra === product.sifra ? 'border-primary' : ''}`}
                                onClick={() => handleProductSelect(product)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Card.Body>
                                    <Card.Title>{product.nazivIgre}</Card.Title>
                                    <Card.Text>
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
                            <h4>Slika za proizvod: {selectedProduct.nazivIgre}</h4>
                            
                            <div className="current-image mb-4">
                                <h5>Trenutna slika</h5>
                                <img 
                                    src={`/slike/proizvodi/${selectedProduct.sifra}.png?t=${new Date().getTime()}`}
                                    alt={selectedProduct.nazivIgre}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = getGameImage(selectedProduct.nazivIgre);
                                    }}
                                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                                />
                            </div>
                            
                            <div className="upload-new-image">
                                <h5>Uploadaj novu sliku</h5>
                                <ImageUploader 
                                    onImageUpload={handleImageUpload} 
                                    aspectRatio={16/9}
                                />
                                {loading && (
                                    <div className="text-center mt-2">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Učitavanje...</span>
                                        </div>
                                        <p>Uploadam sliku...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-5">
                            <h4>Odaberite proizvod za upravljanje slikom</h4>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ProductImageManagement;
