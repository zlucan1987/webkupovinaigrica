import React from 'react';
import { Container, Image } from 'react-bootstrap';

export default function EraDiagram() {
  return (
    <Container className="mt-4 text-center">
      <h2>ERA Dijagram</h2>
      <div className="mt-4">
        <Image 
          src="/era-diagram.jpg" 
          alt="ERA Dijagram" 
          fluid 
          className="mx-auto d-block"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
    </Container>
  );
}
