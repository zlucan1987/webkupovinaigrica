import { Button, Col, Form, Row, Image, Alert } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import KupacService from "../../services/KupacService";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { profilePictures, getKupacProfilePicture, setKupacProfilePicture } from "../../utils/imageUtils";
import ImageUploader from "../../components/ImageUploader";

export default function KupciPromjena() {
    const navigate = useNavigate();
    const [kupac, setKupac] = useState({});
    const routeParams = useParams();
    const [selectedProfilePicture, setSelectedProfilePicture] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function dohvatiKupca() {
            const odgovor = await KupacService.getBySifra(routeParams.sifra);
            setKupac(odgovor);
            
            // Dohvati profilnu sliku kupca
            const profilnaSlika = getKupacProfilePicture(routeParams.sifra);
            setSelectedProfilePicture(profilnaSlika);
            
            // Force refresh the profile picture by checking if it exists on the server
            const serverImageUrl = `https://www.brutallucko.online/slike/kupci/${routeParams.sifra}.png?t=${new Date().getTime()}`;
            
            // Check if the image exists on the server
            const img = new window.Image();
            img.onload = () => {
                console.log("KupciPromjena: Image loaded successfully from server");
                // Update the profile picture in the UI
                setSelectedProfilePicture(serverImageUrl);
                // Save the URL in localStorage for future use
                setKupacProfilePicture(routeParams.sifra, serverImageUrl);
            };
            img.onerror = () => {
                console.error("KupciPromjena: Failed to load image from URL", serverImageUrl);
            };
            img.src = serverImageUrl;
        }
        
        dohvatiKupca();
    }, [routeParams.sifra]);

    async function promjena(kupac) {
        const odgovor = await KupacService.promjena(routeParams.sifra, kupac);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        
        // Spremi odabranu profilnu sliku za kupca
        setKupacProfilePicture(routeParams.sifra, selectedProfilePicture);
        
        navigate(RouteNames.KUPAC_PREGLED);
    }
    
    const handleImageUpload = async (base64Image) => {
        try {
            setLoading(true);
            setError('');
            
            console.log("KupciPromjena.handleImageUpload: Uploading image for kupac", routeParams.sifra);
            
            // Upload the image
            const result = await KupacService.postaviSliku(routeParams.sifra, base64Image);
            
            if (!result.greska) {
                // Update the profile picture in the UI using the URL returned from the service
                // Use absolute URL to ensure consistency
                const imageUrl = result.imageUrl || `https://www.brutallucko.online/slike/kupci/${routeParams.sifra}.png?t=${new Date().getTime()}`;
                console.log("KupciPromjena.handleImageUpload: Setting profile picture to", imageUrl);
                
                // Update state and localStorage
                setSelectedProfilePicture(imageUrl);
                setKupacProfilePicture(routeParams.sifra, imageUrl);
                
                // Show success message
                setSuccess('Slika kupca uspješno promijenjena!');
                setTimeout(() => setSuccess(''), 3000);
                
                // Verify image is loaded - using window.Image to avoid conflict with React Bootstrap Image
                const img = new window.Image();
                img.onload = () => {
                    console.log("KupciPromjena.handleImageUpload: Image loaded successfully");
                };
                img.onerror = () => {
                    console.error("KupciPromjena.handleImageUpload: Failed to load image from URL", imageUrl);
                    setError('Slika je uploadana, ali ne može se prikazati. Pokušajte osvježiti stranicu.');
                };
                img.src = imageUrl;
            } else {
                console.error("KupciPromjena.handleImageUpload: Error from KupacService", result.poruka);
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
            ime: podaci.get("ime"),
            prezime: podaci.get("prezime"),
            ulica: podaci.get("ulica"),
            mjesto: podaci.get("mjesto"),
        });
    }

    return (
        <div className="kupci-komponenta bijeli-tekst">
            Promjena kupca
            <Form onSubmit={odradiSubmit}>
                <Row className="gx-0">
                    <Col md={9} className="pe-0">
                        <Form.Group controlId="ime">
                            <Form.Label>Ime</Form.Label>
                            <Form.Control
                                type="text"
                                name="ime"
                                required
                                defaultValue={kupac.ime}
                                className="input-manja-sirina"
                            />
                        </Form.Group>

                        <Form.Group controlId="prezime">
                            <Form.Label>Prezime</Form.Label>
                            <Form.Control
                                type="text"
                                name="prezime"
                                defaultValue={kupac.prezime}
                                className="input-manja-sirina"
                            />
                        </Form.Group>

                        <Form.Group controlId="ulica">
                            <Form.Label>Ulica</Form.Label>
                            <Form.Control
                                type="text"
                                name="ulica"
                                defaultValue={kupac.ulica}
                                className="input-manja-sirina"
                            />
                        </Form.Group>

                        <Form.Group controlId="mjesto">
                            <Form.Label>Mjesto</Form.Label>
                            <Form.Control
                                type="text"
                                name="mjesto"
                                defaultValue={kupac.mjesto}
                                className="input-manja-sirina"
                            />
                        </Form.Group>

                        <Form.Group controlId="profilnaSlika" className="mt-3">
                            <Form.Label>Profilna slika</Form.Label>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}
                            
                            {/* Komponenta za upload vlastite slike */}
                            <div className="mb-4">
                                <h6>Upload vlastite slike</h6>
                                <ImageUploader 
                                    onImageUpload={(base64Image) => handleImageUpload(base64Image)} 
                                    aspectRatio={1} 
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
                            
                            <h6>Ili odaberite jednu od predefiniranih slika</h6>
                            <div className="d-flex flex-wrap">
                                {profilePictures.map((picture, index) => (
                                    <div 
                                        key={index} 
                                        className="m-2" 
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setSelectedProfilePicture(picture)}
                                    >
                                        <Image 
                                            src={picture} 
                                            roundedCircle 
                                            width={60} 
                                            height={60} 
                                            className={selectedProfilePicture === picture ? 'border border-primary border-3' : ''}
                                            onError={(e) => {
                                                console.error("Failed to load profile image:", picture);
                                                // Fallback to default image if the profile image fails to load
                                                e.target.src = profilePictures[0];
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={3} className="d-flex flex-column align-items-center justify-content-center">
                        <Link to={RouteNames.KUPAC_PREGLED} className="btn btn-danger manji-gumb mb-2">
                            <FaTimesCircle className="me-1" /> Odustani
                        </Link>
                        <Button variant="success" type="submit" className="manji-gumb">
                            <FaCheckCircle className="me-1" /> Promjeni kupca
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}
