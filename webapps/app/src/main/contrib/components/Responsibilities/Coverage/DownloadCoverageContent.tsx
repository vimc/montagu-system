import * as React from "react";
import { connectToStores } from "../../../../shared/alt";
import { CoverageSet, Scenario, Touchstone } from "../../../../shared/models/Generated";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { CoverageSetList } from "./CoverageSetList";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { coverageTokenActions } from "../../../actions/CoverageActions";
import { OneTimeButton } from "../../../../shared/components/OneTimeButton";
import { FormatControl } from "../FormatControl";
import { HasFormatOption } from "../Demographics/DemographicOptions";
import { doNothing } from "../../../../shared/Helpers";
import { responsibilityActions } from "../../../actions/ResponsibilityActions";
import { coverageSetActions } from "../../../actions/CoverageSetActions";

const commonStyles = require("../../../../shared/styles/common.css");
const styles = require("../Responsibilities.css");

export interface DownloadCoverageComponentProps extends RemoteContent {
    touchstone?: Touchstone;
    scenario?: Scenario;
    coverageSets?: CoverageSet[];
    coverageToken?: string;
    downloadButtonDisableTimeout?: number;
    selectedFormat?: string;
}

interface DownloadState {
    downloadButtonEnabled: boolean;
}

export class DownloadCoverageContentComponent
    extends RemoteContentComponent<DownloadCoverageComponentProps, DownloadState>
{
    downloadButtonDisableTimeout: number;

    constructor(props?: DownloadCoverageComponentProps) {
        super(props);
        this.state = {
            downloadButtonEnabled: true,
        };
        this.onDownloadClicked = this.onDownloadClicked.bind(this);
        this.downloadButtonDisableTimeout = this.props.downloadButtonDisableTimeout
            ? this.props.downloadButtonDisableTimeout
            : 5000;
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
            coverageSets: curResp ? curResp.coverageSets : null,
            coverageToken: state.coverageOneTimeToken,
            selectedFormat: state.selectedFormat,
        };
    }

    onSelectFormat(format: string) {
        coverageSetActions.selectFormat(format);
        responsibilityStore.fetchOneTimeCoverageToken().catch(doNothing);
    }

    refreshToken() {
        coverageTokenActions.clearUsedToken();
        responsibilityStore.fetchOneTimeCoverageToken();
    }

    onDownloadClicked() {
        setTimeout(() => {
            this.setState({
                downloadButtonEnabled: false,
            })
        });
        setTimeout(() => {
            this.setState({
                downloadButtonEnabled: true,
            })
        }, this.downloadButtonDisableTimeout);
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
                    <table className={commonStyles.specialColumn}>
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
                    <div className={commonStyles.smallTitle}>Coverage sets included</div>
                    <CoverageSetList coverageSets={data.coverageSets}/>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-12 col-md-6">
                    <table className={styles.options}>
                        <tbody>
                        <tr className={commonStyles.specialColumn}>
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
                <OneTimeButton
                    token={data.coverageToken}
                    refreshToken={this.refreshToken}
                    enabled={this.state.downloadButtonEnabled}
                    onClick={this.onDownloadClicked}
                >
                    Download combined coverage set data in CSV format
                </OneTimeButton>
            </div>
        </div>;
    }
}

export const DownloadCoverageContent = connectToStores(DownloadCoverageContentComponent);