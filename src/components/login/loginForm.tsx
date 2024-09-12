import React, { useState } from 'react';
import { ErrorText } from '@/types/login/types';
import { postLogin } from '@/apis/login/login';
import { setToken } from '@/utils/token/token';
import { setItem } from '@/utils/localStorage/localStorage';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import AuthInput from '../common/authInput';
import AuthButton from '../common/authButton';

const LoginForm = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorText, setErrorText] = useState('');
    const [loading, setLoading] = useState(false); // 로딩 상태 추가

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleLoginSuccess = async () => {
        setLoading(true); // 로그인 요청 시작
        try {
            const res = await postLogin({ email, password });
            const userData = res.data;
            const userInfo = {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                teamId: userData.teamId,
                updatedAt: userData.updatedAt,
                createdAt: userData.createdAt,
                profile: {
                    id: userData.profile.id,
                    code: userData.profile.code,
                }
            };
            console.log('userInfo', userInfo);
            setToken(userData.accessToken);
            setItem('refreshToken', userData.refreshToken);

            // 메인 페이지로 리다이렉트
            router.push('/');
        } catch (err) {
            const error = err as AxiosError;

            if (error.response) {
                // 서버 응답 에러 처리
                const errorMessage = typeof error.response.data === 'string' 
                    ? error.response.data 
                    : '알 수 없는 오류가 발생했습니다.';
                setErrorText(errorMessage);
            } else if (error.request) {
                // 네트워크 오류 (요청을 보냈으나 응답을 받지 못함)
                setErrorText('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
            } else {
                // 기타 오류
                setErrorText('로그인 중 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false); // 요청 완료 후 로딩 상태 해제
        }
    };

    const handleLogin = async () => {
        if (!email) {
            setErrorText(ErrorText.EmailRequired);
        } else if (!password) {
            setErrorText(ErrorText.PasswordRequired);
        } else {
            setErrorText(''); // 이전 오류 메시지 초기화
            await handleLoginSuccess(); // 로그인 시도
        }
    };

    // const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (event.key === 'Enter') {
    //         handleLogin();
    //     }
    // };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold text-center mb-4">로그인</h2>
            <AuthInput 
                label="이메일" 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
            />
            <AuthInput 
                label="비밀번호" 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
            />
            <AuthButton 
                label="로그인" 
                type='submit'
                onClick={handleLogin} 
                loading={loading}
            />
            {errorText && <div className="mt-2 text-red-600 text-sm">{errorText}</div>}
        </div>
    );
};
export default LoginForm;
