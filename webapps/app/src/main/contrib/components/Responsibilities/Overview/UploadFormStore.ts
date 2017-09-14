import AltReform, { Reform } from "alt-reform";
import { alt } from "../../../../shared/alt";
import { FormErrors } from "../../../../shared/FormHelpers";
import { Result } from "../../../../shared/models/Generated";
import { makeNotification, notificationActions } from "../../../../shared/actions/NotificationActions";
import FormActions from "../../../../shared/FormActions";
import fetcher from "../../../../shared/sources/Fetcher";
import * as Validation from "../../../../shared/Validation";

export interface UploadFormStoreFields {
    file: File;
}

export function uploadFormStore(name: string): Reform<UploadFormStoreFields> {
    const qualifiedName = "Upload_" + name;
    const { submitFailed } = FormActions(qualifiedName);

    return AltReform(qualifiedName, alt, {
        fields: {
            file: Validation.required("File"),
            errors: () => {
            }
        },
        onSubmit: (state: UploadFormStoreFields & FormErrors) => {
            return fetcher.fetcher.fetch("", {
                method:
                    "post"
            }, false);
        },
        onSubmitSuccess: (response: any) => {
            response.json()
                .then((response: any) => {
                    const apiResponse = <Result>response;
                    switch (apiResponse.status) {
                        case "success":
                            return notificationActions.notify(makeNotification("Thank you.", "info"));
                        case "failure":
                            return alt.dispatch(submitFailed(apiResponse.errors[0].message));
                        default:
                            return alt.dispatch(submitFailed("The server response was not correctly formatted: "
                                + response.toString(), "error"));
                    }
                });
        },
        onSubmitFail: (response: any) => {
            console.log("Error uploading burden estimates: " + response);
            alt.dispatch(submitFailed("An error occurred uploading burden estimates"));
        }
    });
}