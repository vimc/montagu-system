import * as React from "react";
import {ExpectationMapping, NumberRange} from "../../../../shared/models/Generated";
import {CountriesList} from "./CountriesList";
import {FileDownloadButton} from "../../../../shared/components/FileDownloadLink";

interface ExpectationsDescriptionProps {
    expectationMapping: ExpectationMapping;
    groupId: String;
    touchstoneVersionId: String;
}

export class ExpectationsDescription extends React.PureComponent<ExpectationsDescriptionProps> {

    render(): JSX.Element {

        const {expectationMapping, groupId, touchstoneVersionId} = this.props;
        const expectation = expectationMapping.expectation;

        const templateUrl = `/modelling-groups/${groupId}/expectations/${touchstoneVersionId}/${expectation.id}/`;

        const numCountries = expectation.countries.length;
        const numYears = expectation.years.maximum_inclusive - expectation.years.minimum_inclusive + 1;
        const numAges = expectation.ages.maximum_inclusive - expectation.ages.minimum_inclusive + 1;

        const cohorts = this.cohortsText();

        return <div className="mt-3 mb-5 p-3 border">
            <div className="h3">Template for {this.applicableScenarios(expectationMapping)}</div>
            <div>
                Expecting data on:
                <ul id={"outcomes"}>
                    {expectation.outcomes.map(o => <li>{o}</li>)}
                </ul>
                For all combinations of:
                <ul>
                    <li id={"countries"}>{numCountries} countries: <CountriesList targetKey={`countries-${expectation.id}`}
                                                                                  countries={expectation.countries} /></li>
                    <li id={"years"}>{numYears} years: {rangeAsString(expectation.years)}</li>
                    <li id={"ages"}>{numAges} ages: {rangeAsString(expectation.ages)}</li>
                    {cohorts && <li id={"cohorts"}>{cohorts}</li>}
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

    cohortsText(){
        const cohorts = this.props.expectationMapping.expectation.cohorts;
        if (cohorts.maximum_birth_year == null){
            if (cohorts.minimum_birth_year == null){
                return null
            }
            else {
                return `Not including cohorts born before ${cohorts.minimum_birth_year}`
            }
        }
        else if (cohorts.minimum_birth_year == null){
            return `Not including cohorts born after ${cohorts.maximum_birth_year}`
        }
        return `Not including cohorts born before ${cohorts.minimum_birth_year} or after ${cohorts.maximum_birth_year}`
    }
}

function rangeAsString(range: NumberRange) {
    return `${range.minimum_inclusive} - ${range.maximum_inclusive}`
}