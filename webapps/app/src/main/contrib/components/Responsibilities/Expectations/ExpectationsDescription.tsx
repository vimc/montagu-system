import * as React from "react";
import {ExpectationMapping} from "../../../../shared/models/Generated";
import {FileDownloadButton} from "../../../../report/components/FileDownloadLink";

interface ExpectationsDescriptionProps {
    expectationMapping: ExpectationMapping;
    groupId: String;
    touchstoneVersionId: String;
}

export class ExpectationsDescription extends React.PureComponent<ExpectationsDescriptionProps> {
    render(): JSX.Element {
        const {expectationMapping, groupId, touchstoneVersionId} = this.props;
        const expectations = expectationMapping.expectation;
        const templateUrl = `/modelling-groups/${groupId}/expectations/${touchstoneVersionId}/${expectations.id}/`;
        return <div className="mt-3 mb-5 p-3 border">
            <div className="h3">Template for {this.applicableScenarios(expectationMapping)}</div>
            <div>
                You need to do the following:
                <ul>
                    <li>These years</li>
                    <li>These ages</li>
                </ul>
            </div>
            <div>
                <FileDownloadButton href={templateUrl}>
                    Download burden estimate template
                </FileDownloadButton>
            </div>
        </div>
    }

    applicableScenarios(expectationMapping: ExpectationMapping) {
        return expectationMapping.applicable_scenarios.join(", ");
    }
}
