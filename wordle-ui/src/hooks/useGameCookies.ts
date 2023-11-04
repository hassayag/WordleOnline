import { useCookies } from "react-cookie";

export const useGameCookies = () => {
    const [cookies, setCookie] = useCookies(['session', 'game']);

    const cookieConfig =  { 
        path: '/', 
        secure: true, 
        domain: '',
        sameSite: 'none' as any,
        httpOnly: true
    }

    const setSessionCookie = (token: string) => {
        setCookie('session', token, cookieConfig);
    }

    const setGameCookie = (token: string) => {
        setCookie('game', token, cookieConfig);
    }

    return {
        sessionCookie: cookies.session,
        setSessionCookie,
        gameCookie: cookies.game,
        setGameCookie
    }
}
