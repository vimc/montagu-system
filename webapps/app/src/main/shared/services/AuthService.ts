import { LocalService } from "./LocalService";

export class AuthService extends LocalService {

    stateSegment = 'auth';

    logIn(email: string, password: string) {
        this.setOptions({
            Authorization: 'Basic ' + btoa(`${email}:${password}`),
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        return this.postNoProcess("/authenticate/", "grant_type=client_credentials")
    }

    setShinyCookie() {
        this.setOptions({credentials: "include"});
        return this.get("/set-shiny-cookie/");
    }

    clearShinyCookie() {
        this.setOptions({credentials: "include"});
        return this.get("/clear-shiny-cookie/");
    }
}
