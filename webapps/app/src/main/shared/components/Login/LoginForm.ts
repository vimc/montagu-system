import { AuthStoreBaseInterface } from "../../stores/AuthStoreBase";
import AltReform, { Reform } from "alt-reform";
import { alt } from "../../alt";
import fetcher from "../../sources/Fetcher";
import FormActions from "../../FormActions";
import * as Validation from "../../Validation";
import { FormErrors } from "../../FormHelpers";

export interface LoginFields {
    email: string;
    password: string;
}

export function loginForm(name: string, authStore: AuthStoreBaseInterface<any>): Reform<LoginFields> {
    const qualifiedName = "Login_" + name;
    const { submitFailed } = FormActions(qualifiedName);

    return AltReform(qualifiedName, alt, {
        fields: {
            email: Validation.required("Email address"),
            password: Validation.required("Password"),
            errors: () => {
            },
        },
        onSubmit: (state: LoginFields & FormErrors) => {
            const data = "grant_type=client_credentials";
            return fetcher.fetcher.fetch("/authenticate/", {
                method: "POST",
                headers: {
                    'Authorization': 'Basic ' + btoa(`${state.email}:${state.password}`),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: data
            }, false);
        },
        onSubmitSuccess: (response: any) => {
            response.json().then((json: any) => {
                if (json.error) {
                    alt.dispatch(submitFailed("Your username or password is incorrect"));
                } else if (json.access_token) {
                    authStore.logIn(json.access_token);
                } else {
                    // This case catches the situation where the server has an internal error, but
                    // still returns something in the standard format
                    console.log("Error logging in: " + JSON.stringify(json));
                    alt.dispatch(submitFailed("An error occurred logging in"));
                }
            });
        },
        onSubmitFail: (response: any) => {
            console.log("Error logging in: " + response);
            alt.dispatch(submitFailed("An error occurred logging in"));
        }
    });
}