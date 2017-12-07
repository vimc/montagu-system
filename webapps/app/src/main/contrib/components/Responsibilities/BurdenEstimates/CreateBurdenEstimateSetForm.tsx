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
    touched: boolean;
    hasUploadSuccess: boolean;
}

interface BurdenEstimateProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class CreateBurdenEstimateSetForm extends React.Component<BurdenEstimateProps, BurdenEstimateState> {

    constructor() {

        const result = helpers.ingestQueryStringAndReturnResult();

        super();

        this.state = {
            touched: false,
            typeCode: null,
            typeDetails: null,
            disabled: true,
            errors: [],
            hasSuccess: false,
            hasUploadSuccess: result && result.status == "success"
        }
    }

    onTypeChange(value: BurdenEstimateSetTypeCode) {
        this.setState({
            typeCode: value,
            touched: true,
            disabled: value.length == 0
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
            disabled: true
        });

        const url = `/modelling-groups/${this.props.groupId}/responsibilities/${this.props.touchstoneId}/${this.props.scenarioId}/estimate-sets/`;
        return fetcher.fetcher.fetch(url, {
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
                        self.setState({
                            hasSuccess: result.status == "success",
                            errors: result.errors,
                            disabled: false
                        });

                        responsibilityStore.refreshResponsibilities()
                    }
                );
        });
    }

    render() {

        const hasError = this.state.errors.length > 0;

        const alertMessage = hasError ? this.state.errors[0].message : "Success! You have created a new burden estimate set";

        const options = [{value: "central-single-run", text: "Single model run"}, {
            value: "central-averaged",
            text: "Averaged across model runs"
        }];

        return <div>
            <Alert hasSuccess={this.state.hasUploadSuccess} hasError={false}
                   message={"Success! Your burden estimates have been uploaded"}/>
            <form className="mt-4" onSubmit={this.onSubmit.bind(this)}>
                <h4>Create a new set of burden estimates:</h4>
                <div className="row">
                    <div className="col">
                        <label>How were these estimates obtained?</label>
                        <OptionSelector
                            defaultOption={"-- Please select one --"}
                            options={options} onChange={this.onTypeChange.bind(this)}
                            className={`form-control ${this.state.touched && this.state.typeCode.length == 0 ? "is-invalid" : ""}`}/>
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