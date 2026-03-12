let activeTimers = [];

export function startCascade(scenario, onStationHit, onComplete) {

  stopCascade();

  scenario.propagation.forEach((step, index) => {

    const timer = setTimeout(() => {

      onStationHit({
        stationCode: step.station_code,
        delayAdded: step.delay_added,
        affectedTrains: step.affected_trains,
        offsetSeconds: step.offset_seconds,
        stepIndex: index,
        totalSteps: scenario.propagation.length
      });

      if (index === scenario.propagation.length - 1) {
        if (onComplete) onComplete();
      }

    }, step.offset_seconds);

    activeTimers.push(timer);
  });
}

export function stopCascade() {
  activeTimers.forEach(clearTimeout);
  activeTimers = [];
}