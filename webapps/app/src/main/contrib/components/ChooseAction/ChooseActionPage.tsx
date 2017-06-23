import * as React from "react";
import { ChooseActionContent } from "./ChooseActionContent";
import { modellingGroupActions } from "../../actions/ModellingGroupActions";
import { PageWithHeaderAndNav } from "../PageWithHeader/PageWithHeaderAndNav";
import { responsibilityStore } from "../../stores/ResponsibilityStore";
import { doNothing } from "../../../shared/Helpers";

export interface LocationProps {
    groupId: string;
}

export class ChooseActionPage extends PageWithHeaderAndNav<LocationProps> {
    componentDidMount() {
        responsibilityStore.fetchTouchstones().catch(doNothing);
        modellingGroupActions.setCurrentModellingGroup(this.props.location.params.groupId);
    }

    title() {
        return <span>What do you want to do?</span>;
    }

    renderPageContent() {
        return <ChooseActionContent />;
    }
}