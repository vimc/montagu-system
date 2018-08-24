import { AbstractLocalService } from "./AbstractLocalService";

export class AuthService extends AbstractLocalService {

    logIn(email: string, password: string) {
        return this.setOptions({
            Authorization: 'Basic ' + btoa(`${email}:${password}`),
            'Content-Type': 'application/x-www-form-urlencoded',
            includeCredentials: false   /* Disables cookies, but allows basic auth */
        })
            .postNoProcess("/authenticate/", "grant_type=client_credentials")
    }

    setCookies(): Promise<string> {
        return this
            .setOptions({ includeBearerToken: true })
            .get("/set-cookies/");
    }

    logOutOfAPI() {
        return this.get("/logout/");
    }

    forgotPassword(email: string) {
        return this.post("/password/request-link/?email=" + encodeURI(email));
    }
}
