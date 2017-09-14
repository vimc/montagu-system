import AltReform, { Reform } from "alt-reform";
import { alt } from "../../alt";
import fetcher from "../../sources/Fetcher";
import FormActions from "../../FormActions";
import * as Validation from "../../Validation";
import { FormErrors } from "../../FormHelpers";
import { makeNotification, notificationActions } from "../../actions/NotificationActions";
import {Result} from "../../models/Generated";

export interface ForgottenPasswordFields {
    email: string;
}

export function forgottenPasswordFormStore(name: string): Reform<ForgottenPasswordFields> {
    const qualifiedName = "ForgottenPassword_" + name;
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
            response.json()
                .then((response: any) => {
                    const apiResponse = <Result>response;
                    switch (apiResponse.status) {
                        case "success":
                            return notificationActions.notify(makeNotification("Thank you. If we have an account registered for this email address you will receive a reset password link", "info"));
                        case "failure":
                            return alt.dispatch(submitFailed(apiResponse.errors[0].message));
                        default:
                            return alt.dispatch(submitFailed("The server response was not correctly formatted: "
                                + response.toString(), "error"));
                    }
                });
        },
        onSubmitFail: (response: any) => {
            console.log("Error requesting password reset: " + response);
            alt.dispatch(submitFailed("An error occurred sending password reset email"));
        }
    });
}