import { calculateTrip, scenarios, formatKrw } from './calculator.mjs';

const state = {
  scenarioId: 'diy-0628',
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const inputs = {
  people: $('#people'),
  flight: $('#flight'),
  baggage: $('#baggage'),
  extra: $('#extra'),
};

function numericValue(input, fallback = 0) {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : fallback;
}

function renderList(element, items) {
  element.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
}

function render() {
  const result = calculateTrip({
    scenarioId: state.scenarioId,
    people: numericValue(inputs.people, 4),
    flightPerPerson: numericValue(inputs.flight, 450000),
    baggagePerPerson: numericValue(inputs.baggage, 0),
    extraPerPerson: numericValue(inputs.extra, 0),
  });

  $('#scenarioLabel').textContent = result.label;
  $('#scenarioSummary').textContent = result.summary;
  $('#scenarioBadge').textContent = result.badge;
  $('#perPersonTotal').textContent = formatKrw(result.perPersonTotal);
  $('#groupTotal').textContent = formatKrw(result.groupTotal);
  $('#recommendationTitle').textContent = result.label;
  $('#recommendationReason').textContent = result.summary;

  const baseLabel = result.type === 'package' ? '패키지 기본가 / 1인' : '현지 기본비 / 1인';
  $('#breakdown').innerHTML = [
    [baseLabel, formatKrw(result.basePerPerson)],
    ['항공권 / 1인', formatKrw(result.flightPerPerson)],
    [`점심 ${result.days}회 × 20,000원`, formatKrw(result.lunchCostPerPerson)],
    [`저녁 ${result.nights}회 × 50,000원`, formatKrw(result.dinnerCostPerPerson)],
    ['골프백 수하물 / 1인', formatKrw(result.baggagePerPerson)],
    ['현장 추가비 / 1인', formatKrw(result.extraPerPerson)],
  ].map(([label, value]) => `<div class="row"><span>${label}</span><strong>${value}</strong></div>`).join('');

  renderList($('#includedList'), result.inclusions);
  renderList($('#excludedList'), result.exclusions);

  $$('.choice').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.scenario === state.scenarioId);
  });
}

function loadRequests() {
  try {
    return JSON.parse(localStorage.getItem('hokkaido-forum-requests') || '[]');
  } catch {
    return [];
  }
}

function saveRequests(requests) {
  localStorage.setItem('hokkaido-forum-requests', JSON.stringify(requests));
}

function renderRequests() {
  const requests = loadRequests();
  const list = $('#requestList');
  if (!requests.length) {
    list.innerHTML = '<div class="request-item"><strong>아직 등록된 요청사항이 없습니다.</strong><p>참석자별 요청사항을 추가하면 이곳에 쌓입니다.</p></div>';
    return;
  }
  list.innerHTML = requests.map((item, index) => `
    <div class="request-item">
      <strong>${index + 1}. ${item.name || '이름 미입력'}</strong>
      <small>${item.preferred}</small>
      <p>${item.request || '요청사항 없음'}</p>
    </div>
  `).join('');
}

$$('.choice').forEach((button) => {
  button.addEventListener('click', () => {
    state.scenarioId = button.dataset.scenario;
    render();
  });
});

Object.values(inputs).forEach((input) => input.addEventListener('input', render));

$('#requestForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const requests = loadRequests();
  requests.push({
    name: $('#name').value.trim(),
    preferred: $('#preferred').value,
    request: $('#request').value.trim(),
    createdAt: new Date().toISOString(),
  });
  saveRequests(requests);
  event.target.reset();
  renderRequests();
});


function requestsAsText() {
  const requests = loadRequests();
  if (!requests.length) return '등록된 요청사항이 없습니다.';
  return ['청정에너지사업본부 훗가이토 에너지 포럼 요청사항', ''].concat(
    requests.map((item, index) => `${index + 1}. ${item.name || '이름 미입력'}\n- 선호안: ${item.preferred}\n- 요청사항: ${item.request || '없음'}`)
  ).join('\n\n');
}

$('#copyRequests').addEventListener('click', async () => {
  const text = requestsAsText();
  try {
    await navigator.clipboard.writeText(text);
    alert('취합 내용이 복사되었습니다.');
  } catch {
    alert(text);
  }
});

$('#mailRequests').addEventListener('click', () => {
  const subject = encodeURIComponent('청정에너지사업본부 훗가이토 에너지 포럼 요청사항');
  const body = encodeURIComponent(requestsAsText());
  window.location.href = `mailto:TAEWANA.KWON@SAMSUNG.COM?subject=${subject}&body=${body}`;
});

$('#clearRequests').addEventListener('click', () => {
  if (confirm('취합 리스트를 모두 삭제할까요?')) {
    saveRequests([]);
    renderRequests();
  }
});

render();
renderRequests();
