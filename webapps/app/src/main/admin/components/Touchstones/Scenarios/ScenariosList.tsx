import {Disease, Scenario} from "../../../../shared/models/Generated";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import * as React from "react";
import {connect} from "react-redux";
import {ScenarioGroup} from "./ScenarioGroup";
import {discardDispatch} from "../../../../shared/Helpers";

export interface ScenariosListProps {
    scenarios: Scenario[];
    diseases: Disease[];
}

export class ScenariosListComponent extends React.Component<ScenariosListProps> {
    render(): JSX.Element {
        return <div>
            {this.props.diseases.map(disease => <ScenarioGroup
                key={disease.id}
                disease={disease}
                scenarios={this.props.scenarios.filter(s => s.disease == disease.id)}
            />)}
        </div>;
    }
}

function mapStateToProps(state: AdminAppState): ScenariosListProps {
    return {
        scenarios: state.scenario.scenarios,
        diseases: state.diseases.diseases
    }
}

export const ScenariosList = connect(mapStateToProps, discardDispatch)(ScenariosListComponent);