export type UserType = {
    jwt_nonce: string
    jwt_csrf: string
    captcha_token: string
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    username: string;
    password: string;
    [key: string]: string;
}