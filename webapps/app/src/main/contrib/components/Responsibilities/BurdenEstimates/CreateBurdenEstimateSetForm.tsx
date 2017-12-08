import * as React from "react";
import {Alert} from "../../../../shared/components/Alert";
import fetcher from "../../../../shared/sources/Fetcher";
import {BurdenEstimateSetTypeCode, ErrorInfo, Result} from "../../../../shared/models/Generated";
import {apiResponse} from "../../../../shared/sources/Source";
import {doNothing, helpers} from "../../../../shared/Helpers";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {OptionSelector} from "../../OptionSelector/OptionSelector";

interface BurdenEstimateState {
    typeCode: BurdenEstimateSetTypeCode;
    typeDetails: string;
    disabled: boolean;
    errors: ErrorInfo[];
    hasSuccess: boolean;
    validated: boolean;
}

interface BurdenEstimateProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class CreateBurdenEstimateSetForm extends React.Component<BurdenEstimateProps, BurdenEstimateState> {

    constructor() {

        super();

        this.state = {
            validated: false,
            typeCode: null,
            typeDetails: null,
            disabled: false,
            errors: [],
            hasSuccess: false
        }
    }

    onTypeChange(value: BurdenEstimateSetTypeCode) {
        this.setState({
            typeCode: value
        })
    }

    onDetailsChange(e: React.MouseEvent<HTMLInputElement>) {
        this.setState({
            typeDetails: (e.target as HTMLInputElement).value
        })
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

            const url = `/modelling-groups/${this.props.groupId}/responsibilities/${this.props.touchstoneId}/${this.props.scenarioId}/estimate-sets/`;

            fetcher.fetcher.fetch(url, {
                method: "post",
                body: JSON.stringify({
                    type: {
                        type: this.state.typeCode,
                        details: this.state.typeDetails
                    }
                })
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
                                responsibilityStore.refreshResponsibilities()
                            }
                        }
                    );
            });
        }
    }

    render() {

        const hasError = this.state.errors.length > 0;

        const alertMessage = hasError ? this.state.errors[0].message : "Success! You have created a new burden estimate set";

        const options = [{value: "central-single-run", text: "Single model run"}, {
            value: "central-averaged",
            text: "Averaged across model runs"
        }];

        return <div>
            <form className={`mt-4 ${this.state.validated ? "was-validated" : ""}`} onSubmit={this.onSubmit.bind(this)}
                  noValidate>
                <h4>Create a new set of burden estimates:</h4>
                <div className="row">
                    <div className="col">
                        <label>How were these estimates calculated?</label>
                        <OptionSelector
                            defaultOption={"-- Please select one --"}
                            options={options} onChange={this.onTypeChange.bind(this)}
                            className="form-control" required={true}/>
                        <div className="invalid-feedback">
                            Please tell us how these estimates were calculated
                        </div>
                    </div>
                    <div className="col">
                        <label>Details of this run</label>
                        <input type="text" className={"form-control"} name="details"
                               onChange={this.onDetailsChange.bind(this)}/>
                    </div>
                </div>
                <div className="mt-4">
                    <Alert hasSuccess={this.state.hasSuccess} hasError={hasError} message={alertMessage}/>
                </div>
                <button type="submit" className="mt-2"
                        disabled={this.state.disabled}>Create
                </button>
            </form>
        </div>;
    }
}