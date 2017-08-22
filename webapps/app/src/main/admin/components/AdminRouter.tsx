import { RouteMap, Router } from "simple-react-router";
import { appSettings } from "../../shared/Settings";

// Pages
import { MainMenu } from "./MainMenu/MainMenu";
import { AdminLoginPage } from "./AdminLoginPage";
import { AdminNoRouteFoundPage } from "./AdminNoRouteFoundPage";
import { ViewAllModellingGroupsPage } from "./ModellingGroups/List/ViewAllModellingGroupsPage";
import { ViewModellingGroupDetailsPage } from "./ModellingGroups/SingleGroup/Details/ViewModellingGroupDetailsPage";
import { GroupAdminPage } from "./ModellingGroups/SingleGroup/Admin/GroupAdminPage";
import {ViewAllUsersPage} from "./Users/List/ViewAllUsersPage";
import {ViewUserDetailsPage} from "./Users/SingleUser/ViewUserDetailsPage";
import { AdminForgottenPasswordPage } from "./AdminForgottenPasswordPage";

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
            map('/modelling-groups/:groupId/', ViewModellingGroupDetailsPage);
            map('/modelling-groups/:groupId/admin/', GroupAdminPage);
            map('/users/', ViewAllUsersPage);
            map('/users/:username', ViewUserDetailsPage);
            map('*', AdminNoRouteFoundPage);
        } else {
            map('/forgotten-password', AdminForgottenPasswordPage);
            map('*', AdminLoginPage);
        }
    }
}