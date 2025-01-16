// import cookie from 'cookie';
import * as cookie from 'cookie';

export async function POST (request: Request) {
    const res = await request.json();

    return new Response('success', {
        status: 200,
        headers: { 
            'Set-Cookie': cookie.serialize('t_app_use_2', res.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                path: '/',
            }),
        },
    });
};