import * as React from 'react';
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { demographicStore } from "../../../stores/DemographicStore";
import { DemographicStatisticType, Touchstone } from "../../../../shared/models/Generated";
import { connectToStores } from "../../../../shared/alt";
import { DemographicDataSet } from "./DemographicDataSet";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";

const commonStyles = require("../../../../shared/styles/common.css");
const styles = require("../Responsibilities.css");

interface Props extends RemoteContent {
    dataSets: DemographicStatisticType[];
    touchstone: Touchstone;
}

class DownloadDemographicsContentComponent extends RemoteContentComponent<Props> {
    static getStores() {
        return [ demographicStore, responsibilityStore ];
    }
    static getPropsFromStores(props: Props): Props {
        const demographicState = demographicStore.getState();
        const responsibilityState = responsibilityStore.getState();
        if (demographicState.currentTouchstone != null) {
            return {
                ready: demographicState.currentTouchstone in demographicState.dataSets,
                dataSets: demographicState.dataSets[demographicState.currentTouchstone],
                touchstone: responsibilityState.currentTouchstone
            };
        } else {
            return {
                ready: false,
                dataSets: null,
                touchstone: null
            }
        }
    }

    renderContent(props: Props) {
        const items = props.dataSets.map(x => <li key={ x.id }>
            <DemographicDataSet set={x} />
        </li>);
        return <div>
            <div className={ commonStyles.sectionTitle }>
                Demographic data for { this.props.touchstone.description }
            </div>
            <div>
                Click to download a CSV file containing demographic data for this touchstone.
                Not all data sets are expected to be relevant to all modellers.
            </div>
            <ul className={ styles.demographics }>{ items }</ul>
        </div>;
    }
}

export const DownloadDemographicsContent = connectToStores(DownloadDemographicsContentComponent);