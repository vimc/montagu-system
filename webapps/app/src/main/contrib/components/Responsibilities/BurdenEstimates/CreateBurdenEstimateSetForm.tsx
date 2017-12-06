import * as React from "react";
import {Alert} from "../../../../shared/components/Alert";
import fetcher from "../../../../shared/sources/Fetcher";
import {BurdenEstimateSetTypeCode, ErrorInfo} from "../../../../shared/models/Generated";

interface BurdenEstimateState {
    typeCode: BurdenEstimateSetTypeCode;
    typeDetails: string;
    disabled: boolean;
    errors: ErrorInfo[];
    hasSuccess: boolean;
    touched: boolean;
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
            touched: false,
            typeCode: null,
            typeDetails: null,
            disabled: true,
            errors: [],
            hasSuccess: false
        }
    }

    onTypeChange(e: any) {
        this.setState({
            typeCode: e.target.value,
            touched: true,
            disabled: e.target.value.length == 0
        })
    }

    onDetailsChange(e: any) {
        this.setState({
            typeDetails: e.target.value
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
        }).then(() => {
            self.setState({
                hasSuccess: true,
                disabled: false
            })
            // TODO dispatch action to update current responsibility with newly created burden estimate set
        }).catch((e: any) => {
            self.setState({
                errors : [e]
            })
        });
    }

    render() {

        const hasError = this.state.errors.length > 0;

        const alertMessage = hasError ? this.state.errors[0].message : "Success! You have created a new burden estimate set";

        return <form className="mt-4" onSubmit={this.onSubmit.bind(this)}>
            <h4>First, please let us know a little about your methodology</h4>
            <div className="row">
                <div className="col">
                    <label>How were these estimates obtained?</label>
                    <select onChange={this.onTypeChange.bind(this)}
                            className={`form-control ${this.state.touched && this.state.typeCode.length == 0 ? "is-invalid" : ""}`}
                            required name="type">
                        <option value="">-- Please select one --</option>
                        <option value="central-single-run">Single model run</option>
                        <option value="central-averaged">Averaged across model runs</option>
                    </select>
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
        </form>;
    }
}