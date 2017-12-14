import * as React from "react";
import { settings } from "../../../../shared/Settings";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { IExtendedResponsibilitySet } from "../../../models/ResponsibilitySet";
import { ModellingGroup } from "../../../../shared/models/Generated";
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { ResponsibilityList } from "./List/ResponsibilityList";
import { connectToStores } from "../../../../shared/alt";
import { ButtonLink } from "../../../../shared/components/ButtonLink";

import "../../../../shared/styles/common.scss";
import "../../../../shared/styles/messages.scss";
import {ResponsibilitySetStatusMessage} from "./ResponsibilitySetStatusMessage";

export interface ResponsibilityOverviewComponentProps extends RemoteContent {
    responsibilitySet: IExtendedResponsibilitySet;
    currentDiseaseId: string;
    modellingGroup: ModellingGroup;
}

export class ResponsibilityOverviewContentComponent extends RemoteContentComponent<ResponsibilityOverviewComponentProps, undefined> {
    static getStores() {
        return [responsibilityStore];
    }

    static getPropsFromStores(): ResponsibilityOverviewComponentProps {
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
        const demographyUrl = `/${props.modellingGroup.id}/responsibilities/${props.responsibilitySet.touchstone.id}/demographics/`;
        return <div>
            <ResponsibilitySetStatusMessage status={this.props.responsibilitySet.status} />
            <div className="largeSectionTitle">Demographic data</div>
            <div className="gapAbove">
                <ButtonLink href={ demographyUrl }>Download demographic data</ButtonLink>
            </div>

            <div className="largeSectionTitle">Scenarios</div>
            <ResponsibilityList
                modellingGroup={ props.modellingGroup }
                responsibilitySet={ props.responsibilitySet}
                currentDiseaseId={ props.currentDiseaseId }
            />
        </div>
    }
}

export const ResponsibilityOverviewContent = connectToStores(ResponsibilityOverviewContentComponent);