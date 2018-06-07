import * as React from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import {History} from "history";

// import {AdminPageHeader} from "./AdminPageHeader";
// Pages
import { MainMenu } from "./MainMenu/MainMenu";
import { AdminLoginPage } from "./AdminLoginPage";
import { AdminNoRouteFoundPage } from "./AdminNoRouteFoundPage";
import { ModellingGroupsListPage } from "./ModellingGroups/List/ModellingGroupsListPage";
import { ModellingGroupDetailsPage } from "./ModellingGroups/SingleGroup/Details/ModellingGroupDetailsPage";
import { ModellingGroupMembersPage } from "./ModellingGroups/SingleGroup/Members/ModellingGroupMembersPage";
import {ViewUserDetailsPage} from "./Users/SingleUser/ViewUserDetailsPage";
import { AdminForgottenPasswordPage } from "./AdminForgottenPasswordPage";
import { ResetPasswordPage } from "./Users/Account/ResetPasswordPage";
import {UsersListPage} from "./Users/List/UsersListPage";
import {TouchstoneListPage} from "./Touchstones/List/TouchstoneListPage";

interface AdminRouterProps {
    loggedIn: boolean;
    history: History;
}

export const AdminRouter : React.StatelessComponent<AdminRouterProps> = (props: AdminRouterProps) => {

    const loggedIn = <Switch>
        <Route exact path="/" component={MainMenu}/>
        <Route exact path="/modelling-groups/" component={ModellingGroupsListPage}/>
        <Route exact path="/modelling-groups/:groupId/" component={ModellingGroupDetailsPage}/>
        <Route exact path="/modelling-groups/:groupId/admin/" component={ModellingGroupMembersPage}/>
        <Route exact path="/touchstones/" component={TouchstoneListPage}/>
        <Route exact path="/users/" component={UsersListPage}/>
        <Route exact path="/users/:username" component={ViewUserDetailsPage}/>
        <Route exact path="/set-password/" component={ResetPasswordPage} />
        <Route component={AdminNoRouteFoundPage}/>
    </Switch>;

    const notLoggedIn = <Switch>
        <Route exact path="/" component={AdminLoginPage}/>
        <Route exact path="/forgotten-password/" component={AdminForgottenPasswordPage} />
        <Route exact path="/set-password/" component={ResetPasswordPage} />
        <Redirect to="/"/>
    </Switch>;

    const routes = props.loggedIn ? loggedIn : notLoggedIn;

    return <ConnectedRouter history={props.history}>
        <div>
            {routes}
        </div>
    </ConnectedRouter>;
}