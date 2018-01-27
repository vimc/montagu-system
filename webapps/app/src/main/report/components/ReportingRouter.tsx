import {RouteMap, Router} from "simple-react-router"

import {appSettings} from "../../shared/Settings";

// Pages
import {MainMenu} from "./MainMenu/MainMenu";
import {ReportingNoRouteFoundPage} from "./ReportingNoRouteFoundPage";
import {ReportingLoginPage} from "./ReportingLoginPage";
import {ReportPage} from "./Reports/ReportPage";
import {ReportingForgottenPasswordPage} from "./ReportingForgottenPasswordPage";

interface RouterProps {
    loggedIn: boolean;
}

export class ReportingRouter extends Router<RouterProps> {
    getRoutes(_map: RouteMap, props: RouterProps) {
        const map: RouteMap = function (url: string, component: ComponentConstructor<any, any>) {
            _map(appSettings.publicPath + url, component);
        };

        map('/forgotten-password/', ReportingForgottenPasswordPage);

        if (props.loggedIn) {
            map('/', MainMenu);
            map('/:report/:version/', ReportPage);
            map('*', ReportingNoRouteFoundPage);
        } else {
            map('*', ReportingLoginPage);
        }
    }
}

