import * as React from "react";
import { PageWithHeader } from "../../PageWithHeader/PageWithHeader";
import { ResponsibilityList } from "./ResponsibilityList";
import { settings } from "../../../Settings";
import { ResponsibilityOverviewTitle } from "./ResponsibilityOverviewTitle";
import { touchstoneActions } from "../../../actions/TouchstoneActions";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";

interface LocationProps {
    touchstoneId: string
}

export class ResponsibilityOverviewPage extends PageWithHeader<LocationProps> {
    componentDidMount() {
        touchstoneActions.setCurrentTouchstone(this.props.location.params.touchstoneId);
        responsibilityStore.fetchResponsibilities();
    }

    title() {
        return <ResponsibilityOverviewTitle />
    }

    renderPageContent() {
        const supportEmail = `mailto:${settings.supportContact}`;
        return <div>
            On this page you can:
            <ol>
                <li>
                    See an overview of which scenarios your group are responsible for providing impact estimates for.
                    If we have the wrong scenarios listed, please contact us <a href={ supportEmail }>here</a>.
                </li>
                <li>Download demographic data which applies to all scenarios</li>
                <li>Download coverage data for each scenario</li>
                <li>Upload impact estimates for each scenario, and review any problems the system has detected in the
                    uploaded data.
                </li>
                <li>Track progress towards providing impact estimates for all your scenarios</li>
            </ol>
            <ResponsibilityList />
        </div>
    }
}