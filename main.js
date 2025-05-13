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

    const basicCard = document.getElementById("basicCard");
    const statCard = document.getElementById("statCard");
    const itemCard = document.getElementById("itemCard");
    const vmatrixCard = document.getElementById("vmatrixCard");

    // 하위 카드 초기화
    basicCard.innerHTML = "";
    statCard.innerHTML = "";
    itemCard.innerHTML = "";
    vmatrixCard.innerHTML = "";

    if (!world || !nickname || !apiKey) {
    vmatrixCard.innerHTML = '<div class="alert alert-warning">모든 필드를 입력해주세요.</div>';
    return;
    }

    vmatrixCard.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';

    try {
    const ocidResponse = await fetch(`https://open.api.nexon.com/maplestorym/v1/id?character_name=${encodeURIComponent(nickname)}&world_name=${encodeURIComponent(world)}`, {
        headers: { 'x-nxopen-api-key': apiKey }
    });
    const ocidData = await ocidResponse.json();
    const ocid = ocidData.ocid;

    const endpoints = ['guild', 'basic', 'stat', 'item-equipment', 'vmatrix'];
    let guildName = '';
    let characterJob = '';

    let enhancementMap = {};

    for (const endpoint of endpoints) {
        const res = await fetch(`https://open.api.nexon.com/maplestorym/v1/character/${endpoint}?ocid=${ocid}`, {
        headers: { 'x-nxopen-api-key': apiKey }
        });
        const data = await res.json();

        if (endpoint === 'guild') {
        guildName = data.guild_name || '';
        }

        if (endpoint === 'basic') {
        characterJob = data.character_class || data.character_job_name || '';
        const genderKo = data.character_gender === 'Male' ? '남' : data.character_gender === 'Female' ? '여' : data.character_gender;
        const formattedExp = `${formatNumber(data.character_exp)} ${formatKoreanExp(data.character_exp)}`;
        basicCard.innerHTML = `
            <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">기본 정보</h5>
                <h6 class="fs-5 fw-semibold ms-2 mb-0">${data.character_name}</h6>
                <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <img src="images/world/${data.world_name}.png" alt="${data.world_name}" class="world-icon">
                    ${data.world_name} | Lv.${data.character_level} | ${data.character_job_name}${guildName ? ` | ${guildName}` : ''}
                </li>
                <li class="list-group-item">성별 : ${genderKo}</li>
                <li class="list-group-item">생성일: ${formatDate(data.character_date_create)}</li>
                <li class="list-group-item">경험치: ${formattedExp}</li>
                <li class="list-group-item">최근 접속 시간: ${formatDate(data.character_date_last_login)}</li>
                <li class="list-group-item">최근 접속종료 시간: ${formatDate(data.character_date_last_logout)}</li>
                </ul>
            </div>
            </div>
        `;
        }

        else if (endpoint === 'stat') {
        statCard.innerHTML = `
            <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">스탯 정보</h5>
                <ul class="list-group list-group-flush">
                ${data.stat.map(stat => `<li class="list-group-item">${stat.stat_name} : ${formatNumber(stat.stat_value)}</li>`).join('')}
                </ul>
            </div>
            </div>
        `;
        }

        else if (endpoint === 'item-equipment') {
        itemCard.innerHTML = `
            <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">주요 장비 세트</h5>
                <ul class="list-group list-group-flush">
                ${getEquipmentSet(data.item_equipment).filter(data => data.setCounts > 0).map(equipment => `<li class="list-group-item">${equipment.setName} ${equipment.setCounts}세트</li>`).join('')}
                </ul>
            </div>
            </div>
        `;
        }

        else if (endpoint === 'vmatrix') {
        const cores = data.character_v_core_equipment;
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
        }

        await delay(300);

        document.getElementById("screenshotBtnContainer").style.display = "block";
    }

    } catch (error) {
    document.getElementById("vmatrixCard").innerHTML = '<div class="alert alert-danger">캐릭터 정보를 불러오지 못했습니다.</div>';
    console.error(error);
    }
}

function getEquipmentSet(data) {
    let setOption = [
    {
        setName: '아케인셰이드',
        setCounts: 0
    },
    {
        setName: '앱솔랩스',
        setCounts: 0
    },
    {
        setName: '칠흑의 보스',
        setCounts: 0
    },
    {
        setName: '군단장 전리품',
        setCounts: 0
    }
    ];

    const bossOfDarkness = [
    "루즈 컨트롤 머신 마크", "마력이 깃든 안대", "몽환의 벨트",
    "저주받은 적의 마도서", "저주받은 청의 마도서", "거대한 공포",
    "고통의 근원", "커맨더 포스 이어링", "창세의 뱃지"
    ];

    const commanderReward = [
    "카오스 영생의 돌", "영생의 돌", "지옥의 불꽃",
    "고귀한 이피아의 반지", "검은 노바의 휘장", "폭군의 위상",
    "매커네이터 펜던트", "도미네이터 펜던트"
    ];

    console.log(data);

    data.filter(data => data.item_name).forEach(({ item_name }) => {
    if (item_name.startsWith("아케인셰이드")) {
        setOption[setOption.findIndex(set => set.setName === "아케인셰이드")].setCounts++;
    } else if (item_name.startsWith("앱솔랩스")) {
        setOption[setOption.findIndex(set => set.setName === "앱솔랩스")].setCounts++;
    } else if (bossOfDarkness.some(item => item_name.startsWith(item))) {
        setOption[setOption.findIndex(set => set.setName === "칠흑의 보스")].setCounts++;
    } else if (commanderReward.some(item => item_name.startsWith(item))) {
        setOption[setOption.findIndex(set => set.setName === "군단장 전리품")].setCounts++;
    }
    });

    return setOption;
}

