import { Button } from "flowbite-react";
import React from "react";

interface ButtonProps {
    label: string;
    onClick?: () => void;
    loading?: boolean;
    type: string;
}

const AuthButton: React.FC<ButtonProps> = ({ label, onClick, loading = false }) => {
    return (
        <div className="flex justify-end mt-6">
            <Button 
                onClick={onClick} 
                className={`w-full py-1 bg-green-200 hover:bg-green-300 text-white font-semibold rounded-md transition duration-200 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-200 hover:bg-green-300'}`}
                disabled={loading} // 로딩 중에는 버튼 비활성화
            >
                {loading ? '처리 중...' : label}
            </Button>
        </div>
    );
};

export default AuthButton;