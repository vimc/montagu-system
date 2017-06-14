import { RouteMap, Router } from "simple-react-router";
import { DefaultPage } from "./DefaultPage";
import { AdminLoginPage } from "./AdminLoginPage";

interface RouterProps {
    loggedIn: boolean;
}

export class AdminRouter extends Router<RouterProps> {
    getRoutes(map: RouteMap, props: RouterProps) {
        if (props.loggedIn) {
            map('/', DefaultPage);
        } else {
            map('*', AdminLoginPage);
        }
    }
}