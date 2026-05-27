export const EXCHANGE_RATE_JPY_TO_KRW = 9.5;

export const scenarios = [
  {
    id: 'diy-0628',
    label: '6/28–6/30 직접 예약',
    dateLabel: '6월 28일(일) ~ 6월 30일(화)',
    type: 'direct',
    badge: '가성비 1순위',
    nights: 2,
    days: 3,
    rounds: 2,
    baseCostPerGroupKrw: 1795500,
    baseDescription: '에어비앤비 2박 + 렌터카 직접예약 + 라쿠텐 골프 직접예약 + 현지 이동비 추정',
    summary: '가격을 가장 낮추는 선택지입니다. 다만 2박 3일이라 라운드 수와 여유는 제한됩니다.',
    inclusions: ['에어비앤비 2박 추정', '렌터카 예약 필요', '라쿠텐 골프 기준 티타임 확인 필요', '네이버 항공권 기준 항공가 확인 필요', '평일 중심 골프 2라운드 추정'],
    exclusions: ['왕복 항공권', '식비', '골프백 수하물', '현장 추가비', '티타임 확정 필요'],
  },
  {
    id: 'diy-0627',
    label: '6/27–6/30 직접 예약',
    dateLabel: '6월 27일(토) ~ 6월 30일(화)',
    type: 'direct',
    badge: '자유도·균형안',
    nights: 3,
    days: 4,
    rounds: 3,
    baseCostPerGroupKrw: 2869000,
    baseDescription: '에어비앤비 3박 + 렌터카 직접예약 + 라쿠텐 골프 직접예약 + 3라운드 현지비 추정',
    summary: '숙소 고정과 자유도를 살리면서 3라운드까지 노릴 수 있는 균형안입니다.',
    inclusions: ['에어비앤비 3박 추정', '렌터카 예약 필요', '라쿠텐 골프 기준 티타임 확인 필요', '네이버 항공권 기준 항공가 확인 필요', '골프 3라운드 추정'],
    exclusions: ['왕복 항공권', '식비', '골프백 수하물', '현장 추가비', '주말 골프요금 영향'],
  },
  {
    id: 'package-rusutsu-0627',
    label: '6/27–6/30 루스츠 패키지',
    dateLabel: '6월 27일(토) ~ 6월 30일(화)',
    type: 'package',
    badge: '골프 만족도 1순위',
    nights: 3,
    days: 4,
    rounds: 3.5,
    holes: 63,
    packagePricePerPersonKrw: 779000,
    baseDescription: '루스츠 리조트 3박4일 63홀 패키지 / 항공 불포함',
    summary: '63홀 구성과 이동 편의성이 좋습니다. 항공과 현장 추가비 확인이 핵심입니다.',
    inclusions: ['루스츠 리조트 3박', '조식', '63홀 그린피·카트피', '공항 왕복 셔틀', '여행자보험'],
    exclusions: ['왕복 항공권', '중식/석식 일부', '개인 음료/주류', '캐디피/락커비/이용세 등 현장 추가비 가능성', '골프백 수하물', '13시 전 신치토세 도착 실패 시 1일차 9홀 불가 가능성'],
  },
];

export function formatKrw(value) {
  return Math.round(value).toLocaleString('ko-KR') + '원';
}

export function calculateTrip({ scenarioId, people = 4, flightPerPerson = 450000, baggagePerPerson = 0, extraPerPerson = 0 }) {
  const scenario = scenarios.find((item) => item.id === scenarioId);
  if (!scenario) throw new Error(`Unknown scenario: ${scenarioId}`);

  const lunchCostPerPerson = scenario.days * 20000;
  const dinnerCostPerPerson = scenario.nights * 50000;
  const mealCostPerPerson = lunchCostPerPerson + dinnerCostPerPerson;
  const basePerPerson = scenario.type === 'package'
    ? scenario.packagePricePerPersonKrw
    : scenario.baseCostPerGroupKrw / people;
  const perPersonTotal = Math.round(basePerPerson + flightPerPerson + baggagePerPerson + extraPerPerson + mealCostPerPerson);

  return {
    ...scenario,
    people,
    basePerPerson: Math.round(basePerPerson),
    flightPerPerson,
    baggagePerPerson,
    extraPerPerson,
    lunchCostPerPerson,
    dinnerCostPerPerson,
    mealCostPerPerson,
    perPersonTotal,
    groupTotal: perPersonTotal * people,
  };
}
