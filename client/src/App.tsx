import React, { useState, useEffect } from 'react';
import './App.css';

interface Property {
  id: number;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  type: string;
}

function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch properties from backend API
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/properties');
        const data = await response.json();
        setProperties(data.properties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        // Fallback to mock data if backend is not available
        setProperties([
          {
            id: 1,
            title: 'Modern Downtown Apartment',
            price: 450000,
            bedrooms: 2,
            bathrooms: 2,
            area: 1200,
            location: 'Downtown',
            type: 'Apartment'
          },
          {
            id: 2,
            title: 'Suburban Family House',
            price: 650000,
            bedrooms: 4,
            bathrooms: 3,
            area: 2400,
            location: 'Suburbs',
            type: 'House'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <div className="App"><p>Loading properties...</p></div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏠 Real Estate Portal</h1>
        <p>Find your dream property</p>
      </header>
      
      <main className="properties-container">
        <h2>Available Properties</h2>
        <div className="properties-grid">
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              <h3>{property.title}</h3>
              <p className="price">${property.price.toLocaleString()}</p>
              <div className="property-details">
                <span>🛏️ {property.bedrooms} bed</span>
                <span>🚿 {property.bathrooms} bath</span>
                <span>📐 {property.area} sq ft</span>
              </div>
              <p className="location">📍 {property.location}</p>
              <p className="type">🏷️ {property.type}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
