import * as React from "react";
import {Alert} from "reactstrap";
import { compose, branch, renderComponent} from "recompose";
import { connect } from 'react-redux';
import { Action, Dispatch } from "redux";
import {ContribAppState} from "../../contrib/reducers/contribAppReducers";
import {
    ModelRunParametersFormComponent,
    ModelRunParametersFormProps
} from "../../contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersForm";
import {runParametersActionCreators} from "../../contrib/actions/runParametersActionCreators";
import {GlobalState} from "../reducers/GlobalState";


// import {ErrorInfo, Result} from "../models/Generated";
// import {apiResponse} from "../sources/Source";

// export interface FormState {
//     disabled: boolean;
//     errors: ErrorInfo[];
//     hasSuccess: boolean;
//     validated: boolean;
// }
//
// interface FormProps {
//     url: string;
//     successCallback: (result: Result) => any;
//     successMessage: string;
//     submitText: string;
//     data: any;
// }

export interface FormState {
    disabled: boolean;
    errors: any;
    successMessage: string;
 }

export interface FormProps {
    url: string;
    successCallback: (result: any) => any;
    successMessage: string;
    submitText: string;
    data: any;
}

export class FormComponent extends React.Component<FormProps, FormState> {

    constructor(props: FormProps) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        // this.onChange = this.onChange.bind(this);
        // this.clearSuccess = this.clearSuccess.bind(this);
    }

    submitForm(form: HTMLFormElement) {

        const data = this.props.data ? JSON.stringify(this.props.data) : new FormData(form);

        //
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;

        if (form.checkValidity() === true) {

            this.submitForm(form);
        }
    }


    render() {
        const hasError = this.state.errors.length > 0;
        return <div>
            <form encType="multipart/form-data"
                  onSubmit={this.onSubmit}
                  // onChange={this.onChange}
            >
                {this.props.children}
                <Alert color="danger" isOpen={hasError}>
                    {this.state.errors[0] && this.state.errors[0].message}
                </Alert>
                <Alert color="success" isOpen={this.state.hasSuccess} toggle={this.clearSuccess}>
                    {this.props.successMessage}
                </Alert>
                <button type="submit" className="mt-2"
                        disabled={this.state.disabled}>{this.props.submitText}
                </button>
            </form>
        </div>;
    }
}

export const mapStateToProps = (state: GlobalState, props: Partial<FormProps>): Partial<FormProps> => {
    return {
        url: props.url,
        successCallback: props.successCallback,
        successMessage: props.successMessage,
        submitText: props.submitText,
        data: props.data
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<FormProps> => {
    return {
        submitForm: () => {
            dispatch(

            )
        }
    }
};

export const Form = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(FormComponent) as React.ComponentClass<Partial<FormProps>>;



/*
export class Form extends React.Component<FormProps, FormState> {

    constructor(props: FormProps) {

        super(props);

        this.state = {
            validated: false,
            disabled: false,
            errors: [],
            hasSuccess: false
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.clearSuccess = this.clearSuccess.bind(this);
    }

    submitForm(form: HTMLFormElement) {

        const data = this.props.data ? JSON.stringify(this.props.data) : new FormData(form);

        return fetcher.fetcher.fetch(this.props.url, {
            method: "POST",
            body: data
        }).then((response: Response) => {
            return apiResponse(response)
                .then((result: Result) => {
                        this.resultCallback(result)
                    }
                );
        });
    }

    resultCallback(result: Result) {
        const success = result.status == "success";
        this.setState({
            hasSuccess: success,
            errors: result.errors,
            disabled: false,
            validated: false
        });

        if (success) {
            // to do clear cache
            this.props.successCallback(result);
        }
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

            this.submitForm(form)
        }
    }

    onChange(){
        this.setState({
            errors: [],
            hasSuccess: false
        });
    }

    clearSuccess(){
        this.setState({
            hasSuccess: false
        })
    }

    render() {

        const hasError = this.state.errors.length > 0;

        return <div>
            <form encType="multipart/form-data" className={this.state.validated ? "was-validated" : ""}
                  onSubmit={this.onSubmit}
                  onChange={this.onChange}
                  noValidate>
                {this.props.children}
                <Alert color="danger" isOpen={hasError}>
                    {this.state.errors[0] && this.state.errors[0].message}
                </Alert>
                <Alert color="success" isOpen={this.state.hasSuccess} toggle={this.clearSuccess}>
                    {this.props.successMessage}
                </Alert>
                <button type="submit" className="mt-2"
                        disabled={this.state.disabled}>{this.props.submitText}
                </button>
            </form>
        </div>;
    }
}
*/