import * as React from "react";
import {Dispatch} from "redux";
import {branch, compose, renderComponent} from "recompose";
import {connect} from 'react-redux';

import {CoverageSet, ModellingGroup, Scenario, TouchstoneVersion} from "../../../../shared/models/Generated";
import {CoverageSetList} from "./CoverageSetList";
import {FormatControl} from "../../../../shared/components/FormatControl";

import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {coverageActionCreators} from "../../../actions/coverageActionCreators";
import {withConfidentialityAgreement} from "../Overview/ConfidentialityAgreement";
import {FileDownloadButton} from "../../../../shared/components/FileDownloadLink";
import {UncontrolledTooltip} from "reactstrap";

export interface DownloadCoverageContentProps {
    group: ModellingGroup;
    touchstone: TouchstoneVersion;
    scenario: Scenario;
    coverageSets: CoverageSet[];
    selectedFormat: string;
    setFormat: (format: string) => void;
}

interface DownloadCoverageState {
    filterToExpectations: boolean
}

export class DownloadCoverageContentComponent extends React.Component<DownloadCoverageContentProps, DownloadCoverageState> {
    constructor() {
        super();
        this.state = {
            filterToExpectations: true
        };
        this.onSelectFormat = this.onSelectFormat.bind(this);
        this.toggleAllCountries = this.toggleAllCountries.bind(this);
    }

    onSelectFormat(format: string) {
        this.props.setFormat(format);
    }

    toggleAllCountries() {
        this.setState({
            filterToExpectations: !this.state.filterToExpectations
        })
    }

    render() {
        const {group, touchstone, scenario, selectedFormat} = this.props;

        const url = `/modelling-groups/${group.id}/responsibilities/${touchstone.id}/${scenario.id}/coverage/csv/`
            + `?format=${selectedFormat}&all-countries=${!this.state.filterToExpectations}`;

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
                    <div>
                        <span className="smallTitle">
                            Choose format
                        </span>
                        <a href={"#"} id={"format-tooltip"} className={"ml-1 small"} onClick={(e)=> {e.preventDefault()}}>What's this?</a>
                        <UncontrolledTooltip target="format-tooltip" className={"text-muted"}>
                            Wide format includes coverage and target values for all years in a single row. Long format
                            includes a row for each year.
                        </UncontrolledTooltip>
                    </div>
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
            <div className="row mt-4">
                <div className="col-12">
                   <label className="checkbox-inline"><input type="checkbox"
                                                             id={"filter-countries"}
                                                             className={"mr-1"}
                                                             onChange={this.toggleAllCountries}
                                                             checked={this.state.filterToExpectations} />
                       Filter to touchstone countries</label>
                    <a href={"#"} id={"countries-tooltip"} className={"ml-1 small"} onClick={(e)=> {e.preventDefault()}}>What's this?</a>
                    <UncontrolledTooltip target="countries-tooltip" className={"text-muted"}>When this is checked we will only include coverage data for
                        countries we expect burden estimates for in this touchstone. To include all the coverage data we have for this scenario, please de-select this option</UncontrolledTooltip>
                </div>
            </div>
            <div className="mt-4">
                <FileDownloadButton href={url} delayBeforeReenable={1}>
                    Download combined coverage set data in CSV format
                </FileDownloadButton>
            </div>
        </div>;
    }
}

export const mapStateToProps = (state: ContribAppState): Partial<DownloadCoverageContentProps> => {
    return {
        group: state.groups.currentUserGroup,
        touchstone: state.touchstones.currentTouchstoneVersion,
        coverageSets: state.coverage.dataSets,
        selectedFormat: state.coverage.selectedFormat,
        scenario: state.responsibilities.currentResponsibility ? state.responsibilities.currentResponsibility.scenario : null,
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<DownloadCoverageContentProps> => {
    return {
        setFormat: (format: string) => dispatch(coverageActionCreators.setFormat(format))
    }
};

export const DownloadCoverageContent = compose(
    connect(mapStateToProps, mapDispatchToProps),
    branch((props: DownloadCoverageContentProps) => !props.touchstone || !props.scenario, renderComponent(LoadingElement)),
    withConfidentialityAgreement
)(DownloadCoverageContentComponent) as React.ComponentClass<Partial<DownloadCoverageContentProps>>;
