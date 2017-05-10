import * as React from "react";
import { Responsibility } from "../../Models";
import { Store } from "../../stores/MainStore";

const styles = require("./Responsibilities.css");

export class ResponsibilityComponent extends React.Component<Responsibility, undefined> {
    render() {
        const item = this.props;
        return <li className={ styles.scenario }>
            <div className={ styles.header }>
                <span className={ styles.name }>{ item.scenario.description }</span>
                &nbsp;
                (ID: { item.scenario.id })
                <span className={ styles.status }>{ item.status }</span>
            </div>
            <div>
                <div className={ styles.content }>
                    <div className={ styles.metadata }>
                        Disease: { Store.getDiseaseById(item.scenario.disease).name }
                    </div>
                    <div className={ styles.actions }>
                        <button>Download input data</button>
                        <button>Upload a new burden estimate set</button>
                    </div>
                    <div className={ styles.estimates }>
                        You have not uploaded any burden estimate sets.
                    </div>
                </div>
            </div>
        </li>
    }
}