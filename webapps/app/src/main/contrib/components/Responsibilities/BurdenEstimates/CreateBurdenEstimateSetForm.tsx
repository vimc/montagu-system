import * as React from "react";
import { Action, Dispatch } from "redux";
import { compose, branch, renderComponent} from "recompose";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


import {OptionSelector} from "../../OptionSelector/OptionSelector";
import {Form} from "../../../../shared/components/Form";
import {BurdenEstimateSetTypeCode} from "../../../../shared/models/Generated";
import {FormEvent} from "react";
import {UploadBurdenEstimatesPageLocationProps} from "./UploadBurdenEstimatesPage";
import {uploadBurdenEstimatesPageActionCreators} from "../../../actions/pages/uploadBurdenEstimatesPageActionCreators";

interface BurdenEstimateProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
    refreshResponsibilities: (props: UploadBurdenEstimatesPageLocationProps) => void;
    match: any;
}

class CreateBurdenEstimateSet {
    type: { type: BurdenEstimateSetTypeCode, details: string }
}

export class CreateBurdenEstimateSetFormComponent extends React.Component<BurdenEstimateProps, CreateBurdenEstimateSet> {

    constructor(props: BurdenEstimateProps) {
        super();
        this.state = {
            type: {
                type: null,
                details: null
            }
        }
        this.successCallback = this.successCallback.bind(this);
    }

    successCallback() {
        this.props.refreshResponsibilities(this.props.match.params);
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

    render(): JSX.Element {

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
            <h4>First step: register how these central estimates were calculated</h4>
            <Form successCallback={this.successCallback}
                  url={`/modelling-groups/${this.props.groupId}/responsibilities/${this.props.touchstoneId}/${this.props.scenarioId}/estimate-sets/`}
                  successMessage={successMessage}
                  submitText={"Continue"}
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
                        <label>Details of how these estimates were calculated</label>
                        <input type="text" className={"form-control"} name="details" required={true}
                               onChange={this.onDetailsChange.bind(this)}/>
                        <small className="form-text text-muted">
                            For example, if averaged, what kind of averaging function was used.
                        </small>
                        <div className="invalid-feedback">
                            Please give us some details, a short note is fine
                        </div>
                    </div>
                </div>
            </Form>
        </div>;
    }
}



export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<BurdenEstimateProps> => {
    return {
        refreshResponsibilities: (props: UploadBurdenEstimatesPageLocationProps) =>
            dispatch(uploadBurdenEstimatesPageActionCreators.refreshResponsibilities(props)),
    }
};

export const CreateBurdenEstimateSetForm = compose(
    connect(state => state, mapDispatchToProps),
    withRouter,
)(CreateBurdenEstimateSetFormComponent) as React.ComponentClass<Partial<BurdenEstimateProps>>;
