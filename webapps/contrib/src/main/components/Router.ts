import { RouteMap, Router } from "simple-react-router";
// Pages
import { ResponsibilityOverviewPage } from "./Responsibilities/ResponsibilityOverviewPage";
import { ChooseTouchstonePage } from "./Touchstones/ChooseTouchstonePage";
import { LoadingPage } from "./LoadingPage";
import { LoginPage } from "./Login/LoginPage";

interface RoutingProperties {
    loggedIn: boolean;
    loaded: boolean;
    errorMessage: string;
}

export default class AppRouter extends Router<RoutingProperties> {
    getRoutes(map: RouteMap, props: RoutingProperties) {
        const { loggedIn, loaded, errorMessage } = props;
        if (loggedIn) {
            if (loaded) {
                map('/', ChooseTouchstonePage);
                map('/responsibilities/:touchstoneId', ResponsibilityOverviewPage);
            } else {
                map("*", LoadingPage, { errorMessage });
            }
        } else {
            map('*', LoginPage);
        }
    }
}