const equipmentOrder = [
  "무기",
  "보조무기",
  "엠블렘",
  "모자",
  "상의",
  "하의",
  "한벌옷",
  "장갑",
  "신발",
  "어깨",
  "망토",
  "벨트",
  "목걸이",
  "목걸이 (2번째 슬롯)",
  "얼굴장식",
  "눈장식",
  "귀고리",
  "뱃지",
  "포켓",
  "반지",
  "반지 (2번째 슬롯)",
  "반지 (3번째 슬롯)",
  "반지 (4번째 슬롯)"
];

const validAdditionalOptionPhysics = [
    "물리 대미지",
    "최종 대미지",
    "방어율 무시",
    "물리 공격력"
]

const validAdditionalOptionMagic = [
    "마법 대미지",
    "최종 대미지",
    "방어율 무시",
    "마법 공격력"
]

const validPotentialOptionPhysics = [
    "물리 대미지",
    "보스 공격력",
    "최대 HP"
]

const validPotentialOptionMagic = [
    "마법 대미지",
    "보스 공격력",
    "최대 HP"
]

const additionalOptionGradeGroup = {
  1: "rebirth_flame_180",
  2: "powerful_rebirth_flame",
  3: "eternal_rebirth_flame",
  4: "rebirth_flame"
}

const potentialGradeGroup = {
  1: 'R',
  2: 'E',
  3: 'U',
  4: 'L'
}

const itemGradeGroup = {
  '레어': 'R',
  '에픽': 'E',
  '유니크': 'U',
  '레전더리': 'L'
}

const categoryMap = [
    { group: ['히어로', '팔라딘', '다크나이트', '비숍', '아크메이지(불,독)', '아크메이지(썬,콜)', '보우마스터', '신궁', '패스파인더', '나이트로드', '섀도어', '듀얼블레이드', '캡틴', '바이퍼', '캐논슈터'], tag: '모험가' },
    { group: ['소울마스터', '미하일', '플레임위자드', '윈드브레이커', '나이트워커', '스트라이커'], tag: '시그너스기사단' },
    { group: ['아란', '에반', '메르세데스', '팬텀', '루미너스', '은월'], tag: '영웅' },
    { group: ['블래스터', '배틀메이지', '와일드헌터', '제논', '메카닉'], tag: '레지스탕스' },
    { group: ['데몬슬레이어', '데몬어벤져'], tag: '데몬' },
    { group: ['카이저', '카데나', '카인', '엔젤릭버스터'], tag: '노바' },
    { group: ['아델', '일리움', '칼리', '아크'], tag: '레프' },
    { group: ['라라', '호영', '렌'], tag: '아니마' },
    { group: ['제로'], tag: '초월자' },
    { group: ['키네시스'], tag: '프렌즈 월드' },
    { group: ['에릴', '시아', '아이엘'], tag: '샤인'}
];

const classMap = [
    { group: ['히어로', '팔라딘', '다크나이트', '소울마스터', '미하일', '블래스터', '데몬슬레이어', '데몬어벤져', '아란', '카이저', '아델', '제로', '에릴', '렌'], tag: '전사' },
    { group: ['비숍', '아크메이지(불,독)', '아크메이지(썬,콜)', '플레임위자드', '에반', '루미너스', '배틀메이지', '일리움', '라라', '키네시스', '시아'], tag: '마법사' },
    { group: ['보우마스터', '신궁', '패스파인더', '윈드브레이커', '메르세데스', '와일드헌터', '카인', '아이엘'], tag: '궁수' },
    { group: ['나이트로드', '섀도어', '듀얼블레이드', '나이트워커', '팬텀', '카데나', '칼리', '호영', '제논'], tag: '도적' },
    { group: ['캡틴', '바이퍼', '캐논슈터', '스트라이커', '은월', '메카닉', '엔젤릭버스터', '아크', '제논'], tag: '해적' }
];

const magicJob = ['비숍', '아크메이지(불,독)', '아크메이지(썬,콜)', '플레임위자드', '에반', '루미너스', '배틀메이지', '일리움', '라라', '키네시스', '시아', '캡틴', '메카닉', '엔젤릭버스터']

function openTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
}

function formatDate(utcString) {
    if (!utcString) return '-';
    const date = new Date(utcString);
    const offsetDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC+9
    return offsetDate.toISOString().replace('T', ' ').substring(0, 19);
}

function formatNumber(num) {
    return Number(num).toLocaleString();
}

