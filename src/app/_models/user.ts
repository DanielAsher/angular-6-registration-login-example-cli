
export interface TokenData {
    app_id: string;
    identity: string;
    access: string[];
    salt: string;
    expires: number;
    path: string;
    sync_label: string;
}

export interface AccessToken {
    token: string;
    token_data: TokenData;
}

export interface User {
    access_token: AccessToken;
    username: string;
    password: string;
}