import * as React from "react";
import { ResponsibilityOverviewTitle } from "./ResponsibilityOverviewTitle";
import { touchstoneActions } from "../../../actions/TouchstoneActions";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { doNothing } from "../../../../shared/Helpers";
import {modellingGroupActions} from "../../../../shared/actions/ModellingGroupActions";
import { ResponsibilityOverviewDescription } from "./ResponsibilityOverviewDescription";
import { ResponsibilityOverviewContent } from "./ResponsibilityOverviewContent";
import {ContribPageWithHeader} from "../../PageWithHeader/ContribPageWithHeader";
import {ChooseActionPage} from "../../ChooseAction/ChooseActionPage";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import { Page } from "../../../../shared/components/PageWithHeader/Page";

interface LocationProps {
    groupId: string;
    touchstoneId: string;
}

export class ResponsibilityOverviewPage extends ContribPageWithHeader<LocationProps> {
    load(props: LocationProps) {
        return this.loadParent(props).then(() => {
            touchstoneActions.setCurrentTouchstone(props.touchstoneId);
            return responsibilityStore.fetchResponsibilities();
        });
    }

    name() {
        const s = responsibilityStore.getState();
        return s.currentTouchstone.description;
    }

    title() {
        return <ResponsibilityOverviewTitle />;
    }

    urlFragment(): string {
        const s = responsibilityStore.getState();
        return `responsibilities/${s.currentTouchstone.id}/`;
    }

    parent(): IPageWithParent {
        return new ChooseActionPage();
    }

    render() :JSX.Element {
        return <Page page={this}>
            <ResponsibilityOverviewDescription
                currentTouchstoneId={this.props.location.params.touchstoneId}
            />
            <ResponsibilityOverviewContent />
        </Page>;
    }
}