import { Injectable, Output, EventEmitter } from '@angular/core';
import { SilentFetchBase } from './silent-fetch-base.service';
import { AuthConfiguration } from '../auth-configuration';
import { Http } from '@angular/http';
import { OidcAuthStorage } from './oidc-auth-storage.service';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WellKnownEndpointsService {

    private endpoints: WellKnownEndpoints;

    constructor(private authConfig: AuthConfiguration, private http: Http, private storage: OidcAuthStorage) {
    }

    @Output() onWellKnownEndpointsLoaded: EventEmitter<any> = new EventEmitter<any>(true);    

    public ensureEndpoints() : void {
        var storageValue = this.storage.getWellKnownEndpoints();
        
        if(!storageValue) {
            console.debug("Fetching endpoints from the server " + this.authConfig.getWellKnownEndpointsUrl() + ".");
            this.fetchEndpoints();
        }
        else {
            console.debug("Loading endpoints from the storage.")
            this.endpoints = storageValue;
            this.onWellKnownEndpointsLoaded.emit();
        }
    }

    private fetchEndpoints() : void {
        this.http.get(this.authConfig.getWellKnownEndpointsUrl()).subscribe((data) => {
            var jsonResponse = data.json();
            var parsed = new WellKnownEndpoints();
            parsed.authorizationEndpointUri = jsonResponse.authorization_endpoint;

            this.endpoints = parsed;
            this.storage.setWellKnownEndpoints(this.endpoints);
            
            this.onWellKnownEndpointsLoaded.emit();
        });
    }
}

export class WellKnownEndpoints {
    public authorizationEndpointUri : string;
}