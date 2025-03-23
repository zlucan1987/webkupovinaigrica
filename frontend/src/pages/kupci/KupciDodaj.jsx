import { Button, Col, Form, Row, Image, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KupacService from "../../services/KupacService";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { profilePictures, setKupacProfilePicture } from "../../utils/imageUtils";
import { useState } from "react";
import ImageUploader from "../../components/ImageUploader";

export default function KupciDodaj() {
  const navigate = useNavigate();
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(profilePictures[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function dodaj(kupac) {
    const odgovor = await KupacService.dodaj(kupac);
    if (odgovor.greska) {
      alert(odgovor.poruka);
      return;
    }
    
    // Spremi odabranu profilnu sliku za kupca
    if (odgovor.data && odgovor.data.sifra) {
      setKupacProfilePicture(odgovor.data.sifra, selectedProfilePicture);
    }
    
    navigate(RouteNames.KUPAC_PREGLED);
  }
  
  const handleImageUpload = async (base64Image) => {
    try {
      setLoading(true);
      setError('');
      
      // Prvo moramo dodati kupca da bismo dobili šifru
      setSuccess('Slika je spremljena i bit će uploadana nakon dodavanja kupca.');
      
      // Spremamo base64 sliku privremeno da je možemo uploadati nakon dodavanja kupca
      localStorage.setItem('tempKupacImage', base64Image);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error handling image:', error);
      setError('Došlo je do greške prilikom pripreme slike');
    } finally {
      setLoading(false);
    }
  };

  function odradiSubmit(e) {
    e.preventDefault();

    let podaci = new FormData(e.target);

    dodaj({
      ime: podaci.get("ime"),
      prezime: podaci.get("prezime"),
      ulica: podaci.get("ulica"),
      mjesto: podaci.get("mjesto"),
    });
  }

  return (
    <div className="kupci-komponenta bijeli-tekst">
      <h2 className="mb-4">Dodavanje kupca</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form onSubmit={odradiSubmit}>
        <Row className="gx-0">
          <Col md={9} className="pe-0">
            {/* Polja za unos */}
            <Form.Group controlId="ime" className="mb-3">
              <Form.Label>Ime</Form.Label>
              <Form.Control 
                type="text" 
                name="ime" 
                required 
                className="input-manja-sirina"
                style={{ 
                  backgroundColor: '#333',
                  borderColor: '#666',
                  color: 'white',
                  height: '38px',
                  maxWidth: '400px'
                }}
              />
            </Form.Group>

            <Form.Group controlId="prezime" className="mb-3">
              <Form.Label>Prezime</Form.Label>
              <Form.Control 
                type="text" 
                name="prezime" 
                className="input-manja-sirina"
                style={{ 
                  backgroundColor: '#333',
                  borderColor: '#666',
                  color: 'white',
                  height: '38px',
                  maxWidth: '400px'
                }}
              />
            </Form.Group>

            <Form.Group controlId="ulica" className="mb-3">
              <Form.Label>Ulica</Form.Label>
              <Form.Control 
                type="text" 
                name="ulica" 
                className="input-manja-sirina"
                style={{ 
                  backgroundColor: '#333',
                  borderColor: '#666',
                  color: 'white',
                  height: '38px',
                  maxWidth: '400px'
                }}
              />
            </Form.Group>

            <Form.Group controlId="mjesto" className="mb-3">
              <Form.Label>Mjesto</Form.Label>
              <Form.Control 
                type="text" 
                name="mjesto" 
                className="input-manja-sirina"
                style={{ 
                  backgroundColor: '#333',
                  borderColor: '#666',
                  color: 'white',
                  height: '38px',
                  maxWidth: '400px'
                }}
              />
            </Form.Group>

            <Form.Group controlId="profilnaSlika" className="mt-3">
              <Form.Label>Profilna slika</Form.Label>
              
              {/* Komponenta za upload vlastite slike */}
              <div className="mb-4" style={{ maxWidth: '400px' }}>
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
                    <p>Pripremam sliku...</p>
                  </div>
                )}
              </div>
              
              <h6>Ili odaberite jednu od predefiniranih slika</h6>
              <div className="d-flex flex-wrap" style={{ maxWidth: '400px' }}>
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
                    />
                  </div>
                ))}
              </div>
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex flex-column align-items-center justify-content-center">
            {/* Gumbi s ikonama */}
            <Link to={RouteNames.KUPAC_PREGLED} className="btn btn-danger manji-gumb mb-2">
              <FaTimesCircle className="me-1" /> Odustani
            </Link>
            <Button variant="success" type="submit" className="manji-gumb">
              <FaCheckCircle className="me-1" /> Dodaj kupca
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
