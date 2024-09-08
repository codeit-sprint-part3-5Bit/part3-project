let accessToken = '';

export const setToken = (token: string) => {
  accessToken = token;
  localStorage.setItem('accessToken', token); // 로컬 스토리지에 accessToken 저장
};

export const getTokens = () => {
  const refreshToken = localStorage.getItem('refreshToken'); // 로컬 스토리지에서 refreshToken 가져오기
  return { accessToken, refreshToken };
};