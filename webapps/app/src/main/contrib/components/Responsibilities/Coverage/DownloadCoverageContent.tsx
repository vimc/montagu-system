import * as React from "react";
import { connectToStores } from "../../../../shared/alt";
import { CoverageSet, Scenario, Touchstone } from "../../../../shared/models/Generated";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { CoverageSetList } from "./CoverageSetList";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import fetcher from "../../../../shared/sources/Fetcher";
import { coverageTokenActions } from "../../../actions/CoverageActions";
import { OneTimeButton } from "../../../../shared/components/OneTimeButton";

const commonStyles = require("../../../../shared/styles/common.css");

export interface DownloadCoverageComponentProps extends RemoteContent {
    props: {
        touchstone: Touchstone;
        scenario: Scenario;
        coverageSets: CoverageSet[];
        coverageToken: string;
    };
}

export class DownloadCoverageContentComponent extends RemoteContentComponent<DownloadCoverageComponentProps> {
    static getStores() {
        return [ responsibilityStore ];
    }
    static getPropsFromStores(): DownloadCoverageComponentProps {
        const state = responsibilityStore.getState();
        const r = state.currentResponsibility;
        if (r != null) {
            return {
                ready: state.ready,
                props: {
                    touchstone: state.currentTouchstone,
                    scenario: r.scenario,
                    coverageSets: r.coverageSets,
                    coverageToken: state.coverageOneTimeToken
                }
            };
        } else {
            return {
                ready: false,
                props: null
            };
        }
    }

    refreshToken() {
        coverageTokenActions.clearUsedToken();
        responsibilityStore.fetchOneTimeCoverageToken();
    }

    renderContent(props: DownloadCoverageComponentProps) {
        const data = props.props;
        return <div>
            <p>
                Each scenario is based on vaccination coverage from up to 3 different
                coverage sets (eg. routine and campaign). The datasets to download
                here contain data on all coverage sets to be included in a particular
                scenario. Note that there are no coverage sets included in the no
                vaccination scenario, and therefore the coverage file does not
                contain any data apart from the header row.
            </p>
            <table className={ commonStyles.specialColumn }>
                <tbody>
                    <tr><td>Touchstone</td><td>{ data.touchstone.description }</td></tr>
                    <tr><td>Scenario</td><td>{ data.scenario.description }</td></tr>
                </tbody>
            </table>

            <div className={ commonStyles.gapAbove }>
                <div className={ commonStyles.smallTitle }>Coverage sets included</div>
                <CoverageSetList coverageSets={ data.coverageSets } />
            </div>
            <div className={ commonStyles.gapAbove }>
                <OneTimeButton token={ data.coverageToken } refreshToken={ this.refreshToken }>
                    Download combined coverage set data in CSV format
                </OneTimeButton>
            </div>
        </div>;
    }
}

export const DownloadCoverageContent = connectToStores(DownloadCoverageContentComponent);