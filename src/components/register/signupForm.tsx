import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { BASE_URL } from "@/apis/base";
import AuthInput from "../common/authInput";
import AuthButton from "../common/authButton";

const SignupForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmationError, setConfirmationError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setConfirmationError("");
    setSuccess("");
    setLoading(true);

    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("유효한 이메일 주소를 입력하세요.");
      isValid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "비밀번호는 최소 8자 이상이어야 하며, 숫자와 특수문자를 포함해야 합니다."
      );
      isValid = false;
    }

    if (password !== passwordConfirmation) {
      setConfirmationError("비밀번호가 일치하지 않습니다.");
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/signup`, {
        email,
        name,
        password,
        passwordConfirmation,
      });

      setSuccess("회원가입이 완료되었습니다!");
      console.log(response.data);

      // 회원가입 성공 후 로그인 페이지로 이동
      router.push("/login");
    } catch (err) {
      setConfirmationError("회원가입에 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-4">회원가입</h2>

      <AuthInput
        label="이메일"
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {emailError && <p className="text-red-500">{emailError}</p>}

      <AuthInput
        label="이름"
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <AuthInput
        label="비밀번호"
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {passwordError && <p className="text-red-500">{passwordError}</p>}

      <AuthInput
        label="비밀번호 확인"
        id="passwordConfirmation"
        type="password"
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
      />
      {confirmationError && <p className="text-red-500">{confirmationError}</p>}

      <AuthButton
        label="회원가입"
        onClick={handleSubmit}
        loading={loading}
        type="submit"
      />
      <div className="mt-4 text-center">
        <label className="text-sm">이미 회원이신가요? </label>
        <button
          onClick={() => router.push("/login")}
          className="text-sm text-green-200 hover:underline"
        >
          로그인하기
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
