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
import { DownloadCoveragePage } from "./Responsibilities/Coverage/DownloadCoveragePage";
import { UploadBurdenEstimatesPage } from "./Responsibilities/BurdenEstimates/UploadBurdenEstimatesPage";
import { DownloadDemographicsPage } from "./Responsibilities/Demographics/DownloadDemographicsPage";
import { ModelRunParametersPage} from "./Responsibilities/ModelRunParameters/ModelRunParametersPage";
import { ResponsibilityGuidanceModelInputsPage } from "./Responsibilities/Guidance/ResponsibilityGuidanceModelInputsPage";
import { ResponsibilityGuidanceModelOutputsPage } from "./Responsibilities/Guidance/ResponsibilityGuidanceModelOutputsPage";

interface ContribRouterProps {
    loggedIn: boolean;
    history: History;
}

export const ContribRouter : React.StatelessComponent<ContribRouterProps> = (props: ContribRouterProps) => {

    const loggedIn = <Switch>
        <Route exact path="/" component={ChooseGroupPage}/>
        <Route exact path="/:groupId/" component={ChooseActionPage}/>
        <Route exact path="/:groupId/responsibilities/:touchstoneId" component={ResponsibilityOverviewPage}/>
        <Route exact path="/:groupId/responsibilities/:touchstoneId/coverage/:scenarioId" component={DownloadCoveragePage}/>
        <Route exact path="/:groupId/responsibilities/:touchstoneId/burdens/:scenarioId" component={UploadBurdenEstimatesPage}/>
        <Route exact path="/:groupId/responsibilities/:touchstoneId/demographics" component={DownloadDemographicsPage}/>
        <Route exact path="/:groupId/responsibilities/:touchstoneId/parameters" component={ModelRunParametersPage}/>
        <Route exact path="/help/touchstones/" component={TouchstoneHelpPage}/>
        <Route exact path="/help/model-inputs/" component={ResponsibilityGuidanceModelInputsPage}/>
        <Route exact path="/help/model-outputs/" component={ResponsibilityGuidanceModelOutputsPage}/>
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


