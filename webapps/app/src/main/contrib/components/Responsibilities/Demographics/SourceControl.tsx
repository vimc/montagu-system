import * as React from "react";
import { ChangeEvent, EventHandler } from "react";
import { DemographicStatisticType } from "../../../../shared/models/Generated";

const styles = require("../Responsibilities.css");

interface Props {
    dataSet: DemographicStatisticType;
    onSelect: EventHandler<ChangeEvent<HTMLSelectElement>>;
    selected: string;
}

export class SourceControl extends React.Component<Props, undefined> {
    render() {
        const props = this.props;
        let sources: JSX.Element[] = [];
        if (props.dataSet != null) {
            sources = props.dataSet.sources.map(x => <option key={x} value={x}>{x}</option>);
        }

        return <select
            className={styles.source}
            onChange={props.onSelect}
            value={props.selected}
            disabled={sources.length == 0}
        >
            <option value="">- Select -</option>
            {sources}
        </select>;
    }
}