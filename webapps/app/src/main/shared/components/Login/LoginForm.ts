import { AuthStoreBaseInterface } from "../../stores/AuthStoreBase";
import AltReform, { Reform } from "alt-reform";
import { alt } from "../../alt";
import fetcher from "../../sources/Fetcher";
import FormActions from "../../FormActions";
import * as Validation from "../../Validation";
import { FormErrors } from "../../FormHelpers";
import { requestAuthToken, processLoginResponse } from "../../sources/LoginSource";

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
            return requestAuthToken(state.email, state.password);
        },
        onSubmitSuccess: (response: any) => {
            return processLoginResponse(response, authStore, true, err => alt.dispatch(submitFailed(err)));
        },
        onSubmitFail: (response: Response) => {
            console.log("Error logging in: " + response);
            alt.dispatch(submitFailed("An error occurred logging in"));
        }
    });
}