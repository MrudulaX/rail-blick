import { startCascade, stopCascade } from './cascadeEngine';
import { calculateImpact } from './impactCalculator';
import { predictConfirmationProbability } from './waitlistModel';

export function createScenarioLoader(scenarios, impactData, trains, cascadeCtx) {

  function triggerScenario(scenarioId) {
    const scenario = scenarios.find(s => s.id === scenarioId);
    const trainMap = Object.fromEntries(trains.map(t => [t.number, t]));
    if (!scenario) {
      console.error(`Scenario ${scenarioId} not found`);
      return;
    }

    cascadeCtx.startNewCascade(scenario);

    const stationsAffectedSoFar = [];

    startCascade(
      scenario,
      (eventData) => {
        stationsAffectedSoFar.push(eventData.stationCode);

        cascadeCtx.updateStationHit(eventData);

        const allAffectedTrains = [
          ...new Set(scenario.propagation
            .filter((_, i) => i <= eventData.stepIndex)
            .flatMap(s => s.affected_trains))
        ];

        const impact = calculateImpact(
          allAffectedTrains,
          impactData,
          stationsAffectedSoFar
        );
        cascadeCtx.updateImpact({
          passengers: impact.totalPassengers,
          connections: impact.brokenConnections
        });

        const waitlistUpdates = {};
        for (const trainNum of eventData.affectedTrains) {
          const train = trainMap[trainNum];
          if (!train) continue;

          const baseInput = {
            wl_position: 12,
            days_before_travel: 3,
            route_demand_score: 0.7,
            season_index: 0.6,
            class_type_encoded: 1,    // 3A
            train_type_encoded: 3,    // Duronto
            day_of_week_encoded: 1    // Tue
          };

          const before = predictConfirmationProbability({ ...baseInput, route_demand_score: 0.5 });
          const after = predictConfirmationProbability({ ...baseInput, route_demand_score: 0.95 });

          waitlistUpdates[trainNum] = { before, after };
        }
        cascadeCtx.updateWaitlist(waitlistUpdates);
      },

      () => cascadeCtx.completeCascade()
    );
  }

  function stopCurrentCascade() {
    stopCascade();
    cascadeCtx.resetCascade();
  }

  return { triggerScenario, stopCurrentCascade };
}
