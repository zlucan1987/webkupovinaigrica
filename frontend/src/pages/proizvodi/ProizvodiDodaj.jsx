import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import ProizvodService from "../../services/ProizvodService";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useState } from "react";
import ImageUploader from "../../components/ImageUploader";

export default function ProizvodiDodaj() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempImageBase64, setTempImageBase64] = useState(null);

  async function dodaj(proizvod) {
    const odgovor = await ProizvodService.dodaj(proizvod);
    if (odgovor.greska) {
      setError(odgovor.poruka);
      return null;
    }
    
    // Ako imamo privremenu sliku, uploadaj je za novi proizvod
    if (tempImageBase64 && odgovor.data && odgovor.data.sifra) {
      try {
        await uploadImageForProduct(odgovor.data.sifra, tempImageBase64);
      } catch (err) {
        console.error("Greška prilikom uploada slike:", err);
        // Nastavimo dalje čak i ako upload slike ne uspije
      }
    }
    
    navigate(RouteNames.PROIZVOD_PREGLED);
    return odgovor.data;
  }

  const handleImageUpload = async (base64Image) => {
    try {
      setLoading(true);
      setError('');
      
      // Spremamo base64 sliku privremeno da je možemo uploadati nakon dodavanja proizvoda
      setTempImageBase64(base64Image);
      setSuccess('Slika je spremljena i bit će uploadana nakon dodavanja proizvoda.');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Greška prilikom pripreme slike:', error);
      setError('Došlo je do greške prilikom pripreme slike');
    } finally {
      setLoading(false);
    }
  };
  
  const uploadImageForProduct = async (productId, base64Image) => {
    if (!productId || !base64Image) return;
    
    try {
      console.log(`Započinjem upload slike za proizvod ID: ${productId}`);
      
      // Uploadamo sliku
      const result = await ProizvodService.postaviSliku(productId, base64Image);
      
      if (!result.greska) {
        console.log(`Slika uspješno uploadana za proizvod ID: ${productId}`);
      } else {
        console.error(`Greška prilikom uploada slike za proizvod ID: ${productId}`, result.poruka);
      }
    } catch (error) {
      console.error('Greška prilikom uploada slike:', error);
    }
  };

  function odradiSubmit(e) {
    e.preventDefault();
    setError('');

    let podaci = new FormData(e.target);

    dodaj({
      nazivIgre: podaci.get("nazivIgre"),
      cijena: podaci.get("cijena"),
    });
  }

  return (
    <div className="proizvodi-komponenta" style={{ color: 'white' }}>
      <h2>Dodavanje proizvoda</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form onSubmit={odradiSubmit}>
        <Row>
          <Col md={8}>
            <Form.Group controlId="nazivIgre" className="mb-3">
              <Form.Label>Naziv igre</Form.Label>
              <Form.Control 
                type="text" 
                name="nazivIgre" 
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

            <Form.Group controlId="cijena" className="mb-3">
              <Form.Label>Cijena</Form.Label>
              <Form.Control 
                type="number" 
                step="0.01" 
                name="cijena" 
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
            
            <Form.Group controlId="slika" className="mb-3">
              <Form.Label>Slika proizvoda</Form.Label>
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
                    <p>Pripremam sliku...</p>
                  </div>
                )}
              </div>
            </Form.Group>
          </Col>
          <Col md={4} className="d-flex flex-column align-items-center justify-content-start mt-4">
            {/* Gumbi s ikonama */}
            <Link to={RouteNames.PROIZVOD_PREGLED} className="btn btn-danger manji-gumb mb-2">
              <FaTimesCircle className="me-1" /> Odustani
            </Link>
            <Button variant="success" type="submit" className="manji-gumb">
              <FaCheckCircle className="me-1" /> Dodaj proizvod
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
