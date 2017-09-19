import { isPlatformBrowser } from '@angular/common'
import { Observable } from 'rxjs/Observable';

export abstract class SilentFetchBase {

    private iframe : HTMLIFrameElement;
    
    constructor(private iframeId : string, private url : string) {
    }

    public init() : void {
        if(isPlatformBrowser){
            var element: HTMLIFrameElement;
            
            element = document.getElementById(this.iframeId) as HTMLIFrameElement;
            if(element == null){
                element = document.createElement("iframe") as HTMLIFrameElement;
                element.style.display = 'none';
                document.body.appendChild(element);
            }

            this.iframe = element;
        }
    }

    public fetch() : Observable<object> {
        return new Observable();
    }
}