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
}