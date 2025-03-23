import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Container, Card, Spinner, Alert, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import ProizvodService from '../services/ProizvodService';
import StavkaService from '../services/StavkaService';
import KupacService from '../services/KupacService';
import RacunService from '../services/RacunService';
import AuthService from '../services/AuthService';
import './SalesGraph.css';

const SalesGraph = () => {
  const [graphData, setGraphData] = useState([]);
  const [animatedData, setAnimatedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [proizvodi, setProizvodi] = useState([]);
  const [kupci, setKupci] = useState([]);
  const [formData, setFormData] = useState({
    proizvodId: '',
    kupacId: '',
    kolicina: 1,
    cijena: 0
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    setIsAdmin(AuthService.hasRole('Admin'));
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Dohvati podatke za graf direktno s backenda
        const grafPodaci = await ProizvodService.getGrafPodaci();
        console.log('Podaci za graf dohvaćeni s backenda:', grafPodaci);
        
        // Provjeri strukturu podataka
        if (grafPodaci.length > 0) {
          console.log('Struktura prvog podatka:', Object.keys(grafPodaci[0]));
          console.log('Vrijednosti prvog podatka:', grafPodaci[0]);
          
          // Provjeri da li postoji svojstvo brojProdanihPrimjeraka
          if (grafPodaci[0].brojProdanihPrimjeraka !== undefined) {
            console.log('Svojstvo brojProdanihPrimjeraka postoji:', grafPodaci[0].brojProdanihPrimjeraka);
          } else {
            console.log('Svojstvo brojProdanihPrimjeraka ne postoji!');
            console.log('Dostupna svojstva:', Object.keys(grafPodaci[0]));
            
            // Ako ne postoji, provjeri da li postoji svojstvo brojKupaca
            if (grafPodaci[0].brojKupaca !== undefined) {
              console.log('Svojstvo brojKupaca postoji:', grafPodaci[0].brojKupaca);
              
              // Dodaj svojstvo brojProdanihPrimjeraka
              grafPodaci.forEach(item => {
                item.brojProdanihPrimjeraka = item.brojKupaca;
              });
              
              console.log('Dodano svojstvo brojProdanihPrimjeraka:', grafPodaci[0]);
            }
          }
        }
        
        // Sortiraj podatke po broju prodanih primjeraka (silazno)
        const sortiraniPodaci = [...grafPodaci].sort((a, b) => b.brojProdanihPrimjeraka - a.brojProdanihPrimjeraka);
        
        // Set the actual data
        setGraphData(sortiraniPodaci);
        
        // Initialize animated data with zero values
        const initialAnimatedData = sortiraniPodaci.map(item => ({
          ...item,
          brojProdanihPrimjeraka: 0
        }));
        
        setAnimatedData(initialAnimatedData);
        setAnimationComplete(false);
        
        // Dohvati proizvode i kupce za dropdown
        const proizvodiData = await ProizvodService.get();
        setProizvodi(proizvodiData);
        
        const kupciData = await KupacService.get();
        setKupci(kupciData);
        
      } catch (err) {
        console.error('Error fetching data for graph:', err);
        setError('Došlo je do greške prilikom dohvaćanja podataka za graf.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Animation effect
  useEffect(() => {
    if (graphData.length > 0 && !animationComplete && !loading) {
      let currentStep = 0;
      const totalSteps = 20; // Number of animation steps
      
      const animationInterval = setInterval(() => {
        currentStep++;
        
        if (currentStep >= totalSteps) {
          // Animation complete, set to final values
          setAnimatedData([...graphData]);
          setAnimationComplete(true);
          clearInterval(animationInterval);
        } else {
          // Calculate intermediate values
          const newData = graphData.map(item => {
            const targetValue = item.brojProdanihPrimjeraka;
            const currentValue = Math.floor((targetValue * currentStep) / totalSteps);
            
            return {
              ...item,
              brojProdanihPrimjeraka: currentValue
            };
          });
          
          setAnimatedData(newData);
        }
      }, 50); // 50ms per step = 1 second total animation
      
      return () => clearInterval(animationInterval);
    }
  }, [graphData, animationComplete, loading]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Ako je odabran proizvod, postavi cijenu
    if (name === 'proizvodId') {
      const odabraniProizvod = proizvodi.find(p => p.sifra === parseInt(value));
      if (odabraniProizvod) {
        setFormData({
          ...formData,
          [name]: value,
          cijena: odabraniProizvod.cijena
        });
        return;
      }
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    try {
      // Provjeri jesu li svi podaci uneseni
      if (!formData.proizvodId || !formData.kupacId || !formData.kolicina) {
        setFormError('Molimo popunite sva polja.');
        return;
      }
      
      // Kreiraj novu stavku
      // Prvo dohvati ili kreiraj račun za kupca
      let racunSifra;
      try {
        // Dohvati sve račune
        const racuni = await RacunService.get();
        
        // Provjeri postoji li već račun za ovog kupca
        const kupacRacun = racuni.find(r => r.kupacSifra === parseInt(formData.kupacId));
        
        if (kupacRacun) {
          // Koristi postojeći račun
          racunSifra = kupacRacun.sifra;
        } else {
          // Kreiraj novi račun za kupca
          const noviRacun = {
            kupacSifra: parseInt(formData.kupacId),
            datum: new Date().toISOString(),
            napomena: "Automatski kreiran račun"
          };
          
          const rezultatRacun = await RacunService.dodaj(noviRacun);
          
          if (rezultatRacun.greska) {
            setFormError(rezultatRacun.poruka);
            return;
          }
          
          racunSifra = rezultatRacun.data.sifra;
        }
        
        // Kreiraj novu stavku s racunSifra
        const novaStavka = {
          racunSifra: racunSifra,
          proizvodSifra: parseInt(formData.proizvodId), // Changed from proizvodId to proizvodSifra
          kolicina: parseInt(formData.kolicina),
          cijena: parseFloat(formData.cijena)
        };
        
        // Pošalji zahtjev za dodavanje stavke
        const rezultat = await StavkaService.dodaj(novaStavka);
        
        // Provjeri rezultat
        if (rezultat.greska) {
          setFormError(rezultat.poruka);
          return;
        }
        
        // Ako je sve u redu, postavi uspjeh
        setFormSuccess('Stavka uspješno dodana!');
      } catch (err) {
        console.error('Error creating or finding receipt:', err);
        setFormError('Došlo je do greške prilikom kreiranja ili pronalaska računa.');
        return;
      }
      
      // Resetiraj formu
      setFormData({
        proizvodId: '',
        kupacId: '',
        kolicina: 1,
        cijena: 0
      });
      
      // Osvježi podatke za graf nakon 1 sekunde
      setTimeout(async () => {
        try {
          const grafPodaci = await ProizvodService.getGrafPodaci();
          console.log('Osvježeni podaci za graf:', grafPodaci);
          
          // Provjeri strukturu podataka
          if (grafPodaci.length > 0) {
            // Provjeri da li postoji svojstvo brojProdanihPrimjeraka
            if (grafPodaci[0].brojProdanihPrimjeraka === undefined) {
              console.log('Svojstvo brojProdanihPrimjeraka ne postoji u osvježenim podacima!');
              
              // Ako ne postoji, provjeri da li postoji svojstvo brojKupaca
              if (grafPodaci[0].brojKupaca !== undefined) {
                console.log('Svojstvo brojKupaca postoji u osvježenim podacima:', grafPodaci[0].brojKupaca);
                
                // Dodaj svojstvo brojProdanihPrimjeraka
                grafPodaci.forEach(item => {
                  item.brojProdanihPrimjeraka = item.brojKupaca;
                });
              }
            }
          }
          
          const sortiraniPodaci = [...grafPodaci].sort((a, b) => b.brojProdanihPrimjeraka - a.brojProdanihPrimjeraka);
          setGraphData(sortiraniPodaci);
          
          // Reset animation
          const initialAnimatedData = sortiraniPodaci.map(item => ({
            ...item,
            brojProdanihPrimjeraka: 0
          }));
          
          setAnimatedData(initialAnimatedData);
          setAnimationComplete(false);
        } catch (err) {
          console.error('Error refreshing graph data:', err);
        }
      }, 1000);
      
    } catch (err) {
      console.error('Error adding stavka:', err);
      setFormError('Došlo je do greške prilikom dodavanja stavke.');
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Učitavanje...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5">
      <Card>
        <Card.Header as="h5" className="text-center text-white">Graf prodaje igrica</Card.Header>
        <Card.Body>
          <Card.Title className="text-center mb-4 text-white">
            Broj prodanih primjeraka po proizvodu
            {isAdmin && (
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="ms-3"
                onClick={() => setShowModal(true)}
              >
                <span style={{ color: 'black' }}>Dodaj novu prodaju</span>
              </Button>
            )}
          </Card.Title>
          
          {graphData.length === 0 ? (
            <Alert variant="info">Nema dostupnih podataka za prikaz.</Alert>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={animatedData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="nazivIgre" 
                  angle={-45} 
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis 
                  label={{ value: 'Broj prodanih primjeraka', angle: -90, position: 'insideLeft' }}
                  allowDecimals={false}
                />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Bar 
                  dataKey="brojProdanihPrimjeraka" 
                  name="Broj prodanih primjeraka" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
          
          <div className="mt-4">
            <p className="text-white">
              Ovaj graf prikazuje ukupan broj prodanih primjeraka za svaki proizvod. 
              Zbraja sve količine iz svih prodaja - ako je jedan kupac kupio 9 primjeraka iste igrice, 
              na grafu će se prikazati 9 primjeraka za tu igricu.
            </p>
          </div>
          
          {/* Modal za dodavanje nove prodaje */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title style={{ color: 'black' }}>Dodaj novu prodaju</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {formError && <Alert variant="danger">{formError}</Alert>}
              {formSuccess && <Alert variant="success">{formSuccess}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'black' }}>Proizvod</Form.Label>
                  <Form.Select 
                    name="proizvodId"
                    value={formData.proizvodId}
                    onChange={handleInputChange}
                  >
                    <option value="">Odaberite proizvod</option>
                    {proizvodi.map(proizvod => (
                      <option key={proizvod.sifra} value={proizvod.sifra}>
                        {proizvod.nazivIgre} - {proizvod.cijena} €
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'black' }}>Kupac</Form.Label>
                  <Form.Select 
                    name="kupacId"
                    value={formData.kupacId}
                    onChange={handleInputChange}
                  >
                    <option value="">Odaberite kupca</option>
                    {kupci.map(kupac => (
                      <option key={kupac.sifra} value={kupac.sifra}>
                        {kupac.ime} {kupac.prezime} (ID: {kupac.sifra})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'black' }}>Količina</Form.Label>
                      <Form.Control 
                        type="number" 
                        name="kolicina"
                        value={formData.kolicina}
                        onChange={handleInputChange}
                        min="1"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'black' }}>Cijena (€)</Form.Label>
                      <Form.Control 
                        type="number" 
                        name="cijena"
                        value={formData.cijena}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-flex justify-content-end">
                  <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                    Odustani
                  </Button>
                  <Button variant="primary" type="submit">
                    Dodaj prodaju
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SalesGraph;
