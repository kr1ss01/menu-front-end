export default interface AuthContextInterface {
    auth: boolean,
    token: string | undefined,
    username: string | undefined,
    fullName: string | undefined,
    image: string | undefined,
    login: (at: string, rt: string) => void,
    logout: () => void,
    handleRt: (rt: string | undefined) => Promise<string>,
    handleChangeImageRaw: (image: string) => void;
};