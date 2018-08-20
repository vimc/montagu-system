import {Scenario} from "../../../../shared/models/Generated";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import * as React from "react";
import {connect} from "react-redux";
import {discardDispatch} from "../../../../shared/Helpers";

export interface ScenariosListProps {
    scenarios: Scenario[]
}

export class ScenariosListComponent extends React.Component<ScenariosListProps> {
    render(): JSX.Element {
        return <ul>
            {this.props.scenarios.map(x => <li key={x.id}>{x.description}</li>)}
        </ul>;
    }
}

function mapStateToProps(state: AdminAppState): ScenariosListProps {
    return {
        scenarios: state.scenario.scenarios
    }
}

export const ScenariosList = connect(mapStateToProps, discardDispatch)(ScenariosListComponent);