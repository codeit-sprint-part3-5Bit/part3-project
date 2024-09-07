export interface LoginUserProps {
    email: string;
    password: string;
}

export enum ErrorText {
    EmailRequired = '이메일을 확인해주세요.',
    PasswordRequired = '비밀번호를 확인해주세요.',
    LoginFailed = '이메일 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.',
}