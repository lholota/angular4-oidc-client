import { inject, TestBed } from '@angular/core/testing';
import { AuthConfiguration } from './../../angular-oidc-auth';

describe('AuthConfiguration', () => {
    var config : AuthConfiguration;

    beforeEach(() => {
        config = new AuthConfiguration();
        config.authorityUrl = "https://login.server.com";
        config.clientId = "dummy";
        config.redirectUrl = "http://dummy.com";
        config.scopes = [ "some_scope" ];
    });

    it('should pass validation if config is correct', function(){
        expect(config.isValid()).toBeTruthy();
    });

    it('it should report empty authorityUrl', function() {
        config.authorityUrl = "";
        expect(config.isValid()).toBeFalsy();
    });

    it('it should report invalid authorityUrl', function() {
        config.authorityUrl = "ftp://dummy";
        expect(config.isValid()).toBeFalsy();
    });

    it('it should report empty clientId', function() {
        config.clientId = "";
        expect(config.isValid()).toBeFalsy();
    });

    it('it should report empty redirectUrl', function() {
        config.redirectUrl = "";
        expect(config.isValid()).toBeFalsy();
    });

    it('it should report no scopes', function() {
        config.scopes = [];
        expect(config.isValid()).toBeFalsy();
    });

    it('it should report empty scopes', function() {
        config.scopes = [""];
        expect(config.isValid()).toBeFalsy();
    });
});