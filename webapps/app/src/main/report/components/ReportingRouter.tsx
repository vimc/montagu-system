import { RouteMap, Router } from "simple-react-router";
import { appSettings } from "../../shared/Settings";

// Pages
import { MainMenu } from "./MainMenu/MainMenu";
import { ReportingNoRouteFoundPage} from "./ReportingNoRouteFoundPage";
import {ReportingLoginPage} from "./ReportingLoginPage";
import {ViewVersionsPage} from "./Versions/ViewVersionsPage";
import {VersionInfoPage} from "./Versions/VersionInfoPage";
import { ReportingForgottenPasswordPage } from "./ReportingForgottenPasswordPage";

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
            map('/:name/', ViewVersionsPage);
            map('/:report/:version', VersionInfoPage);
            map('*', ReportingNoRouteFoundPage);
        } else {
            map('*', ReportingLoginPage);
        }
    }
}