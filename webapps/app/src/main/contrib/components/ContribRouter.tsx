import * as React from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import {History} from "history";

// Pages
import {ContribPageHeader} from "./ContribPageHeader";
import { ChooseGroupPage } from "./ChooseGroup/ChooseGroupPage";
import { ChooseActionPage } from "./ChooseAction/ChooseActionPage";
import { ContribLoginPage } from "./Login/ContribLoginPage";
import { ContribNoRouteFoundPage } from "./ContribNoRouteFoundPage";
import { ContribForgottenPasswordPage } from "./ContribForgottenPasswordPage";
import { TouchstoneHelpPage } from "./TouchstoneHelpPage";
import { ResponsibilityOverviewPage } from "./Responsibilities/Overview/ResponsibilityOverviewPage";

interface ContribRouterProps {
    loggedIn: boolean;
    // loaded: boolean;
    history: History;
}

export const ContribRouter : React.StatelessComponent<ContribRouterProps> = (props: ContribRouterProps) => {

    const loggedIn = <Switch>
        <Route exact path="/" component={ChooseGroupPage}/>
        <Route exact path="/:groupId/" component={ChooseActionPage}/>
        <Route exact path="/:groupId/responsibilities/:touchstoneId" component={ResponsibilityOverviewPage}/>
        <Route exact path="/help/touchstones/" component={TouchstoneHelpPage}/>
        <Route component={ContribNoRouteFoundPage}/>
    </Switch>;

    const notLoggedIn = <Switch>
        <Route exact path="/" component={ContribLoginPage}/>
        <Route exact path="/forgotten-password/" component={ContribForgottenPasswordPage} />
        <Redirect to="/"/>
    </Switch>;

    const routes = props.loggedIn ? loggedIn : notLoggedIn;

    return <ConnectedRouter history={props.history}>
        <div>
            <ContribPageHeader/>
            {routes}
        </div>
    </ConnectedRouter>;
}


