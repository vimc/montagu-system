import * as React from "react";
import { settings } from "../../../../shared/Settings";
import { ResponsibilityOverviewTitle } from "./ResponsibilityOverviewTitle";
import { touchstoneActions } from "../../../actions/TouchstoneActions";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { doNothing } from "../../../../shared/Helpers";
import {modellingGroupActions} from "../../../../shared/actions/ModellingGroupActions";
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
        super.load();
        modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
        responsibilityStore.fetchTouchstones().catch(doNothing).then(() => {
            touchstoneActions.setCurrentTouchstone(this.props.location.params.touchstoneId);
            responsibilityStore.fetchResponsibilities().catch(doNothing);
        });
    }

    name() {
        return "Responsibilities";
    }

    title() {
        return <ResponsibilityOverviewTitle />
    }

    urlFragment(): string {
        const s = responsibilityStore.getState();
        return `responsibilities/${s.currentTouchstone.id}/`;
    }

    parent(): IPageWithParent {
        return new ChooseActionPage();
    }

    renderPageContent() {
        const supportEmail = `mailto:${settings.supportContact}`;
        return <div>
            On this page you can:
            <ol>
                <li>
                    See an overview of which scenarios your group is responsible for
                    providing burden estimates for. If you find the list of scenarios
                    surprising, please contact us <a href={ supportEmail }>here</a>.
                </li>
                <li>Download vaccination coverage data for each scenario.</li>
                <li>
                    Download demographic data which applies to all scenarios. Please
                    use the demographic datasets supplied for estimates generated for the
                    VIMC to ensure consistency between all models, and let us
                    know <a href={ supportEmail }>here</a> if any demographic inputs to
                    your model are missing.
                </li>
                <li>
                    Download csv templates for central and stochastic burden estimates, and parameter values underlying the stochastic runs.
                    Further guidance for generating and uploading stochastic runs is available <a href="/contribution/templates/guidance.html">
                        here.</a>
                </li>
                <li>Upload central burden estimates for each scenario, and review any problems
                    the system has detected in the uploaded data.
                    Montagu does not yet have facilities for uploading stochastic estimates.
                </li>
                <li>Track progress towards providing central burden estimates for all your scenarios.</li>
            </ol>
            <span>
                In the future, you will also be able to:
            </span>
            <ol start={7}>
                <li>Upload stochastic burden estimates for each scenario, and review any problems
                    the system has detected in the uploaded data.
                </li>
            </ol>
            <ResponsibilityOverviewContent />
        </div>
    }
}