function formatKoreanExp(num) {
    const units = ['', '만', '억', '조', '경'];
    const parts = [];
    let value = Number(num);
    let unitIndex = 0;

    while (value > 0 && unitIndex < units.length) {
    const part = value % 10000;
    if (part > 0) {
        parts.unshift(`${part.toLocaleString()}${units[unitIndex]}`);
    }
    value = Math.floor(value / 10000);
    unitIndex++;
    }

    return `(${parts.join(' ')})`;
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function searchCharacter() {
    const world = document.getElementById('world').value;
    const nickname = document.getElementById('nickname').value;
    const apiKey = document.getElementById('apiKey').value;

    const basicCard   = document.getElementById("basicBox");
    const basicCardSkill = document.getElementById("basicBoxSkill");
    const statCard    = document.getElementById("statBox");
    const itemCard    = document.getElementById("itemBox");
    const vmatrixCard = document.getElementById("vmatrixBox");
    const jewelWrap   = document.getElementById("jewelWrap");
    const symbolWrap   = document.getElementById("symbolWrap");
    const hexaWrap   = document.getElementById("hexaWrap");
    const linkWrap   = document.getElementById("linkSkillsWrap");
    const tabLoading = document.getElementById("tab-loading");
    const tabLoadingSkill = document.getElementById("tab-loading-skill");

    if (!basicCard || !statCard || !itemCard || !vmatrixCard) {
    console.error("DOM element missing", { basicCard, statCard, itemCard, vmatrixCard });
    alert("결과 영역 ID를 확인해주세요.");
    return; // 여기서 중단
    }

    // 하위 카드 초기화
    basicCard.innerHTML = "";
    basicCardSkill.innerHTML = "";
    statCard.innerHTML = "";
    itemCard.innerHTML = "";
    vmatrixCard.innerHTML = "";
    jewelWrap.classList.add("d-none");
    symbolWrap.classList.add("d-none");
    hexaWrap.classList.add("d-none");
    linkWrap.classList.add("d-none");

    if (!world || !nickname || !apiKey) {
    tabLoading.innerHTML = '<div class="alert alert-warning">모든 필드를 입력해주세요.</div>';
    tabLoadingSkill.innerHTML = '<div class="alert alert-warning">모든 필드를 입력해주세요.</div>';
    return;
    }

    tabLoading.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
    tabLoadingSkill.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
    try {
    const ocidResponse = await fetch(`https://open.api.nexon.com/maplestorym/v1/id?character_name=${encodeURIComponent(nickname)}&world_name=${encodeURIComponent(world)}`, {
        headers: { 'x-nxopen-api-key': apiKey }
    });
    const ocidData = await ocidResponse.json();
    const ocid = ocidData.ocid;

    const endpoints = ['guild', 'basic', 'stat', 'item-equipment', 'vmatrix', 'set-effect', 'jewel', 'symbol', 'link-skill', 'hexamatrix-stat'];
    // const endpoints = ['guild', 'basic', 'stat', 'item-equipment', 'cashitem-equipment', 'vmatrix', 'symbol', 'set-effect', 'jewel', 'link-skill', 'hexamatrix-skill', 'hexamatrix-stat', 'android-equipment', 'beauty-equipment', 'skill-equipment', 'pet-equipment'];
    let guildName = '';
    let characterJob = '';

    const apiData = {};

    for (const endpoint of endpoints) {
        const res = await fetch(`https://open.api.nexon.com/maplestorym/v1/character/${endpoint}?ocid=${ocid}`, {
        headers: { 'x-nxopen-api-key': apiKey }
        });
        const data = await res.json();

        apiData[endpoint] = data;
        await delay(300);
    }
    tabLoading.innerHTML = '';
    tabLoadingSkill.innerHTML = '';
    
    guildName = apiData["guild"].guild_name || '';

    characterJob = apiData["basic"].character_class || apiData["basic"].character_job_name || '';
    const genderKo = apiData["basic"].character_gender === 'Male' ? '남' : apiData["basic"].character_gender === 'Female' ? '여' : apiData["basic"].character_gender;
    const formattedExp = `${formatNumber(apiData["basic"].character_exp)} ${formatKoreanExp(apiData["basic"].character_exp)}`;
    const basicHTML = `
        <div class="card h-100">
            <div class="card-body py-3">
            <!-- 헤더: 이름 + 길드/칭호 배지 영역 -->
            <div class="d-flex align-items-start gap-3">
                <!-- 왼쪽: 동그란 아바타 -->
                <img src="${apiData["basic"].character_image}" alt="${apiData["basic"].character_name}" class="avatar-clip shadow-sm">

                <!-- 오른쪽: 정보 영역 -->
                <div class="flex-grow-1">
                <!-- 1줄: 닉네임 + 서버 아이콘/칭호 -->
                <div class="d-flex align-items-center gap-2">
                    <h5 class="mb-0 fw-semibold">${apiData["basic"].character_name}</h5>
                    ${`<span class="badge text-bg-light border"><img src="images/world/${apiData["basic"].world_name}.png" class="world-icon" alt="${apiData["basic"].world_name}">
                    ${apiData["basic"].world_name}</span>`}
                </div>

                <!-- 2줄: 레벨/직업/길드 -->
                <div class="text-body-secondary small mt-1">
                    Lv.${apiData["basic"].character_level}
                    ${apiData["basic"].character_job_name ? ` | ${apiData["basic"].character_job_name}` : ''}
                    ${guildName ? ` | <span class="text-primary-emphasis">${guildName}</span>` : ''}
                </div>

                <!-- 3줄: “뱃지” 스타일 요약(원하는 항목만) -->
                <div class="mt-2 d-flex flex-wrap gap-2">
                <!--
                    ${apiData["basic"].total_rank ? `<span class="badge badge-pill-light">종합랭킹 ${apiData["basic"].total_rank}</span>` : ''}
                    ${apiData["basic"].server_class_rank ? `<span class="badge badge-pill-light">서버/직업랭킹 ${apiData["basic"].server_class_rank}</span>` : ''}
                    ${apiData["basic"].union_level ? `<span class="badge bg-primary-subtle text-primary-emphasis border">유니온 ${apiData["basic"].union_level}</span>` : ''}
                    ${apiData["basic"].dojo ? `<span class="badge bg-danger-subtle text-danger-emphasis border">무릉도장 ${apiData["basic"].dojo}층</span>` : ''} -->
                </div>
                </div>
            </div>

            <!-- 구분선 -->
            <hr class="my-3">

            <!-- 상세 표 (왼쪽에 보이던 리스트를 여기 배치) -->
            <ul class="list-group list-group-flush">
                <li class="list-group-item px-0 d-flex">
                <div class="text-secondary" style="min-width:7rem">성별</div>
                <div class="flex-grow-1">${genderKo}</div>
                </li>
                <li class="list-group-item px-0 d-flex">
                <div class="text-secondary" style="min-width:7rem">생성일</div>
                <div class="flex-grow-1">${formatDate(apiData["basic"].character_date_create)}</div>
                </li>
                <li class="list-group-item px-0 d-flex">
                <div class="text-secondary" style="min-width:7rem">경험치</div>
                <div class="flex-grow-1">${formattedExp}</div>
                </li>
                <li class="list-group-item px-0 d-flex">
                <div class="text-secondary" style="min-width:7rem">최근 접속</div>
                <div class="flex-grow-1">${formatDate(apiData["basic"].character_date_last_login)}</div>
                </li>
                <li class="list-group-item px-0 d-flex">
                <div class="text-secondary" style="min-width:7rem">최근 종료</div>
                <div class="flex-grow-1">${formatDate(apiData["basic"].character_date_last_logout)}</div>
                </li>
            </ul>

            <!-- (선택) 하단 아이콘 띠 -->
            ${apiData["basic"].profile_icons ? `
                <div class="mt-3 d-flex align-items-center gap-2">
                ${apiData["basic"].profile_icons.map(src => `<img src="${src}" alt="" height="28">`).join('')}
                </div>
            ` : ''}
            </div>
        </div>
        `;

        
    basicCard.innerHTML = basicHTML;
    basicCardSkill.innerHTML = basicHTML;

    statCard.innerHTML = `
        <div class="card h-100">
        <div class="card-body">
            <h5 class="card-title">스탯 정보</h5>
            <ul class="list-group list-group-flush">
            ${apiData["stat"].stat.map(stat => `<li class="list-group-item">${stat.stat_name} : ${formatNumber(stat.stat_value)}</li>`).join('')}
            </ul>
        </div>
        </div>
    `;

    // itemCard.innerHTML = `
    //     <div class="card h-100">
    //     <div class="card-body">
    //         <h5 class="card-title">장착 장비</h5>
    //         <ul class="list-group list-group-flush">
    //         ${getEquipmentSet(apiData["item-equipment"].item_equipment).filter(data => data.setCounts > 0).map(equipment => `<li class="list-group-item">${equipment.setName} ${equipment.setCounts}세트</li>`).join('')}
    //         </ul>
    //     </div>
    //     </div>
    // `;

    renderJewels(apiData["jewel"]);

    renderSymbols(apiData["symbol"]);

    renderItemEquip(apiData["item-equipment"], apiData["set-effect"]);

    const cores = apiData["vmatrix"].character_v_core_equipment;
    let vMatrixHTML = `
        <div class="card">
        <div class="card-body">
            <h5 class="card-title">V 매트릭스</h5>
            <div class="d-flex flex-wrap gap-3">
    `;

    let skillCores = [];
    let enhancementMap = {};
    let specialCores = [];

    for (const core of cores) {
        const { v_core_type, v_core_level, slot_level, v_core_name } = core;
        const totalLevel = v_core_level + slot_level;

        if (v_core_type === 'Skill') {
        skillCores.push({ name: v_core_name, level: totalLevel });
        } else if (v_core_type === 'Special') {
        specialCores.push({ name: v_core_name, level: v_core_level });
        } else if (v_core_type === 'Enhancement') {
        const skills = [
            core.v_core_skill_name_1,
            core.v_core_skill_name_2,
            core.v_core_skill_name_3
        ].filter(n => n !== '(Unknown)');
        for (const name of skills) {
            if (!enhancementMap[name]) enhancementMap[name] = 0;
            enhancementMap[name] += totalLevel;
        }
        }
    }

    // 출력 순서: Skill → Enhancement → Special
    for (const { name, level } of skillCores) {
        const icon = getSkillImageTag(name, characterJob, 'Skill');
        vMatrixHTML += `
        <div class="text-center">
            <div>Lv. ${level}</div>
            ${icon}
        </div>
        `;
    }

    for (const [skillName, level] of Object.entries(enhancementMap)) {
        const icon = getSkillImageTag(skillName, characterJob, 'Enhancement');
        vMatrixHTML += `
        <div class="text-center">
            <div>Lv. ${Math.min(level, 60)}</div>
            ${icon}
        </div>
        `;
    }

    for (const { name, level } of specialCores) {
        const icon = getSkillImageTag(name, characterJob, 'Special');
        vMatrixHTML += `
        <div class="text-center">
            <div>Lv. ${level}</div>
            ${icon}
        </div>
        `;
    }

    vmatrixCard.innerHTML = vMatrixHTML;

    renderLinkSkills(apiData["link-skill"]);

    renderHexaStat(apiData["hexamatrix-stat"]);

    await delay(300);

    document.getElementById("screenshotBtnContainer").style.display = "block";

    } catch (error) {
    tabLoading.innerHTML = '<div class="alert alert-danger">캐릭터 정보를 불러오지 못했습니다.</div>';
    console.error(error);
    }
}

function getJobDetail(job) {
    const detail = [];
    
    categoryMap.forEach(({ group, tag }) => { if (group.includes(job)) detail.push(tag); });
    classMap.forEach(({ group, tag }) => { if (group.includes(job)) detail.push(tag); });
    return detail;
}

function resolveSkillImage(skillName, job, type) {
    const cleanName = skillName.replace(/:/g, '').split('/')[0];
    const details = Array.from(new Set(getJobDetail(job)));
    const paths = [];

    if (type === 'Skill') {
    paths.push(`images/5차스킬/${job}/스킬코어/${cleanName}`);
    for (const d of details) paths.push(`images/5차스킬/공용스킬/${d}/${cleanName}`);
    paths.push(`images/5차스킬/공용스킬/전체공용/${cleanName}`);
    } else if (type === 'Enhancement') {
    paths.push(`images/5차스킬/${job}/강화코어/${cleanName}`);
    } else if (type === 'Special') {
    paths.push(`images/5차스킬/특수코어/${cleanName}`);
    }
    console.log('paths : ', paths);

    console.log('flatMap : ', paths.flatMap(path => [
    `${encodeURI(path)}.png`,
    `${encodeURI(path)}.webp`
    ]));

    return paths.flatMap(path => [
    `${encodeURI(path)}.png`,
    `${encodeURI(path)}.webp`
    ]);
}

function getSkillImageTag(skillName, job, type) {
    const candidates = resolveSkillImage(skillName, job, type);
    const imgId = `img_${Math.random().toString(36).substring(2)}`;
    const wrapperId = `wrap_${imgId}`;

    const html = `
    <div class="v-icon-wrapper" id="${wrapperId}">
        <div class="v-icon-bg" style="position: relative;">
        <img id="${imgId}" src="images/polygon.png" class="skill-icon" alt="${skillName}" title="${skillName}">
        </div>
    </div>
    `;

    const ensureImgReady = () => {
    const imgEl = document.getElementById(imgId);
    if (!imgEl) {
        setTimeout(ensureImgReady, 100); // 아직 DOM에 없으면 재시도
        return;
    }

    let index = 0;

    const tryNext = () => {
        if (index >= candidates.length) {
        console.warn(`❌ 모든 후보 경로 실패: ${skillName}`);
        return;
        }

        const url = candidates[index];
        const testImg = new Image();

        testImg.onload = () => {
        console.log(`✅ 로드 성공: ${url}`);
        imgEl.src = url;
        };
        testImg.onerror = () => {
        console.warn(`❌ 실패: ${url}`);
        index++;
        tryNext();
        };
        testImg.src = url;
    };

    tryNext();
    };

    setTimeout(ensureImgReady, 0);
    return html;
}


async function downloadResultImage() {
  const original = document.getElementById('result');
  if (!original) {
    alert('결과 영역이 없습니다.');
    return;
  }

  // 파일명 구성 (기존 그대로)
  const world = document.getElementById('world')?.value || '월드';
  const nickname = document.getElementById('nickname')?.value || '캐릭터';
  const dateTime = getFormattedDateTime();
  const filename = `${world}_${nickname}_${dateTime}.png`;

  // 캡처에서 빼고 싶은 요소 잠깐 숨기기 (필요 없으면 지워도 됨)
  const toHide = [
    document.getElementById('screenshotBtn'),
    ...original.querySelectorAll('[data-hide-on-capture]')
  ].filter(Boolean);
  const prevVisibility = toHide.map(el => el.style.visibility);
  toHide.forEach(el => (el.style.visibility = 'hidden'));

  try {
    const canvas = await html2canvas(original, {
      backgroundColor: '#ffffff',
      useCORS: true,   // 외부 이미지 포함
      scale: 2,        // 선명도
      // 고정폭이면 아래 옵션 생략해도 OK.
      // 긴 영역(스크롤 전체)을 한 장으로 담고 싶다면 주석 해제:
      width:  original.scrollWidth,
      height: original.scrollHeight,
      windowWidth:  original.scrollWidth
    });

    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = filename;
    a.click();
  } catch (err) {
    console.error('스크린샷 생성 오류:', err);
    alert('스크린샷 생성 중 문제가 발생했습니다.');
  } finally {
    // 숨겼던 요소 복원
    toHide.forEach((el, i) => (el.style.visibility = prevVisibility[i] || ''));
  }
}

function getFormattedDateTime() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}${mm}${dd}_${hh}${mi}${ss}`;
}

// 옵션 문자열 조립 유틸 (안정 버전)
function joinOptions(list, validOptions = [], maxLines = 2) {
  if (!Array.isArray(list) || list.length === 0) return '';

  // 옵션 누적 맵: name -> { value: number, isPct: boolean }
  const acc = {};

  const toNumberInfo = (raw) => {
    if (raw == null) return null;
    const s = String(raw).trim();
    const isPct = s.includes('%');
    // 콤마/퍼센트 제거 후 숫자 파싱
    const num = parseFloat(s.replace(/,/g, '').replace('%', ''));
    if (isNaN(num)) return null;
    return { num, isPct };
  };

  for (const l of list) {
    const name = l.option_name;
    const info = toNumberInfo(l.option_value);
    if (!name || !info) continue;

    if (!acc[name]) {
      acc[name] = { value: info.num, isPct: info.isPct };
    } else {
      acc[name].value += info.num;
      // 어느 한 쪽이라도 퍼센트면 퍼센트로 취급
      acc[name].isPct = acc[name].isPct || info.isPct;
    }
  }

  // validOptions 순서대로 집계 → 문자열 라인 배열
  const lines = [];
  for (const key of validOptions) {
    const entry = acc[key];
    if (!entry) continue;

    const text = entry.isPct
      ? `${entry.value.toFixed(2)}%`
      : entry.value.toLocaleString('ko-KR'); // 숫자 포맷팅

    lines.push(`${key} ${text}`);
    // if (lines.length >= maxLines) break;
  }

  return lines.join(', ');
}

// 스타포스 요약 만들기
function makeStarforceSummary(item) {
  const bits = [];
  if (item.starforce_upgrade) bits.push(`⭐ ${item.starforce_upgrade}`);
//   // 예: 잠재/에디 등급
//   if (item.item_potential_option_grade) bits.push(item.item_potential_option_grade);
//   if (item.item_additional_potential_option_grade) bits.push(`에디 ${item.item_additional_potential_option_grade}`);
  return bits.join('  ');
}

// 아이템 카드 템플릿 (한 장)
function renderItemCard(item, job) {
    // 마법 직업군인지 확인
    const isMagicJob = magicJob.indexOf(job) !== -1;
    let additionalOption;
    let potentialOption;
    if (isMagicJob) {
        additionalOption = validAdditionalOptionMagic;
        potentialOption = validPotentialOptionMagic;
    }
    else {
        additionalOption = validAdditionalOptionPhysics;
        potentialOption = validPotentialOptionPhysics;
    }
    const starforce = makeStarforceSummary(item);
    const addOptRaw = joinOptions(item.item_additional_option, additionalOption, 1);
    const potOptRaw = joinOptions(item.item_potential_option, potentialOption, 1);
    const addPotRaw = joinOptions(item.item_additional_potential_option, potentialOption, 1);

    const itemGrade = itemGradeGroup[item.item_grade];
    const potentialGrade = potentialGradeGroup[item.item_potential_option_grade];
    const additionalPotentialGrade = potentialGradeGroup[item.item_additional_potential_option_grade];
    const additionalOptionGrade = additionalOptionGradeGroup[item.item_additional_option_grade];

    const addOpt = addOptRaw ? `<img class="rebirth_flame" src="images/${additionalOptionGrade}.png"</img> <span>${addOptRaw}</span>` : "";
    const potOpt = potOptRaw ? `<span class="potential ${potentialGrade}">${potentialGrade}</span> <span>${potOptRaw}</span>` : "";
    const addPot = addPotRaw ? `<span class="potential a${additionalPotentialGrade}">${additionalPotentialGrade}</span> <span>${addPotRaw}</span>` : "";
    // 맨 아랫줄(옵션 라인) 구성: 있으면 붙이고, 없으면 생략
    const subLines = [addOpt, potOpt, addPot].filter(Boolean);

    return `
            <div class="item-card d-flex">
                <!-- 좌측: 아이콘 -->
                <div class="item-left">
                    <img class="item-icon ${itemGrade}" src="${item.item_icon || ''}" alt="${item.item_name || ''}">
                </div>
                <!-- 우측: 제목 + 옵션 -->
                <div class="item-right flex-grow-1">
                    <div class="item-title d-flex align-items-center gap-2">
                    <span>${item.item_name || '-'}</span>
                    ${starforce ? `<span class="badge-soft">${starforce}</span>` : ''}
                    </div>
                    ${subLines.length ? `
                    <div class="item-subline mt-1">
                        ${subLines.filter(Boolean).map(line => `<div>${line}</div>`).join('')}
                    </div>` : ''}
                </div>
            </div>
    `;
}

// item_equipment 배열을 2열 그리드에 렌더
function renderItemEquip(equipment, set) {
  const grid = document.getElementById('itemBox');
  if (!grid) return;

  const jobName = equipment.character_class;
  let items = (equipment && Array.isArray(equipment.item_equipment)) ? equipment.item_equipment : [];

  // ✅ 원하는 순서대로 정렬
  items.sort((a, b) => {
    const idxA = equipmentOrder.indexOf(a.item_equipment_slot_name);
    const idxB = equipmentOrder.indexOf(b.item_equipment_slot_name);
    // 못 찾으면 맨 뒤로 보냄
    return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
  });

  let setEffect = (set && Array.isArray(set.set_info)) ? set.set_info : [];

  grid.innerHTML = `
  <div class="card h-100">
    <div class="card-body">
        <h5 class="card-title">장비 정보</h5>
        <div id="itemGrid" class="item-grid">
        ${items.map(item => renderItemCard(item, jobName)).join('')}
        </div>
    </div>
    <div class="card-body">
        <h5 class="card-title">세트 옵션 정보</h5>
            <ul class="list-group list-group-flush">
            ${setEffect.map(set => `<li class="list-group-item">${set.set_name} ${set.set_count}세트</li>`).join(' ')}
            </ul>
    </div>
  </div>`
}

function renderJewels(jewelData) {
  const wrap = document.getElementById("jewelWrap");
  const btnContainer = document.getElementById("jewelPageBtns");
  const grid = document.getElementById("jewelGrid");
  const setOpt = document.getElementById("jewelSetOption");

  if (!jewelData || !Array.isArray(jewelData.jewel_equipment)) {
    wrap.classList.add("d-none");
    return;
  }

  const pages = jewelData.jewel_equipment;
  const defaultPage = jewelData.use_jewel_page_no || 1;
  let currentPage = defaultPage;

  // 페이지 버튼 만들기
  btnContainer.innerHTML = pages.map(p =>
    `<button type="button" class="btn btn-sm btn-outline-primary ${p.jewel_page_no === currentPage ? 'active' : ''}"
      data-page="${p.jewel_page_no}">
      ${p.jewel_page_no}
    </button>`
  ).join('');

  // 버튼 클릭 시 페이지 전환
  btnContainer.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      currentPage = parseInt(btn.dataset.page, 10);
      btnContainer.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      drawPage(currentPage);
    });
  });

  function drawPage(pageNo) {
    const page = pages.find(p => p.jewel_page_no === pageNo);
    if (!page) return;

    // 보석 렌더링
    grid.innerHTML = page.jewel_info.map(j =>
      `<div class="jewel-card">
         <img src="${j.jewel_icon}" alt="${j.jewel_name}">
         <div class="jewel-card-name">${j.jewel_name}</div>
         <div class="jewel-card-option">${j.jewel_option}</div>
       </div>`
    ).join('');

    // ✅ 세트옵션은 현재 페이지가 기본 페이지일 때만 보이기
    if (pageNo === defaultPage && jewelData.use_jewel_set_option) {
      setOpt.textContent = jewelData.use_jewel_set_option;
      setOpt.classList.remove("d-none");
    } else {
      setOpt.textContent = "";
      setOpt.classList.add("d-none");
    }
  }

  // 처음 페이지 렌더
  drawPage(currentPage);
  wrap.classList.remove("d-none");
}

function renderSymbols(symbolData) {
  const wrap = document.getElementById("symbolWrap");
  const arcaneGrid = document.getElementById("arcaneSymbolGrid");
  const authenticGrid = document.getElementById("authenticSymbolGrid");
  const arcaneBody = document.getElementById("arcaneBody");
  const authenticBody = document.getElementById("authenticBody");

  if (!symbolData || !Array.isArray(symbolData.arcane_symbol) || !Array.isArray(symbolData.authentic_symbol)) {
    wrap.classList.add("d-none");
    return;
  }

  function drawSymbol(grid, body, symbol) {
    if (symbol.length === 0) {
        body.classList.add("d-none");
        return;
    }
    grid.innerHTML = symbol.map(s =>
      `<div class="symbol-card">
         <img src="${s.symbol_icon}" alt="${s.symbol_name}">
         <div class="symbol-card-level">Lv.${s.symbol_level}</div>
       </div>`
    ).join('');
    body.classList.remove("d-none");
  }

  drawSymbol(arcaneGrid, arcaneBody, symbolData.arcane_symbol);
  drawSymbol(authenticGrid, authenticBody, symbolData.authentic_symbol);
  wrap.classList.remove("d-none");
}

// data: 질문에 준 JSON 응답 객체
function renderLinkSkills(data){
  const wrap = document.getElementById('linkSkillsWrap');
  const btns = document.getElementById('linkPresetBtns');
  const grid = document.getElementById('linkGrid');

  if(!data || !Array.isArray(data.link_skill) || data.link_skill.length === 0){
    wrap.classList.add('d-none');
    return;
  }

  const presets = data.link_skill;
  const defaultPreset = data.use_prest_no || presets[0].preset_no;
  let current = defaultPreset;

  // 프리셋 버튼 생성
  btns.innerHTML = presets.map(p =>
    `<button type="button"
             class="btn btn-sm btn-outline-primary ${p.preset_no===current?'preset-active':''}"
             data-preset="${p.preset_no}">프리셋 ${p.preset_no}</button>`
  ).join('');

  // 버튼 이벤트
  btns.querySelectorAll('button').forEach(b=>{
    b.addEventListener('click',()=>{
      current = parseInt(b.dataset.preset,10);
      btns.querySelectorAll('button').forEach(x=>x.classList.remove('preset-active'));
      b.classList.add('preset-active');
      draw(current);
    });
  });

  // 중복 스킬 합산(이름 기준)
  function aggregateSkills(list){
    const map = new Map();
    for(const s of list||[]){
      const key = s.skill_name;
      const prev = map.get(key);
      const lvl = Number(s.skill_level)||0;
      if(prev){
        prev.level += lvl;                 // 레벨 합산
      }else{
        map.set(key, {                     // 첫 항목 저장
          name: s.skill_name,
          level: lvl,
          icon: s.skill_icon || '',
          desc: s.skill_description || '',
          eff:  s.skill_effect || ''
        });
      }
    }
    return Array.from(map.values());
  }

  function draw(presetNo){
    const preset = presets.find(p=>p.preset_no===presetNo);
    if(!preset){ grid.innerHTML=''; return; }

    const agg = aggregateSkills(preset.link_skill_info);
    // 정렬은 자유(예: 이름순). 필요 없으면 제거
    agg.sort((a,b)=>a.name.localeCompare(b.name,'ko'));

    grid.innerHTML = agg.map(s=>`
      <div class="link-card">
        <img src="${s.icon}" alt="${s.name}">
        <div class="link-level">Lv.${s.level}</div>
        <div class="link-name">${s.name}</div>
      </div>
    `).join('');
  }

  // 초기 렌더(기본 프리셋)
  draw(current);
  wrap.classList.remove('d-none');
}

function renderHexaStat(data){
  const wrap = document.getElementById('hexaWrap');
  const btns = document.getElementById('hexaSlotBtns');
  const pagesEl = document.getElementById('hexaPages');

  // 방어: 데이터 없으면 숨김
  if(!data || !Array.isArray(data.hexamatrix_stat)){
    wrap.classList.add('d-none');
    return;
  }

  // 슬롯별 데이터 맵 (slotNo -> stat_info[])
  const slotMap = new Map();
  for(const s of data.hexamatrix_stat){
    slotMap.set(s.stat_core_slot, Array.isArray(s.stat_info) ? s.stat_info : []);
  }

  // 기본 선택 슬롯: 1번에 데이터 있으면 1, 아니면 존재하는 첫 슬롯
  const existingSlots = [...slotMap.keys()].sort((a,b)=>a-b);
  let currentSlot = existingSlots.length ? existingSlots[0] : 1;

  // 슬롯 버튼(1~6) 만들기: 없는 슬롯은 disabled
  btns.innerHTML = Array.from({length:6}, (_,i)=>{
    const n = i+1;
    const has = slotMap.has(n);
    return `<button type="button"
              class="btn btn-sm btn-outline-primary btn-slot ${n===currentSlot?'active':''}"
              data-slot="${n}" ${has?'':'disabled'}>
              슬롯 ${n}
            </button>`;
  }).join('');

  // 버튼 이벤트
  btns.querySelectorAll('.btn-slot').forEach(b=>{
    b.addEventListener('click',()=>{
      if(b.disabled) return;
      currentSlot = parseInt(b.dataset.slot,10);
      btns.querySelectorAll('.btn-slot').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      drawSlot(currentSlot);
    });
  });

  // 페이지 렌더 함수 (좌: page_no=1, 우: page_no=2)
  function drawSlot(slotNo){
    const pages = (slotMap.get(slotNo) || []).slice().sort((a,b)=>a.page_no-b.page_no);
    const page1 = pages.find(p=>p.page_no===1) || null;
    const page2 = pages.find(p=>p.page_no===2) || null;

    pagesEl.innerHTML = `
      ${renderPageCard(1, page1)}
      ${renderPageCard(2, page2)}
    `;
  }

  function renderPageCard(pageNo, p){
    if(!p){
      return `
        <div class="hexa-page">
          <div class="hexa-page-header">
            <span>페이지 ${pageNo}</span>
            <span class="badge-active" style="visibility:hidden">활성</span>
          </div>
          <div class="text-secondary small">데이터가 없습니다.</div>
        </div>
      `;
    }
    const active = p.activate_flag === '1' || p.activate_flag === 1;

    return `
      <div class="hexa-page">
        <div class="hexa-page-header">
          <span>페이지 ${pageNo}</span>
          ${active ? `<span class="badge-active">활성</span>` : `<span class="badge-active" style="opacity:.3">비활성</span>`}
        </div>

        <div class="hexa-row">
          <div class="hexa-label">메인</div>
          <div class="hexa-level">Lv.${p.main_stat_level ?? 0}</div>
          <div class="hexa-text">${p.main_stat || '-'}</div>
        </div>

        <div class="hexa-row">
          <div class="hexa-label">서브1</div>
          <div class="hexa-level">Lv.${p.sub_1_stat_level ?? 0}</div>
          <div class="hexa-text">${p.sub_1_stat || '-'}</div>
        </div>

        <div class="hexa-row">
          <div class="hexa-label">서브2</div>
          <div class="hexa-level">Lv.${p.sub_2_stat_level ?? 0}</div>
          <div class="hexa-text">${p.sub_2_stat || '-'}</div>
        </div>
      </div>
    `;
  }

  // 초기 렌더
  drawSlot(currentSlot);
  wrap.classList.remove('d-none');
}
