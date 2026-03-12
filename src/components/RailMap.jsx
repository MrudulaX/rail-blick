import React, { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* -----------------------------
   Dummy Stations (Demo Network)
----------------------------- */

const stations = [
  { code: "NDLS", name: "New Delhi", lat: 28.6139, lng: 77.2090 },
  { code: "BPL", name: "Bhopal", lat: 23.2599, lng: 77.4126 },
  { code: "NGP", name: "Nagpur", lat: 21.1458, lng: 79.0882 },
  { code: "BCT", name: "Mumbai Central", lat: 18.9690, lng: 72.8193 }
];

/* -----------------------------
   Railway Corridors
----------------------------- */

const corridors = [
  { id: "c1", from: "NDLS", to: "BPL" },
  { id: "c2", from: "BPL", to: "NGP" },
  { id: "c3", from: "NGP", to: "BCT" }
];

export default function RailMap() {

  /* -----------------------------
     Station + Corridor States
  ----------------------------- */

  const [stationStatus, setStationStatus] = useState({});
  const [corridorStatus, setCorridorStatus] = useState({});

  /* -----------------------------
     Cascade Simulation
  ----------------------------- */

  const triggerDemoCascade = () => {

    // reset
    setStationStatus({});
    setCorridorStatus({});

    // Step 1
    setTimeout(() => {
      setStationStatus(prev => ({ ...prev, NDLS: "critical" }));
    }, 500);

    // Step 2
    setTimeout(() => {
      setCorridorStatus(prev => ({ ...prev, c1: "active" }));
      setStationStatus(prev => ({ ...prev, NDLS: "danger", BPL: "warning" }));
    }, 2000);

    // Step 3
    setTimeout(() => {
      setCorridorStatus(prev => ({ ...prev, c1: "normal", c2: "active" }));
      setStationStatus(prev => ({ ...prev, BPL: "critical", NGP: "warning" }));
    }, 3500);

    // Step 4
    setTimeout(() => {
      setCorridorStatus(prev => ({ ...prev, c2: "normal", c3: "active" }));
      setStationStatus(prev => ({ ...prev, NGP: "critical", BCT: "warning" }));
    }, 5000);

    // Step 5
    setTimeout(() => {
      setCorridorStatus(prev => ({ ...prev, c3: "normal" }));
      setStationStatus(prev => ({ ...prev, BCT: "critical" }));
    }, 6500);
  };

  /* -----------------------------
     Helper: Get coordinates
  ----------------------------- */

  const getCoords = (code) => {
    const s = stations.find(s => s.code === code);
    return s ? [s.lat, s.lng] : [0, 0];
  };

  /* -----------------------------
     Helper: Station Colors
  ----------------------------- */

  const getMarkerColor = (code) => {

    const status = stationStatus[code] || "normal";

    switch (status) {
      case "critical":
        return "#FF4444";
      case "danger":
        return "#FF8800";
      case "warning":
        return "#FFD700";
      default:
        return "#00FF87";
    }
  };

  return (
    <div
      style={{
        height: "600px",
        width: "100%",
        position: "relative",
        background: "#050508"
      }}
    >

      {/* Trigger Button */}

      <button
        onClick={triggerDemoCascade}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          padding: "10px 18px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Trigger Cascade
      </button>

      {/* Map */}

      <MapContainer
        center={[23, 78]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >

        {/* Dark Map */}

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; CARTO"
        />

        {/* Corridors */}

        {corridors.map(c => {

          const isActive = corridorStatus[c.id] === "active";

          return (
            <Polyline
              key={c.id}
              positions={[getCoords(c.from), getCoords(c.to)]}
              pathOptions={{
                color: isActive ? "#FF4444" : "#4a4a6a",
                weight: isActive ? 3 : 2,
                opacity: 0.8
              }}
            />
          );
        })}

        {/* Stations */}

        {stations.map(station => {

          const status = stationStatus[station.code] || "normal";

          return (
            <CircleMarker
              key={station.code}
              center={[station.lat, station.lng]}
              radius={status === "critical" ? 8 : 6}
              pathOptions={{
                fillColor: getMarkerColor(station.code),
                fillOpacity: 1,
                color: "#ffffff",
                weight: 1
              }}
            >

              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <span>
                  <b>{station.name}</b> ({station.code})
                </span>
              </Tooltip>

            </CircleMarker>
          );
        })}

      </MapContainer>

    </div>
  );
}