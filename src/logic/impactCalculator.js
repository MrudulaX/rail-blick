export function calculateImpact(affectedTrainNumbers, impactData, stationsAffected) {
  let totalPassengers = 0;
  const seenTrains = new Set();

  for (const trainNum of affectedTrainNumbers) {
    if (seenTrains.has(trainNum)) continue;
    seenTrains.add(trainNum);
    const capacity = impactData.train_capacity[trainNum];
    if (capacity) totalPassengers += capacity.total;
  }

  // Count connections broken at affected stations
  let brokenConnections = 0;
  let highRiskConnections = 0;

  for (const conn of impactData.connection_pairs) {
    const isStationAffected = stationsAffected.includes(conn.station);
    const isTrainAffected =
      affectedTrainNumbers.includes(conn.arriving_train) ||
      affectedTrainNumbers.includes(conn.departing_train);

    if (isStationAffected && isTrainAffected) {
      brokenConnections++;
      if (conn.risk_level === 'HIGH') highRiskConnections++;
    }
  }

  return { totalPassengers, brokenConnections, highRiskConnections };
}
