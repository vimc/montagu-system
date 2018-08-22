import * as React from "react";
import {Disease, Scenario} from "../../../../shared/models/Generated";
import {UncontrolledTooltip} from "reactstrap";
import {FileDownloadButton} from "../../../../shared/components/FileDownloadLink";

export interface ScenarioGroupProps {
    touchstoneVersionId: string;
    disease: Disease;
    scenarios: Scenario[];
    canDownloadCoverage: boolean;
}

export class ScenarioGroup extends React.Component<ScenarioGroupProps> {
    render(): JSX.Element {
        return <div>
            <h3>{this.props.disease.name}</h3>
            <div className="row">
                <ul className="list-group col-12">
                    {this.renderRows(this.props.scenarios)}
                </ul>
            </div>
        </div>;
    }

    renderRows(scenarios: Scenario[]): JSX.Element[] {
        return scenarios.map(s => ScenarioItem(this.props, s));
    }
}

const ScenarioItem = (props: ScenarioGroupProps, scenario: Scenario) => {
    let href = null;
    if (props.canDownloadCoverage) {
        href = `/touchstones/${props.touchstoneVersionId}/${scenario.id}/coverage/csv/`
    }
    return <li key={scenario.id} className="list-group-item">
        <div className="row align-items-center">
            <div className="col-4 text-left">{scenario.description}</div>
            <code className="col-4 text-center">{scenario.id}</code>
            <div className="col-4 text-right" id={`download-coverage-${scenario.id}`}>
                <FileDownloadButton href={href}>
                    Download coverage data</FileDownloadButton>
                {!props.canDownloadCoverage &&
                <UncontrolledTooltip placement="bottom" target={`download-coverage-${scenario.id}`}>
                    You do not have permission to download coverage
                </UncontrolledTooltip>}
            </div>
        </div>
    </li>
};