import * as React from 'react';
import { Action, Dispatch } from "redux";
import { compose, branch, renderComponent} from "recompose";
import { connect } from 'react-redux';

import { DemographicDataset, Touchstone } from "../../../../shared/models/Generated";
import { DemographicOptions } from "./DemographicOptions";
import { OneTimeButton } from "../../../../shared/components/OneTimeButton/OneTimeButton";
import { OneTimeButtonTimeBlocker } from "../../../../shared/components/OneTimeButton/OneTimeButtonTimeBlocker";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {demographicActionCreators} from "../../../actions/demographicActionCreators";

export interface DownloadDemographicsContentProps {
    dataSets: DemographicDataset[];
    selectedDataSet: DemographicDataset;
    selectedGender: string;
    selectedFormat: string;
    touchstone: Touchstone;
    token: string;
    refreshToken: () => void;
}

const ButtonWithTimeout = OneTimeButtonTimeBlocker(OneTimeButton);

export class DownloadDemographicsContentComponent extends React.Component<DownloadDemographicsContentProps> {

    ButtonWithTimeout?: any;

    componentWillReceiveProps(nextProps: DownloadDemographicsContentProps) {
        if (nextProps.touchstone && nextProps.dataSets) {
            if (nextProps.selectedDataSet !== this.props.selectedDataSet
            || nextProps.selectedFormat !== this.props.selectedFormat
            || nextProps.selectedGender !== this.props.selectedGender)
            {
                this.ButtonWithTimeout.enable();
            }
        }
    }

    render() {
        const canDownload = DownloadDemographicsContentComponent.canDownload(this.props);

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
            <ButtonWithTimeout
                token={this.props.token}
                refreshToken={this.props.refreshToken}
                disableDuration={5000}
                enabled={canDownload}
                onRef={ref => (this.ButtonWithTimeout = ref)}
            >
                Download data set
            </ButtonWithTimeout>
        </div>;
    }

    static canDownload(props: DownloadDemographicsContentProps): boolean {
        return props.selectedDataSet != null
            && (!props.selectedDataSet.gender_is_applicable || props.selectedGender != null)
    }
}

export const mapStateToProps = (state: ContribAppState): Partial<DownloadDemographicsContentProps> => {
    return {
        touchstone: state.touchstones.currentTouchstone,
        dataSets: state.demographic.dataSets,
        selectedDataSet: state.demographic.selectedDataSet,
        selectedGender: state.demographic.selectedGender,
        selectedFormat: state.demographic.selectedFormat,
        token: state.demographic.token
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<DownloadDemographicsContentProps> => {
    return {
        refreshToken: () => dispatch(demographicActionCreators.getOneTimeToken())
    }
};

export const DownloadDemographicsContent = compose(
    connect(mapStateToProps, mapDispatchToProps),
    branch((props: DownloadDemographicsContentProps) => !props.touchstone, renderComponent(LoadingElement))
)(DownloadDemographicsContentComponent) as React.ComponentClass<Partial<DownloadDemographicsContentProps>>;
