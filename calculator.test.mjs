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
assert.ok(base.inclusions.some((item) => item.includes('라쿠텐 골프')));
assert.ok(base.inclusions.some((item) => item.includes('네이버 항공권')));

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
assert.equal(rusutsu.packageUrl, 'https://www.jiantour.com/master/38740');

const direct0627 = calculateTrip({
  scenarioId: 'diy-0627',
  people: 4,
  flightPerPerson: 400000,
  baggagePerPerson: 0,
  extraPerPerson: 0,
});
assert.equal(direct0627.rounds, 3);
assert.equal(direct0627.perPersonTotal, 1347250);

assert.equal(scenarios.length, 5);
console.log('calculator tests passed');

const weekdayAlt = calculateTrip({
  scenarioId: 'diy-0625',
  people: 4,
  flightPerPerson: 450000,
  baggagePerPerson: 0,
  extraPerPerson: 0,
});
assert.equal(weekdayAlt.days, 3);
assert.equal(weekdayAlt.nights, 2);
assert.equal(weekdayAlt.mealCostPerPerson, 160000);
assert.equal(weekdayAlt.perPersonTotal, 1101625);
assert.equal(weekdayAlt.groupTotal, 4406500);

const rusutsu0625 = calculateTrip({
  scenarioId: 'package-rusutsu-0625',
  people: 4,
  flightPerPerson: 450000,
  baggagePerPerson: 0,
  extraPerPerson: 0,
});
assert.equal(rusutsu0625.days, 4);
assert.equal(rusutsu0625.nights, 3);
assert.equal(rusutsu0625.mealCostPerPerson, 230000);
assert.equal(rusutsu0625.perPersonTotal, 1459000);
assert.ok(rusutsu0625.packageUrl.includes('onlinetour.co.kr'));
