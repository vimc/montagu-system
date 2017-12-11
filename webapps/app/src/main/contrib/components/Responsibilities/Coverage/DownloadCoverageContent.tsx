import * as React from "react";
import { connectToStores } from "../../../../shared/alt";
import { CoverageSet, Scenario, Touchstone } from "../../../../shared/models/Generated";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { CoverageSetList } from "./CoverageSetList";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { coverageTokenActions } from "../../../actions/CoverageActions";
import { OneTimeButton } from "../../../../shared/components/OneTimeButton";
import { OneTimeButtonTimeBlocker } from "../../../../shared/components/OneTimeButtonTimeBlocker";
import { FormatControl } from "../FormatControl";
import { HasFormatOption } from "../Demographics/DemographicOptions";
import { doNothing } from "../../../../shared/Helpers";
import { responsibilityActions } from "../../../actions/ResponsibilityActions";
import { coverageSetActions } from "../../../actions/CoverageSetActions";

import "../../../../shared/styles/common.scss";
import "../Responsibilities.scss";

export interface DownloadCoverageComponentProps extends RemoteContent {
    touchstone: Touchstone;
    scenario: Scenario;
    coverageSets: CoverageSet[];
    coverageToken: string;
    selectedFormat: string;
}

const ButtonWithTimeout = OneTimeButtonTimeBlocker(OneTimeButton);

export class DownloadCoverageContentComponent
    extends RemoteContentComponent<DownloadCoverageComponentProps, undefined>
{
    ButtonWithTimeout?: any;

    constructor() {
        super();
        this.onSelectFormat = this.onSelectFormat.bind(this);
    }

    static getStores() {
        return [responsibilityStore];
    }

    static getPropsFromStores(): DownloadCoverageComponentProps {
        const state = responsibilityStore.getState();
        const curResp = state.currentResponsibility;
        return {
            ready: curResp ? state.ready : false,
            touchstone: state.currentTouchstone,
            scenario: curResp ? curResp.scenario : null,
            coverageSets: curResp ? curResp.coverageSets : [],
            coverageToken: state.coverageOneTimeToken,
            selectedFormat: state.selectedFormat,
        };
    }

    onSelectFormat(format: string) {
        coverageSetActions.selectFormat(format);
        responsibilityStore.fetchOneTimeCoverageToken().catch(doNothing);
        if (this.ButtonWithTimeout) this.ButtonWithTimeout.enable();
    }

    refreshToken() {
        coverageTokenActions.clearUsedToken();
        responsibilityStore.fetchOneTimeCoverageToken();
    }

    renderContent(props: DownloadCoverageComponentProps) {
        const data = props;
        return <div>
            <p>
                Each scenario is based on vaccination coverage from up to 3 different
                coverage sets (eg. routine and campaign). The datasets to download
                here contain data on all coverage sets to be included in a particular
                scenario. Note that there are no coverage sets included in the no
                vaccination scenario, and therefore the coverage file does not
                contain any data apart from the header row.
            </p>
            <div className="row mt-3">
                <div className="col-12 col-md-8 col-lg-6">
                    <table className="specialColumn">
                        <tbody>
                        <tr>
                            <td>
                                <div className="col">
                                    <label className="col-form-label">Touchstone</label>
                                </div>
                            </td>
                            <td>
                                <div className="col">{data.touchstone.description}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col">
                                    <label className="col-form-label">Scenario</label>
                                </div>
                            </td>
                            <td>
                                <div className="col">{data.scenario.description}</div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-12">
                    <div className="smallTitle">Coverage sets included</div>
                    <CoverageSetList coverageSets={data.coverageSets}/>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-12 col-md-6">
                    <table className="options">
                        <tbody>
                        <tr className="specialColumn">
                            <td>
                                <div className="col">
                                    <label className="col-form-label">
                                        Format
                                    </label>
                                </div>
                            </td>
                            <td><FormatControl
                                value={props.selectedFormat}
                                onSelectFormat={this.onSelectFormat}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-4">
                <ButtonWithTimeout
                    token={data.coverageToken}
                    refreshToken={this.refreshToken}
                    disableDuration={1000}
                    enabled={true}
                    onRef={ref => (this.ButtonWithTimeout = ref)}
                >
                    Download combined coverage set data in CSV format
                </ButtonWithTimeout>
            </div>
        </div>;
    }
}

export const DownloadCoverageContent = connectToStores(DownloadCoverageContentComponent);