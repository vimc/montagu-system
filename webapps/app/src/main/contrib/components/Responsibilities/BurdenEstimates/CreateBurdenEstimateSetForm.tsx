import * as React from "react";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {OptionSelector} from "../../OptionSelector/OptionSelector";
import {Form} from "./Form";
import {BurdenEstimateSetTypeCode} from "../../../../shared/models/Generated";
import {FormEvent} from "react";

interface BurdenEstimateProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

interface CreateBurdenEstimateSet {
    type: { type: BurdenEstimateSetTypeCode, details: string }
}

interface FormData {
    data: CreateBurdenEstimateSet
}

export class CreateBurdenEstimateSetForm extends React.Component<BurdenEstimateProps, FormData> {

    constructor() {
        super();
        this.state = {
            data: {
                type: {
                    type: null,
                    details: null
                }
            }
        }
    }

    static successCallback() {
        responsibilityStore.refreshResponsibilities()
    }

    onTypeChange(e: FormEvent<HTMLInputElement>) {
        const newData = this.state.data;
        newData.type.type = (e.target as HTMLInputElement).value as BurdenEstimateSetTypeCode;
        this.setState({
            data: newData
        })
    }

    onDetailsChange(e: FormEvent<HTMLInputElement>) {
        const newData = this.state.data;
        newData.type.details = (e.target as HTMLInputElement).value;
        this.setState({
            data: newData
        })
    }

    render() {

        const successMessage = "Success! You have created a new burden estimate set";

        const options = [{value: "central-single-run", text: "Single model run"}, {
            value: "central-averaged",
            text: "Averaged across model runs"
        }];

        return <div>
            <h4>Create a new set of burden estimates:</h4>
            <Form successCallback={CreateBurdenEstimateSetForm.successCallback}
                  url={`/modelling-groups/${this.props.groupId}/responsibilities/${this.props.touchstoneId}/${this.props.scenarioId}/estimate-sets/`}
                  successMessage={successMessage}
                  submitText={"Create"}
                  data={this.state.data}>
                <div className="row">
                    <div className="col">
                        <label>How were these estimates calculated?</label>
                        <OptionSelector name={"typeCode"}
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
            </Form>
        </div>;
    }
}