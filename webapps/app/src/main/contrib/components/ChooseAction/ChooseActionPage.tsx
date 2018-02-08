import * as React from "react";
import { ChooseActionContent } from "./ChooseActionContent";
import { responsibilityStore } from "../../stores/ResponsibilityStore";
import { doNothing } from "../../../shared/Helpers";
import {modellingGroupActions} from "../../../shared/actions/ModellingGroupActions";
import {ContribPageWithHeader} from "../PageWithHeader/ContribPageWithHeader";
import {IPageWithParent} from "../../../shared/models/Breadcrumb";
import {ChooseGroupPage} from "../ChooseGroup/ChooseGroupPage";
import { Page } from "../../../shared/components/PageWithHeader/Page";

export interface LocationProps {
    groupId: string;
}

export class ChooseActionPage extends ContribPageWithHeader<LocationProps> {
    load(props: LocationProps) {
        return this.loadParent(props).then(() => {
            modellingGroupActions.setCurrentGroup(props.groupId);
            return responsibilityStore.fetchTouchstones();
        });
    }

    name(): string {
        const s = responsibilityStore.getState();
        return s.currentModellingGroup.description;
    }

    title(): JSX.Element {
        return <span>What do you want to do?</span>;
    }

    urlFragment(): string {
        const s = responsibilityStore.getState();
        return `${s.currentModellingGroup.id}/`;
    }

    parent(): IPageWithParent {
        return new ChooseGroupPage();
    }

    render() :JSX.Element {
        return <Page page={this}>
            <ChooseActionContent />
        </Page>;
    }
}