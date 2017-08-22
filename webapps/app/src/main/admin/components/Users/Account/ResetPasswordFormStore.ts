import AltReform, { Reform } from "alt-reform";
import { alt } from "../../../../shared/alt";
import FormActions from "../../../../shared/FormActions";
import * as Validation from "../../../../shared/Validation";
import { NotificationException } from "../../../../shared/actions/NotificationActions";
import { processResponseAndNotifyOnErrors } from "../../../../shared/sources/Source";
import { FormErrors, justState } from "../../../../shared/FormHelpers";
import fetcher from "../../../../shared/sources/Fetcher";

export interface ResetPasswordFields {
    password: string;
}

export function resetPasswordFormStore(token: string): Reform<ResetPasswordFields> {
    const qualifiedName = "ResetPassword";
    const { submitFailed } = FormActions(qualifiedName);
    const url = `/onetime_link/${token}/`;

    return AltReform(qualifiedName, alt, {
        fields: {
            password: Validation.multi("Password", [Validation.required, (name: string) => Validation.minLength(name, 8)]),
            errors: () => {
            },
        },
        onSubmit: (state: ResetPasswordFields & FormErrors) => fetcher.fetcher.fetch(url, {
                method: "post",
                body: JSON.stringify(justState(state))
        }),
        onSubmitSuccess: (response: Response) => {
            return processResponseAndNotifyOnErrors(response)
                .catch(e => {
                    const n = e as NotificationException;
                    alt.dispatch(submitFailed(n.notification.message));
                });
        },
        onSubmitFail: (response: any) => {
            console.log("Error setting password: " + response);
            alt.dispatch(submitFailed("An error occurred setting the password"));
        }
    });
}