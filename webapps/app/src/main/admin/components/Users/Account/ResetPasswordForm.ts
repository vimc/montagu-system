import AltReform, { FormConnector, Reform } from "alt-reform";
import { alt } from "../../../../shared/alt";
import FormActions from "../../../../shared/FormActions";
import * as Validation from "../../../../shared/Validation";
import {
    makeNotification, notificationActions,
    NotificationException
} from "../../../../shared/actions/NotificationActions";
import { FormErrors, justState } from "../../../../shared/FormHelpers";
import fetcher from "../../../../shared/sources/Fetcher";
import { AccountStoreInterface } from "../../../stores/AccountStore";
import { Result } from "../../../../shared/models/Generated";
import { accountActions } from "../../../actions/AccountActions";

export interface ResetPasswordFields {
    password: string;
}

export function resetPasswordForm(accountStore: AccountStoreInterface, name?: string): Reform<ResetPasswordFields> {
    const qualifiedName = "ResetPassword_" + (name || "main");
    const { submitFailed } = FormActions(qualifiedName);

    return AltReform(qualifiedName, alt, {
        fields: {
            password: Validation.multi("Password", [Validation.required, (name: string) => Validation.minLength(name, 8)]),
            errors: () => {
            },
        },
        onSubmit: (state: ResetPasswordFields & FormErrors) =>
            fetcher.fetcher.fetch(`/onetime_link/${(accountStore.getState().passwordResetToken)}/`, {
            method: "post",
            body: JSON.stringify(justState(state))
        }),
        onSubmitSuccess: (response: Response) => {
            response.json()
                .then((response: any) => {
                    const apiResponse = <Result>response;
                    if (apiResponse.status === "success") {
                        notificationActions.notify(makeNotification("Your password has been reset. Please log in with your new password to continue", "info"))
                    } else if (apiResponse.status === "failure") {
                        if (apiResponse.errors[0].code == "invalid-token-used") {
                            accountActions.passwordResetTokenExpired();
                            alt.dispatch(submitFailed("This password reset link has expired. Please request a new one."));
                        }
                        else {
                            alt.dispatch(submitFailed(apiResponse.errors[0].message));
                        }
                    } else {
                        alt.dispatch(submitFailed("The server response was not correctly formatted: "
                            + response.toString(), "error"));
                    }
                });

        },
        onSubmitFail: (response: any) => {
            response = response != true || "An error occurred setting the password";
            alt.dispatch(submitFailed(response));
        }
    });
}