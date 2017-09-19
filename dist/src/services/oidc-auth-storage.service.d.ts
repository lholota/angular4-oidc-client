import { AuthConfiguration } from '../auth-configuration';
import { WellKnownEndpoints } from './well-known-endpoints.service';
export declare class OidcAuthStorage {
    private authConfig;
    private wellKnownEndpointsKey;
    constructor(authConfig: AuthConfiguration);
    getWellKnownEndpoints(): WellKnownEndpoints | undefined;
    setWellKnownEndpoints(value: WellKnownEndpoints): void;
}
