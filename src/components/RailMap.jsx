import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// 1. DUMMY DATA (Since Dev 1 hasn't finished the JSONs yet)
const stations = [
  { code: "NDLS", name: "New Delhi", lat: 28.6139, lng: 77.2090 },
  { code: "BPL", name: "Bhopal", lat: 23.2599, lng: 77.4126 },
  { code: "NGP", name: "Nagpur", lat: 21.1458, lng: 79.0882 },
  { code: "BCT", name: "Mumbai Central", lat: 18.9690, lng: 72.8193 }
];

const corridors = [
  { id: "c1", from: "NDLS", to: "BPL" },
  { id: "c2", from: "BPL", to: "NGP" },
  { id: "c3", from: "NGP", to: "BCT" }
];

export default function RailMap() {
  // 2. STATE FOR ANIMATIONS
  // Stores the status of each station: normal, warning, danger, critical
  const [stationStatus, setStationStatus] = useState({});
  // Stores the status of each corridor: normal, active
  const [corridorStatus, setCorridorStatus] = useState({});

  // 3. THE SIMULATED CASCADE (This is what Dev 1's engine will eventually do)
  const triggerDemoCascade = () => {
    // Reset everything first
    setStationStatus({});
    setCorridorStatus({});

    // Step 1: New Delhi gets a massive delay instantly
    setTimeout(() => {
      setStationStatus(prev => ({ ...prev, NDLS: 'critical' }));
    }, 500);

    // Step 2: The delay travels down the corridor to Bhopal
    setTimeout(() => {
      setCorridorStatus(prev => ({ ...prev, c1: 'active' }));
      setStationStatus(prev => ({ ...prev, NDLS: 'danger', BPL: 'warning' }));
    }, 2000);

    // Step 3: Bhopal becomes critical, travels to Nagpur
    setTimeout(() => {
      setCorridorStatus(prev => ({ ...prev, c1: 'normal', c2: 'active' }));
      setStationStatus(prev => ({ ...prev, BPL: 'critical', NGP: 'warning' }));
    }, 3500);

    // Step 4: Nagpur becomes critical, travels to Mumbai
    setTimeout(() => {
      setCorridorStatus(prev => ({ ...prev, c2: 'normal', c3: 'active' }));
      setStationStatus(prev => ({ ...prev, NGP: 'critical', BCT: 'warning' }));
    }, 5000);
    
    // Step 5: Mumbai gets hit
    setTimeout(() => {
      setCorridorStatus(prev => ({ ...prev, c3: 'normal' }));
      setStationStatus(prev => ({ ...prev, BCT: 'critical' }));
    }, 6500);
  };

  // Helper function to find coordinates for polylines
  const getCoords = (code) => {
    const s = stations.find(s => s.code === code);
    return s ? [s.lat, s.lng] : [0, 0];
  };

  // Helper function to get the right CSS class based on state
  const getMarkerColor = (code) => {
    const status = stationStatus[code] || 'normal';
    switch (status) {
      case 'critical': return '#FF4444'; // Red
      case 'danger': return '#FF8800';   // Orange
      case 'warning': return '#FFD700';  // Yellow
      default: return '#00FF87';         // Green
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      
      {/* Floating UI Button to Trigger Animation */}
      <button 
        onClick={triggerDemoCascade}
        className="absolute top-4 right-4 z-[1000] bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold shadow-lg transition-colors border border-blue-400"
      >
        Trigger Cascade
      </button>

      <MapContainer 
        center={[23.0, 78.0]} // Center of India
        zoom={5} 
        style={{ height: '100%', width: '100%', background: '#050508' }}
        zoomControl={false}
      >
        {/* Dark theme map tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* 1. Render Corridors (Polylines) FIRST so they appear under stations */}
        {corridors.map(c => {
          const isActive = corridorStatus[c.id] === 'active';
          return (
            <Polyline 
              key={c.id}
              positions={[getCoords(c.from), getCoords(c.to)]}
              pathOptions={{ 
                color: isActive ? '#FF4444' : '#4a4a6a', 
                weight: isActive ? 3 : 2,
                opacity: 0.8
              }}
            />
          );
        })}

        {/* 2. Render Stations (CircleMarkers) */}
        {stations.map(station => {
          const status = stationStatus[station.code] || 'normal';
          return (
            <CircleMarker
              key={station.code}
              center={[station.lat, station.lng]}
              radius={status === 'critical' ? 8 : 6}
              pathOptions={{
                fillColor: getMarkerColor(station.code),
                fillOpacity: 1,
                color: '#fff', // border color
                weight: 1,
                className: `marker-${status}` // Adds the CSS animation class from Step 1
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <span className="font-bold">{station.name} ({station.code})</span>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
