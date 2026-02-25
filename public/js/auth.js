/**
 * 인증(로그인, 회원가입) 흐름을 담당하는 모듈
 */

const auth = {
    /**
     * 로그인 폼 제출 처리
     */
    handleLogin: async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorBox = document.getElementById('loginError');

        // 초기화
        if (errorBox) {
            errorBox.style.display = 'none';
            errorBox.innerText = '';
        }

        try {
            const response = await api.request('/api/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            if (response && response.ok) {
                const data = await response.json();
                api.saveTokens(data.accessToken, data.refreshToken);
                location.href = '/index.html';
            } else {
                const errorData = await response.json().catch(() => ({}));
                const message = errorData.message || '로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.';

                if (errorBox) {
                    errorBox.innerText = message;
                    errorBox.style.display = 'block';
                } else {
                    alert(message);
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            const msg = '서버와 통신하는 중 오류가 발생했습니다.';
            if (errorBox) {
                errorBox.innerText = msg;
                errorBox.style.display = 'block';
            } else {
                alert(msg);
            }
        }
    },

    /**
     * 회원가입 폼 제출 처리
     */
    handleSignup: async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;

        if (password !== passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await api.request('/api/signup', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, passwordConfirm })
            });

            if (response && (response.status === 201 || response.ok)) {
                alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
                location.href = '/login.html';
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(errorData.message || '회원가입에 실패했습니다.');
            }
        } catch (err) {
            console.error('Signup error:', err);
            alert('서버와 통신하는 중 오류가 발생했습니다.');
        }
    }
};

// 전역 등록
window.auth = auth;
