import { EventEmitter, Injectable, NgModule, Output } from '@angular/core';
import { Http } from '@angular/http';
import { isPlatformBrowser } from '@angular/common';
var AuthConfiguration = (function () {
    function AuthConfiguration() {
        // TODO: Set default values
    }
    /**
     * @return {?}
     */
    AuthConfiguration.prototype.isValid = function () {
        if (!this.validateString(this.authorityUrl, "The authorityUrl cannot be empty.")) {
            return false;
        }
        if (!this.authorityUrl.startsWith("https://")) {
            if (this.authorityUrl.startsWith("http://")) {
                console.warn("Make sure you are using the HTTPS version of the authorityUrl in production!");
            }
            else {
                console.error("The authorityUrl is not valid, it must start with https:// or http://");
                return false;
            }
        }
        if (!this.validateString(this.clientId, "The clientId cannot be empty.")) {
            return false;
        }
        if (!this.validateString(this.redirectUrl, "The redirectUrl cannot be empty.")) {
            return false;
        }
        if (this.scopes == undefined || this.scopes.length == 0 || this.scopes.every(function (item) { return item == ""; })) {
            console.error("There has to be at least one requested scope.");
            return false;
        }
        // TODO: validate urls properly, warn when url is only http
        return true;
    };
    /**
     * @return {?}
     */
    AuthConfiguration.prototype.getWellKnownEndpointsUrl = function () {
        return this.authorityUrl + '/.well-known/openid-configuration';
    };
    /**
     * @param {?} validatedValue
     * @param {?} errorMsg
     * @return {?}
     */
    AuthConfiguration.prototype.validateString = function (validatedValue, errorMsg) {
        if (validatedValue == undefined || validatedValue == "") {
            console.error(errorMsg);
            return false;
        }
        return true;
    };
    return AuthConfiguration;
}());
AuthConfiguration.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
AuthConfiguration.ctorParameters = function () { return []; };
var OidcAuthStorage = (function () {
    /**
     * @param {?} authConfig
     */
    function OidcAuthStorage(authConfig) {
        this.authConfig = authConfig;
        this.wellKnownEndpointsKey = "";
    }
    /**
     * @return {?}
     */
    OidcAuthStorage.prototype.getWellKnownEndpoints = function () {
        if (!isPlatformBrowser) {
            return;
        }
        var /** @type {?} */ storageValue = this.authConfig.storage.getItem(this.wellKnownEndpointsKey);
        if (!storageValue || storageValue == undefined) {
            return;
        }
        var /** @type {?} */ obj = JSON.parse(storageValue);
        var /** @type {?} */ result = (obj);
        return result;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    OidcAuthStorage.prototype.setWellKnownEndpoints = function (value) {
        var /** @type {?} */ str = JSON.stringify(value);
        this.authConfig.storage.setItem(this.wellKnownEndpointsKey, str);
    };
    return OidcAuthStorage;
}());
OidcAuthStorage.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
OidcAuthStorage.ctorParameters = function () { return [
    { type: AuthConfiguration, },
]; };
var WellKnownEndpointsService = (function () {
    /**
     * @param {?} authConfig
     * @param {?} http
     * @param {?} storage
     */
    function WellKnownEndpointsService(authConfig, http, storage) {
        this.authConfig = authConfig;
        this.http = http;
        this.storage = storage;
        this.onWellKnownEndpointsLoaded = new EventEmitter(true);
    }
    /**
     * @return {?}
     */
    WellKnownEndpointsService.prototype.ensureEndpoints = function () {
        var /** @type {?} */ storageValue = this.storage.getWellKnownEndpoints();
        if (!storageValue) {
            console.debug("Fetching endpoints from the server " + this.authConfig.getWellKnownEndpointsUrl() + ".");
            this.fetchEndpoints();
        }
        else {
            console.debug("Loading endpoints from the storage.");
            this.endpoints = storageValue;
            this.onWellKnownEndpointsLoaded.emit();
        }
    };
    /**
     * @return {?}
     */
    WellKnownEndpointsService.prototype.fetchEndpoints = function () {
        var _this = this;
        this.http.get(this.authConfig.getWellKnownEndpointsUrl()).subscribe(function (data) {
            var /** @type {?} */ jsonResponse = data.json();
            var /** @type {?} */ parsed = new WellKnownEndpoints();
            parsed.authorizationEndpointUri = jsonResponse.authorization_endpoint;
            _this.endpoints = parsed;
            _this.storage.setWellKnownEndpoints(_this.endpoints);
            _this.onWellKnownEndpointsLoaded.emit();
        });
    };
    return WellKnownEndpointsService;
}());
WellKnownEndpointsService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
WellKnownEndpointsService.ctorParameters = function () { return [
    { type: AuthConfiguration, },
    { type: Http, },
    { type: OidcAuthStorage, },
]; };
WellKnownEndpointsService.propDecorators = {
    'onWellKnownEndpointsLoaded': [{ type: Output },],
};
var WellKnownEndpoints = (function () {
    function WellKnownEndpoints() {
    }
    return WellKnownEndpoints;
}());
var OidcAuthService = (function () {
    /**
     * @param {?} wellKnownEndpointsService
     */
    function OidcAuthService(wellKnownEndpointsService) {
        this.wellKnownEndpointsService = wellKnownEndpointsService;
        this.setupComplete = new EventEmitter(true);
    }
    /**
     * @param {?} config
     * @return {?}
     */
    OidcAuthService.prototype.setup = function (config) {
        var _this = this;
        if (config == undefined) {
            console.error("The configuration is null/undefined.");
        }
        if (!config.isValid()) {
            console.error("The configuration is invalid, please fix the errors above.");
        }
        this.wellKnownEndpointsService.onWellKnownEndpointsLoaded.subscribe(function () {
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
            _this.setupComplete.emit();
        });
        this.wellKnownEndpointsService.ensureEndpoints();
    };
    /**
     * @return {?}
     */
    OidcAuthService.prototype.getToken = function () {
        return "";
    };
    /**
     * @return {?}
     */
    OidcAuthService.prototype.addAuthHeaders = function () {
    };
    /**
     * @return {?}
     */
    OidcAuthService.prototype.parseTokenFromLocation = function () {
        if (!isPlatformBrowser || !window.location.hash) {
            return false;
        }
        return this.parseTokenFromHash(window.location.hash);
    };
    /**
     * @param {?} hash
     * @return {?}
     */
    OidcAuthService.prototype.parseTokenFromHash = function (hash) {
        if (!isPlatformBrowser || !window.location.hash) {
            return false;
        }
        var /** @type {?} */ parsed = this.parseHash(window.location.hash);
        // If token(s) are found and are valid, save them to storage and
        return true;
    };
    /**
     * @param {?} hash
     * @return {?}
     */
    OidcAuthService.prototype.parseHash = function (hash) {
        var /** @type {?} */ result = hash.substr(1).split('&').reduce(function (result, item) {
            var /** @type {?} */ parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});
    };
    return OidcAuthService;
}());
OidcAuthService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
OidcAuthService.ctorParameters = function () { return [
    { type: WellKnownEndpointsService, },
]; };
OidcAuthService.propDecorators = {
    'setupComplete': [{ type: Output },],
};
var OidcAuthModule = (function () {
    function OidcAuthModule() {
    }
    /**
     * Use in AppModule: new instance of SumService.
     * @return {?}
     */
    OidcAuthModule.forRoot = function () {
        return {
            ngModule: OidcAuthModule,
            providers: [OidcAuthService]
        };
    };
    /**
     * Use in features modules with lazy loading: new instance of SumService.
     * @return {?}
     */
    OidcAuthModule.forChild = function () {
        return {
            ngModule: OidcAuthModule,
            providers: [OidcAuthService]
        };
    };
    return OidcAuthModule;
}());
OidcAuthModule.decorators = [
    { type: NgModule, args: [{
                declarations: [],
                exports: []
            },] },
];
/**
 * @nocollapse
 */
OidcAuthModule.ctorParameters = function () { return []; };
// Public classes.
// TODO: Add public services
/**
 * Angular library starter.
 * Build an Angular library compatible with AoT compilation & Tree shaking.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular-library-starter
 */
/**
 * Entry point for all public APIs of the package.
 */
/**
 * Generated bundle index. Do not edit.
 */
export { OidcAuthModule, AuthConfiguration, OidcAuthStorage as ɵc, OidcAuthService as ɵa, WellKnownEndpointsService as ɵb };
//# sourceMappingURL=angular-library-starter.es5.js.map
