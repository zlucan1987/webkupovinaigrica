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
import StavkaService from '../services/StavkaService';
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
        
        // Fetch all items (stavke)
        const stavke = await StavkaService.get();
        
        // Fetch all products to get their names
        const proizvodi = await ProizvodService.get();
        
        // Create a map of product IDs to product names
        const proizvodMap = {};
        proizvodi.forEach(proizvod => {
          proizvodMap[proizvod.sifra] = proizvod.naziv;
        });
        
        // Count customers per product
        const productCustomerCount = {};
        
        // Process each stavka to count unique customers per product
        stavke.forEach(stavka => {
          const proizvodSifra = stavka.proizvodSifra;
          const racunSifra = stavka.racunSifra || stavka.racun?.sifra;
          
          if (!productCustomerCount[proizvodSifra]) {
            productCustomerCount[proizvodSifra] = new Set();
          }
          
          // Add the receipt ID to the set of customers for this product
          if (racunSifra) {
            productCustomerCount[proizvodSifra].add(racunSifra);
          }
        });
        
        // Convert the data to the format needed for the chart
        const chartData = Object.keys(productCustomerCount).map(proizvodSifra => {
          return {
            name: proizvodMap[proizvodSifra] || `Proizvod ${proizvodSifra}`,
            brojKupaca: productCustomerCount[proizvodSifra].size,
            proizvodSifra: parseInt(proizvodSifra)
          };
        });
        
        // Sort by number of customers (descending)
        chartData.sort((a, b) => b.brojKupaca - a.brojKupaca);
        
        setGraphData(chartData);
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
                  dataKey="name" 
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
