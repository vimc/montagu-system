import {AdminPage} from "../../../AdminPage";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {TouchstoneVersionPageLocationProps} from "../SingleTouchstoneVersion/TouchstoneVersionPage";
import * as React from "react";
import {scenarioPageActionCreators} from "../../../actions/pages/ScenarioPageActionCreators";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {ScenariosList} from "./ScenariosList";

class ScenarioPageComponent extends React.Component<PageProperties<TouchstoneVersionPageLocationProps>> {
    render(): JSX.Element {
        return <PageArticle title={this.props.title}>
            <ScenariosList />
        </PageArticle>;
    }
}

export const ScenarioPage = AdminPage(scenarioPageActionCreators)(ScenarioPageComponent);
