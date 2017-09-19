import { Injectable } from '@angular/core';
import { SilentFetchBase } from 'src/services/silent-fetch-base.service';
import { AuthConfiguration } from 'src/auth-configuration';

@Injectable()
export class SilentRenew extends SilentFetchBase {

    constructor(private authConfig: AuthConfiguration) {
        super("ng-oidc-token-renewal", "");
    }
}