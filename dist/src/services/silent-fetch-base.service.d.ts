import { Observable } from 'rxjs/Observable';
export declare abstract class SilentFetchBase {
    private iframeId;
    private url;
    private iframe;
    constructor(iframeId: string, url: string);
    init(): void;
    fetch(): Observable<object>;
}
