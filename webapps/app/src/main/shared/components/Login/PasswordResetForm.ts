import AltReform, { Reform } from "alt-reform";
import { alt } from "../../alt";
import fetcher from "../../sources/Fetcher";
import FormActions from "../../FormActions";
import * as Validation from "../../Validation";
import { FormErrors, justState } from "../../FormHelpers";
import { makeNotification, notificationActions } from "../../actions/NotificationActions";

export interface PasswordResetFields {
    email: string;
}

export function passwordResetForm(name: string): Reform<PasswordResetFields> {
    const qualifiedName = "Password_reset_" + name;
    const { submitFailed } = FormActions(qualifiedName);

    return AltReform(qualifiedName, alt, {
        fields: {
            email: Validation.required("Email address"),
            errors: () => {
            }
        },
        onSubmit: (state: PasswordResetFields & FormErrors) => {
            return fetcher.fetcher.fetch("/password/request_link/?email=" + encodeURI(state.email), {
                method: "post"
            }, false);
        },
        onSubmitSuccess: (response: any) => {
            response.json().then((json: any) => {
                if (json.error) {
                    alt.dispatch(submitFailed("Error requesting password reset"));
                } else {
                    notificationActions.notify(
                        makeNotification("Thank you. If we have an account registered for this email address you will receive a reset password link", "info"));
                }
            });
        },
        onSubmitFail: (response: any) => {
            console.log("Error requesting password reset: " + response);
            alt.dispatch(submitFailed("An error occurred sending password reset email"));
        }
    });
}