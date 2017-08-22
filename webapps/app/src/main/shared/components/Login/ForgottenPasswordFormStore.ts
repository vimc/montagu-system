import AltReform, { Reform } from "alt-reform";
import { alt } from "../../alt";
import fetcher from "../../sources/Fetcher";
import FormActions from "../../FormActions";
import * as Validation from "../../Validation";
import { FormErrors } from "../../FormHelpers";
import { makeNotification, notificationActions, NotificationException } from "../../actions/NotificationActions";
import { processResponseAndNotifyOnErrors } from "../../sources/Source";

export interface ForgottenPasswordFields {
    email: string;
}

export function forgottenPasswordFormStore(name: string): Reform<ForgottenPasswordFields> {
    const qualifiedName = "Password_reset_" + name;
    const { submitFailed } = FormActions(qualifiedName);

    return AltReform(qualifiedName, alt, {
        fields: {
            email: Validation.required("Email address"),
            errors: () => {
            }
        },
        onSubmit: (state: ForgottenPasswordFields & FormErrors) => {
            return fetcher.fetcher.fetch("/password/request_link/?email=" + encodeURI(state.email), {
                method: "post"
            }, false);
        },
        onSubmitSuccess: (response: any) => {
            return processResponseAndNotifyOnErrors(response)
                .then(() => notificationActions.notify(makeNotification("Thank you. If we have an account registered for this email address you will receive a reset password link", "info")))
                .catch(e => {
                    const n = e as NotificationException;
                    alt.dispatch(submitFailed(n.notification.message));
                });
        },
        onSubmitFail: (response: any) => {
            console.log("Error requesting password reset: " + response);
            alt.dispatch(submitFailed("An error occurred sending password reset email"));
        }
    });
}