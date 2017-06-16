import { RouteMap, Router } from "simple-react-router";
import { MainMenu } from "./MainMenu/MainMenu";
import { AdminLoginPage } from "./AdminLoginPage";
import { AdminNoRouteFoundPage } from "./AdminNoRouteFoundPage";
import { appSettings } from "../../shared/Settings";

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
            map('*', AdminNoRouteFoundPage);
        } else {
            map('*', AdminLoginPage);
        }
    }
}