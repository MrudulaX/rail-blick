import { createContext, useState, useCallback, useRef } from "react";
import { createScenarioLoader } from "../logic/scenarioLoader";
import scenariosData from "../../public/data/scenarios.json";
import stationsData from "../../public/data/stations.json";
import corridorsData from "../../public/data/corridors.json";
import trainsData from "../../public/data/trains.json";
import impactDataRaw from "../../public/data/impactData.json";

export const CascadeContext = createContext();

export function CascadeProvider({ children }) {
  const data = {
    stations: stationsData,
    corridors: corridorsData,
    scenarios: scenariosData,
    trains: trainsData,
  };

  // ── Live cascade state ─────────────────────────────────────────────
  const [activeCascade, setActiveCascade] = useState(null);
  const [stationStatus, setStationStatus] = useState({});     // { "NDLS": "red", "MTJ": "orange" }
  const [stationsAffected, setStationsAffected] = useState([]); // ordered list
  const [trainsDisrupted, setTrainsDisrupted] = useState([]);   // train objects
  const [waitlistUpdates, setWaitlistUpdates] = useState({});   // { "12952": { before: 0.74, after: 0.38 } }
  const [passengersAtRisk, setPassengersAtRisk] = useState(0);
  const [brokenConnections, setBrokenConnections] = useState(0);
  const [networkHealth, setNetworkHealth] = useState(100);
  const [cascadeComplete, setCascadeComplete] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const trainMap = Object.fromEntries(trainsData.map((t) => [t.number, t]));
  const activeCascadeRef = useRef(null);

  // ── API called by scenarioLoader ───────────────────────────────────
  const startNewCascade = useCallback((scenario) => {
    activeCascadeRef.current = scenario;
    setActiveCascade(scenario);

    setStationStatus({});
    setStationsAffected([]);
    setTrainsDisrupted([]);
    setWaitlistUpdates({});
    setPassengersAtRisk(0);
    setBrokenConnections(0);
    setNetworkHealth(100);
    setCascadeComplete(false);
    setIsRunning(true);
  }, []);

  const updateStationHit = useCallback((eventData) => {
    const { stationCode, stepIndex, totalSteps } = eventData;

    // Color by distance from trigger
    const severity =
      stepIndex === 0 ? "red" : stepIndex === 1 ? "orange" : "yellow";

    setStationStatus((prev) => ({ ...prev, [stationCode]: severity }));
    setStationsAffected((prev) =>
      prev.includes(stationCode) ? prev : [...prev, stationCode]
    );

    // Drop network health proportionally
    const drop = Math.round((stepIndex / totalSteps) * 60);
    setNetworkHealth(Math.max(10, 100 - drop - stepIndex * 8));
  }, []);


  const updateImpact = useCallback(({ passengers, connections }) => {
    setPassengersAtRisk(passengers);
    setBrokenConnections(connections);
    // Build train list from ref (no nested setState)
    if (activeCascadeRef.current) {
      const allTrainNums = [
        ...new Set(activeCascadeRef.current.propagation.flatMap((s) => s.affected_trains)),
      ];
      const trainObjs = allTrainNums.map((num) => trainMap[num]).filter(Boolean);
      setTrainsDisrupted(trainObjs);
    }
  }, [trainMap]);


  const updateWaitlist = useCallback((updates) => {
    setWaitlistUpdates((prev) => ({ ...prev, ...updates }));
  }, []);

  const completeCascade = useCallback(() => {
    setCascadeComplete(true);
    setIsRunning(false);
  }, []);

  const resetCascade = useCallback(() => {
    setActiveCascade(null);
    setStationStatus({});
    setStationsAffected([]);
    setTrainsDisrupted([]);
    setWaitlistUpdates({});
    setPassengersAtRisk(0);
    setBrokenConnections(0);
    setNetworkHealth(100);
    setCascadeComplete(false);
    setIsRunning(false);
  }, []);

  // ── Scenario loader (Dev 3's logic, wired here) ────────────────────
  const loader = createScenarioLoader(
    scenariosData,
    impactDataRaw,
    trainsData,
    {
      startNewCascade,
      updateStationHit,
      updateImpact,
      updateWaitlist,
      completeCascade,
      resetCascade,
    }
  );

  const triggerScenario = useCallback(
    (id) => {
      try {
        loader.triggerScenario(id);
      } catch (e) {
        console.error("Scenario trigger failed:", e);
      }
    },
    [scenariosData, impactDataRaw, trainsData]
  );

  const stopScenario = useCallback(() => {
    try {
      loader.stopCurrentCascade();
    } catch (e) {
      resetCascade();
    }
  }, []);

  return (
    <CascadeContext.Provider
      value={{
        // Static data
        data,
        // Live state
        activeCascade,
        stationStatus,
        stationsAffected,
        trainsDisrupted,
        waitlistUpdates,
        passengersAtRisk,
        brokenConnections,
        networkHealth,
        cascadeComplete,
        isRunning,
        // Actions
        triggerScenario,
        stopScenario,
        resetCascade,
      }}
    >
      {children}
    </CascadeContext.Provider>
  );
}
