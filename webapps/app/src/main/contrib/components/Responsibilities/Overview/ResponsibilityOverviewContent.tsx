import * as React from "react";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {IExtendedResponsibilitySet} from "../../../models/ResponsibilitySet";
import {ModellingGroup} from "../../../../shared/models/Generated";
import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {ResponsibilityList} from "./List/ResponsibilityList";
import {connectToStores} from "../../../../shared/alt";
import {ButtonLink} from "../../../../shared/components/ButtonLink";

import {ResponsibilitySetStatusMessage} from "./ResponsibilitySetStatusMessage";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {connect} from "react-redux";
import {branch, compose, renderNothing} from "recompose";
import {settings} from "../../../../shared/Settings";

const stochasticParams = require('./stochastic_template_params.csv');

export interface ResponsibilityOverviewComponentPublicProps extends RemoteContent {
    responsibilitySet: IExtendedResponsibilitySet;
    currentDiseaseId: string;
    modellingGroup: ModellingGroup;
}

export interface ResponsibilityOverviewComponentProps extends ResponsibilityOverviewComponentPublicProps {
    canView: boolean;
}

export class ResponsibilityOverviewContentComponent extends RemoteContentComponent<ResponsibilityOverviewComponentPublicProps, undefined> {
    static getStores() {
        return [responsibilityStore];
    }

    static getPropsFromStores(): ResponsibilityOverviewComponentPublicProps {
        const state = responsibilityStore.getState();
        const set = responsibilityStore.getCurrentResponsibilitySet();
        return {
            responsibilitySet: set,
            ready: state.ready && set != null,
            currentDiseaseId: state.currentDiseaseId,
            modellingGroup: state.currentModellingGroup
        }
    }

    renderContent(props: ResponsibilityOverviewComponentProps) {

        const touchstoneId = props.responsibilitySet.touchstone.id;
        const demographyUrl = `/${props.modellingGroup.id}/responsibilities/${touchstoneId}/demographics/`;
        const parametersUrl = `/${props.modellingGroup.id}/responsibilities/${touchstoneId}/parameters/`;

        const paramsSection = <div id="params-section">
            <div className="largeSectionTitle">Parameters</div>
            <div><a key={"params"}
                    href={stochasticParams}>Download stochastic parameters template</a>
            </div>
            <ButtonLink href={parametersUrl}>Upload parameters</ButtonLink>
        </div>;
        return <div>
            <ResponsibilitySetStatusMessage status={this.props.responsibilitySet.status}/>
            <div className="largeSectionTitle">Demographic data</div>
            <div className="mt-3">
                <ButtonLink href={demographyUrl}>Download demographic data</ButtonLink>
            </div>
            {touchstoneId != "201801rfp-1" && paramsSection}
            <div className="largeSectionTitle">Scenarios</div>
            <ResponsibilityList
                modellingGroup={props.modellingGroup}
                responsibilitySet={props.responsibilitySet}
                currentDiseaseId={props.currentDiseaseId}
            />

        </div>
    }
}

export const ResponsibilityOverviewContentAltComponent = connectToStores(ResponsibilityOverviewContentComponent);


export const mapStateToProps = (state: ContribAppState, props: ResponsibilityOverviewComponentPublicProps)
    : ResponsibilityOverviewComponentProps => {
    return {
        ...props,
        canView: props.responsibilitySet && (state.groups.signedConfidentialityAgreement ||
        !settings.isApplicantTouchstone(props.responsibilitySet.touchstone.id))
    }
};

const enhance = compose(
    connect(mapStateToProps),
    branch((props: ResponsibilityOverviewComponentProps) => !props.canView, renderNothing)
);

export const ResponsibilityOverviewContent =
    enhance(ResponsibilityOverviewContentAltComponent);