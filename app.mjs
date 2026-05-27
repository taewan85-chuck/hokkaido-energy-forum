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

  const link = $('#scenarioLink');
  if (result.type === 'package' && result.packageUrl) {
    link.href = result.packageUrl;
    link.textContent = '루스츠 패키지 상품 페이지 보기';
    link.classList.remove('is-muted');
    link.style.display = 'inline-flex';
  } else {
    link.href = '#';
    link.textContent = '직접 예약은 아래 확인 링크를 참고하세요';
    link.classList.add('is-muted');
    link.style.display = 'inline-flex';
  }

  const baseLabel = result.type === 'package' ? '패키지 기본가 / 1인' : '현지 기본비 / 1인';
  $('#breakdown').innerHTML = [
    [baseLabel, formatKrw(result.basePerPerson)],
    ['항공권 / 1인', formatKrw(result.flightPerPerson)],
    [`점심 ${result.days}회 × 1인 20,000원`, formatKrw(result.lunchCostPerPerson)],
    [`저녁 ${result.nights}회 × 1인 50,000원`, formatKrw(result.dinnerCostPerPerson)],
    ['골프백 수하물 / 1인', formatKrw(result.baggagePerPerson)],
    ['현장 추가비 / 1인', formatKrw(result.extraPerPerson)],
  ].map(([label, value]) => `<div class="row"><span>${label}</span><strong>${value}</strong></div>`).join('');

  renderList($('#includedList'), result.inclusions);
  renderList($('#excludedList'), result.exclusions);

  $$('.choice').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.scenario === state.scenarioId);
  });
}

const REQUEST_STORE_URL = 'https://jsonblob.com/api/jsonBlob/019e67ab-b6ce-71cd-bf42-f403e96fa5c9';
let sharedRequests = [];
let storeOnline = false;

async function loadRequests() {
  try {
    const response = await fetch(REQUEST_STORE_URL, { cache: 'no-store' });
    const data = await response.json();
    sharedRequests = Array.isArray(data.requests) ? data.requests : [];
    storeOnline = true;
  } catch (error) {
    sharedRequests = JSON.parse(localStorage.getItem('hokkaido-forum-requests') || '[]');
    storeOnline = false;
  }
  return sharedRequests;
}

async function saveRequests(requests) {
  sharedRequests = requests;
  localStorage.setItem('hokkaido-forum-requests', JSON.stringify(requests));
  try {
    await fetch(REQUEST_STORE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests }),
    });
    storeOnline = true;
  } catch (error) {
    storeOnline = false;
    throw error;
  }
}

async function renderRequests() {
  const requests = await loadRequests();
  const list = $('#requestList');
  if (!requests.length) {
    list.innerHTML = `<div class="request-item"><strong>아직 등록된 요청사항이 없습니다.</strong><p>참석자별 요청사항을 추가하면 이곳에 함께 표시됩니다.</p><small>${storeOnline ? '공용 취합 리스트 연결됨' : '공용 취합 리스트 연결 실패 - 임시 저장 모드'}</small></div>`;
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

$('#requestForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const item = {
    name: $('#name').value.trim(),
    preferred: $('#preferred').value,
    request: $('#request').value.trim(),
    createdAt: new Date().toISOString(),
  };
  const requests = await loadRequests();
  requests.push(item);
  try {
    await saveRequests(requests);
    event.target.reset();
    await renderRequests();
    alert('요청사항이 공용 취합 리스트에 추가되었습니다.');
  } catch {
    alert('공용 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
});


async function requestsAsText() {
  const requests = await loadRequests();
  if (!requests.length) return '등록된 요청사항이 없습니다.';
  return ['청정에너지사업본부 훗가이토 에너지 포럼 요청사항', ''].concat(
    requests.map((item, index) => `${index + 1}. ${item.name || '이름 미입력'}\n- 선호안: ${item.preferred}\n- 요청사항: ${item.request || '없음'}`)
  ).join('\n\n');
}


$('#importLocalRequests').addEventListener('click', async () => {
  const local = JSON.parse(localStorage.getItem('hokkaido-forum-requests') || '[]');
  if (!local.length) {
    alert('이 브라우저에 이전 입력내용이 없습니다.');
    return;
  }
  const remote = await loadRequests();
  const existingKeys = new Set(remote.map((item) => `${item.name}|${item.preferred}|${item.request}`));
  const merged = remote.slice();
  let added = 0;
  for (const item of local) {
    const key = `${item.name}|${item.preferred}|${item.request}`;
    if (!existingKeys.has(key)) {
      merged.push(item);
      existingKeys.add(key);
      added += 1;
    }
  }
  await saveRequests(merged);
  await renderRequests();
  alert(`${added}건을 공용 취합 리스트에 반영했습니다.`);
});

$('#copyRequests').addEventListener('click', async () => {
  const text = await requestsAsText();
  try {
    await navigator.clipboard.writeText(text);
    alert('취합 내용이 복사되었습니다.');
  } catch {
    alert(text);
  }
});


$('#clearRequests').addEventListener('click', async () => {
  if (confirm('취합 리스트를 모두 삭제할까요?')) {
    await saveRequests([]);
    await renderRequests();
  }
});

render();
renderRequests();
