import * as React from "react";
import {ExpectationMapping} from "../../../../shared/models/Generated";

export class ExpectationsDescription extends React.PureComponent<ExpectationMapping> {

    render(): JSX.Element {

        const expectation = this.props.expectation;
        const numCountries = expectation.countries.length;
        const numYears = expectation.years.maximum_inclusive - expectation.years.minimum_inclusive + 1;
        const numAges = expectation.ages.maximum_inclusive - expectation.ages.minimum_inclusive + 1;
        const numCohorts = expectation.cohorts.maximum_birth_year - expectation.cohorts.minimum_birth_year + 1;
        const numOutcomes = expectation.outcomes.length;
        return <div className="mt-3 mb-5 p-3 border">
            <div className="h3">Template for {this.applicableScenarios()}</div>
            <div>
                Expecting data for:
                <ul>
                    <li id={"years"}>{numYears} years: {expectation.years.minimum_inclusive} - {expectation.years.maximum_inclusive}</li>
                    <li id={"ages"}>{numAges} ages: {expectation.ages.minimum_inclusive} - {expectation.ages.maximum_inclusive}</li>
                    {expectation.cohorts.minimum_birth_year &&
                    <li id={"cohorts"}>{numCohorts} cohorts: {expectation.cohorts.minimum_birth_year} - {expectation.cohorts.maximum_birth_year}</li>}
                    <li id={"countries"}>{numCountries} countries: {expectation.countries.map(c => c.name).join(", ")}</li>
                    <li id={"outcomes"}>{numOutcomes} outcomes: {expectation.outcomes.join(", ")}</li>
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
