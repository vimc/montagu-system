import * as React from "react";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { IExtendedResponsibilitySet } from "../../../models/ResponsibilitySet";
import { ModellingGroup } from "../../../../shared/models/Generated";
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { ResponsibilityList } from "./List/ResponsibilityList";
import { connectToStores } from "../../../../shared/alt";
import { ButtonLink } from "../../../../shared/components/ButtonLink";

const commonStyles = require("../../../../shared/styles/common.css");

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
        const templateUrl = `/templates/${props.currentDiseaseId}.csv`;
        return <div>
            <div className={ commonStyles.largeSectionTitle }>Demographic data</div>
            <div className={ commonStyles.gapAbove }>
                <ButtonLink href={ demographyUrl }>Download demographic data</ButtonLink>
            </div>

            <div className={ commonStyles.largeSectionTitle }>Scenarios</div>
            <div className={ commonStyles.gapAbove }>
                <ButtonLink href={ templateUrl }>Download burden estimate template</ButtonLink>
            </div>
            <ResponsibilityList
                modellingGroup={ props.modellingGroup }
                responsibilitySet={ props.responsibilitySet}
                currentDiseaseId={ props.currentDiseaseId }
            />
        </div>
    }
}

export const ResponsibilityOverviewContent = connectToStores(ResponsibilityOverviewContentComponent);