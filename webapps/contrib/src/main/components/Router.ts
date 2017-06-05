import { RouteMap, Router } from "simple-react-router";
// Pages
import { ResponsibilityOverviewPage } from "./Responsibilities/Overview/ResponsibilityOverviewPage";
import { ChooseTouchstonePage } from "./Touchstones/ChooseTouchstonePage";
import { LoadingPage } from "./LoadingPage";
import { LoginPage } from "./Login/LoginPage";
import { DownloadCoveragePage } from "./Responsibilities/Coverage/DownloadCoveragePage";

interface RoutingProperties {
    loggedIn: boolean;
    loaded: boolean;
}

export default class AppRouter extends Router<RoutingProperties> {
    getRoutes(map: RouteMap, props: RoutingProperties) {
        const { loggedIn, loaded } = props;
        if (loggedIn) {
            if (loaded) {
                map('/', ChooseTouchstonePage);
                map('/responsibilities/:touchstoneId', ResponsibilityOverviewPage);
                map('/responsibilities/:touchstoneId/:scenarioId', DownloadCoveragePage);
            } else {
                map("*", LoadingPage);
            }
        } else {
            map('*', LoginPage);
        }
    }
}