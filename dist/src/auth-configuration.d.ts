export declare enum NavigationMode {
    SilentOnly = 0,
    Redirect = 1,
}
export declare class AuthConfiguration {
    constructor();
    authorityUrl: string;
    enableSilentTokenRenewal: boolean;
    enableSessionCheck: boolean;
    sessionCheckIntervalInSeconds: number;
    silentTokenRenewalIntervalInSeconds: number;
    clientId: string;
    scopes: string[];
    navigationMode: NavigationMode;
    redirectUrl: string;
    postLogoutRedirectUri: string;
    storage: Storage;
    isValid(): boolean;
    getWellKnownEndpointsUrl(): string;
    private validateString(validatedValue, errorMsg);
}
