import * as React from "react";
import { Responsibility, Touchstone } from "../../Models";
import { Store } from "../../stores/MainStore";
import { ButtonLink } from "../ButtonLink";

const styles = require("./Responsibilities.css");

interface Props {
    responsibility: Responsibility;
    touchstone: Touchstone;
}

export class ResponsibilityComponent extends React.Component<Props, undefined> {
    render() {
        const item = this.props.responsibility;
        const downloadUrl = `/responsibilities/${ this.props.touchstone.id }/${ item.scenario.id }/`;

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
                        <ButtonLink href={ downloadUrl }>Download input data</ButtonLink>
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