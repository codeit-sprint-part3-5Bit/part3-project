import React, { useState, useEffect } from "react";
import { ErrorText } from "@/types/login/types";
import { postLogin } from "@/apis/login/login";
import { setToken } from "@/utils/token/token";
import { setItem } from "@/utils/localStorage/localStorage";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import AuthInput from "../common/authInput";
import AuthButton from "../common/authButton";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const router = useRouter();
  const { setAccessToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // 이메일 유효성 검사
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 비밀번호 유효성 검사 (대소문자 요구 제거)
  const isValidPassword = (password: string) => {
    // 최소 8자 이상, 숫자 및 특수문자 포함
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleLoginSuccess = async () => {
    setLoading(true);
    try {
      const res = await postLogin({ email, password });
      const userData = res.data;

      // 클라이언트에서만 로컬 스토리지에 접근
      if (typeof window !== "undefined") {
        setToken(userData.accessToken); // 액세스 토큰 저장
        setItem("refreshToken", userData.refreshToken); // 리프레시 토큰 저장
      }

      setAccessToken(userData.accessTocken);

      router.push("/");
    } catch (err) {
      const error = err as AxiosError;

      if (error.response) {
        const errorMessage =
          typeof error.response.data === "string"
            ? error.response.data
            : "알 수 없는 오류가 발생했습니다.";
        setEmailError(errorMessage);
      } else if (error.request) {
        setEmailError(
          "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요."
        );
      } else {
        setEmailError("로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    let valid = true;

    // 이메일 유효성 검사
    if (!email) {
      setEmailError(ErrorText.EmailRequired);
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("유효한 이메일 주소를 입력해주세요.");
      valid = false;
    } else {
      setEmailError("");
    }

    // 비밀번호 유효성 검사 (대소문자 요구 제거)
    if (!password) {
      setPasswordError(ErrorText.PasswordRequired);
      valid = false;
    } else if (!isValidPassword(password)) {
      setPasswordError(
        "비밀번호는 최소 8자 이상, 숫자 및 특수 문자를 포함해야 합니다."
      );
      valid = false;
    } else {
      setPasswordError("");
    }

    if (valid) {
      await handleLoginSuccess();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center mb-4">로그인</h2>
        <AuthInput
          label="이메일"
          id="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          errorText={emailError}
        />
        <AuthInput
          label="비밀번호"
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          errorText={passwordError}
        />
        <AuthButton
          label="로그인"
          type="submit"
          onClick={handleLogin}
          loading={loading}
        />
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/register")}
            className="text-sm text-blue-500 hover:underline"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
