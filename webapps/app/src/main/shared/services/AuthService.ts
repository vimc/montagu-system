import { AbstractLocalService } from "./AbstractLocalService";

export class AuthService extends AbstractLocalService {

    // this method is used only for integration tests
    logIn(email: string, password: string) {
        return this.setOptions({
            Authorization: 'Basic ' + btoa(`${email}:${password}`),
            'Content-Type': 'application/x-www-form-urlencoded',
            includeCredentials: false   /* Disables cookies, but allows basic auth */
        })
            .postNoProcess("/authenticate/", "grant_type=client_credentials")
    }

    logOutOfAPI() {
        return this.get("/logout/");
    }

    forgotPassword(email: string) {
        return this.post("/password/request-link/?email=" + encodeURI(email));
    }

    getCurrentUser() {
        return this.setOptions({notificationOnError: false})
            .get("/user/?includePermissions=true");
    }
}
