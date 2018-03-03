// import {RouteMap, Router} from "simple-react-router";
import * as React from "react";
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import {appSettings} from "../../shared/Settings";

// Pages
import {ReportsListPage} from "./ReportsList/ReportsListPage";
import {ReportingNoRouteFoundPage} from "./ReportingNoRouteFoundPage";
import {ReportingLoginPage} from "./ReportingLoginPage";
import {ReportPage} from "./Reports/ReportPage";
import {ReportingForgottenPasswordPage} from "./ReportingForgottenPasswordPage";
import {ReportingApp} from "./ReportingApp";
// import {ReportsListComponentProps} from "./ReportsList/ReportsListComponent";

interface RouterProps {
    loggedIn: boolean;
}

/*
export class ReportingRouter extends Router<RouterProps> {
    getRoutes(_map: RouteMap, props: RouterProps) {
        const map: RouteMap = functi;on (url: string, component: ComponentConstructor<any, any>) {
            _map(appSettings.publicPath + url, component);
        };

        map('/forgotten-password/', ReportingForgottenPasswordPage);

        if (props.loggedIn) {
            map('/', ReportsListPage);
            map('/:report/:version/', ReportPage);
            map('*', ReportingNoRouteFoundPage);
        } else {
            map('*', ReportingLoginPage);
        }
    }
}
*/

export const ReportingRouter : React.StatelessComponent<any> = (props: any) => {
    // console.log('ssssaaaaaa', props)

    const loggedin = <Switch>
        <Route exact path="/" component={ReportsListPage}/>
        <Route exact path="/:report/:version/" component={ReportPage} />
        <Route component={ReportingNoRouteFoundPage} />
    </Switch>;

    const notloggedin = <Switch>
        <Route exact path="/" component={ReportingLoginPage}/>
        <Route exact path="/forgotten-password/" component={ReportingForgottenPasswordPage} />
        <Route component={ReportingNoRouteFoundPage} />
    </Switch>;

    const routes = props.loggedIn ?  loggedin : notloggedin;

    // console.log('r',routes)

    return <ConnectedRouter history={props.history}>
        {/*<div>*/}

                {routes}
            {/*</Switch>*/}
            {/*<ReportingApp/>*/}
        {/*</div>*/}
    </ConnectedRouter>;
}
