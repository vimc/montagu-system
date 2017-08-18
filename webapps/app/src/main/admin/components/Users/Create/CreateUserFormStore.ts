import AltReform, { Reform } from "alt-reform";
import { alt } from "../../../../shared/alt";
import FormActions from "../../../../shared/FormActions";
import * as Validation from "../../../../shared/Validation";
import fetcher from "../../../../shared/sources/Fetcher";
import { NotificationException } from "../../../../shared/actions/NotificationActions";
import { userStore } from "../../../stores/UserStore";
import { processResponseAndNotifyOnErrors } from "../../../../shared/sources/Source";
import { FormErrors, justState } from "../../../../shared/FormHelpers";

export interface CreateUserFields {
    name: string;
    email: string;
    username: string;
}

export function createUserFormStore(name?: string): Reform<CreateUserFields> {
    const qualifiedName = "CreateUser_" + (name || "main");
    const { submitFailed } = FormActions(qualifiedName);

    return AltReform(qualifiedName, alt, {
        fields: {
            name: Validation.required("Full name"),
            email: Validation.required("Email address"),
            username: Validation.multi("Username", [Validation.required, Validation.usernameFormat]),
            errors: () => {
            },
        },
        onSubmit: (state: CreateUserFields & FormErrors) => fetcher.fetcher.fetch("/users/", {
                method: "post",
                body: JSON.stringify(justState(state))
        }),
        onSubmitSuccess: (response: Response) => {
            return processResponseAndNotifyOnErrors(response)
                .then(() => userStore.fetchUsers(true))
                .catch(e => {
                    const n = e as NotificationException;
                    alt.dispatch(submitFailed(n.notification.message));
                });
        },
        onSubmitFail: (response: any) => {
            console.log("Error creating user: " + response);
            alt.dispatch(submitFailed("An error occurred creating the user"));
        }
    });
}