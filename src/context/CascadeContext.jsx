import { createContext, useState, useEffect } from "react";
// Import static JSON data
import stationsData from "../../public/data/stations.json";
import corridorsData from "../../public/data/corridors.json";
import scenariosData from "../../public/data/scenarios.json";
import trainsData from "../../public/data/trains.json";

export const CascadeContext = createContext();

export function CascadeProvider({ children }) {
  // Static data loaded once
  const [data] = useState({
    stations: stationsData,
    corridors: corridorsData,
    scenarios: scenariosData,
    trains: trainsData
  });

  // Dynamic state that the Engine (Dev 3) will update
  const [activeCascade, setActiveCascade] = useState(null); // Which scenario is running?
  const [stationStatus, setStationStatus] = useState({}); // { "NDLS": "red", "MTJ": "orange" }
  const [networkHealth, setNetworkHealth] = useState(100);
  const [passengersAtRisk, setPassengersAtRisk] = useState(0);
  const [trainsDisrupted, setTrainsDisrupted] = useState([]);
  const [brokenConnections, setBrokenConnections] = useState(0);

  // Mock function to simulate Dev 3's trigger
  const triggerScenario = (scenarioId) => {
    const scenario = data.scenarios.find(s => s.id === scenarioId);
    setActiveCascade(scenario);
    // Real implementation will have the CascadeEngine slowly update `stationStatus` over time.
    // For Dev 2 testing, we can just highlight the trigger station in red.
    setStationStatus({ [scenario.trigger_station]: "red" });
  };

  const contextValue = {
    data,
    activeCascade,
    stationStatus,
    networkHealth,
    passengersAtRisk,
    trainsDisrupted,
    brokenConnections,
    triggerScenario
  };

  return (
    <CascadeContext.Provider value={contextValue}>
      {children}
    </CascadeContext.Provider>
  );
}
