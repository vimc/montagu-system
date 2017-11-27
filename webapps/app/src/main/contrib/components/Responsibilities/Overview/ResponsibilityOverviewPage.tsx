import * as React from "react";
import { settings } from "../../../../shared/Settings";
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

interface LocationProps {
    groupId: string;
    touchstoneId: string;
}

export class ResponsibilityOverviewPage extends ContribPageWithHeader<LocationProps> {
    load() {
        modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
        responsibilityStore.fetchTouchstones().catch(doNothing).then(() => {
            touchstoneActions.setCurrentTouchstone(this.props.location.params.touchstoneId);
            responsibilityStore.fetchResponsibilities().catch(doNothing).then(() => {
                super.load();
            });
        });
    }

    name() {
        return "Responsibilities";
    }

    title() {
        return <ResponsibilityOverviewTitle />;
    }

    urlFragment(): string {
        const s = responsibilityStore.getState();
        return `responsibilities/${s.currentTouchstone ? s.currentTouchstone.id : ''}/`;
    }

    parent(): IPageWithParent {
        return new ChooseActionPage();
    }

    renderPageContent() {
        // const curUrl = `/${this.props.location.params.groupId}/responsibilities/${this.props.location.params.touchstoneId}/`
        return <div>
            <ResponsibilityOverviewDescription />
            <ResponsibilityOverviewContent />
        </div>
    }
}