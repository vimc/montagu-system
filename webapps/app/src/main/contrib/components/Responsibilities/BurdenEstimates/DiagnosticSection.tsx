import * as React from "react";
import {ChangeEvent} from "react";
import {compose} from "recompose";
import {connect} from 'react-redux';
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {Dispatch} from "redux";
import {BurdenOutcome} from "../../../actionTypes/EstimateTypes";
import {estimatesActionCreators} from "../../../actions/estimatesActionCreators";
import {ScenarioChart} from "./ScenarioChart";
import withLifecycle, {LifecycleMethods} from "@hocs/with-lifecycle";
import {FormGroup, Input, Label} from "reactstrap";
import {ILookup} from "../../../../shared/models/Lookup";
import {DataPoint} from "../../../reducers/estimatesReducer";
import {NumberRange} from "../../../../shared/models/Generated";

export interface DiagnosticSectionPublicProps {
    scenarioId: string,
    setId: number
}

export interface DiagnosticSectionProps {
    setChartType: (outcome: BurdenOutcome) => void;
    getData: (outcome: BurdenOutcome,
              scenarioId: string,
              setId: number) => void;
    data: ILookup<DataPoint[]>;
    ages: NumberRange;
    years: NumberRange;
    scenarioId: string;
    setId: number;
    outcome: BurdenOutcome
}

export class DiagnosticSectionComponent extends React.Component<DiagnosticSectionProps> {

    onChangeOutcome(e: ChangeEvent<HTMLInputElement>){
        this.props.setChartType(e.target.value as BurdenOutcome);
    }

    render() {

        return <div className={"mt-5"}>
            <h2>Diagnostics</h2>
            <p>As a quick check on your most recently uploaded estimates for this scenario, the following graph shows
                key outcomes aggregated across all countries, disaggregated by age.</p>
            <FormGroup>
                <Label for="outcome">Burden outcome:</Label>
                <Input type="select" name="outcome" id="outcome" style={{width: "100px"}}
                       defaultValue={"deaths"} onChange={this.onChangeOutcome.bind(this)}>
                    <option value={"deaths"}>Deaths</option>
                    <option value={"cases"}>Cases</option>
                    <option value={"dalys"}>Dalys</option>
                </Input>
            </FormGroup>
            <ScenarioChart scenarioId={this.props.scenarioId}
                           setId={this.props.setId}
                           ages={this.props.ages}
                           years={this.props.years}
                           data={this.props.data}
                           outcome={this.props.outcome}/>
        </div>
    }
}

const mapStateToProps = (state: ContribAppState, props: DiagnosticSectionPublicProps): Partial<DiagnosticSectionProps> => {

    const expectations = state.responsibilities.responsibilitiesSet &&
        state.responsibilities.responsibilitiesSet.expectations
            .find(e => e.applicable_scenarios.indexOf(props.scenarioId) > -1)
            .expectation;

    let data = null;
    switch(state.estimates.chartType) {
        case BurdenOutcome.DEATHS:
            data = state.estimates.deaths && state.estimates.deaths[props.setId];
            break;
        case BurdenOutcome.DALYS:
            data = state.estimates.dalys && state.estimates.dalys[props.setId];
            break;
        case BurdenOutcome.CASES:
            data = state.estimates.cases && state.estimates.cases[props.setId];
            break
    }
    return {
        outcome: state.estimates.chartType,
        scenarioId: props.scenarioId,
        data: data,
        ages: expectations && expectations.ages,
        years: expectations && expectations.years
    };
};

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<DiagnosticSectionProps> => {
    return {
        setChartType: (outcome: BurdenOutcome) => dispatch(estimatesActionCreators.setChartType(outcome)),
        getData: (outcome: BurdenOutcome,
                  scenarioId: string,
                  setId: number) => dispatch(estimatesActionCreators.getEstimates(outcome, scenarioId, setId))
    }
};

const getData = (props: DiagnosticSectionProps) => {
    props.getData(BurdenOutcome.DEATHS, props.scenarioId, props.setId);
    props.getData(BurdenOutcome.DALYS, props.scenarioId, props.setId);
    props.getData(BurdenOutcome.CASES, props.scenarioId, props.setId);
};

const lifecyleProps: Partial<LifecycleMethods<DiagnosticSectionProps>> = {
    onDidMount(props: DiagnosticSectionProps) {
       getData(props);
    },
    onDidUpdate(prevProps: DiagnosticSectionProps, props: DiagnosticSectionProps) {
        if (props.setId != prevProps.setId || props.scenarioId != prevProps.scenarioId) {
            getData(props);
        }
    }
};


export const DiagnosticSection = compose<DiagnosticSectionProps, DiagnosticSectionPublicProps>(
    connect(mapStateToProps, mapDispatchToProps),
    withLifecycle(lifecyleProps)
)(DiagnosticSectionComponent);