import * as React from "react";
import {Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux';
import {History} from "history";
import * as logo from "../../shared/components/PageWithHeader/logo.png"
import {PageHeader} from "../../shared/components/PageWithHeader/PageHeader";
import {AdminAppState} from "../reducers/adminAppReducers";
import {connect} from "react-redux";
// Pages
import {AdminNoRouteFoundPage} from "./AdminNoRouteFoundPage";
import {ModellingGroupsListPage} from "./ModellingGroups/List/ModellingGroupsListPage";
import {ModellingGroupDetailsPage} from "./ModellingGroups/SingleGroup/Details/ModellingGroupDetailsPage";
import {ModellingGroupMembersPage} from "./ModellingGroups/SingleGroup/Members/ModellingGroupMembersPage";
import {UsersListPage} from "./Users/List/UsersListPage";
import {UserDetailsPage} from "./Users/SingleUser/UserDetailsPage";
import {TouchstoneListPage} from "./Touchstones/List/TouchstoneListPage";
import {TouchstoneDetailsPage} from "./Touchstones/Details/TouchstoneDetailsPage";
import {ResponsibilitiesPage} from "./Touchstones/SingleTouchstoneVersion/ResponsibilitiesPage";
import {MainMenuPage} from "./MainMenu/MainMenu";
import {TouchstoneVersionPage} from "./Touchstones/SingleTouchstoneVersion/TouchstoneVersionPage";
import {DownloadDemographicsAdminPage} from "./Touchstones/Demography/DownloadDemographicsPage";
import {ScenarioPage} from "./Touchstones/Scenarios/ScenarioPage";
import {CoveragePage} from "./Touchstones/Coverage/CoveragePage";
import {LoginPage} from "../../shared/components/LoginPage";
import {ModelMetaPage} from "./ModellingGroups/Models/ModelMetaPage";
import {CoverageVariablesPage} from "./Touchstones/Coverage/CoverageVariablesPage";

interface AdminRouterProps {
    loggedIn: boolean;
    history: History;
    canUploadCoverage: boolean;
}

export const AdminRouterComponent: React.FunctionComponent<AdminRouterProps> = (props: AdminRouterProps) => {

    const loggedIn = <Switch>
        <Route exact path="/" component={MainMenuPage}/>
        <Route exact path="/modelling-groups/" component={ModellingGroupsListPage}/>
        <Route exact path="/modelling-groups/models/" component={ModelMetaPage}/>
        <Route exact path="/modelling-groups/:groupId/" component={ModellingGroupDetailsPage}/>
        <Route exact path="/modelling-groups/:groupId/admin/" component={ModellingGroupMembersPage}/>
        <Route exact path="/touchstones/" component={TouchstoneListPage}/>
        <Route exact path="/touchstones/:touchstoneId/" component={TouchstoneDetailsPage}/>
        <Route exact path="/touchstones/:touchstoneId/:touchstoneVersionId/" component={TouchstoneVersionPage}/>
        <Route exact path="/touchstones/:touchstoneId/:touchstoneVersionId/responsibilities/"
               component={ResponsibilitiesPage}/>
        <Route exact path="/touchstones/:touchstoneId/:touchstoneVersionId/demographics/"
               component={DownloadDemographicsAdminPage}/>
        <Route exact path="/touchstones/:touchstoneId/:touchstoneVersionId/scenarios/" component={ScenarioPage}/>
        { props.canUploadCoverage &&
            <Route exact path="/touchstones/:touchstoneId/:touchstoneVersionId/coverage/" component={CoveragePage}/>
        }
        <Route exact path="/touchstones/:touchstoneId/:touchstoneVersionId/coverage/coverage-variables/" component={CoverageVariablesPage}/>
        <Route exact path="/users/" component={UsersListPage}/>
        <Route exact path="/users/:username/" component={UserDetailsPage}/>
        <Route component={AdminNoRouteFoundPage}/>
    </Switch>;

    const notLoggedIn = <Switch>
        <Route component={LoginPage}/>
    </Switch>;

    const routes = props.loggedIn ? loggedIn : notLoggedIn;

    return <ConnectedRouter history={props.history}>
        <div>
            <PageHeader siteTitle={"Admin portal"} logo={logo}/>
            {routes}
        </div>
    </ConnectedRouter>;
};

export const mapStateToProps = (state: AdminAppState, props: Partial<AdminRouterProps>): AdminRouterProps => {
    return {
        history: props.history,
        loggedIn: state.auth.loggedIn,
        canUploadCoverage: state.auth.canUploadCoverage
    }
};

export const AdminRouter = connect(mapStateToProps)(AdminRouterComponent);
