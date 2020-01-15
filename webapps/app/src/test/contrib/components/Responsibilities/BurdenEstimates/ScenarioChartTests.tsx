import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {
    ChartLabel,
    FlexibleWidthXYPlot,
    Hint,
    HorizontalGridLines,
    VerticalBarSeries,
    VerticalBarSeriesCanvas,
    VerticalGridLines,
    XAxis,
    XYPlot,
    YAxis
} from 'react-vis';

import {
    CustomAxisLabel,
    ScenarioChart,
    ScenarioChartKey
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/ScenarioChart";


describe("Scenario chart", () => {

    const ageRange = {maximum_inclusive: 10, minimum_inclusive: 1};
    const yearRange = {maximum_inclusive: 2000, minimum_inclusive: 1980};
    const data = {1: [{x: 2000, y: 1}, {x: 2001, y: 2}], 2: [{x: 2000, y: 1}, {x: 2001, y: 2}]}

    test("renders age range key", () => {
        const rendered = shallow(<ScenarioChart data={data}
                                                ages={ageRange}
                                                years={yearRange}
                                                scenarioId={"s1"}
                                                setId={1} outcome={"deaths"}/>).dive();

        expect(rendered.find(ScenarioChartKey).props()).to.deep.eq({
            ageRange: 9,
            maxAge: 10
        })
    });

    test("renders one series for each age", () => {
        const rendered = shallow(<ScenarioChart
            data={data}
            ages={ageRange}
            years={yearRange}
            scenarioId={"s1"}
            setId={1} outcome={"deaths"}/>).dive();

        expect(rendered.find(VerticalBarSeries)).to.have.lengthOf(2);
    });

    test("renders title", () => {
        const rendered = shallow(<ScenarioChart
            data={data}
            ages={ageRange}
            years={yearRange}
            scenarioId={"s1"}
            setId={1} outcome={"cases"}/>).dive();

        expect(rendered.find(".chart-title").text()).to.eq("Yearly cases across all countries, disaggregated by age");
    });

    test("renders axis labels", () => {
        const rendered = shallow(<ScenarioChart
            data={data}
            ages={ageRange}
            years={yearRange}
            scenarioId={"s1"}
            setId={1} outcome={"cases"}/>).dive();

        expect(rendered.find(CustomAxisLabel).at(0).prop("title")).to.eq("Cases");
        expect(rendered.find(CustomAxisLabel).at(1).prop("title")).to.eq("Year");
    });

    describe("Scenario chart key", () => {

        test("renders one key bar for each age", () => {
            const rendered = shallow(<ScenarioChartKey maxAge={10} ageRange={3}/>);
            expect(rendered.find(".ageKey")).to.have.lengthOf(3);
        });
    });

});