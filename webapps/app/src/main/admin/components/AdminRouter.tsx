import * as React from "react";
import {Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux';
import {History} from "history";
import * as logo from "../../shared/components/PageWithHeader/logo.png"
import {PageHeader} from "../../shared/components/PageWithHeader/PageHeader";

// Pages
import {AdminLoginPage} from "./AdminLoginPage";
import {AdminNoRouteFoundPage} from "./AdminNoRouteFoundPage";
import {ModellingGroupsListPage} from "./ModellingGroups/List/ModellingGroupsListPage";
import {ModellingGroupDetailsPage} from "./ModellingGroups/SingleGroup/Details/ModellingGroupDetailsPage";
import {ModellingGroupMembersPage} from "./ModellingGroups/SingleGroup/Members/ModellingGroupMembersPage";
import {SetPasswordPage} from "./Users/Account/SetPasswordPage";
import {UsersListPage} from "./Users/List/UsersListPage";
import {UserDetailsPage} from "./Users/SingleUser/UserDetailsPage";
import {TouchstoneListPage} from "./Touchstones/List/TouchstoneListPage";
import {TouchstoneDetailsPage} from "./Touchstones/Details/TouchstoneDetailsPage";
import {ResponsibilitiesPage} from "./Touchstones/SingleTouchstoneVersion/ResponsibilitiesPage";
import {MainMenu} from "./MainMenu/MainMenu";
import {ForgottenPasswordPage} from "../../shared/components/ForgottenPasswordPage";
import {TouchstoneVersionPage} from "./Touchstones/SingleTouchstoneVersion/TouchstoneVersionPage";
import {DownloadDemographicsAdminPage} from "./Touchstones/Demography/DownloadDemographicsPage";

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
        <Route exact path="/touchstones/:touchstoneId/" component={TouchstoneDetailsPage}/>
        <Route exact path="/touchstones/:touchstoneId/:touchstoneVersionId/" component={TouchstoneVersionPage}/>
        <Route exact path="/touchstones/:touchstoneId/:touchstoneVersionId/responsibilities/" component={ResponsibilitiesPage}/>
        <Route exact path="/touchstones/:touchstoneId/:touchstoneVersionId/demographics/" component={DownloadDemographicsAdminPage}/>
        <Route exact path="/users/" component={UsersListPage}/>
        <Route exact path="/users/:username/" component={UserDetailsPage}/>
        <Route exact path="/set-password/" component={SetPasswordPage} />
        <Route component={AdminNoRouteFoundPage}/>
    </Switch>;

    const notLoggedIn = <Switch>
        <Route exact path="/forgotten-password/" component={ForgottenPasswordPage} />
        <Route exact path="/set-password/" component={SetPasswordPage} />
        <Route component={AdminLoginPage}/>
    </Switch>;

    const routes = props.loggedIn ? loggedIn : notLoggedIn;

    return <ConnectedRouter history={props.history}>
        <div>
            <PageHeader siteTitle={"Admin portal"} logo={logo} />
            {routes}
        </div>
    </ConnectedRouter>;
};