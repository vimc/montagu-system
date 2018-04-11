import * as React from "react";
import { Action, Dispatch } from "redux";
import {Alert} from "reactstrap";
import { compose, branch, renderComponent} from "recompose";
import { connect } from 'react-redux';

import {OptionSelector} from "../../OptionSelector/OptionSelector";
import {BurdenEstimateSetTypeCode} from "../../../../shared/models/Generated";
import {FormEvent} from "react";
import {EstimatesCreateBurdenData} from "../../../actionTypes/EstimatesTypes";
import {estimatesActionCreators} from "../../../actions/estimatesActionCreators";

interface CreateBurdenEstimateSetFormProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
    match: any;
    createBurden: (data: EstimatesCreateBurdenData) => void;
}

interface CreateBurdenEstimateSetFormState {
    data: EstimatesCreateBurdenData;
    hasSuccess: boolean;
    errors: Error[];
    disabled: boolean;
    validated: boolean;
}

// ToDo: Use Redux-form

export class CreateBurdenEstimateSetFormComponent extends React.Component<CreateBurdenEstimateSetFormProps, CreateBurdenEstimateSetFormState> {

    private successMessage: string = "Success! You have registered how your central estimates were calculated";
    private options = [
        {
            value: "central-single-run",
            text: "Single model run"
        }, {
            value: "central-averaged",
            text: "Averaged across model runs"
        }];

    constructor(props: CreateBurdenEstimateSetFormProps) {
        super(props);
        this.state = {
            data: {
                type: {
                    type: null,
                    details: null
                }
            },
            hasSuccess: false,
            errors: [],
            disabled: false,
            validated: false
        }
        this.onTypeChange = this.onTypeChange.bind(this);
        this.onDetailsChange = this.onDetailsChange.bind(this);
        this.clearFormStatus = this.clearFormStatus.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onTypeChange(value: BurdenEstimateSetTypeCode) {
        this.setState( {
            data: {
                type: {
                    type: value,
                    details: this.state.data.type.details
                }
            },
            errors: []
        });
    }

    onDetailsChange(e: FormEvent<HTMLInputElement>) {
        const details = (e.target as HTMLInputElement).value;
        this.setState({
            data: {
                type: {
                    details: details,
                    type: this.state.data.type.type
                }
            },
            errors: []
        })
    }

    clearFormStatus() {
        this.setState({
            errors: [],
            hasSuccess: false,
            disabled: false
        })
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.target as HTMLFormElement;

        this.setState({
            validated: true
        });

        if (form.checkValidity() === true) {

            this.setState({
                disabled: true
            });

            const data = this.state.data;
            this.props.createBurden(data);
        }
    }

    render(): JSX.Element {

        return <div>
            <h4>First step: register how these central estimates were calculated</h4>
            <form encType="multipart/form-data"
                  onSubmit={this.onSubmit}
                  className={this.state.validated ? "was-validated" : ""}
                  noValidate
            >
                <div className="row">
                    <div className="col">
                        <label>How were these estimates calculated?</label>
                        <OptionSelector
                            name={"typeCode"}
                            defaultOption={"-- Please select one --"}
                            options={this.options} onChange={this.onTypeChange}
                            className="form-control" required={true}
                        />
                        <div className="invalid-feedback">
                            Please choose one
                        </div>
                    </div>
                    <div className="col">
                        <label>Details of how these estimates were calculated</label>
                        <input
                            type="text"
                            className={"form-control"}
                            name="details"
                            required={true}
                            onChange={this.onDetailsChange}
                        />
                        <small className="form-text text-muted">
                            For example, if averaged, what kind of averaging function was used.
                        </small>
                        <div className="invalid-feedback">
                            Please give us some details, a short note is fine
                        </div>
                    </div>
                </div>
                <Alert color="danger" isOpen={this.state.errors.length > 0}>
                    {this.state.errors[0] && this.state.errors[0].message}
                </Alert>
                <Alert color="success" isOpen={this.state.hasSuccess} toggle={this.clearFormStatus}>
                    {this.successMessage}
                </Alert>
                <button type="submit" className="mt-2"
                        disabled={this.state.disabled}>Continue
                </button>
            </form>
        </div>;
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<CreateBurdenEstimateSetFormProps> => {
    return {
        createBurden: (data: EstimatesCreateBurdenData) => dispatch(estimatesActionCreators.createBurden(data))
    }
};

export const CreateBurdenEstimateSetForm = compose(
    connect(state => state, mapDispatchToProps),
)(CreateBurdenEstimateSetFormComponent) as React.ComponentClass<Partial<CreateBurdenEstimateSetFormProps>>;
