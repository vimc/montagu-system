//Class which makes the ajax calls for logging in and out of Montagu
class MontaguAuth {

    constructor() {
        this.API_ROOT = "/api/v1/";
    }

    login(email, password) {
        const loginUrl = this.API_ROOT + "authenticate/";
        return $.ajax({
            type: "POST",
            url: loginUrl,
            data: "grant_type=client_credentials",
            headers: {
                "Authorization": "Basic " + btoa(`${email}:${password}`),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    setCookies(token) {
        //Call set-cookies to complete login
        const setCookiesUrl = this.API_ROOT + "set-cookies/";
        return $.ajax({
            type: "GET",
            url: setCookiesUrl,
            headers: {
                "Authorization": "Bearer " + token
            }
        });
    }

    logout() {
        const logoutUrl = this.API_ROOT + "logout/";
        return $.ajax({
            type: "GET",
            url: logoutUrl
        });
    }
}
