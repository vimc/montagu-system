import * as React from "react";
import {Disease, Scenario} from "../../../../shared/models/Generated";
import {UncontrolledTooltip} from "reactstrap";
import {FileDownloadButton} from "../../../../shared/components/FileDownloadLink";
import {branch, renderNothing} from "recompose";

export interface ScenarioGroupProps {
    touchstoneVersionId: string;
    disease: Disease;
    scenarios: Scenario[];
    canDownloadCoverage: boolean;
}

export class ScenarioGroupComponent extends React.Component<ScenarioGroupProps> {
    render(): JSX.Element {
        return <div className={"my-5"}>
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

export const ScenarioGroup =
    branch<ScenarioGroupProps>((props: ScenarioGroupProps) => props.scenarios.length == 0, renderNothing)(ScenarioGroupComponent);

const ScenarioItem = (props: ScenarioGroupProps, scenario: Scenario) => {
    let hrefLong = null;
    let hrefWide = null;
    if (props.canDownloadCoverage) {
        const href = `/touchstones/${props.touchstoneVersionId}/${scenario.id}/coverage/csv/?format=`
        hrefLong = href + "long"
        hrefWide = href + "wide"
    }
    return <li key={scenario.id} className="list-group-item">
        <div className="row align-items-center">
            <div className="col-4 text-left">{scenario.description}</div>
            <code className="col-4 text-center">{scenario.id}</code>
            <div className="col-4 text-right" id={`download-coverage-${scenario.id}`}>
                Download coverage data in
                <span id={`download-long-format-${scenario.id}`}>
                    <FileDownloadButton href={hrefLong}>
                        Long format
                    </FileDownloadButton>
                </span>
                <span id={`download-wide-format-${scenario.id}`}>
                    <FileDownloadButton href={hrefWide} className={``}>
                        Wide format
                    </FileDownloadButton>
                </span>
                {props.canDownloadCoverage &&
                <span>
                    <UncontrolledTooltip  target={`download-long-format-${scenario.id}`} className={"text-muted download-format-tooltip"}>
                        Long format includes a row for each year.
                    </UncontrolledTooltip>
                    <UncontrolledTooltip  target={`download-wide-format-${scenario.id}`} className={"text-muted download-format-tooltip"}>
                        Wide format includes coverage and target values for all years in a single row.
                    </UncontrolledTooltip>
                </span>}

                {!props.canDownloadCoverage &&
                <UncontrolledTooltip placement="bottom" target={`download-coverage-${scenario.id}`} className={"download-permission-tooltip"} >
                    You do not have permission to download coverage
                </UncontrolledTooltip>}
            </div>
        </div>
    </li>
};