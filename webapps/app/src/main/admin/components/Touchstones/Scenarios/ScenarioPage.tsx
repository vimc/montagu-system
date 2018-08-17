import {AdminPage} from "../../../AdminPage";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {TouchstoneVersionPageLocationProps} from "../SingleTouchstoneVersion/TouchstoneVersionPage";
import * as React from "react";
import {scenarioPageActionCreators} from "../../../actions/pages/ScenarioPageActionCreators";

class ScenarioPageComponent extends React.Component<PageProperties<TouchstoneVersionPageLocationProps>> {
    render(): JSX.Element {
        return <div></div>
    }
}

export const ScenarioPage = AdminPage(scenarioPageActionCreators)(ScenarioPageComponent);
