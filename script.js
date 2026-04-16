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
