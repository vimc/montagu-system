import * as React from "react";
import {settings} from "../../../../shared/Settings";
import {connect} from "react-redux";
import {branch, compose, renderNothing} from "recompose";
import {Dispatch} from "redux";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {modellingGroupsActionCreators} from "../../../actions/modellingGroupsActionCreators";

export interface ConfidentialityAgreementPublicProps {
    touchstoneId: string;
}

export interface ConfidentialityAgreementProps extends ConfidentialityAgreementPublicProps {
    signAgreement: () => void;
}

export const ConfidentialityAgreementComponent: React.SFC<ConfidentialityAgreementProps>
    = (props: ConfidentialityAgreementProps) => {

    if (settings.isApplicantTouchstone(props.touchstoneId)) {
        return <div className={"row"}>
            <div className={"col-12 col-md-6 offset-md-3"}>
                <div className={"border p-3 border-dark"}>
                    I have read and understood the RfP applicants' confidentiality agreement in full. This explains
                    in
                    details that vaccine coverage data for future years which is provided via Montagu is
                    confidential
                    and
                    must not be shared outside RfP applicants' specific modelling group.
                    <input type={"checkbox"} onChange={props.signAgreement}/>
                </div>
            </div>
        </div>
    }

}

export const mapDispatchToProps
    = (dispatch: Dispatch<ContribAppState>, props: ConfidentialityAgreementPublicProps): ConfidentialityAgreementProps => {
    return {
        ...props,
        signAgreement: () => dispatch(modellingGroupsActionCreators.signConfidentialityAgreement())
    }
};

const enhance = compose<ConfidentialityAgreementPublicProps>(
    connect((props: ConfidentialityAgreementPublicProps) => props, mapDispatchToProps),
    branch((props: ConfidentialityAgreementProps) =>
            !settings.isApplicantTouchstone(props.touchstoneId), renderNothing)
);

export const ConfidentialityAgreement = enhance(ConfidentialityAgreementComponent);


