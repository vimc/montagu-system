import * as React from "react";
import {Alert} from "../../../../shared/components/Alert";
import fetcher from "../../../../shared/sources/Fetcher";
import {BurdenEstimateSetTypeCode, ErrorInfo, Result} from "../../../../shared/models/Generated";
import {apiResponse} from "../../../../shared/sources/Source";
import {doNothing, helpers} from "../../../../shared/Helpers";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {OptionSelector} from "../../OptionSelector/OptionSelector";
import {Validator} from "../../../../../../../app/src/main/shared/Validation";

interface FormField {
    name: string;
    value: string;
    validator: Validator;
}

interface FormState {
    disabled: boolean;
    errors: ErrorInfo[];
    hasSuccess: boolean;
    validated: boolean;
}

interface FormProps {
    fields: FormField[];
    url: string;
    successCallback: (result: Result) => any;
    buildPostData: () => any;
    successMessage: string;
    submitText: string;
}

export class MontaguForm extends React.Component<FormProps, FormState> {

    constructor() {

        super();

        this.state = {
            validated: false,
            disabled: false,
            errors: [],
            hasSuccess: false
        }
    }

    onSubmit(e: any) {
        e.preventDefault();

        const self = this;
        self.setState({
            validated: true
        });

        if (e.target.checkValidity() === true) {

            self.setState({
                disabled: true
            });

            fetcher.fetcher.fetch(this.props.url, {
                method: "post",
                body: JSON.stringify(this.props.buildPostData)
            }).then((response: Response) => {
                apiResponse(response)
                    .then((result: Result) => {

                            const success = result.status == "success";
                            self.setState({
                                hasSuccess: success,
                                errors: result.errors,
                                disabled: false
                            });

                            if (success) {
                                self.props.successCallback(result)
                            }

                        }
                    );
            });
        }
    }

    render() {

        const hasError = this.state.errors.length > 0;
        const alertMessage = hasError ? this.state.errors[0].message : this.props.successMessage;

        return <div>
            <form className={`mt-4 ${this.state.validated ? "was-validated" : ""}`} onSubmit={this.onSubmit.bind(this)}
                  noValidate>
                {this.props.children}
                <div className="mt-4">
                    <Alert hasSuccess={this.state.hasSuccess} hasError={hasError} message={alertMessage}/>
                </div>
                <button type="submit" className="mt-2"
                        disabled={this.state.disabled}>{this.props.submitText}
                </button>
            </form>
        </div>;
    }
}