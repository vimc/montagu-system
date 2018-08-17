import {Scenario} from "../../../../shared/models/Generated";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import * as React from "react";
import {connect} from "react-redux";

export interface ScenariosListProps {
    scenario: Scenario[]
}

export class ScenariosListComponent extends React.Component<ScenariosListProps> {
    render(): JSX.Element {
        return <ul>
            {this.props.scenario.map(x => <li key={x.id}>{x.description}</li>)}
        </ul>;
    }
}

function mapStateToProps(state: AdminAppState): ScenariosListProps {
    return {
        scenario: state.scenario.scenarios
    }
}

export const ScenariosList = connect(mapStateToProps)(ScenariosListComponent);