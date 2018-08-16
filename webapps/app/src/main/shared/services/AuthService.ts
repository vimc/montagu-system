import { AbstractLocalService } from "./AbstractLocalService";

export class AuthService extends AbstractLocalService {

    logIn(email: string, password: string) {
        return this.setOptions({
            Authorization: 'Basic ' + btoa(`${email}:${password}`),
            'Content-Type': 'application/x-www-form-urlencoded'
        })
            .postNoProcess("/authenticate/", "grant_type=client_credentials")
    }

    setShinyCookie() {
        return this.get("/set-shiny-cookie/");
    }

    clearShinyCookie() {
        return this.get("/clear-shiny-cookie/");
    }

    forgotPassword(email: string) {
        return this.post("/password/request-link/?email=" + encodeURI(email));
    }
}
