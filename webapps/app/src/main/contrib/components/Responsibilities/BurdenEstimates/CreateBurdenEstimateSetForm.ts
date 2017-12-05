import AltReform, {Reform} from "alt-reform";
import {alt} from "../../../../shared/alt";
import fetcher from "../../../../shared/sources/Fetcher";
import * as Validation from "../../../../shared/Validation";
import {BurdenEstimateSetType, Result} from "../../../../shared/models/Generated";

interface BurdenEstimateFields {
    type: BurdenEstimateSetType;
    parameterSetId: number
}

export const CreateBurdenEstimateSetForm: Reform<BurdenEstimateFields> = AltReform("CreateBurdenEstimateSetForm", alt, {
    successMessage: "",
    errorMessage: "",
    fields: {
        type: Validation.required("Please select a type"),
        parameterSetId: () => {}
    },
    onSubmit: (state: BurdenEstimateFields) => {
        return fetcher.fetcher.fetch("url", {
            method: "post"
        }, false);
    },
    onSubmitSuccess: (response: any) => {
        response.json()
            .then((response: any) => {
                const apiResponse = <Result>response;
                switch (apiResponse.status) {
                    case "success":
                        this.successMessage = "Success! You have created a new burden estimate set";
                        this.errorMessage = "";
                        break;
                    case "failure":
                        this.errorMessage = apiResponse.errors[0].message;
                        this.successMessage = "";
                        break;
                }
            });
    },
    onSubmitFail: (response: any) => {
        this.successMessage = "";
        this.errorMessage = "failed";
    }
});