import * as React from "react";
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

// Pages
import {ReportsListPage} from "./ReportsList/ReportsListPage";
import {ReportingNoRouteFoundPage} from "./ReportingNoRouteFoundPage";
import {ReportingLoginPage} from "./ReportingLoginPage";
import {ReportPage} from "./Reports/ReportPage";
import {ReportingForgottenPasswordPage} from "./ReportingForgottenPasswordPage";

interface RouterProps {
    loggedIn: boolean;
    history: any;
}

export const ReportingRouter : React.StatelessComponent<RouterProps> = (props: RouterProps) => {

    const loggedIn = <Switch>
        <Route exact path="/" component={ReportsListPage}/>
        <Route exact path="/:report/:version/" component={ReportPage} />
        <Route component={ReportingNoRouteFoundPage} />
    </Switch>;

    const notLoggedIn = <Switch>
        <Route exact path="/" component={ReportingLoginPage}/>
        <Route exact path="/forgotten-password/" component={ReportingForgottenPasswordPage} />
        <Route component={ReportingNoRouteFoundPage} />
    </Switch>;

    const routes = props.loggedIn ?  loggedIn : notLoggedIn;

    return <ConnectedRouter history={props.history}>
        {routes}
    </ConnectedRouter>;
}
