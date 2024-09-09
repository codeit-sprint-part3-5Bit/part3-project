import { setToken } from "./token";
import { postMemberRefresh } from "@/apis/login/login";
import { getItem, setItem } from "../localStorage/localStorage";


const renewTokens = async () => {
    const refreshToken = getItem('refreshToken');
    if(refreshToken) {
        const response = await postMemberRefresh(refreshToken);

        const newAccessToken = response.accessToken;
        const newRefreshToken = response.refreshToken;

        setToken(newAccessToken);
        setItem('refreshToken', newRefreshToken);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } else {
        console.error("refreshToken이 없습니다.");
    }
};

export default renewTokens;