import * as React from "react";
import { connectToStores } from "../../../../shared/alt";
import { CoverageSet, Scenario, Touchstone } from "../../../../shared/models/Generated";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { CoverageSetList } from "./CoverageSetList";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import fetcher from "../../../../shared/sources/Fetcher";
import { coverageTokenActions } from "../../../actions/CoverageActions";
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

    refreshToken(e: React.MouseEvent<HTMLButtonElement>): void {
        setTimeout(() => {
            coverageTokenActions.clearUsedToken();
            responsibilityStore.fetchOneTimeCoverageToken();
        });
    }

    renderContent(props: DownloadCoverageComponentProps) {
        const data = props.props;
        const url = fetcher.fetcher.buildURL(`/onetime_link/${data.coverageToken}/`);
        const downloadDisabled = data.coverageToken == null;
        return <div>
            <table className={ commonStyles.specialColumn }>
                <tbody>
                    <tr><td>Touchstone</td><td>{ data.touchstone.description }</td></tr>
                    <tr><td>Scenario</td><td>{ data.scenario.description }</td></tr>
                </tbody>
            </table>
            <CoverageSetList coverageSets={ data.coverageSets } />
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

export const DownloadCoverageContent = connectToStores(DownloadCoverageContentComponent);