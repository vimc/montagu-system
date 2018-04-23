import * as React from "react";
import {ChangeEvent} from "react";
import {settings} from "../../../../shared/Settings";
import {connect} from "react-redux";
import {branch, compose, renderComponent} from "recompose";
import {Dispatch} from "redux";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {default as withLifecycle, LifecycleMethods} from "@hocs/with-lifecycle";
import {userActionCreators} from "../../../actions/userActionCreators";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";

interface State {
    checked: boolean;
}

const fullConfidentialityAgreement = require('./rfp-applicants-confidentiality.pdf');

// exported for testing but this class should not be invoked by itself, it is rendered as part of the
// higher order component below
export class ConfidentialityAgreementComponent extends React.Component<ConfidentialityProps, State> {

    constructor() {
        super();
        this.state = {checked: false};
        this.onChange = this.onChange.bind(this)
    }

    onChange(e: ChangeEvent<HTMLInputElement>) {

        this.setState({
            checked: e.target.checked
        })
    }

    render() {

        if (this.props.signed == null) {
            return <LoadingElement />
        }
        else {
            // at this point we can assume that `signed` is false, as if true this component would never be
            // rendered
            return <div className={"row"}>
                <div className={"col-12 col-md-6 offset-md-3"}>
                    <div className={"border p-3 border-dark mb-5"}>
                        I have read and understood the terms of the <a href={fullConfidentialityAgreement}>
                        RfP applicants' confidentiality agreement</a>. In doing so, I understand and agree not to
                        disclose
                        or share any information on vaccine coverage data which I access from Montagu,
                        beyond my immediate RfP modelling group.
                        <input type={"checkbox"} className={"mt-2 mb-2 d-block"}
                               style={{height: "20px", width: "20px"}} checked={this.state.checked}
                               onChange={this.onChange}/>
                        {this.state.checked &&
                        <button className="btn-success" onClick={this.props.signAgreement}>Submit</button>
                        }
                    </div>
                </div>
            </div>
        }
    }

}

export interface ConfidentialityPublicProps {
    touchstoneId: string;
}

interface ConfidentialityPropsFromState extends ConfidentialityPublicProps {
    signed?: boolean;
}

interface ConfidentialityProps extends ConfidentialityPropsFromState {
    signAgreement: () => void;
    getConfidentiality: () => void;
}

const mapStateToProps
    = (state: ContribAppState, props: ConfidentialityPublicProps): ConfidentialityPropsFromState => {
    return {
        ...props,
        signed: state.user.signedConfidentialityAgreement
    }
};

const mapDispatchToProps
    = (dispatch: Dispatch<ContribAppState>, props: ConfidentialityPropsFromState): ConfidentialityProps => {
    return {
        ...props,
        getConfidentiality: () => dispatch(userActionCreators.getConfidentialityAgreement()),
        signAgreement: () => dispatch(userActionCreators.signConfidentialityAgreement())
    }
};

const lifecyleProps: Partial<LifecycleMethods<ConfidentialityProps>> = {
    onDidMount(props: ConfidentialityProps) {
        props.getConfidentiality();
    }
};

export function withConfidentialityAgreement<TOuter extends ConfidentialityPublicProps>(WrappedComponent: ComponentConstructor<any, any>) {
    return compose<ConfidentialityPropsFromState, TOuter>(
        connect(mapStateToProps, mapDispatchToProps),
        withLifecycle(lifecyleProps),
        branch((props: ConfidentialityProps) =>
            settings.isApplicantTouchstone(props.touchstoneId) && !props.signed,
            renderComponent(ConfidentialityAgreementComponent)
        ))(WrappedComponent)
}



