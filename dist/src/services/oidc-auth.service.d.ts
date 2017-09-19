import { EventEmitter } from '@angular/core';
import { AuthConfiguration } from '../auth-configuration';
import { Observable } from 'rxjs/Observable';
import { WellKnownEndpointsService } from './well-known-endpoints.service';
export declare class OidcAuthService {
    private wellKnownEndpointsService;
    constructor(wellKnownEndpointsService: WellKnownEndpointsService);
    setupComplete: EventEmitter<any>;
    setup(config: AuthConfiguration): void;
    tokenExpired: Observable<void>;
    isAuthorized: Observable<boolean>;
    getToken(): string;
    addAuthHeaders(): void;
    private parseTokenFromLocation();
    private parseTokenFromHash(hash);
    private parseHash(hash);
}
