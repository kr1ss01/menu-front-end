export default interface SafeUser {
    username: string;
    fullName: string;
    image?: Buffer;
};

export interface OwnUser {
    email: string;
    pwdChange: string;
    auth: boolean;
    name: string;
};

export interface InfoUser {
    username: string;
    fullName: string;
    image: Buffer;
    imageMimeType: string;
}