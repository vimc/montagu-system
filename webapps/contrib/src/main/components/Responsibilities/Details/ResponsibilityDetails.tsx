import * as React from "react";
import { Store } from "../../../stores/ResponsibilityStore";
import { connectToStores } from "../../../alt";
import { CoverageSet, Scenario, Touchstone } from "../../../models/Generated";
import { CoverageSetComponent } from "./CoverageSetComponent";
import { RemoteContent } from "../../../stores/RemoteContent";
import { RemoteContentComponent } from "../../RemoteContentComponent/RemoteContentComponent";
import { ButtonLink } from "../../ButtonLink";
import { CoverageSetList } from "./CoverageSetList";
const commonStyles = require("../../../styles/common.css");

export interface ResponsibilityDetailsProps extends RemoteContent {
    touchstone?: Touchstone;
    scenario?: Scenario;
    coverageSets?: CoverageSet[];
}

export class ResponsibilityDetailsComponent extends RemoteContentComponent<ResponsibilityDetailsProps> {
    static getStores() {
        return [ Store ];
    }
    static getPropsFromStores(): ResponsibilityDetailsProps {
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

    renderContent(props: ResponsibilityDetailsProps) {
        return <div>
            <table className={ commonStyles.specialColumn }>
                <tbody>
                    <tr><td>Touchstone</td><td>{ this.props.touchstone.description }</td></tr>
                    <tr><td>Scenario</td><td>{ this.props.scenario.description }</td></tr>
                </tbody>
            </table>
            <CoverageSetList coverageSets={ this.props.coverageSets } />
            <div className={ commonStyles.gapAbove }>
                <ButtonLink href="/">Download combined coverage set data in CSV format</ButtonLink>
            </div>
        </div>;
    }
}

export const ResponsibilityDetails = connectToStores(ResponsibilityDetailsComponent);