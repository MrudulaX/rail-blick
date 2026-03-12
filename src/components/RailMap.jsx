@import "leaflet/dist/leaflet.css";

/* Reset Leaflet background to be dark so it blends with our theme before tiles load */
.leaflet-container {
    background: #0a0a14 !important;
}

/* Custom CSS animation for affected stations */
@keyframes map-pulse {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.station-marker-normal { background-color: #22c55e; border: 2px solid #000; border-radius: 50%; opacity: 0.8;}
.station-marker-yellow { background-color: #eab308; border: 2px solid #000; border-radius: 50%; }
.station-marker-orange { background-color: #f97316; border: 2px solid #000; border-radius: 50%; }
.station-marker-red { background-color: #ef4444; border: 2px solid #fff; border-radius: 50%; animation: map-pulse 2s infinite; z-index: 1000 !important; }
