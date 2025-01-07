import cookie from 'cookie';

export async function POST (request: Request) {
    return new Response('success', {
        status: 200,
        headers: {
            'Set-Cookie': cookie.serialize('t_app_use_2', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                expires: new Date(0),
                path: '/',
            }),
        },
    });
};