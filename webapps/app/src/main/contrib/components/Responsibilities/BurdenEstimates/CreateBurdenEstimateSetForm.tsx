import * as React from "react";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {OptionSelector} from "../../OptionSelector/OptionSelector";
import {Form} from "../../../../shared/components/Form";
import {BurdenEstimateSetTypeCode} from "../../../../shared/models/Generated";
import {FormEvent} from "react";

interface BurdenEstimateProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

class CreateBurdenEstimateSet {
    type: { type: BurdenEstimateSetTypeCode, details: string }
}

export class CreateBurdenEstimateSetForm extends React.Component<BurdenEstimateProps, CreateBurdenEstimateSet> {

    constructor() {
        super();
        this.state = {
            type: {
                type: null,
                details: null
            }
        }
    }

    static successCallback() {
        responsibilityStore.refreshResponsibilities()
    }

    onTypeChange(value: BurdenEstimateSetTypeCode) {

        this.setState((prevState) => {
            return {
                type: {
                    type: value,
                    details: prevState.type.details
                }
            }
        });
    }

    onDetailsChange(e: FormEvent<HTMLInputElement>) {

        const details = (e.target as HTMLInputElement).value;
        this.setState((prevState) => {
            return {
                type: {
                    type: prevState.type.type,
                    details: details
                }
            }
        })
    }

    render() {

        const successMessage = "Success! You have registered how your central estimates were calculated";

        const options = [
            {
                value: "central-single-run",
                text: "Single model run"
            }, {
                value: "central-averaged",
                text: "Averaged across model runs"
            }];

        return <div>
            <h4>Register how your central estimates were calculated:</h4>
            <Form successCallback={CreateBurdenEstimateSetForm.successCallback}
                  url={`/modelling-groups/${this.props.groupId}/responsibilities/${this.props.touchstoneId}/${this.props.scenarioId}/estimate-sets/`}
                  successMessage={successMessage}
                  submitText={"Register"}
                  data={this.state}>
                <div className="row">
                    <div className="col">
                        <label>How were these estimates calculated?</label>
                        <OptionSelector name={"typeCode"}
                                        defaultOption={"-- Please select one --"}
                                        options={options} onChange={this.onTypeChange.bind(this)}
                                        className="form-control" required={true}/>
                        <div className="invalid-feedback">
                            Please choose one
                        </div>
                    </div>
                    <div className="col">
                        <label>Details of how these estimates were calculated. For example, if averaged, what kind of averaging function was used.</label>
                        <input type="text" className={"form-control"} name="details" required={true}
                               onChange={this.onDetailsChange.bind(this)}/>
                        <div className="invalid-feedback">
                            Please give us some details, a short note is fine
                        </div>
                    </div>
                </div>
            </Form>
        </div>;
    }
}