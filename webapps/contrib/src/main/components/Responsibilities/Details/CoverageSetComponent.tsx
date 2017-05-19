import * as React from "react";
import { CoverageSet } from "../../../models/Generated";
const styles = require("../Responsibilities.css");

interface Props {
    order: number,
    set: CoverageSet
}

export class CoverageSetComponent extends React.Component<Props, undefined> {
    render() {
        return <tr>
            <td>{ this.props.order + 1 }</td>
            <td>{ this.props.set.name }</td>
            <td>{ this.props.set.vaccine }</td>
            <td>{ this.props.set.activity_type }</td>
            <td>{ this.props.set.gavi_support_level }</td>
        </tr>;
    }
}