import { RouteMap, Router } from "simple-react-router";
import { MainMenu } from "./MainMenu/MainMenu";
import { AdminLoginPage } from "./AdminLoginPage";
import { AdminNoRouteFoundPage } from "./AdminNoRouteFoundPage";

interface RouterProps {
    loggedIn: boolean;
}

export class AdminRouter extends Router<RouterProps> {
    getRoutes(map: RouteMap, props: RouterProps) {
        if (props.loggedIn) {
            map('/', MainMenu);
            map('*', AdminNoRouteFoundPage);
        } else {
            map('*', AdminLoginPage);
        }
    }
}