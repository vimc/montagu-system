import * as React from "react";
import { connectToStores } from "../../../alt";
import { CoverageSet, Scenario, Touchstone } from "../../../models/Generated";
import { RemoteContent } from "../../../stores/RemoteContent";
import { RemoteContentComponent } from "../../RemoteContentComponent/RemoteContentComponent";
import { CoverageSetList } from "./CoverageSetList";
import { Store } from "../../../stores/ResponsibilityStore";
import fetcher from "../../../sources/Fetcher";
import { coverageTokenActions } from "../../../actions/CoverageActions";
const commonStyles = require("../../../styles/common.css");

export interface ResponsibilityDetailsProps extends RemoteContent {
    touchstone?: Touchstone;
    scenario?: Scenario;
    coverageSets?: CoverageSet[];
    coverageToken?: string;
    bearerToken?: string;
}

export class ResponsibilityDetailsComponent extends RemoteContentComponent<ResponsibilityDetailsProps> {
    static getStores() {
        return [ Store ];
    }
    static getPropsFromStores(): ResponsibilityDetailsProps {
        const state = Store.getState();
        const r = state.currentResponsibility;
        if (r != null) {
            return {
                touchstone: state.currentTouchstone,
                scenario: r.scenario,
                coverageSets: r.coverageSets,
                coverageToken: state.coverageOneTimeToken,
                ready: state.ready
            };
        } else {
            return { ready: false };
        }
    }

    refreshToken(e: React.MouseEvent<HTMLButtonElement>): void {
        setTimeout(() => {
            coverageTokenActions.clearUsedToken();
            Store.fetchOneTimeCoverageToken();
        });
    }

    renderContent(props: ResponsibilityDetailsProps) {
        const url = fetcher.buildURL(`/onetime_link/${props.coverageToken}/`);
        const downloadDisabled = props.coverageToken == null;
        return <div>
            <table className={ commonStyles.specialColumn }>
                <tbody>
                    <tr><td>Touchstone</td><td>{ this.props.touchstone.description }</td></tr>
                    <tr><td>Scenario</td><td>{ this.props.scenario.description }</td></tr>
                </tbody>
            </table>
            <CoverageSetList coverageSets={ this.props.coverageSets } />
            <div className={ commonStyles.gapAbove }>
                <form action={ url }>
                    <button onClick={ this.refreshToken }
                            disabled={ downloadDisabled }
                            type="submit">
                        Download combined coverage set data in CSV format
                    </button>
                </form>
            </div>
        </div>;
    }
}

export const ResponsibilityDetails = connectToStores(ResponsibilityDetailsComponent);