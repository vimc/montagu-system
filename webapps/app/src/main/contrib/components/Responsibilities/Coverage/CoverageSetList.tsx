import * as React from "react";
import { CoverageSet } from "../../../../shared/models/Generated";
import { CoverageSetComponent } from "./CoverageSetComponent";

import "../Responsibilities.scss";
import "../../../../shared/styles/common.scss";

interface Props {
    coverageSets: CoverageSet[];
}

export class CoverageSetList extends React.Component<Props, undefined> {
    render() {
        if (this.props.coverageSets) {
            const coverageSets = this.props.coverageSets.map((x, order) =>
                <CoverageSetComponent key={order} order={order} set={x}/>
            );
            return <div className="coverageSets">
                <table className="table table-responsive">
                    <thead>
                    <tr>
                        <th>
                            <div className="col"><label className="col-form-label">Description</label></div>
                        </th>
                        <th>
                            <div className="col"><label className="col-form-label">Vaccine</label></div>
                        </th>
                        <th>
                            <div className="col"><label className="col-form-label">Activity type</label></div>
                        </th>
                        <th>
                            <div className="col"><label className="col-form-label">GAVI support level</label></div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>{coverageSets}</tbody>
                </table>
            </div>;
        } else {
            return null;
        }
    }
}