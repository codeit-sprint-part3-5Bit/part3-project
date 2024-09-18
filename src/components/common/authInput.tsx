import React from "react";

interface InputProps {
    label: string;
    id: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    errorText?: string; // 에러 메시지를 받을 수 있도록 추가
}

const AuthInput: React.FC<InputProps> = ({ label, id, type, value, onChange, onKeyPress, errorText }) => {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
            <input 
                type={type} 
                id={id} 
                value={value} 
                onChange={onChange} 
                onKeyPress={onKeyPress} 
                className={`w-full border px-4 py-2 bg-gray-100 rounded-lg placeholder:text-[14px] ${errorText ? 'border-red-500' : 'border-gray-300'}`}
                required 
            />
            {errorText && <p className="mt-1 text-sm text-red-600">{errorText}</p>} {/* 에러 메시지 출력 */}
        </div>
    );
};

export default AuthInput;