import * as React from 'react';
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { demographicStore } from "../../../stores/DemographicStore";
import { DemographicDataset, Touchstone } from "../../../../shared/models/Generated";
import { connectToStores } from "../../../../shared/alt";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { DemographicOptions } from "./DemographicOptions";
import { OneTimeButton } from "../../../../shared/components/OneTimeButton";
import { demographicActions } from "../../../actions/DemographicActions";
import { doNothing } from "../../../../shared/Helpers";

const commonStyles = require("../../../../shared/styles/common.css");
const styles = require("../Responsibilities.css");

export interface DownloadDemographicsContentProps extends RemoteContent {
    dataSets: DemographicDataset[];
    selectedDataSet: DemographicDataset;
    selectedGender: string;
    selectedFormat: string;
    touchstone: Touchstone;
    downloadButtonDisableDuration?: number;
    token: string;
}

interface DownloadState {
    downloadButtonEnabled: boolean;
}

export class DownloadDemographicsContentComponent extends RemoteContentComponent<DownloadDemographicsContentProps, DownloadState> {
    downloadButtonDisableDuration: number;
    downloadButtonEnableTimeoutId: any;

    constructor(props?: DownloadDemographicsContentProps) {
        super(props);
        this.state = {
            downloadButtonEnabled: true,
        };
        this.onDownloadClicked = this.onDownloadClicked.bind(this);
        this.downloadButtonDisableDuration = this.props.downloadButtonDisableDuration
            ? this.props.downloadButtonDisableDuration
            : 5000;
    }

    static getStores() {
        return [demographicStore, responsibilityStore];
    }

    componentWillReceiveProps(nextProps: DownloadDemographicsContentProps) {
        if (nextProps.ready) {
            if (nextProps.selectedDataSet !== this.props.selectedDataSet
            || nextProps.selectedFormat !== this.props.selectedFormat
            || nextProps.selectedGender !== this.props.selectedGender)
            {
                this.enableDownloadButton();
            }
        }
    }

    static getPropsFromStores(props: DownloadDemographicsContentProps): Partial<DownloadDemographicsContentProps> {
        const demographicState = demographicStore.getState();
        const responsibilityState = responsibilityStore.getState();

        if (demographicState.currentTouchstone != null) {
            return {
                ready: demographicState.currentTouchstone in demographicState.dataSets,
                selectedDataSet: demographicState.selectedDataSet,
                selectedGender: demographicState.selectedGender,
                selectedFormat: demographicState.selectedFormat,
                dataSets: demographicState.dataSets[demographicState.currentTouchstone],
                token: demographicState.token,
                touchstone: responsibilityState.currentTouchstone
            };
        } else {
            return {
                ready: false
            }
        }
    }

    enableDownloadButton(){
        this.setState({
            downloadButtonEnabled: true,
        })
        this.clearTimeoutForDownloadButtonEnable();
    }

    clearTimeoutForDownloadButtonEnable(){
        if (this.downloadButtonEnableTimeoutId) {
            clearTimeout(this.downloadButtonEnableTimeoutId);
            this.downloadButtonEnableTimeoutId = undefined;
        }
    }

    onDownloadClicked() {
        setTimeout(() => {
            this.setState({
                downloadButtonEnabled: false,
            })
        });

        this.downloadButtonEnableTimeoutId = setTimeout(() => {
            this.setState({
                downloadButtonEnabled: true,
            })
        }, this.downloadButtonDisableDuration);

    }

    componentWillUnmount () {
        this.clearTimeoutForDownloadButtonEnable();
    }

    refreshToken() {
        demographicActions.clearUsedToken();
        demographicStore.fetchOneTimeToken().catch(doNothing);
    }

    renderContent(props: DownloadDemographicsContentProps) {
        const canDownload = DownloadDemographicsContentComponent.canDownload(props)
                            && this.state.downloadButtonEnabled;

        return <div className={styles.demographics}>
            <div className={commonStyles.sectionTitle}>
                Demographic data for {props.touchstone.description}
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
            <DemographicOptions
                dataSets={props.dataSets}
                selectedFormat={props.selectedFormat}
                selectedDataSet={props.selectedDataSet}
                selectedGender={props.selectedGender}/>
            <OneTimeButton
                token={props.token}
                refreshToken={this.refreshToken}
                enabled={canDownload}
                onClick={this.onDownloadClicked}
            >
                Download data set
            </OneTimeButton>
        </div>;
    }

    static canDownload(props: DownloadDemographicsContentProps): boolean {
        return props.selectedDataSet != null
            && (!props.selectedDataSet.gender_is_applicable || props.selectedGender != null)
    }
}

export const DownloadDemographicsContent = connectToStores(DownloadDemographicsContentComponent);