import * as React from "react";
import { Store } from "../../stores/ResponsibilityStore";
import { connectToStores } from "../../alt";
import { CoverageSet, Scenario, Touchstone } from "../../models/Generated";
import { CoverageSetComponent } from "./CoverageSetComponent";
import { RemoteContent } from "../../stores/RemoteContent";
import { RemoteContentComponent } from "../RemoteContentComponent/RemoteContentComponent";
import { ButtonLink } from "../ButtonLink";
const commonStyles = require("../../styles/common.css");
const styles = require("./Responsibilities.css");

interface Props extends RemoteContent {
    touchstone?: Touchstone;
    scenario?: Scenario;
    coverageSets?: CoverageSet[];
}

export class ResponsibilityDetailsComponent extends RemoteContentComponent<Props> {
    static getStores() {
        return [ Store ];
    }
    static getPropsFromStores(): Props {
        const r = Store.getState().currentResponsibility;
        if (r != null) {
            return {
                touchstone: Store.getState().currentTouchstone,
                scenario: r.scenario,
                coverageSets: r.coverageSets,
                ready: Store.getState().ready
            };
        } else {
            return { ready: false };
        }
    }

    renderContent(props: Props) {
        const coverageSets = props.coverageSets.map((x, order) =>
            <CoverageSetComponent key={ order } order={ order } set={ x } />
        );
        return <div>
            <table className={ commonStyles.specialColumn }>
                <tbody>
                    <tr><td>Touchstone</td><td>{ this.props.touchstone.description }</td></tr>
                    <tr><td>Scenario</td><td>{ this.props.scenario.description }</td></tr>
                </tbody>
            </table>
            <div className={[ styles.coverageSets, commonStyles.gapAbove ].join(" ")}>
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
            </div>
            <div className={ commonStyles.gapAbove }>
                <ButtonLink href="/">Download combined coverage set data in CSV format</ButtonLink>
            </div>
        </div>;
    }
}

export const ResponsibilityDetails = connectToStores(ResponsibilityDetailsComponent);