import * as React from "react";
import {ExpectationMapping} from "../../../../shared/models/Generated";

export class ExpectationsDescription extends React.PureComponent<ExpectationMapping> {
    render(): JSX.Element {
        return <div className="mt-3 mb-5 p-3 border">
            <div className="h3">Template for {this.applicableScenarios()}</div>
            <div>
                You need to do the following:
                <ul>
                    <li>These years</li>
                    <li>These ages</li>
                </ul>
            </div>
            <div>
                <button>Download template</button>
            </div>
        </div>
    }

    applicableScenarios() {
        return this.props.applicable_scenarios.join(", ");
    }
}
