import AltReform, {Reform} from "alt-reform";
import {alt} from "../../alt";
import fetcher from "../../sources/Fetcher";
import FormActions from "../../FormActions";
import * as Validation from "../../Validation";
import {FormErrors} from "../../FormHelpers";

export interface PasswordResetFields {
    email: string;
}

export function passwordResetForm(name: string): Reform<PasswordResetFields> {
    const qualifiedName = "Password_reset_" + name;
    const { submitSuccess } = FormActions(qualifiedName);
    const { submitFailed } = FormActions(qualifiedName);

    return AltReform(qualifiedName, alt, {
        fields: {
            email: Validation.required("Email address"),
            errors: () => {
            },
        },
        onSubmit: (state: PasswordResetFields & FormErrors) => {
            return fetcher.fetcher.fetch("/password/request_email?email=" + state.email, {
                method: "POST"
            }, false);
        },
        onSubmitSuccess: (response: any) => {
            response.json().then((json: any) => {
                if (json.error) {
                    alt.dispatch(submitFailed("Error requesting password reset"));
                } else if (json.access_token) {
                    alt.dispatch(submitSuccess("Thank you. An email will been sent to any account associated with your email address"));
                } else {
                    // This case catches the situation where the server has an internal error, but
                    // still returns something in the standard format
                    console.log("Error requesting password reset: " + JSON.stringify(json));
                    alt.dispatch(submitFailed("An error occurred sending password reset email"));
                }
            });
        },
        onSubmitFail: (response: any) => {
            console.log("Error requesting password reset: " + response);
            alt.dispatch(submitFailed("An error occurred sending password reset email"));
        }
    });
}