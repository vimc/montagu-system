import * as React from "react";
import { CoverageSet } from "../../../../shared/models/Generated";
const styles = require("../Responsibilities.css");

export interface CoverageSetComponentProps {
    order: number,
    set: CoverageSet
}

export class CoverageSetComponent extends React.Component<CoverageSetComponentProps, undefined> {
    render() {
        return <tr>
            <td>{ this.props.order + 1 }</td>
            <td>{ this.props.set.name }</td>
            <td>{ this.props.set.vaccine }</td>
            <td>{ this.props.set.activity_type }</td>
            <td>{ this.props.set.gavi_support }</td>
        </tr>;
    }
}