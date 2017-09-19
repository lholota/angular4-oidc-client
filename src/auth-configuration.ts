import { Injectable } from '@angular/core';

export enum NavigationMode {
    SilentOnly,
    Redirect
}

@Injectable()
export class AuthConfiguration {
    
    constructor() {
        // TODO: Set default values
    }

    public authorityUrl : string;
    public enableSilentTokenRenewal: boolean;
    public enableSessionCheck : boolean;
    public sessionCheckIntervalInSeconds : number;
    public silentTokenRenewalIntervalInSeconds : number;
    public clientId : string;
    public scopes : string[];
    public navigationMode : NavigationMode;
    public redirectUrl : string;
    public postLogoutRedirectUri : string; // ???
    public storage: Storage;

    // TBA: assign from json obj

    public isValid() : boolean {
        if(!this.validateString(this.authorityUrl, "The authorityUrl cannot be empty.")) {
            return false;
        }

        if(!this.authorityUrl.startsWith("https://"))
        {
            if(this.authorityUrl.startsWith("http://")) {
                console.warn("Make sure you are using the HTTPS version of the authorityUrl in production!");
            }
            else {
                console.error("The authorityUrl is not valid, it must start with https:// or http://");
                return false;
            }
        }

        if(!this.validateString(this.clientId, "The clientId cannot be empty.")) {
            return false;
        }

        if(!this.validateString(this.redirectUrl, "The redirectUrl cannot be empty.")) {
            return false;
        }

        if(this.scopes == undefined || this.scopes.length == 0 || this.scopes.every((item) => item == "")) {
            console.error("There has to be at least one requested scope.");
            return false;
        }

        // TODO: validate urls properly, warn when url is only http
        return true;
    }

    public getWellKnownEndpointsUrl() : string {
        return this.authorityUrl + '/.well-known/openid-configuration';
    }

    private validateString(validatedValue: string, errorMsg: string) : boolean {
        if(validatedValue == undefined || validatedValue == "") {
            console.error(errorMsg);
            return false;
        }

        return true;
    }
}