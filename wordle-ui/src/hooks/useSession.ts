import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import SessionService from '@/services/session-service';

export const useSession = () => {
    const [cookies, setCookie] = useCookies(['session', 'game']);

    useEffect(() => {
        if (!cookies.session || cookies.session === 'undefined') {
            SessionService.createSession()
            .then((session) =>
                setSessionCookie(session.session_token)
            )
            .catch((err) => console.error(`Failed to get session - ${err}`))
        }
    },[])

    const cookieConfig = {
        path: '/',
        secure: true,
    };

    const setSessionCookie = (token: string) => {
        setCookie('session', token, cookieConfig);
    };

    const setGameCookie = (token: string) => {
        setCookie('game', token, cookieConfig);
    };

    return {
        sessionCookie: cookies.session as string,
        setSessionCookie,
        gameCookie: cookies.game as string,
        setGameCookie,
    };
};
