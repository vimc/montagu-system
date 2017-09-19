import { RouteMap, Router } from "simple-react-router";
// Pages
import { ResponsibilityOverviewPage } from "./Responsibilities/Overview/ResponsibilityOverviewPage";
import { ChooseActionPage } from "./ChooseAction/ChooseActionPage";
import { LoadingPage } from "./LoadingPage";
import { DownloadCoveragePage } from "./Responsibilities/Coverage/DownloadCoveragePage";
import { ContribLoginPage } from "./Login/ContribLoginPage";
import { ContribNoRouteFoundPage } from "./ContribNoRouteFoundPage";
import { appSettings } from "../../shared/Settings";
import { ChooseGroupPage } from "./ChooseGroup/ChooseGroupPage";
import { DownloadDemographicsPage } from "./Responsibilities/Demographics/DownloadDemographicsPage";
import { ContribForgottenPasswordPage } from "./ContribForgottenPasswordPage";
import { TouchstoneHelp } from "./TouchstoneHelp";
import { UploadBurdenEstimatesPage } from "./Responsibilities/BurdenEstimates/UploadBurdenEstimatesPage";

interface RoutingProperties {
    loggedIn: boolean;
    loaded: boolean;
}

export class ContribRouter extends Router<RoutingProperties> {
    getRoutes(_map: RouteMap, props: RoutingProperties) {
        const { loggedIn, loaded } = props;
        const map: RouteMap = function (urlFragment: string, component: ComponentConstructor<any, any>) {
            _map(appSettings.publicPath + urlFragment, component);
        };

        map('/forgotten-password/', ContribForgottenPasswordPage);

        if (loggedIn) {
            if (loaded) {
                map('/', ChooseGroupPage);
                map('/:groupId/', ChooseActionPage);
                map('/:groupId/responsibilities/:touchstoneId', ResponsibilityOverviewPage);
                map('/:groupId/responsibilities/:touchstoneId/coverage/:scenarioId', DownloadCoveragePage);
                map('/:groupId/responsibilities/:touchstoneId/burdens/:scenarioId', UploadBurdenEstimatesPage);
                map('/:groupId/responsibilities/:touchstoneId/demographics', DownloadDemographicsPage);
                map('/help/touchstones/', TouchstoneHelp);
                map('*', ContribNoRouteFoundPage);
            } else {
                map("*", LoadingPage);
            }
        } else {
            map('*', ContribLoginPage);
        }
    }
}