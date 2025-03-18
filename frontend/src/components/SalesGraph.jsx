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
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import ProizvodService from '../services/ProizvodService';
import './SalesGraph.css';

const SalesGraph = () => {
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Dohvati podatke za graf direktno s backenda
        const grafPodaci = await ProizvodService.getGrafPodaci();
        console.log('Podaci za graf dohvaćeni s backenda:', grafPodaci);
        
        // Sortiraj podatke po broju kupaca (silazno)
        const sortiraniPodaci = [...grafPodaci].sort((a, b) => b.brojKupaca - a.brojKupaca);
        
        setGraphData(sortiraniPodaci);
      } catch (err) {
        console.error('Error fetching data for graph:', err);
        setError('Došlo je do greške prilikom dohvaćanja podataka za graf.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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
        <Card.Header as="h5" className="text-center">Graf prodaje igrica</Card.Header>
        <Card.Body>
          <Card.Title className="text-center mb-4">Broj kupaca po proizvodu</Card.Title>
          
          {graphData.length === 0 ? (
            <Alert variant="info">Nema dostupnih podataka za prikaz.</Alert>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={graphData}
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
                  label={{ value: 'Broj kupaca', angle: -90, position: 'insideLeft' }}
                  allowDecimals={false}
                />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Bar 
                  dataKey="brojKupaca" 
                  name="Broj kupaca" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
          
          <div className="mt-4">
            <p className="text-muted">
              Ovaj graf prikazuje broj jedinstvenih kupaca za svaki proizvod. 
              Kupac se broji samo jednom po proizvodu, bez obzira na količinu kupljenih jedinica.
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SalesGraph;
