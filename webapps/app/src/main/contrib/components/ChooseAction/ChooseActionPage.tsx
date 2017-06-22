import * as React from "react";
import { ChooseActionContent } from "./ChooseActionContent";
import { modellingGroupActions } from "../../actions/ModellingGroupActions";
import { PageWithHeaderAndNav } from "../PageWithHeader/PageWithHeaderAndNav";

export interface LocationProps {
    groupId: string;
}

export class ChooseActionPage extends PageWithHeaderAndNav<LocationProps> {
    componentDidMount() {
        modellingGroupActions.setCurrentModellingGroup(this.props.location.params.groupId);
    }

    title() {
        return <span>What do you want to do?</span>;
    }

    renderPageContent() {
        return <ChooseActionContent />;
    }
}