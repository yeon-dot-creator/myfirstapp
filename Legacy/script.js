/**
 * 페이지 이동 전용 함수
 * @param {string} url - 이동할 페이지 경로
 */
function navigateTo(url) {
    window.location.href = url;
}

/**
 * 로그인 처리 함수
 */
function handleLogin(event) {
    if (event) event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // 로컬 스토리지에서 저장된 데이터 가져오기
    const storedData = localStorage.getItem('userData');

    if (!storedData) {
        alert('등록된 계정 정보가 없습니다. 회원가입을 먼저 완료해 주세요.');
        return;
    }

    const userData = JSON.parse(storedData);

    // 이메일과 비밀번호가 일치하는지 확인
    if (userData.email === email && userData.password === password) {
        alert(`${userData.name}님, 로그인이 완료되었습니다!`);
        // 로그인 상태 유지
        localStorage.setItem('isLoggedIn', 'true');
        navigateTo('welcome.html');
    } else {
        alert('이메일 또는 비밀번호가 틀렸습니다. 다시 확인해 주세요.');
    }
}

/**
 * 회원가입 처리 함수
 */
function handleSignup(event) {
    if (event) event.preventDefault();

    // 데이터 추출
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // 비밀번호 확인 검사
    if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    // 로컬 스토리지에 저장할 객체 생성
    const userData = {
        name: name,
        email: email,
        password: password
    };

    // 로컬 스토리지에 데이터 저장
    localStorage.setItem('userData', JSON.stringify(userData));

    alert(`${name}님, 회원가입이 완료되었습니다! (데이터가 로컬스토리지에 저장되었습니다)`);
    navigateTo('login.html');
}

/**
 * 사용자 정보 출력 함수 (welcome.html용)
 */
function displayUserInfo() {
    const storedData = localStorage.getItem('userData');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!storedData || isLoggedIn !== 'true') {
        alert('로그인이 필요한 페이지입니다.');
        navigateTo('login.html');
        return;
    }

    const userData = JSON.parse(storedData);
    document.getElementById('user-name').textContent = userData.name;
    document.getElementById('user-email').textContent = userData.email;
    document.getElementById('welcome-message').textContent = `${userData.name}님, 다시 만나서 반가워요!`;
}

/**
 * 로그아웃 처리 함수
 */
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    alert('로그아웃되었습니다.');
    navigateTo('index.html');
}

/**
 * 환영 효과 (폭죽 효과) 생성 함수
 */
function createConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.borderRadius = '50%';
        confetti.style.opacity = '1';

        container.appendChild(confetti);

        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;

        confetti.animate([
            { transform: `translateY(-20px) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards'
        });
    }
}

/**
 * 메인 대시보드 로그인 확인 함수
 */
function checkLogin() {
    const storedData = localStorage.getItem('userData');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!storedData || isLoggedIn !== 'true') {
        alert('로그인이 필요한 페이지입니다.');
        navigateTo('login.html');
        return;
    }

    const userData = JSON.parse(storedData);
    document.getElementById('dash-user-name').textContent = userData.name;

    // 저장된 검색 히스토리 렌더링
    renderHistory();
}

/**
 * 각 언론사의 검색 URL 패턴 및 기본 경제 섹션 URL
 */
const newsOutlets = [
    {
        cardId: 'news-card-1',
        name: 'BBC News',
        defaultUrl: 'https://www.bbc.com/news/business',
        searchUrl: 'https://www.bbc.co.uk/search?q='
    },
    {
        cardId: 'news-card-2',
        name: 'NY Times',
        defaultUrl: 'https://www.nytimes.com/section/business',
        searchUrl: 'https://www.nytimes.com/search?query='
    },
    {
        cardId: 'news-card-3',
        name: 'The Guardian',
        defaultUrl: 'https://www.theguardian.com/business',
        searchUrl: 'https://www.theguardian.com/search?q='
    },
    {
        cardId: 'news-card-4',
        name: 'Wall Street Journal',
        defaultUrl: 'https://www.wsj.com/economy',
        searchUrl: 'https://www.wsj.com/search?query='
    },
    {
        cardId: 'news-card-5',
        name: 'Reuters',
        defaultUrl: 'https://www.reuters.com/business/',
        searchUrl: 'https://www.reuters.com/search/news?query='
    },
    {
        cardId: 'news-card-6',
        name: 'Bloomberg',
        defaultUrl: 'https://www.bloomberg.com/economics',
        searchUrl: 'https://www.bloomberg.com/search?query='
    },
    {
        cardId: 'news-card-7',
        name: 'Financial Times',
        defaultUrl: 'https://www.ft.com/global-economy',
        searchUrl: 'https://www.ft.com/search?q='
    },
    {
        cardId: 'news-card-8',
        name: 'CNBC',
        defaultUrl: 'https://www.cnbc.com/economy/',
        searchUrl: 'https://www.cnbc.com/search/?query='
    }
];

// 현재 검색 키워드 저장
let currentKeyword = '';

/**
 * 키워드로 각 언론사 검색 결과 페이지로 링크 업데이트
 */
function searchNews() {
    const keyword = document.getElementById('search-keyword').value.trim();

    if (!keyword) {
        alert('검색할 키워드를 입력해 주세요.');
        return;
    }

    currentKeyword = keyword;
    const encodedKeyword = encodeURIComponent(keyword);

    newsOutlets.forEach(outlet => {
        const card = document.getElementById(outlet.cardId);
        if (!card) return;

        const link = card.querySelector('a');
        if (link) {
            link.href = outlet.searchUrl + encodedKeyword;
            link.textContent = `"${keyword}" 검색`;
        }

        // 카드에 검색 활성화 시각 효과
        card.style.borderColor = '#667eea';
        card.style.borderWidth = '2px';
    });

    // 검색 상태 표시
    const checkedCount = document.querySelectorAll('.outlet-checkbox:checked').length;
    document.getElementById('search-status').textContent = 
        `✅ "${keyword}" 키워드로 ${newsOutlets.length}개 언론사 검색 링크가 업데이트되었습니다. (${checkedCount}개 선택됨)`;

    // 검색 히스토리에 추가
    addToHistory(keyword);

    // 해당 키워드의 저장된 메모 불러오기
    loadNotes(keyword);
}

/**
 * 검색 초기화 — 기본 경제 섹션 링크로 복구
 */
function resetSearch() {
    document.getElementById('search-keyword').value = '';
    currentKeyword = '';

    newsOutlets.forEach(outlet => {
        const card = document.getElementById(outlet.cardId);
        if (!card) return;

        const link = card.querySelector('a');
        if (link) {
            link.href = outlet.defaultUrl;
            link.textContent = '기사 보기';
        }

        // 카드 스타일 원래대로
        card.style.borderColor = 'var(--border-color)';
        card.style.borderWidth = '1px';
    });

    document.getElementById('search-status').textContent = '';

    // 메모 키워드 라벨 숨기기
    document.getElementById('notes-keyword-label').style.display = 'none';
    document.getElementById('comparison-notes').value = '';
    document.getElementById('notes-save-status').textContent = '';
}

/**
 * 선택된 언론사만 새 탭으로 열기
 */
function openSelectedSearch() {
    const keyword = document.getElementById('search-keyword').value.trim();

    if (!keyword) {
        alert('먼저 검색할 키워드를 입력해 주세요.');
        return;
    }

    const encodedKeyword = encodeURIComponent(keyword);
    const checkboxes = document.querySelectorAll('.outlet-checkbox:checked');

    if (checkboxes.length === 0) {
        alert('열고 싶은 언론사를 하나 이상 선택해 주세요.');
        return;
    }

    // 먼저 검색 링크 업데이트
    searchNews();

    let openedCount = 0;
    checkboxes.forEach(cb => {
        const cardId = cb.dataset.card;
        const outlet = newsOutlets.find(o => o.cardId === cardId);
        if (outlet) {
            window.open(outlet.searchUrl + encodedKeyword, '_blank');
            openedCount++;
        }
    });

    document.getElementById('search-status').textContent = 
        `🚀 "${keyword}" 키워드로 ${openedCount}개 언론사 검색 페이지를 열었습니다.`;
}

/**
 * 모든 언론사를 새 탭으로 열기
 */
function openAllSearch() {
    const keyword = document.getElementById('search-keyword').value.trim();

    if (!keyword) {
        alert('먼저 검색할 키워드를 입력해 주세요.');
        return;
    }

    const encodedKeyword = encodeURIComponent(keyword);

    // 먼저 검색 링크 업데이트
    searchNews();

    newsOutlets.forEach(outlet => {
        window.open(outlet.searchUrl + encodedKeyword, '_blank');
    });

    document.getElementById('search-status').textContent = 
        `🌐 "${keyword}" 키워드로 ${newsOutlets.length}개 언론사 검색 페이지를 모두 열었습니다.`;
}

/**
 * 전체 선택 / 해제 토글
 */
function toggleSelectAll(checked) {
    const checkboxes = document.querySelectorAll('.outlet-checkbox');
    checkboxes.forEach(cb => cb.checked = checked);
    updateSelectedCount();
}

/**
 * 선택된 언론사 수 업데이트
 */
function updateSelectedCount() {
    const total = document.querySelectorAll('.outlet-checkbox').length;
    const checked = document.querySelectorAll('.outlet-checkbox:checked').length;
    document.getElementById('selected-count').textContent = `${checked}개 선택됨`;

    // 전체 선택 체크박스 동기화
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = (checked === total);
    }
}

// ===== 검색 히스토리 =====

/**
 * 검색 히스토리에 키워드 추가
 */
function addToHistory(keyword) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');

    // 중복 제거 (같은 키워드가 있으면 제거 후 맨 앞에 추가)
    history = history.filter(item => item !== keyword);
    history.unshift(keyword);

    // 최대 10개까지만 저장
    if (history.length > 10) {
        history = history.slice(0, 10);
    }

    localStorage.setItem('searchHistory', JSON.stringify(history));
    renderHistory();
}

/**
 * 검색 히스토리 렌더링
 */
function renderHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const container = document.getElementById('search-history');
    const section = document.getElementById('search-history-section');

    if (!container || !section) return;

    if (history.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    container.innerHTML = '';

    history.forEach(keyword => {
        const tag = document.createElement('button');
        tag.textContent = keyword;
        tag.style.cssText = 'padding: 0.25rem 0.6rem; border: 1px solid rgba(255,255,255,0.4); border-radius: 1rem; background: rgba(255,255,255,0.15); color: white; font-size: 0.75rem; cursor: pointer; transition: background 0.2s;';
        tag.onmouseover = () => tag.style.background = 'rgba(255,255,255,0.3)';
        tag.onmouseout = () => tag.style.background = 'rgba(255,255,255,0.15)';
        tag.onclick = () => {
            document.getElementById('search-keyword').value = keyword;
            searchNews();
        };
        container.appendChild(tag);
    });

    // 히스토리 전체 삭제 버튼
    const clearBtn = document.createElement('button');
    clearBtn.textContent = '✕';
    clearBtn.title = '히스토리 전체 삭제';
    clearBtn.style.cssText = 'padding: 0.25rem 0.5rem; border: none; border-radius: 1rem; background: rgba(255,100,100,0.3); color: white; font-size: 0.7rem; cursor: pointer; transition: background 0.2s;';
    clearBtn.onmouseover = () => clearBtn.style.background = 'rgba(255,100,100,0.5)';
    clearBtn.onmouseout = () => clearBtn.style.background = 'rgba(255,100,100,0.3)';
    clearBtn.onclick = () => {
        localStorage.removeItem('searchHistory');
        renderHistory();
    };
    container.appendChild(clearBtn);
}

// ===== 비교 메모장 =====

/**
 * 메모 저장 (키워드별로 localStorage에 저장)
 */
function saveNotes() {
    const notes = document.getElementById('comparison-notes').value;
    const keyword = currentKeyword || '_general';

    let allNotes = JSON.parse(localStorage.getItem('comparisonNotes') || '{}');
    allNotes[keyword] = notes;
    localStorage.setItem('comparisonNotes', JSON.stringify(allNotes));

    const statusEl = document.getElementById('notes-save-status');
    const now = new Date().toLocaleTimeString('ko-KR');
    statusEl.textContent = `✅ 저장 완료 (${now})`;

    // 2초 후 상태 메시지 제거
    setTimeout(() => { statusEl.textContent = ''; }, 2000);
}

/**
 * 메모 불러오기 (키워드별)
 */
function loadNotes(keyword) {
    const allNotes = JSON.parse(localStorage.getItem('comparisonNotes') || '{}');
    const notes = allNotes[keyword] || '';
    
    document.getElementById('comparison-notes').value = notes;

    // 키워드 라벨 표시
    const label = document.getElementById('notes-keyword-label');
    const keywordSpan = document.getElementById('notes-current-keyword');
    if (label && keywordSpan) {
        label.style.display = 'block';
        keywordSpan.textContent = `🔍 ${keyword}`;
    }

    document.getElementById('notes-save-status').textContent = '';
}

/**
 * 현재 메모 지우기
 */
function clearNotes() {
    if (!confirm('현재 메모를 지우시겠습니까?')) return;

    document.getElementById('comparison-notes').value = '';

    const keyword = currentKeyword || '_general';
    let allNotes = JSON.parse(localStorage.getItem('comparisonNotes') || '{}');
    delete allNotes[keyword];
    localStorage.setItem('comparisonNotes', JSON.stringify(allNotes));

    document.getElementById('notes-save-status').textContent = '🗑️ 메모가 삭제되었습니다.';
    setTimeout(() => { document.getElementById('notes-save-status').textContent = ''; }, 2000);
}
