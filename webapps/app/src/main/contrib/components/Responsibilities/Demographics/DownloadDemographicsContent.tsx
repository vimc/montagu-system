import * as React from 'react';
import {branch, compose, renderComponent} from "recompose";
import {connect} from 'react-redux';

import {DemographicDataset, TouchstoneVersion} from "../../../../shared/models/Generated";
import {DemographicOptions} from "./DemographicOptions";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {FileDownloadButton} from "../../../../shared/components/FileDownloadLink";

export interface DownloadDemographicsContentProps {
    dataSets: DemographicDataset[];
    selectedDataSet: DemographicDataset;
    selectedGender: string;
    selectedFormat: string;
    touchstone: TouchstoneVersion;
}

export class DownloadDemographicsContentComponent extends React.Component<DownloadDemographicsContentProps> {
    render() {
        const canDownload = DownloadDemographicsContentComponent.canDownload(this.props);
        const {touchstone, selectedDataSet, selectedFormat, selectedGender} = this.props;
        let url: string = null;
        if (canDownload) {
            url = `/touchstones/${touchstone.id}/demographics/${selectedDataSet.source}/${selectedDataSet.id}/?format=${selectedFormat}&gender=${selectedGender}`;
        }

        return <div className="demographics">
            <div className="sectionTitle">
                Demographic data for {this.props.touchstone.description}
            </div>
            <div>
                <p>
                    All available datasets are based on the UNWPP 2017 release, with the
                    exception of neonatal (28 day) mortality which is a hybrid between the
                    UNWPP infant mortality (available 1950 to 2100) and neonatal mortality
                    from IGME/childmortality.org.
                </p>
                <p>
                    Select the following options to download a CSV file containing
                    demographic data for this touchstone. Not all data sets are expected
                    to be relevant to all modellers.
                </p>
            </div>
            <DemographicOptions/>
            <FileDownloadButton
                href={url}
                enabled={canDownload}
                delayBeforeReenable={5}
            >
                Download data set
            </FileDownloadButton>
        </div>;
    }

    static canDownload(props: DownloadDemographicsContentProps): boolean {
        return props.selectedDataSet != null
            && (!props.selectedDataSet.gender_is_applicable || props.selectedGender != null)
    }
}

export const mapStateToProps = (state: ContribAppState): Partial<DownloadDemographicsContentProps> => {
    return {
        touchstone: state.touchstones.currentTouchstoneVersion,
        dataSets: state.demographic.dataSets,
        selectedDataSet: state.demographic.selectedDataSet,
        selectedGender: state.demographic.selectedGender,
        selectedFormat: state.demographic.selectedFormat,
    }
};

export const DownloadDemographicsContent = compose(
    connect(mapStateToProps),
    branch((props: DownloadDemographicsContentProps) => !props.touchstone, renderComponent(LoadingElement))
)(DownloadDemographicsContentComponent) as React.ComponentClass<Partial<DownloadDemographicsContentProps>>;
