import { Injectable, EventEmitter, Output } from '@angular/core';
import { AuthConfiguration } from '../auth-configuration';
import { Observable } from 'rxjs/Observable';
import { WellKnownEndpointsService } from './well-known-endpoints.service';
import { isPlatformBrowser } from '@angular/common'

@Injectable()
export class OidcAuthService {

    constructor(private wellKnownEndpointsService: WellKnownEndpointsService) {
    }

    @Output() setupComplete: EventEmitter<any> = new EventEmitter<any>(true);    

    public setup(config : AuthConfiguration) {

        if(config == undefined) {
            console.error("The configuration is null/undefined.");
        }

        if(!config.isValid()){
            console.error("The configuration is invalid, please fix the errors above.");
        }

        this.wellKnownEndpointsService.onWellKnownEndpointsLoaded.subscribe(() => {
            // Continue setup in here when the endpoints have been loaded

            /*
            Usecases
                -> page is first load -> fetch token silently or redirect
                -> page reload -> token in storage (no need to wait...)
                -> page is a return from the authentication -> parse the tokens from the hash part of the url (no need to wait...)
                -> start background stuff (has to wait)
                    -> session-check
                    -> token renewal
            */

            this.setupComplete.emit();
        });

        this.wellKnownEndpointsService.ensureEndpoints();
    }

    public tokenExpired : Observable<void>;
    public isAuthorized : Observable<boolean>;

    public getToken() : string{
        return "";
    }

    public addAuthHeaders(/*options args*/) : void {

    }

    private parseTokenFromLocation() : boolean {
        if(!isPlatformBrowser || !window.location.hash){
            return false;
        }

        return this.parseTokenFromHash(window.location.hash);
    }

    private parseTokenFromHash(hash: string) : boolean {
        if(!isPlatformBrowser || !window.location.hash){
            return false;
        }

        var parsed = this.parseHash(window.location.hash);
        // If token(s) are found and are valid, save them to storage and

        return true;
    }

    private parseHash(hash: string) : any {
        let result: any = hash.substr(1).split('&').reduce(function (result: any, item: string) {
            let parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});
    }
}