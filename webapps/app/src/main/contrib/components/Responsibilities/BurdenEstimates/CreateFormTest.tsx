import * as React from "react";
import {Alert} from "../../../../shared/components/Alert";
import fetcher from "../../../../shared/sources/Fetcher";
import {BurdenEstimateSetTypeCode, ErrorInfo, Result} from "../../../../shared/models/Generated";
import {apiResponse} from "../../../../shared/sources/Source";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {OptionSelector} from "../../OptionSelector/OptionSelector";
import {MontaguForm} from "./Form";

interface BurdenEstimateProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class CreateBurdenEstimateSetForm extends React.Component<BurdenEstimateProps, undefined> {

    successCallback() {
        responsibilityStore.refreshResponsibilities()
    }

    render() {

        const successMessage = "Success! You have created a new burden estimate set";

        const options = [{value: "central-single-run", text: "Single model run"}, {
            value: "central-averaged",
            text: "Averaged across model runs"
        }];

        return <div>
            <h4>Create a new set of burden estimates:</h4>
            <MontaguForm successCallback={this.successCallback}
                         url={`/modelling-groups/${this.props.groupId}/responsibilities/${this.props.touchstoneId}/${this.props.scenarioId}/estimate-sets/`}
                         buildPostData={() => {
                         }}
                         successMessage={successMessage} fields={[]}
                         submitText={"Create"}>
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

            </MontaguForm>
        </div>;
    }
}