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
import { ResponsibilityGuidanceNeonatalMortalityPage } from "./Responsibilities/Guidance/Demographics/ResponsibilityGuidanceNeonatalMortalityPage";
import { ResponsibilityGuidanceMarshallIslandsPage } from "./Responsibilities/Guidance/Demographics/ResponsibilityGuidanceMarshallIslandsPage";
import { ResponsibilityGuidanceOver80Page } from "./Responsibilities/Guidance/Demographics/ResponsibilityGuidanceOver80Page";
import { ResponsibilityGuidanceKosovoPage } from "./Responsibilities/Guidance/Demographics/ResponsibilityGuidanceKosovoPage";
import { ResponsibilityGuidanceTuvaluPage } from "./Responsibilities/Guidance/Demographics/ResponsibilityGuidanceTuvaluPage";

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
        <Route exact path="/help/neonatal-mortality/" component={ResponsibilityGuidanceNeonatalMortalityPage}/>
        <Route exact path="/help/marshall-islands/" component={ResponsibilityGuidanceMarshallIslandsPage}/>
        <Route exact path="/help/over80/" component={ResponsibilityGuidanceOver80Page}/>
        <Route exact path="/help/kosovo/" component={ResponsibilityGuidanceKosovoPage}/>
        <Route exact path="/help/tuvalu/" component={ResponsibilityGuidanceTuvaluPage}/>
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


