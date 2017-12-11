import * as React from "react";

import { CoverageSet } from "../../../../shared/models/Generated";

import "../Responsibilities.scss";

export interface CoverageSetComponentProps {
    order: number,
    set: CoverageSet
}

export class CoverageSetComponent extends React.Component<CoverageSetComponentProps, undefined> {
    render() {
        return <tr>
            <td><div className="col py-2">{ this.props.set.name }</div></td>
            <td><div className="col py-2">{ this.props.set.vaccine }</div></td>
            <td><div className="col py-2">{ this.props.set.activity_type }</div></td>
            <td><div className="col py-2">{ this.props.set.gavi_support }</div></td>
        </tr>;
    }
}