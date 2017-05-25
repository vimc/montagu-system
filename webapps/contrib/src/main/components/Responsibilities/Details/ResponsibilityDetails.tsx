import * as React from "react";
import * as ResponsibilityStore from "../../../stores/ResponsibilityStore";
import * as AuthStore from "../../../stores/AuthStore";
import { connectToStores } from "../../../alt";
import { CoverageSet, Scenario, Touchstone } from "../../../models/Generated";
import { RemoteContent } from "../../../stores/RemoteContent";
import { RemoteContentComponent } from "../../RemoteContentComponent/RemoteContentComponent";
import { CoverageSetList } from "./CoverageSetList";
import { sources } from "../../../sources/Sources";
const commonStyles = require("../../../styles/common.css");

export interface ResponsibilityDetailsProps extends RemoteContent {
    touchstone?: Touchstone;
    scenario?: Scenario;
    coverageSets?: CoverageSet[];
    coverageURL?: string;
    bearerToken?: string;
}

export class ResponsibilityDetailsComponent extends RemoteContentComponent<ResponsibilityDetailsProps> {
    static getStores() {
        return [ ResponsibilityStore.Store, AuthStore.Store ];
    }
    static getPropsFromStores(): ResponsibilityDetailsProps {
        const state = ResponsibilityStore.Store.getState();
        const r = state.currentResponsibility;
        if (r != null) {
            return {
                touchstone: state.currentTouchstone,
                scenario: r.scenario,
                coverageSets: r.coverageSets,
                coverageURL: sources.coverageSets.coverageURL(state),
                bearerToken: AuthStore.Store.getState().bearerToken,
                ready: state.ready
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
                <form action={ props.coverageURL } method="post">
                    <input name="bearer-token" type="hidden" value={ props.bearerToken } />
                    <button type="submit">Download combined coverage set data in CSV format</button>
                </form>
            </div>
        </div>;
    }
}

export const ResponsibilityDetails = connectToStores(ResponsibilityDetailsComponent);