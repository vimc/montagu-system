import * as React from "react";
import {Alert} from "../../../../shared/components/Alert";
import {CreateBurdenEstimateSetForm} from "./CreateBurdenEstimateSetForm";
import fetcher from "../../../../shared/sources/Fetcher";
import {BurdenEstimateSetTypeCode, ErrorInfo} from "../../../../shared/models/Generated";

interface BurdenEstimateState {
    typeId: BurdenEstimateSetTypeCode;
    typeDetails: string;
    parameterSetId: number;
    loading: boolean;
    errors: ErrorInfo[];
    hasSuccess: boolean;
}

interface BurdenEstimateProps {
    parameterSets: number[]
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class CreateBurdenEstimateSetForm extends React.Component<BurdenEstimateProps, BurdenEstimateState> {

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

        const setTypes = BurdenEstimateSetTypeCode[0]

        return <form onSubmit={this.onSubmit.bind(this)}>
            <div className="form-group">
                <select className={`form-control ${this.state.type ? "has-error" : ""}`} name="type">
                    <option>
                    </option>
                </select>
            </div>
            <div className="form-group">
                <select className="form-control" name="parameter-set">
                    <option>

                    </option>
                </select>
            </div>
            <Alert hasSuccess={this.state.hasSuccess} hasError={this.state.hasError}
                   message={alertMessage}/>
            <button type="submit"
                    disabled={disabled}>Create
            </button>
        </form>;
    }
}