import * as React from "react";
import {Disease, Scenario} from "../../../../shared/models/Generated";
import {UncontrolledTooltip} from "reactstrap";

export interface ScenarioGroupProps {
    disease: Disease;
    scenarios: Scenario[];
}

export class ScenarioGroup extends React.Component<ScenarioGroupProps> {
    render(): JSX.Element {
        return <div>
            <h3>{this.props.disease.name}</h3>
            <div className="row">
                <ul className="list-group col-lg-9 col-md-9 col-12">
                    {this.renderRows(this.props.scenarios)}
                </ul>
            </div>
        </div>;
    }

    renderRows(scenarios: Scenario[]): JSX.Element[] {
        return scenarios.map(s => <li key={s.id} className="list-group-item">
            <div className="row align-items-center">
                <div className="col-4 text-left">{s.description}</div>
                <code className="col-4 text-center">{s.id}</code>
                <div className="col-4 text-right">
                    <button id={`download-coverage-${s.id}`} disabled={true}>Download coverage data</button>
                    <UncontrolledTooltip placement="bottom" target={`download-coverage-${s.id}`}>
                        Coming soon
                    </UncontrolledTooltip>
                </div>
            </div>
        </li>);
    }
}