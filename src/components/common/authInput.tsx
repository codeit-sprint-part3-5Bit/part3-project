import React from "react";

interface InputProps {
    label: string,
    id: string,
    type: string,
    value: string,
    onChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress?: (e:React.KeyboardEvent<HTMLInputElement>) => void;
}

const AuthInput: React.FC<InputProps> = ({ label, id, type, value, onChange, onKeyPress }) => {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="mb-3 block text-sm font-medium text-gray-700">{label}</label>
            <input 
                type={type} 
                id={id} 
                value={value} 
                onChange={onChange} 
                onKeyPress={onKeyPress} 
                 className="w-full border-none px-4 bg-gray-100 rounded-lg placeholder:text-[14px]"
                required 
            />
        </div>
    );
};

export default AuthInput;