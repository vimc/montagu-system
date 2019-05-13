import * as React from "react";
import {Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux';
import {History} from "history";

// Pages
import {ReportsListPage} from "./ReportsList/ReportsListPage";
import {ReportingNoRouteFoundPage} from "./ReportingNoRouteFoundPage";
import {ReportPage} from "./Reports/ReportPage";
import {ReportingPageHeader} from "./ReportingPageHeader";
import {LoginPage} from "../../shared/components/LoginPage";

interface ReportRouterProps {
    loggedIn: boolean;
    history: History;
}

export const ReportingRouter : React.FunctionComponent<ReportRouterProps> = (props: ReportRouterProps) => {

    const loggedIn = <Switch>
        <Route exact path="/" component={ReportsListPage}/>
        <Route exact path="/:report/:version/" component={ReportPage} />
        <Route component={ReportingNoRouteFoundPage} />
    </Switch>;

    const notLoggedIn = <Switch>
        <Route component={LoginPage}/>
    </Switch>;

    const routes = props.loggedIn ?  loggedIn : notLoggedIn;

    return <ConnectedRouter history={props.history}>
        <div>
            <ReportingPageHeader/>
            {routes}
        </div>
    </ConnectedRouter>;
};
