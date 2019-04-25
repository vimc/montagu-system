//Class which makes the ajax calls for logging in and out of Montagu
class MontaguAuth {

    constructor(apiRoot) {
        this.apiRoot = apiRoot;
    }

    login(email, password) {
        const loginUrl = this.apiRoot + "authenticate/";
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
        const setCookiesUrl = this.apiRoot + "set-cookies/";
        return $.ajax({
            type: "GET",
            url: setCookiesUrl,
            headers: {
                "Authorization": "Bearer " + token
            }
        });
    }

    getUserDetails() {
        const url = this.apiRoot + "user/";
        return $.ajax({
            type: "GET",
            url: url,
            xhrFields: {
                withCredentials: true
            }
        });
    }

    logout() {
        const logoutUrl = this.apiRoot + "logout/";
        return $.ajax({
            type: "GET",
            url: logoutUrl
        });
    }
}
