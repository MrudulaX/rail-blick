import { useContext } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from 'react-leaflet';
import { CascadeContext } from '../context/CascadeContext';

export default function RailMap() {
  const { data, stationStatus } = useContext(CascadeContext);
  
  // Center of India
  const center = [22.9734, 78.6569];
  const zoom = 5;

  // Dark-themed tiles (CartoDB Dark Matter)
  const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  // Helper to get color status
  const getMarkerColor = (stationCode) => {
    const status = stationStatus[stationCode];
    if (status === 'red') return '#ef4444';
    if (status === 'orange') return '#f97316';
    if (status === 'yellow') return '#eab308';
    return '#22c55e'; // Green (Normal)
  };

  const getMarkerPulseClass = (stationCode) => {
    const status = stationStatus[stationCode];
    if (status === 'red') return 'station-marker-red';
    if (status === 'orange') return 'station-marker-orange';
    if (status === 'yellow') return 'station-marker-yellow';
    return 'station-marker-normal';
  };

  return (
    <div className="h-full w-full">
      <MapContainer center={center} zoom={zoom} zoomControl={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer url={TILE_URL} attribution="&copy; OpenStreetMap contributors &copy; CARTO" />
        
        {/* Draw Corridors */}
        {data.corridors?.map((corridor, i) => {
          // Flatten lat/longs from station data for this corridor
          const positions = corridor.stations.map(code => {
            const stn = data.stations.find(s => s.code === code);
            return stn ? [stn.lat, stn.lng] : null;
          }).filter(p => p !== null);

          return (
            <Polyline 
              key={`corr-${i}`} 
              positions={positions} 
              color="#333344" // Default gray line
              weight={3} 
              opacity={0.6} 
            />
          );
        })}

        {/* Draw Stations */}
        {data.stations?.map((stn) => (
          <CircleMarker
            key={stn.code}
            center={[stn.lat, stn.lng]}
            radius={stationStatus[stn.code] === 'red' ? 8 : 5}
            pathOptions={{ fillColor: getMarkerColor(stn.code), color: '#000', weight: 2, fillOpacity: 1 }}
            className={getMarkerPulseClass(stn.code)}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-tooltip">
              <div className="font-mono bg-gray-900 border border-gray-700 p-2 text-white">
                <div className="font-bold text-cyan-400">{stn.code}</div>
                <div className="text-xs">{stn.name}</div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
