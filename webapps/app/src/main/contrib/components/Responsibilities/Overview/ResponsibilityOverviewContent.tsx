import * as React from "react";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { IExtendedResponsibilitySet } from "../../../models/ResponsibilitySet";
import { ModellingGroup } from "../../../../shared/models/Generated";
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { ResponsibilityList } from "./List/ResponsibilityList";
import { connectToStores } from "../../../../shared/alt";

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
        return {
            responsibilitySet: responsibilityStore.getCurrentResponsibilitySet(),
            ready: state.ready,
            currentDiseaseId: state.currentDiseaseId,
            modellingGroup: state.currentModellingGroup
        }
    }

    renderContent(props: ResponsibilityOverviewComponentProps) {
        return <div>
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