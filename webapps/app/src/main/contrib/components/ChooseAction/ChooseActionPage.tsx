import * as React from "react";
import { ChooseActionContent } from "./ChooseActionContent";
import { PageWithHeaderAndNav } from "../PageWithHeader/PageWithHeaderAndNav";
import { responsibilityStore } from "../../stores/ResponsibilityStore";
import { doNothing } from "../../../shared/Helpers";
import {modellingGroupActions} from "../../../shared/actions/ModellingGroupActions";

export interface LocationProps {
    groupId: string;
}

export class ChooseActionPage extends PageWithHeaderAndNav<LocationProps> {
    componentDidMount() {
        responsibilityStore.fetchTouchstones().catch(doNothing);
        modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
    }

    title() {
        return <span>What do you want to do?</span>;
    }

    renderPageContent() {
        return <ChooseActionContent />;
    }
}