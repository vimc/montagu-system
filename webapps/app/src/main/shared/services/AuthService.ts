import { LocalService } from "./LocalService";

export class AuthService extends LocalService {
    logIn(email: string, password: string) {
        this.setOptions({Authorization: 'Basic ' + btoa(`${email}:${password}`)});
        return this.postNoProcess("/authenticate/", "grant_type=client_credentials");
    }

    authToShiny() {
        this.setOptions({withCredentials: true});
        return this.get("/set-shiny-cookie/");
    }

    unauthFromShiny() {
        this.setOptions({withCredentials: true});
        return this.get("/clear-shiny-cookie/");
    }
}
