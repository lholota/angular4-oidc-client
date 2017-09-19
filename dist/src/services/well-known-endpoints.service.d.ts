import { EventEmitter } from '@angular/core';
import { AuthConfiguration } from '../auth-configuration';
import { Http } from '@angular/http';
import { OidcAuthStorage } from './oidc-auth-storage.service';
export declare class WellKnownEndpointsService {
    private authConfig;
    private http;
    private storage;
    private endpoints;
    constructor(authConfig: AuthConfiguration, http: Http, storage: OidcAuthStorage);
    onWellKnownEndpointsLoaded: EventEmitter<any>;
    ensureEndpoints(): void;
    private fetchEndpoints();
}
export declare class WellKnownEndpoints {
    authorizationEndpointUri: string;
}
