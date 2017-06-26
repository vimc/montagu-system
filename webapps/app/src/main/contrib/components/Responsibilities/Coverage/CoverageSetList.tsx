import * as React from "react";
import { CoverageSet } from "../../../../shared/models/Generated";
import { CoverageSetComponent } from "./CoverageSetComponent";

const styles = require("../Responsibilities.css");
const commonStyles = require("../../../../shared/styles/common.css");

interface Props {
    coverageSets: CoverageSet[];
}

export class CoverageSetList extends React.Component<Props, undefined> {
    render() {
        if (this.props.coverageSets) {
            const coverageSets = this.props.coverageSets.map((x, order) =>
                <CoverageSetComponent key={ order } order={ order } set={ x }/>
            );
            return <div className={[styles.coverageSets, commonStyles.gapAbove].join(" ")}>
                <div>These coverage sets must be applied in the following order:</div>
                <table>
                    <thead>
                    <tr>
                        <th>Order</th>
                        <th>Description</th>
                        <th>Vaccine</th>
                        <th>Activity type</th>
                        <th>GAVI support level</th>
                    </tr>
                    </thead>
                    <tbody>{ coverageSets }</tbody>
                </table>
            </div>;
        } else {
            return null;
        }
    }
}