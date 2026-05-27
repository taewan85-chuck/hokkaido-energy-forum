import assert from 'node:assert/strict';
import { calculateTrip, scenarios } from './calculator.mjs';

const base = calculateTrip({
  scenarioId: 'diy-0628',
  people: 4,
  flightPerPerson: 450000,
  baggagePerPerson: 0,
  extraPerPerson: 0,
});
assert.equal(base.days, 3);
assert.equal(base.nights, 2);
assert.equal(base.lunchCostPerPerson, 60000);
assert.equal(base.dinnerCostPerPerson, 100000);
assert.equal(base.mealCostPerPerson, 160000);
assert.equal(base.perPersonTotal, 1058875);
assert.equal(base.groupTotal, 4235500);

const rusutsu = calculateTrip({
  scenarioId: 'package-rusutsu-0627',
  people: 4,
  flightPerPerson: 450000,
  baggagePerPerson: 50000,
  extraPerPerson: 50000,
});
assert.equal(rusutsu.days, 4);
assert.equal(rusutsu.mealCostPerPerson, 230000);
assert.equal(rusutsu.perPersonTotal, 1559000);
assert.equal(rusutsu.groupTotal, 6236000);
assert.ok(rusutsu.exclusions.includes('왕복 항공권'));

const direct0627 = calculateTrip({
  scenarioId: 'diy-0627',
  people: 4,
  flightPerPerson: 400000,
  baggagePerPerson: 0,
  extraPerPerson: 0,
});
assert.equal(direct0627.rounds, 3);
assert.equal(direct0627.perPersonTotal, 1347250);

assert.equal(scenarios.length, 3);
console.log('calculator tests passed');
