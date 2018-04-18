import * as React from "react";
import {settings} from "../../../../shared/Settings";
import {connect} from "react-redux";
import {branch, compose, renderNothing} from "recompose";
import {Dispatch} from "redux";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {default as withLifecycle, LifecycleMethods} from "@hocs/with-lifecycle";
import {userActionCreators} from "../../../actions/userActionCreators";

export interface ConfidentialityAgreementPublicProps {
    touchstoneId: string;
}

export interface ConfidentialityAgreementProps extends ConfidentialityAgreementPublicProps {
    signAgreement: () => void;
    signed: boolean;
    getConfidentiality: () => void;
}

const fullConfidentialityAgreement = require('./rfp-applicants-confidentiality.doc');

export const ConfidentialityAgreementComponent: React.SFC<ConfidentialityAgreementProps>
    = (props: ConfidentialityAgreementProps) => {

    if (settings.isApplicantTouchstone(props.touchstoneId)) {
        return <div className={"row"}>
            <div className={"col-12 col-md-6 offset-md-3"}>
                <div className={"border p-3 border-dark mb-5"}>
                    I have read and understood the terms of the <a href={fullConfidentialityAgreement}>
                    RfP applicants' confidentiality agreement</a>. In doing so, I understand and agree not to disclose
                    or share any information on vaccine coverage data which I access from Montagu,
                    beyond my immediate RfP modelling group.
                    {!props.signed &&
                    <input type={"checkbox"} className={"mt-2 mb-2 d-block"}
                           onChange={props.signAgreement} style={{height: "20px", width: "20px"}}/>
                    }
                </div>
            </div>
        </div>
    }
};

const lifecyleProps: Partial<LifecycleMethods<ConfidentialityAgreementProps>> = {
    onDidMount(props: ConfidentialityAgreementProps) {
        props.getConfidentiality();
    }
};

const mapStateToProps
    = (state: ContribAppState, props: ConfidentialityAgreementPublicProps): Partial<ConfidentialityAgreementProps> => {
    return {
        ...props,
        signed: state.user.signedConfidentialityAgreement
    }
};

const mapDispatchToProps
    = (dispatch: Dispatch<ContribAppState>, props: ConfidentialityAgreementProps): ConfidentialityAgreementProps => {
    return {
        ...props,
        getConfidentiality: () => dispatch(userActionCreators.getConfidentialityAgreement()),
        signAgreement: () => dispatch(userActionCreators.signConfidentialityAgreement())
    }
};

const enhance = compose<ConfidentialityAgreementPublicProps, ConfidentialityAgreementPublicProps>(
    connect(mapStateToProps, mapDispatchToProps),
    withLifecycle(lifecyleProps),
    branch((props: ConfidentialityAgreementProps) =>
        !settings.isApplicantTouchstone(props.touchstoneId), renderNothing)
);

export const ConfidentialityAgreement = enhance(ConfidentialityAgreementComponent);


