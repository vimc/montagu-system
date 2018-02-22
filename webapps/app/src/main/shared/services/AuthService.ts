import { LocalService } from "./LocalService";

export class AuthService extends LocalService {

    logIn(email: string, password: string) {
        return this.setOptions({
            Authorization: 'Basic ' + btoa(`${email}:${password}`),
            'Content-Type': 'application/x-www-form-urlencoded'
        })
            .postNoProcess("/authenticate/", "grant_type=client_credentials")
    }

    setShinyCookie() {
        return this.setOptions({credentials: "include"})
            .get("/set-shiny-cookie/");
    }

    clearShinyCookie() {
        return this.setOptions({credentials: "include"})
            .get("/clear-shiny-cookie/");
    }
}
