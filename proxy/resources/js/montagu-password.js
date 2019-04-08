//Class which makes the ajax calls for setting a new password in the Montagu API
class MontaguPassword {

    constructor() {
        this.API_ROOT = "/api/v1/";
    }

    requestResetLink(email) {
        const url = this.API_ROOT + "password/request-link/?email=" + encodeURI(email);
        return $.ajax({
            type: "POST",
            url: url
        });
    }
}
