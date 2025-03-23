import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import ProizvodService from "../../services/ProizvodService";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ImageUploader from "../../components/ImageUploader";
import { getGameImage, refreshProductImage } from "../../utils/imageUtils";

export default function ProizvodiPromjena() {
    const navigate = useNavigate();
    const [proizvod, setProizvod] = useState({});
    const routeParams = useParams();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageTimestamp, setImageTimestamp] = useState(new Date().getTime());

    async function dohvatiProizvod() {
        const odgovor = await ProizvodService.getBySifra(routeParams.sifra);
        setProizvod(odgovor);
    }

    useEffect(() => {
        console.log("routeParams.sifra:", routeParams.sifra); 
        dohvatiProizvod();
    }, [routeParams.sifra]);

    async function promjena(proizvod) {
        const odgovor = await ProizvodService.promjena(routeParams.sifra, proizvod);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        navigate(RouteNames.PROIZVOD_PREGLED);
    }

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
        if (!routeParams.sifra) return;
        
        try {
            setLoading(true);
            setError('');
            setSuccess('');
            
            console.log(`Započinjem upload slike za proizvod ID: ${routeParams.sifra}`);
            
            // Uploadamo sliku
            const result = await ProizvodService.postaviSliku(routeParams.sifra, base64Image);
            
            if (!result.greska) {
                // Verificiraj je li slika stvarno uploadana
                const isUploaded = await verifyImageUploaded(routeParams.sifra);
                
                if (isUploaded) {
                    setSuccess(`Slika za proizvod "${proizvod.nazivIgre}" uspješno postavljena!`);
                    
                    // Čistimo cache slika
                    refreshProductImage(routeParams.sifra);
                    
                    // Ažuriramo timestamp za osvježavanje slike
                    setImageTimestamp(new Date().getTime());
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

    function odradiSubmit(e) {
        e.preventDefault();

        let podaci = new FormData(e.target);

        promjena({
            nazivIgre: podaci.get("nazivIgre"),
            cijena: podaci.get("cijena"),
        });
    }

    return (
        <div className="proizvodi-komponenta" style={{ color: 'white' }}>
            <h2>Promjena proizvoda</h2>
            
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={odradiSubmit}>
                <Row className="gx-0">
                    <Col md={9} className="pe-0">
                        <Form.Group controlId="nazivIgre">
                            <Form.Label>Naziv igre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nazivIgre"
                                required
                                defaultValue={proizvod.nazivIgre}
                                className="input-manja-sirina"
                            />
                        </Form.Group>

                        <Form.Group controlId="cijena">
                            <Form.Label>Cijena</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="cijena"
                                defaultValue={proizvod.cijena}
                                className="input-manja-sirina"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3} className="d-flex flex-column align-items-center justify-content-center">
                        <Link to={RouteNames.PROIZVOD_PREGLED} className="btn btn-danger manji-gumb mb-2">
                            <FaTimesCircle className="me-1" /> Odustani
                        </Link>
                        <Button variant="success" type="submit" className="manji-gumb">
                            <FaCheckCircle className="me-1" /> Promjeni proizvod
                        </Button>
                    </Col>
                </Row>
            </Form>
            
            <Form.Group controlId="slika" className="mt-4">
                <h3>Slika proizvoda</h3>
                
                <Row>
                    <Col md={6}>
                        <div className="current-image mb-4">
                            <h5>Trenutna slika</h5>
                            <img 
                                src={`/slike/proizvodi/${routeParams.sifra}.png?t=${imageTimestamp}`}
                                alt={proizvod.nazivIgre}
                                onError={(e) => {
                                    console.log(`Slika nije pronađena za proizvod: ${proizvod.nazivIgre} (ID: ${routeParams.sifra}), koristi se fallback slika`);
                                    e.target.onerror = null;
                                    e.target.src = getGameImage(proizvod.nazivIgre);
                                }}
                                style={{ maxWidth: '100%', maxHeight: '300px' }}
                            />
                            <Button 
                                variant="outline-info" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => setImageTimestamp(new Date().getTime())}
                            >
                                <i className="bi bi-arrow-clockwise"></i> Osvježi sliku
                            </Button>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="upload-new-image">
                            <h5>Uploadaj novu sliku</h5>
                            <div style={{ maxWidth: '400px' }}>
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
                                        <p>Uploadam sliku...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Form.Group>
        </div>
    );
}
