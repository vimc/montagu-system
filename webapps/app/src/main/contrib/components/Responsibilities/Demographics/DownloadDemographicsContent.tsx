import * as React from 'react';
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { demographicStore } from "../../../stores/DemographicStore";
import { DemographicStatisticType, Touchstone } from "../../../../shared/models/Generated";
import { connectToStores } from "../../../../shared/alt";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { DemographicOptions } from "./DemographicOptions";
import fetcher from "../../../../shared/sources/Fetcher";
import { OneTimeButton } from "../../../../shared/components/OneTimeButton";
import { demographicActions } from "../../../actions/DemographicActions";
import { doNothing } from "../../../../shared/Helpers";

const commonStyles = require("../../../../shared/styles/common.css");
const styles = require("../Responsibilities.css");

export interface DownloadDemographicsContentProps extends RemoteContent {
    dataSets: DemographicStatisticType[];
    selectedDataSet: DemographicStatisticType;
    selectedGender: string;
    touchstone: Touchstone;
    token: string;
}

export class DownloadDemographicsContentComponent extends RemoteContentComponent<DownloadDemographicsContentProps> {
    static getStores() {
        return [demographicStore, responsibilityStore];
    }

    static getPropsFromStores(props: DownloadDemographicsContentProps): DownloadDemographicsContentProps {
        const demographicState = demographicStore.getState();
        const responsibilityState = responsibilityStore.getState();
        if (demographicState.currentTouchstone != null) {
            return {
                ready: demographicState.currentTouchstone in demographicState.dataSets,
                selectedDataSet: demographicState.selectedDataSet,
                selectedGender: demographicState.selectedGender,
                dataSets: demographicState.dataSets[demographicState.currentTouchstone],
                token: demographicState.token,
                touchstone: responsibilityState.currentTouchstone
            };
        } else {
            return {
                ready: false,
                selectedDataSet: null,
                selectedGender: null,
                dataSets: null,
                token: null,
                touchstone: null
            }
        }
    }

    refreshToken() {
        demographicActions.clearUsedToken();
        demographicStore.fetchOneTimeToken().catch(doNothing);
    }

    renderContent(props: DownloadDemographicsContentProps) {
        const canDownload = DownloadDemographicsContentComponent.canDownload(props);
        const url = DownloadDemographicsContentComponent.downloadUrl(props);

        return <div className={styles.demographics}>
            <div className={commonStyles.sectionTitle}>
                Demographic data for {props.touchstone.description}
            </div>
            <div>
                Select the following options to download a CSV file containing demographic data
                for this touchstone.
                Not all data sets are expected to be relevant to all modellers.
            </div>
            <DemographicOptions
                dataSets={props.dataSets}
                selectedDataSet={props.selectedDataSet}
                selectedGender={props.selectedGender} />
            <OneTimeButton token={ props.token } refreshToken={ this.refreshToken } enabled={ canDownload }>
                Download data set
            </OneTimeButton>
        </div>;
    }

    static canDownload(props: DownloadDemographicsContentProps) {
        return props.selectedDataSet != null
            && (!props.selectedDataSet.gender_is_applicable || props.selectedGender != null)
            && props.token != null;
    }
    static downloadUrl(props: DownloadDemographicsContentProps) {
        return fetcher.fetcher.buildOneTimeLink(props.token);
    }
}

export const DownloadDemographicsContent = connectToStores(DownloadDemographicsContentComponent);