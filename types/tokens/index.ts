export enum Token {
    RefreshTokenCookie = 't_app_use',
    AccessTokenCookieHTTPS = 't_app_use_2',
};

export default interface JWTResponseType {
    refresh_token: string;
    access_token: string;
};