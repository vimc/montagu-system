import * as React from "react";
import {ILookup} from "../../../../shared/models/Lookup";
import {format} from "d3-format";
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
import {NumberRange} from "../../../../shared/models/Generated";
import {interpolatePlasma} from "d3-scale-chromatic";
import {DataPoint} from "../../../reducers/estimatesReducer";
import {isNullOrUndefined} from "util";
import {branch, renderComponent} from "recompose";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {titleCase} from "../../../../shared/Helpers";

export interface ChartProps {
    data: ILookup<DataPoint[]>;
    ages: NumberRange;
    years: NumberRange;
    scenarioId: string,
    setId: number
    outcome: string
}

export const ScenarioChartKey = (props: { maxAge: number, ageRange: number }) => {

    const children = [];
    const numChildren = props.ageRange;
    const fraction = (1 / numChildren);
    for (let x = 1; x <= numChildren; x++) {
        children.push(<span key={x} className={"ageKey"} style={{borderRight: `1px solid ${interpolatePlasma(fraction * x)}`}}/>)
    }

    return <div className={"key float-right m-2"}>
        <span>ages:</span>
        <div>0 <span className="float-right">{props.maxAge}</span></div>
        {children}
    </div>

};

class ScenarioChartComponent extends React.Component<ChartProps> {

    ageRange() {
        return this.props.ages.maximum_inclusive - this.props.ages.minimum_inclusive;
    }

    renderBars() {
        const children = [];
        const numChildren = this.ageRange();
        const ages = this.props.ages;
        for (let x = ages.minimum_inclusive; x <= ages.maximum_inclusive; x++) {
            const data = this.props.data[x.toString()];
            if (data) {
                children.push(<VerticalBarSeries key={x}
                                                 color={interpolatePlasma((x - ages.minimum_inclusive + 1) / numChildren)}
                                                 data={data}/>)
            }
        }

        return children
    }

    render() {
        const title = `Yearly ${this.props.outcome} across all countries, disaggregated by age`;
        return (
            <div className={"bg-light p-3 mb-5 border border-secondary graph-wrapper"}>
                <div className={"m-2 chart-title"}>{title}</div>
                <ScenarioChartKey ageRange={this.ageRange()} maxAge={this.props.ages.maximum_inclusive}/>
                <XYPlot height={300} width={600} stackBy="y" margin={{left: 57}}>
                    <HorizontalGridLines/>
                    <XAxis tickFormat={(tick: any) => {
                        return tick.toString();
                    }}/>
                    <YAxis tickFormat={(tick: any) => {
                        return format('.2s')(tick);
                    }}/>
                    <CustomAxisLabel title={titleCase(this.props.outcome)} yAxis/>
                    <CustomAxisLabel title={'Year'} xAxis/>
                    {this.renderBars()}
                </XYPlot>
            </div>
        );
    }
}


function notReady(props: ChartProps): boolean {
    return isNullOrUndefined(props.data);
}

export const ScenarioChart = branch(notReady, renderComponent(LoadingElement))(ScenarioChartComponent);

// Taken from https://github.com/uber/react-vis/issues/542#issuecomment-331724888
export const CustomAxisLabel: any = (props: {
    title: string,
    xAxis?: boolean,
    // note these next two are passed down from the parent XYPlot/Flexible*XYPlot
    innerWidth?: number,
    innerHeight?: number
}) => {
    // since we rotate the y label, we have to adjust it to center
    // (ideally we'd rotate about the correct origin, but i couldn't get that working)
    const yLabelOffset = {
        y: props.innerHeight / 2 + props.title.length * 3, // '3' might be different for you depending on your font size/char width
        x: 10
    };

    const xLabelOffset = {
        x: props.innerWidth / 2,
        y: 1.2 * props.innerHeight // 1.2 was enough for me to get it below x axis. you may need a diff't #
    };
    const transform = props.xAxis
        ? `translate(${xLabelOffset.x}, ${xLabelOffset.y})`
        : `translate(${yLabelOffset.x}, ${yLabelOffset.y}) rotate(-90)`;

    return (
        <g transform={transform}>
            <text className="rv-xy-plot__axis__tick__text">{props.title}</text>
        </g>
    );
};

CustomAxisLabel.displayName = 'CustomAxisLabel';
CustomAxisLabel.requiresSVG = true;
