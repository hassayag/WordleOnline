import config from '@/config/config';
import { useCookies } from "react-cookie";

export const useGameCookies = () => {
    const [cookies, setCookie] = useCookies(['session', 'game']);

    const setSessionCookie = (token: string) => {
        setCookie('session', token, { path: '/', secure: true, domain: config.api.host});
    }

    const setGameCookie = (token: string) => {
        setCookie('game', token, { path: '/', secure: true, domain: config.api.host });
    }

    return {
        sessionCookie: cookies.session,
        setSessionCookie,
        gameCookie: cookies.game,
        setGameCookie
    }
}
