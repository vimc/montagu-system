import * as React from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import {History} from "History";

// Pages
import { MainMenu } from "./MainMenu/MainMenu";
import { AdminLoginPage } from "./AdminLoginPage";
import { AdminNoRouteFoundPage } from "./AdminNoRouteFoundPage";
import { ViewAllModellingGroupsPage } from "./ModellingGroups/List/ViewAllModellingGroupsPage";
import { ViewModellingGroupDetailsPage } from "./ModellingGroups/SingleGroup/Details/ViewModellingGroupDetailsPage";
import { GroupMembersPage } from "./ModellingGroups/SingleGroup/Members/GroupMembersPage";
import {ViewAllUsersPage} from "./Users/List/ViewAllUsersPage";
import {ViewUserDetailsPage} from "./Users/SingleUser/ViewUserDetailsPage";
import { AdminForgottenPasswordPage } from "./AdminForgottenPasswordPage";
import { ResetPasswordPage } from "./Users/Account/ResetPasswordPage";

interface AdminRouterProps {
    loggedIn: boolean;
    history: History;
}

export const AdminRouter : React.StatelessComponent<AdminRouterProps> = (props: AdminRouterProps) => {

    const loggedIn = <Switch>
        <Route exact path="/" component={MainMenu}/>
        <Route exact path="/modelling-groups/" component={ViewAllModellingGroupsPage}/>
        <Route exact path="/modelling-groups/:groupId/" component={ViewModellingGroupDetailsPage}/>
        <Route exact path="/modelling-groups/:groupId/admin/" component={GroupMembersPage}/>
        <Route exact path="/users/" component={ViewAllUsersPage}/>
        <Route exact path="/users/:username" component={ViewUserDetailsPage}/>
        <Route component={AdminNoRouteFoundPage}/>
    </Switch>

    const notLoggedIn = <Switch>
        <Route exact path="/" component={AdminLoginPage}/>
        <Route exact path="/forgotten-password/" component={AdminForgottenPasswordPage} />
        <Route exact path="/set-password/" component={ResetPasswordPage} />
        <Redirect to="/"/>
    </Switch>;

    const routes = props.loggedIn ? loggedIn : notLoggedIn;

    return <ConnectedRouter history={props.history}>
        {routes}
    </ConnectedRouter>;
}