import * as React from "react";
import {Alert} from "../../../../shared/components/Alert";
import fetcher from "../../../../shared/sources/Fetcher";
import {BurdenEstimateSetTypeCode, ErrorInfo} from "../../../../shared/models/Generated";

interface BurdenEstimateState {
    typeCode: BurdenEstimateSetTypeCode;
    typeDetails: string;
    loading: boolean;
    errors: ErrorInfo[];
    hasSuccess: boolean;
}

interface BurdenEstimateProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class CreateBurdenEstimateSetForm extends React.Component<BurdenEstimateProps, BurdenEstimateState> {

    constructor(props: BurdenEstimateProps) {

        super();

        this.state = {
            typeCode: null,
            typeDetails: null,
            loading: false,
            errors: [],
            hasSuccess: false
        }
    }


    onSubmit() {
        const url = `/modelling-groups/${this.props.groupId}/responsibilities/${this.props.touchstoneId}/${this.props.scenarioId}/estimate-sets/`
        return fetcher.fetcher.fetch(url, {
            method: "post",
            data: {}
        }, false);
    }

    render() {

        const disabled = this.state.loading;
        const hasError = this.state.errors.length > 0;

        const alertMessage = hasError ? this.state.errors[0].message : "Success! You have created a new burden estimate set";

        return <form className="mt-4" onSubmit={this.onSubmit.bind(this)}>
            <h4>First, please let us know a little about your methodology</h4>
            <div className="row">
                <div className="col">
                    <label>How were these estimates obtained?</label>
                    <select className={`form-control ${!this.state.typeCode ? "has-error" : ""}`} name="type">
                        <option>
                        </option>
                    </select>
                </div>
                <div className="col">
                    <label>Any extra information about this run</label>
                    <input type="text" className={`form-control ${!this.state.typeDetails ? "has-error" : ""}`}
                           name="details"/>
                </div>
            </div>
            <div className="mt-4">
                <Alert hasSuccess={this.state.hasSuccess} hasError={hasError} message={alertMessage}/>
            </div>
            <button type="submit" className="mt-2"
                    disabled={disabled}>Create
            </button>
        </form>;
    }
}