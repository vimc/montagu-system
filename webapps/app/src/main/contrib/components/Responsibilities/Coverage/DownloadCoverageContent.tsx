import * as React from "react";
import { Action, Dispatch } from "redux";
import { compose, branch, renderComponent} from "recompose";
import { connect } from 'react-redux';

import { CoverageSet, Scenario, Touchstone } from "../../../../shared/models/Generated";
import { CoverageSetList } from "./CoverageSetList";
import { OneTimeButton } from "../../../../shared/components/OneTimeButton/OneTimeButton";
import { OneTimeButtonTimeBlocker } from "../../../../shared/components/OneTimeButton/OneTimeButtonTimeBlocker";
import { FormatControl } from "../FormatControl";

import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {coverageActionCreators} from "../../../actions/coverageActionCreators";

export interface DownloadCoverageContentProps {
    touchstone: Touchstone;
    scenario: Scenario;
    coverageSets: CoverageSet[];
    token: string;
    selectedFormat: string;
    loadToken: () => void;
    setFormat: (format: string) => void;
}

const ButtonWithTimeout = OneTimeButtonTimeBlocker(OneTimeButton);

export class DownloadCoverageContentComponent extends React.Component<DownloadCoverageContentProps> {

    ButtonWithTimeout?: any;

    constructor() {
        super();
        this.onSelectFormat = this.onSelectFormat.bind(this);
    }

    onSelectFormat(format: string) {
        this.props.setFormat(format);
        this.props.loadToken()
        if (this.ButtonWithTimeout) this.ButtonWithTimeout.enable();
    }

    render() {
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
                                <div className="col">{this.props.touchstone.description}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col">
                                    <label className="col-form-label">Scenario</label>
                                </div>
                            </td>
                            <td>
                                <div className="col">{this.props.scenario.description}</div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-12">
                    <div className="smallTitle">Coverage sets included</div>
                    <CoverageSetList coverageSets={this.props.coverageSets}/>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-12 col-md-6">
                    <div className="smallTitle">Choose format</div>
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
                                value={this.props.selectedFormat}
                                onSelectFormat={this.onSelectFormat}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-4">
                <ButtonWithTimeout
                    token={this.props.token}
                    refreshToken={() => this.props.loadToken()}
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

export const mapStateToProps = (state: ContribAppState): Partial<DownloadCoverageContentProps> => {
    return {
        touchstone: state.touchstones.currentTouchstone,
        coverageSets: state.coverage.dataSets,
        selectedFormat: state.coverage.selectedFormat,
        scenario: state.responsibilities.currentResponsibility ? state.responsibilities.currentResponsibility.scenario : null,
        token: state.coverage.token
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<DownloadCoverageContentProps> => {
    return {
        loadToken: () => dispatch(coverageActionCreators.getOneTimeToken()),
        setFormat: (format: string) => dispatch(coverageActionCreators.setFormat(format))
    }
};

export const DownloadCoverageContent = compose(
    connect(mapStateToProps, mapDispatchToProps),
    branch((props: DownloadCoverageContentProps) => !props.touchstone || !props.scenario, renderComponent(LoadingElement))
)(DownloadCoverageContentComponent) as React.ComponentClass<Partial<DownloadCoverageContentProps>>;
