//Class which makes the ajax calls for setting a new password in the Montagu API
class MontaguPassword {

    constructor(apiRoot) {
        this.apiRoot = apiRoot;
    }

    requestResetLink(email) {
        const url = this.apiRoot + "password/request-link/?email=" + encodeURI(email);
        return $.ajax({
            type: "POST",
            url: url
        });
    }

    setPassword(password, access_token) {
        const url = this.apiRoot + "password/set/?access_token=" + encodeURI(access_token);
        const data = { password: password };
        return $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data)
        });
    }
}
