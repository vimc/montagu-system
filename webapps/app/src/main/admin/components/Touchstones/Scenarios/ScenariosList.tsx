import {Disease, Scenario} from "../../../../shared/models/Generated";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import * as React from "react";
import {connect} from "react-redux";
import {ScenarioGroup} from "./ScenarioGroup";
import {discardDispatch} from "../../../../shared/Helpers";

export interface ScenariosListProps {
    scenarios: Scenario[];
    diseases: Disease[];
    canDownloadCoverage: boolean;
    touchstoneVersionId: string;
}

export class ScenariosListComponent extends React.Component<ScenariosListProps> {
    render(): JSX.Element {
        return <div>
            {this.props.diseases.map(disease => <ScenarioGroup
                key={disease.id}
                disease={disease}
                canDownloadCoverage={this.props.canDownloadCoverage}
                scenarios={this.props.scenarios.filter(s => s.disease == disease.id)}
                touchstoneVersionId={this.props.touchstoneVersionId}
            />)}
        </div>;
    }
}

function mapStateToProps(state: AdminAppState): ScenariosListProps {
    const touchstoneVersion = state.touchstones.currentTouchstoneVersion;
    const touchstoneVersionId = touchstoneVersion ? touchstoneVersion.id : null;
    return {
        scenarios: state.scenario.scenarios.filter(s => s.touchstones.some(t => t == touchstoneVersionId)),
        diseases: state.diseases.diseases,
        canDownloadCoverage: state.auth.canDownloadCoverage,
        touchstoneVersionId: touchstoneVersionId
    }
}

export const ScenariosList = connect(mapStateToProps, discardDispatch)(ScenariosListComponent);
