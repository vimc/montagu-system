import * as React from "react";
import { ChooseActionContent } from "./ChooseActionContent";
import { responsibilityStore } from "../../stores/ResponsibilityStore";
import { doNothing } from "../../../shared/Helpers";
import {modellingGroupActions} from "../../../shared/actions/ModellingGroupActions";
import {ContribPageWithHeader} from "../PageWithHeader/ContribPageWithHeader";

export interface LocationProps {
    groupId: string;
}

export class ChooseActionPage extends ContribPageWithHeader<LocationProps> {
    componentDidMount() {
        super.componentDidMount();
        responsibilityStore.fetchTouchstones().catch(doNothing);
        modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
    }

    name(): string {
        return "Touchstones";
    }

    title(): JSX.Element {
        return <span>What do you want to do?</span>;
    }

    renderPageContent() {
        return <ChooseActionContent />;
    }
}