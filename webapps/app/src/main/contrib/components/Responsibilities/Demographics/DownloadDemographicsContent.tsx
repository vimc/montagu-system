import * as React from 'react';
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { demographicStore } from "../../../stores/DemographicStore";
import { DemographicStatisticType, Touchstone } from "../../../../shared/models/Generated";
import { connectToStores } from "../../../../shared/alt";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { demographicActions } from "../../../actions/DemographicActions";
import ReactRadioButtonGroup, { RadioButtonOption } from "react-radio-button-group";
import { GenderControl } from "./GenderControl";
import { ButtonLink } from "../../../../shared/components/ButtonLink";

const commonStyles = require("../../../../shared/styles/common.css");
const styles = require("../Responsibilities.css");

interface Props extends RemoteContent {
    dataSets: DemographicStatisticType[];
    selectedDataSet: DemographicStatisticType;
    selectedGender: string;
    touchstone: Touchstone;
}

class DownloadDemographicsContentComponent extends RemoteContentComponent<Props> {
    static getStores() {
        return [demographicStore, responsibilityStore];
    }

    static getPropsFromStores(props: Props): Props {
        const demographicState = demographicStore.getState();
        const responsibilityState = responsibilityStore.getState();
        if (demographicState.currentTouchstone != null) {
            return {
                ready: demographicState.currentTouchstone in demographicState.dataSets,
                selectedDataSet: demographicState.selectedDataSet,
                selectedGender: demographicState.selectedGender,
                dataSets: demographicState.dataSets[demographicState.currentTouchstone],
                touchstone: responsibilityState.currentTouchstone
            };
        } else {
            return {
                ready: false,
                selectedDataSet: null,
                selectedGender: null,
                dataSets: null,
                touchstone: null
            }
        }
    }

    onSelectDataSet(e: React.ChangeEvent<HTMLSelectElement>) {
        demographicActions.selectDataSet(e.target.value);
    }

    onSelectGender(gender: string) {
        demographicActions.selectGender(gender);
    }

    renderOptions(props: Props) {
        const statisticTypes = props.dataSets.map(x =>
            <option key={x.id} value={x.id}>
                {x.name}
            </option>
        );

        const selectedId = props.selectedDataSet != null ? props.selectedDataSet.id : "";
        return <table className={ styles.options }>
            <tbody>
            <tr  className={ commonStyles.specialColumn }>
                <td>Statistic type</td>
                <td>
                    <select
                        className={styles.dataSet}
                        onChange={this.onSelectDataSet}
                        value={selectedId}>
                        <option value="">- Select -</option>
                        {statisticTypes}
                    </select>
                </td>
            </tr>
            <tr className={ commonStyles.specialColumn }>
                <td>Gender</td>
                <td><GenderControl
                    dataSet={props.selectedDataSet}
                    value={props.selectedGender}
                    onSelectGender={this.onSelectGender} />
                </td>
            </tr>
            </tbody>
        </table>
    }

    renderContent(props: Props) {
        const canDownload = props.selectedDataSet != null
            && (!props.selectedDataSet.gender_is_applicable || props.selectedGender != null);

        return <div className={styles.demographics}>
            <div className={commonStyles.sectionTitle}>
                Demographic data for {props.touchstone.description}
            </div>
            <div>
                Click to download a CSV file containing demographic data for this touchstone.
                Not all data sets are expected to be relevant to all modellers.
            </div>
            { this.renderOptions(props) }

            <ButtonLink href="#" disabled={ !canDownload }>Download data set</ButtonLink>
        </div>;
    }
}

export const DownloadDemographicsContent = connectToStores(DownloadDemographicsContentComponent);