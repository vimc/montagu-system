import * as React from "react";
import {ResponsibilityOverviewTitle} from "./ResponsibilityOverviewTitle";
import {touchstoneActions} from "../../../actions/TouchstoneActions";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {ResponsibilityOverviewDescription} from "./ResponsibilityOverviewDescription";
import {ResponsibilityOverviewContent} from "./ResponsibilityOverviewContent";
import {ContribPageWithHeader} from "../../PageWithHeader/ContribPageWithHeader";
import {ChooseActionPage} from "../../ChooseAction/ChooseActionPage";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {Page} from "../../../../shared/components/PageWithHeader/Page";
import {ConfidentialityAgreement} from "./ConfidentialityAgreement";
import {UserService} from "../../../services/UserService";

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
        return <ResponsibilityOverviewTitle/>;
    }

    urlFragment(): string {
        const s = responsibilityStore.getState();
        return `responsibilities/${s.currentTouchstone.id}/`;
    }

    parent(): IPageWithParent {
        return new ChooseActionPage();
    }

    render(): JSX.Element {
        return <Page page={this}>
            <ConfidentialityAgreement touchstoneId={this.props.match.params.touchstoneId}/>
            <ResponsibilityOverviewDescription currentTouchstoneId={this.props.match.params.touchstoneId}/>
            <ResponsibilityOverviewContent touchstoneId={this.props.match.params.touchstoneId}/>
        </Page>;
    }
}