import * as React from 'react';
import {branch, compose, renderComponent} from "recompose";
import {connect} from 'react-redux';
import {DemographicDataset, TouchstoneVersion} from "../../models/APITypes";
import {DemographicOptions} from "./DemographicOptions";
import {FileDownloadButton} from "../FileDownloadLink";
import {ContribAppState} from "../../../contrib/reducers/contribAppReducers";
import {LoadingElement} from "../../partials/LoadingElement/LoadingElement";

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
            url = `/touchstones/${touchstone.id}/demographics/${selectedDataSet.source}/${selectedDataSet.id}/csv/?format=${selectedFormat}`
            if (this.props.selectedDataSet.gender_is_applicable || this.props.selectedGender != null) {
                url += `&gender=${selectedGender}`;
            }
        }

        const defaultDescription = <div>
            <p>
                All available datasets are based on UNWPP, with the
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

        const rfp2022Description = <div>
            <p>
                All available datasets pertain only to the anonymous pre-defined country (labelled here as 'RfP').
            </p>
            <p>
                You must use these standardised demographic datasets, rather than demography from other sources.
            </p>
            <p>
                Select the following options to download a CSV file containing demographic data for this touchstone.
                Not all datasets are expected to be relevant to all modellers.
            </p>
        </div>

        const description = touchstone.id.indexOf("202212rfp") > -1 ? rfp2022Description : defaultDescription;

        return <div className="demographics">
            <div className="sectionTitle">
                Demographic data for {this.props.touchstone.description}
            </div>
            {description}
            <DemographicOptions/>
            <FileDownloadButton
                href={url}
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
        dataSets: state.demographics.dataSets,
        selectedDataSet: state.demographics.selectedDataSet,
        selectedGender: state.demographics.selectedGender,
        selectedFormat: state.demographics.selectedFormat,
    }
};

export const DownloadDemographicsContent = compose(
    connect(mapStateToProps),
    branch((props: DownloadDemographicsContentProps) => !props.touchstone, renderComponent(LoadingElement))
)(DownloadDemographicsContentComponent) as React.ComponentClass<Partial<DownloadDemographicsContentProps>>;