function getJobDetail(job) {
    const detail = [];
    const categoryMap = [
    { group: ['히어로', '팔라딘', '다크나이트', '비숍', '아크메이지(불,독)', '아크메이지(썬,콜)', '보우마스터', '신궁', '패스파인더', '나이트로드', '섀도어', '듀얼블레이드', '캡틴', '바이퍼', '캐논슈터'], tag: '모험가' },
    { group: ['소울마스터', '미하일', '플레임위자드', '윈드브레이커', '나이트워커', '스트라이커'], tag: '시그너스기사단' },
    { group: ['아란', '에반', '메르세데스', '팬텀', '루미너스', '은월'], tag: '영웅' },
    { group: ['블래스터', '배틀메이지', '와일드헌터', '제논', '메카닉'], tag: '레지스탕스' },
    { group: ['데몬슬레이어', '데몬어벤져'], tag: '데몬' },
    { group: ['카이저', '카데나', '카인', '엔젤릭버스터'], tag: '노바' },
    { group: ['아델', '일리움', '칼리', '아크'], tag: '레프' },
    { group: ['라라', '호영'], tag: '아니마' },
    { group: ['제로'], tag: '초월자' },
    { group: ['키네시스'], tag: '프렌즈 월드' },
    { group: ['에릴', '시아'], tag: '샤인'}
    ];
    const classMap = [
    { group: ['히어로', '팔라딘', '다크나이트', '소울마스터', '미하일', '블래스터', '데몬슬레이어', '데몬어벤져', '아란', '카이저', '아델', '제로', '에릴'], tag: '전사' },
    { group: ['비숍', '아크메이지(불,독)', '아크메이지(썬,콜)', '플레임위자드', '에반', '루미너스', '배틀메이지', '일리움', '라라', '키네시스', '시아'], tag: '마법사' },
    { group: ['보우마스터', '신궁', '패스파인더', '윈드브레이커', '메르세데스', '와일드헌터', '카인'], tag: '궁수' },
    { group: ['나이트로드', '섀도어', '듀얼블레이드', '나이트워커', '팬텀', '카데나', '칼리', '호영', '제논'], tag: '도적' },
    { group: ['캡틴', '바이퍼', '캐논슈터', '스트라이커', '은월', '메카닉', '엔젤릭버스터', '아크', '제논'], tag: '해적' }
    ];
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

// function downloadResultImage() {
//     const result = document.getElementById('result');
//     if (!result) {
//         alert("저장할 결과가 없습니다.");
//         return;
//     }

//     html2canvas(document.getElementById('result'), {
//         width: 1280,
//         height: document.getElementById('result').scrollHeight,
//         scale: 2,        // 해상도 향상
//         useCORS: true,
//         windowWidth: 1280 // 레이아웃 계산에 필요
//     }).then(canvas => {
//         const link = document.createElement('a');
//         link.download = 'character_result.png';
//         link.href = canvas.toDataURL();
//         link.click();
//     });
// }

async function downloadResultImage() {
  const original = document.getElementById("result");

  if (!original) {
    alert("결과 영역이 없습니다.");
    return;
  }

  // 캡처용 클론 생성
  const clone = original.cloneNode(true);
  clone.classList.add("screenshot-mode");

  // 캡처용 스타일 삽입
  const style = document.createElement("style");
  style.textContent = `
    .screenshot-mode {
        width: 1280px !important;
        font-size: 16px;
        background: white;
        padding: 24px;
        box-sizing: border-box;
    }

    .screenshot-mode .row {
        display: flex !important;
        flex-wrap: nowrap !important;
    }

    .screenshot-mode .col-md-4,
    .screenshot-mode .col-md-6,
    .screenshot-mode .col-md-12 {
        width: auto !important;
        flex: 1 1 0% !important;
        max-width: unset !important;
    }

    .screenshot-mode #screenshotButton {
      display: none !important;
    }

    .screenshot-mode footer {
      display: block !important;
    }
  `;
  clone.prepend(style);

  // 캡처 컨테이너 생성
  const wrapper = document.createElement("div");
  wrapper.style.width = "1280px";  // 고정
  wrapper.style.transform = "scale(1)";
  wrapper.style.transformOrigin = "top left";
  wrapper.style.position = "fixed";
  wrapper.style.top = "-10000px"; // 화면 밖으로
  wrapper.style.left = "0";
  wrapper.style.zIndex = "-1";
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    const canvas = await html2canvas(clone, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        width: 1280,
        windowWidth: 1280  // 이것도 꼭 지정
    });

    const dataURL = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "character_result.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error("스크린샷 생성 오류:", error);
    alert("스크린샷 생성 중 문제가 발생했습니다.");
  } finally {
    document.body.removeChild(wrapper); // 정리
  }
}