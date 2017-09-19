export class TokenData {
    
    constructor(uriHash: string) {
        let values: any = uriHash.substr(1).split('&').reduce(function (result: any, item: string) {
            let parts = item.split('=');
            values[parts[0]] = parts[1];
            return result;
        }, {});

        Object.assign(this, values);
    }

    access_token: string;
    id_token: string;
    state: string;
    error: string;

    isValid() : boolean {
        if(this.error){
            console.debug("Error returned from the server: " + this.error);
            return false;
        }

        // parse & validate the rest of the token

        return true;
    }
}