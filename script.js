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
        alert('등록된 계 정보가 없습니다. 회원가입을 먼저 완료해 주세요.');
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
