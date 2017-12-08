import * as React from "react";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {OptionSelector} from "../../OptionSelector/OptionSelector";
import {Form} from "./Form";

interface BurdenEstimateProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class CreateBurdenEstimateSetForm extends React.Component<BurdenEstimateProps, undefined> {

    static successCallback() {
        responsibilityStore.refreshResponsibilities()
    }

    static buildPostData(formData: FormData) {
        return {
            type: {
                type: formData.get("typeCode"),
                details: formData.get("details")
            }
        }
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
                  buildPostData={CreateBurdenEstimateSetForm.buildPostData}
                  successMessage={successMessage}
                  submitText={"Create"}>
                <div className="row">
                    <div className="col">
                        <label>How were these estimates calculated?</label>
                        <OptionSelector name={"typeCode"}
                                        defaultOption={"-- Please select one --"}
                                        options={options} onChange={() => {
                        }}
                                        className="form-control" required={true}/>
                        <div className="invalid-feedback">
                            Please tell us how these estimates were calculated
                        </div>
                    </div>
                    <div className="col">
                        <label>Details of this run</label>
                        <input type="text" className={"form-control"} name="details"/>
                    </div>
                </div>
            </Form>
        </div>;
    }
}