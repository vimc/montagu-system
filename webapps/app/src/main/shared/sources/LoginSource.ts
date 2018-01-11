import fetcher from "./Fetcher";
import { AuthStoreBaseInterface } from "../stores/AuthStoreBase";

export function requestAuthToken(email: string, password: string): Promise<Response> {
    const data = "grant_type=client_credentials";
    return fetcher.fetcher.fetch("/authenticate/", {
        method: "POST",
        headers: {
            'Authorization': 'Basic ' + btoa(`${email}:${password}`),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    }, false);
}

export function processLoginResponse(
    response: Response,
    authStore: AuthStoreBaseInterface<any>,
    triggeredByUser: boolean,
    handleError: (error: string) => void
): Promise<any> {
    return response.json().then((json: any) => {
        if (json.error) {
            handleError("Your username or password is incorrect");
        } else if (json.access_token) {
            authStore.logIn(json.access_token, triggeredByUser);
            authStore.saveShinyCookie(json.shiny_token);
        } else {
            // This case catches the situation where the server has an internal error, but
            // still returns something in the standard format
            console.log("Error logging in: " + JSON.stringify(json));
            handleError("An error occurred logging in");
        }
    });
}

export function logIn(
    email: string,
    password: string,
    authStore: AuthStoreBaseInterface<any>,
     triggeredByUser: boolean
): Promise<any> {
    return requestAuthToken(email, password)
        .then((response: Response) => processLoginResponse(response, authStore, triggeredByUser, err => new Error(err)))
}