import * as React from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import {History} from "history";

// Pages
import { ResponsibilityOverviewPage } from "./Responsibilities/Overview/ResponsibilityOverviewPage";
import { ChooseActionPage } from "./ChooseAction/ChooseActionPage";
import { LoadingPage } from "./LoadingPage";
import { DownloadCoveragePage } from "./Responsibilities/Coverage/DownloadCoveragePage";
import { ContribLoginPage } from "./Login/ContribLoginPage";
import { ContribNoRouteFoundPage } from "./ContribNoRouteFoundPage";
import { ChooseGroupPage } from "./ChooseGroup/ChooseGroupPage";
import { DownloadDemographicsPage } from "./Responsibilities/Demographics/DownloadDemographicsPage";
import { ContribForgottenPasswordPage } from "./ContribForgottenPasswordPage";
import { TouchstoneHelp } from "./TouchstoneHelp";
import { UploadBurdenEstimatesPage } from "./Responsibilities/BurdenEstimates/UploadBurdenEstimatesPage";
import { ResponsibilityGuidanceModelInputs } from "./Responsibilities/Guidance/ResponsibilityGuidanceModelInputs";
import { ResponsibilityGuidanceModelOutputs } from "./Responsibilities/Guidance/ResponsibilityGuidanceModelOutputs";
import { ResponsibilityGuidanceNeonatalMortality } from "./Responsibilities/Guidance/Demographics/ResponsibilityGuidanceNeonatalMortality";
import { ResponsibilityGuidanceMarshallIslands } from "./Responsibilities/Guidance/Demographics/ResponsibilityGuidanceMarshallIslands";
import { ResponsibilityGuidanceOver80 } from "./Responsibilities/Guidance/Demographics/ResponsibilityGuidanceOver80";
import { ResponsibilityGuidanceKosovo } from "./Responsibilities/Guidance/Demographics/ResponsibilityGuidanceKosovo";
import { ResponsibilityGuidanceTuvalu } from "./Responsibilities/Guidance/Demographics/ResponsibilityGuidanceTuvalu";
import {ModelRunParametersPage} from "./Responsibilities/ModelRunParameters/ModelRunParametersPage";

interface ContribRouterProps {
    loggedIn: boolean;
    loaded: boolean;
    history: History;
}

export const ContribRouter : React.StatelessComponent<ContribRouterProps> = (props: ContribRouterProps) => {

    const loggedIn = props.loaded ? <Switch>
        <Route exact path="/" component={ChooseGroupPage}/>
        <Route exact path="/:groupId/" component={ChooseActionPage}/>
        <Route exact path="/:groupId/responsibilities/:touchstoneId" component={ResponsibilityOverviewPage}/>
        <Route exact path="/:groupId/responsibilities/:touchstoneId/coverage/:scenarioId" component={DownloadCoveragePage}/>
        <Route exact path="/:groupId/responsibilities/:touchstoneId/burdens/:scenarioId" component={UploadBurdenEstimatesPage}/>
        <Route exact path="/:groupId/responsibilities/:touchstoneId/demographics" component={DownloadDemographicsPage}/>
        <Route exact path="/:groupId/responsibilities/:touchstoneId/parameters" component={ModelRunParametersPage}/>
        <Route exact path="/help/touchstones/" component={TouchstoneHelp}/>
        <Route exact path="/help/model-inputs/" component={ResponsibilityGuidanceModelInputs}/>
        <Route exact path="/help/model-outputs/" component={ResponsibilityGuidanceModelOutputs}/>
        <Route exact path="/help/neonatal-mortality/" component={ResponsibilityGuidanceNeonatalMortality}/>
        <Route exact path="/help/marshall-islands/" component={ResponsibilityGuidanceMarshallIslands}/>
        <Route exact path="/help/over80/" component={ResponsibilityGuidanceOver80}/>
        <Route exact path="/help/kosovo/" component={ResponsibilityGuidanceKosovo}/>
        <Route exact path="/help/tuvalu/" component={ResponsibilityGuidanceTuvalu}/>
        <Route component={ContribNoRouteFoundPage}/>
    </Switch> : <Switch>
        <Route component={LoadingPage}/>
    </Switch>;

    const notLoggedIn = <Switch>
        <Route exact path="/" component={ContribLoginPage}/>
        <Route exact path="/forgotten-password/" component={ContribForgottenPasswordPage} />
        <Redirect to="/"/>
    </Switch>;

    const routes = props.loggedIn ? loggedIn : notLoggedIn;

    return <ConnectedRouter history={props.history}>
        {routes}
    </ConnectedRouter>;
}


