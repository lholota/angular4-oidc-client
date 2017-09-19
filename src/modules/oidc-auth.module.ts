import { NgModule, ModuleWithProviders } from '@angular/core';

import { OidcAuthService } from '../services/oidc-auth.service';

@NgModule({
    declarations: [
        // Pipes.
        // Directives.
    ],
    exports: [
        // Pipes.
        // Directives.
    ]
})
export class OidcAuthModule {

    /**
     * Use in AppModule: new instance of SumService.
     */
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: OidcAuthModule,
            providers: [OidcAuthService]
        };
    }

    /**
     * Use in features modules with lazy loading: new instance of SumService.
     */
    public static forChild(): ModuleWithProviders {
        return {
            ngModule: OidcAuthModule,
            providers: [OidcAuthService]
        };
    }
}