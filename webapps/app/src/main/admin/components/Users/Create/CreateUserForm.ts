import AltReform, { Reform } from "alt-reform";
import { alt } from "../../../../shared/alt";
import { AuthStoreBaseInterface } from "../../../../shared/stores/AuthStoreBase";
import FormActions from "../../../../shared/FormActions";
import * as Validation from "../../../../shared/Validation";

export interface CreateUserFields {
    name: string;
    email: string;
    username: string;
}

export function createUserForm(): Reform<CreateUserFields> {
    const qualifiedName = "CreateUser";
    const { submitFailed } = FormActions(qualifiedName);

    return AltReform(qualifiedName, alt, {
        fields: {
            name: Validation.required("Full name"),
            email: Validation.required("Email address"),
            username: Validation.multi("Username", [ Validation.required, Validation.usernameFormat ]),
            errors: () => {
            },
        },
        onSubmit: (state: CreateUserFields) => {
            // send to server
        },
        onSubmitSuccess: (response: any) => {
            /*response.json().then((json: any) => {
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
            });*/
        },
        onSubmitFail: (response: any) => {
            console.log("Error creating user: " + response);
            alt.dispatch(submitFailed("An error occurred creating the user"));
        }
    });
}