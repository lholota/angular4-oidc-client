import { Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'
import { SilentFetchBase } from './silent-fetch-base.service';
import { AuthConfiguration } from '../auth-configuration';
import { WellKnownEndpoints } from './well-known-endpoints.service';

@Injectable()
export class OidcAuthStorage {
    private wellKnownEndpointsKey : string = "";

    constructor(private authConfig: AuthConfiguration) {
    }

    getWellKnownEndpoints(): WellKnownEndpoints | undefined {
        if(!isPlatformBrowser)
        {
            return;
        }

        var storageValue = this.authConfig.storage.getItem(this.wellKnownEndpointsKey);
        
        if(!storageValue || storageValue == undefined)
        {
            return;
        }

        var obj = JSON.parse(storageValue);
        var result = obj as WellKnownEndpoints;

        return result;
    }
    
    setWellKnownEndpoints(value:WellKnownEndpoints) {
        var str = JSON.stringify(value);
        this.authConfig.storage.setItem(this.wellKnownEndpointsKey, str);
    }
}