import { RouteMap, Router } from "simple-react-router";
import { appSettings } from "../../shared/Settings";

// Pages
import { MainMenu } from "./MainMenu/MainMenu";
import { AdminLoginPage } from "./AdminLoginPage";
import { AdminNoRouteFoundPage } from "./AdminNoRouteFoundPage";
import { ViewAllModellingGroupsPage } from "./ModellingGroups/List/ViewAllModellingGroupsPage";

interface RouterProps {
    loggedIn: boolean;
}

export class AdminRouter extends Router<RouterProps> {
    getRoutes(_map: RouteMap, props: RouterProps) {
        const map: RouteMap = function (url: string, component: ComponentConstructor<any, any>) {
            _map(appSettings.publicPath + url, component);
        };

        if (props.loggedIn) {
            map('/', MainMenu);
            map('/modelling-groups/', ViewAllModellingGroupsPage);
            map('*', AdminNoRouteFoundPage);
        } else {
            map('*', AdminLoginPage);
        }
    }
}