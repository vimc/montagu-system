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

const commonStyles = require("../../../../shared/styles/common.css");
const messageStyles = require("../../../../shared/styles/messages.css");

export interface ResponsibilityOverviewComponentProps extends RemoteContent {
    responsibilitySet: IExtendedResponsibilitySet;
    currentDiseaseId: string;
    modellingGroup: ModellingGroup;
}

export class ResponsibilityOverviewContentComponent extends RemoteContentComponent<ResponsibilityOverviewComponentProps> {
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
        const supportEmail = `mailto:${settings.supportContact}`;
        const helperText = this.props.responsibilitySet.status  != "incomplete" ?
            <div className={ messageStyles.info }>The burden estimates uploaded by your modelling group have been reviewed and approved.
                You cannot upload any new estimates. If you need to upload new estimates (e.g. for corrections) please contact us <a href={ supportEmail }>here</a>.
            </div>
        : "";
        return <div>
            {helperText}
            <div className={ commonStyles.largeSectionTitle }>Demographic data</div>
            <div className={ commonStyles.gapAbove }>
                <ButtonLink href={ demographyUrl }>Download demographic data</ButtonLink>
            </div>

            <div className={ commonStyles.largeSectionTitle }>Scenarios</div>
            <ResponsibilityList
                modellingGroup={ props.modellingGroup }
                responsibilitySet={ props.responsibilitySet}
                currentDiseaseId={ props.currentDiseaseId }
            />
        </div>
    }
}

export const ResponsibilityOverviewContent = connectToStores(ResponsibilityOverviewContentComponent);