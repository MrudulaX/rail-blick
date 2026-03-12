import { useContext } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from 'react-leaflet';
import { CascadeContext } from '../context/CascadeContext';

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

// Status → visual config
const STATUS_CONFIG = {
  red:    { fill: '#ef4444', stroke: '#ff6b6b', radius: 10, glow: '0 0 16px 4px rgba(239,68,68,0.7)',  pulse: 'station-marker-red' },
  orange: { fill: '#f97316', stroke: '#fb923c', radius: 8,  glow: '0 0 12px 2px rgba(249,115,22,0.5)', pulse: 'station-marker-orange' },
  yellow: { fill: '#eab308', stroke: '#facc15', radius: 7,  glow: '',                                   pulse: 'station-marker-yellow' },
  normal: { fill: '#22c55e', stroke: '#15803d', radius: 5,  glow: '',                                   pulse: 'station-marker-normal' },
};

function getConfig(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.normal;
}

export default function RailMap() {
  const { data, stationStatus, stationsAffected, activeCascade } = useContext(CascadeContext);

  const center = [22.5, 80.5];
  const zoom   = 5;

  // Build a set of affected edge pairs for corridor coloring
  const affectedStationSet = new Set(stationsAffected);

  function getCorridorPolylineSegments(corridor) {
    const codes = corridor.stations;
    const segments = [];
    for (let i = 0; i < codes.length - 1; i++) {
      const a = data.stations.find((s) => s.code === codes[i]);
      const b = data.stations.find((s) => s.code === codes[i + 1]);
      if (!a || !b) continue;

      const aHit = affectedStationSet.has(codes[i]);
      const bHit = affectedStationSet.has(codes[i + 1]);
      const aStatus = stationStatus[codes[i]];
      const bStatus = stationStatus[codes[i + 1]];

      let color = '#2a2a3a';
      let weight = 2;
      let opacity = 0.55;

      if (aHit || bHit) {
        if (aStatus === 'red' || bStatus === 'red') {
          color = '#ef4444'; weight = 4; opacity = 0.9;
        } else if (aStatus === 'orange' || bStatus === 'orange') {
          color = '#f97316'; weight = 3; opacity = 0.8;
        } else {
          color = '#eab308'; weight = 3; opacity = 0.7;
        }
      }

      segments.push({
        key: `${corridor.id}-${i}`,
        positions: [[a.lat, a.lng], [b.lat, b.lng]],
        color, weight, opacity,
      });
    }
    return segments;
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        attributionControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url={TILE_URL} />

        {/* ── Corridor Polylines ── */}
        {data.corridors?.map((corridor) =>
          getCorridorPolylineSegments(corridor).map((seg) => (
            <Polyline
              key={seg.key}
              positions={seg.positions}
              pathOptions={{ color: seg.color, weight: seg.weight, opacity: seg.opacity }}
            />
          ))
        )}

        {/* ── Station Markers ── */}
        {data.stations?.map((stn) => {
          const status = stationStatus[stn.code] || 'normal';
          const cfg    = getConfig(status);
          return (
            <CircleMarker
              key={stn.code}
              center={[stn.lat, stn.lng]}
              radius={cfg.radius}
              className={cfg.pulse}
              pathOptions={{
                fillColor: cfg.fill,
                color: cfg.stroke,
                weight: status === 'normal' ? 1 : 2,
                fillOpacity: 1,
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -cfg.radius - 2]}
                opacity={1}
                className="custom-tooltip"
              >
                <div className="px-3 py-2 text-xs font-mono bg-[#0d0d1a] border border-gray-700 rounded">
                  <div className="font-bold text-cyan-400 text-sm">{stn.code}</div>
                  <div className="text-gray-300">{stn.name}</div>
                  {stn.zone && <div className="text-gray-500 text-[10px]">Zone: {stn.zone}</div>}
                  {status !== 'normal' && (
                    <div className={`text-[10px] mt-1 font-bold ${
                      status === 'red' ? 'text-red-400' : status === 'orange' ? 'text-orange-400' : 'text-yellow-400'
                    }`}>
                      ⚠ CASCADE ACTIVE
                    </div>
                  )}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
