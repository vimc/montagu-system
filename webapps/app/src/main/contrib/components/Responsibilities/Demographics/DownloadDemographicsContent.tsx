import * as React from 'react';
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { demographicStore } from "../../../stores/DemographicStore";
import { DemographicStatisticType } from "../../../../shared/models/Generated";
import { connectToStores } from "../../../../shared/alt";

interface Props extends RemoteContent {
    dataSets: DemographicStatisticType[];
}

class DownloadDemographicsContentComponent extends RemoteContentComponent<Props> {
    static getStores() {
        return [ demographicStore ];
    }
    static getPropsFromStores(props: Props): Props {
        const state = demographicStore.getState();
        if (state.currentTouchstone != null) {
            return {
                ready: state.currentTouchstone in state.dataSets,
                dataSets: state.dataSets[state.currentTouchstone]
            };
        } else {
            return {
                ready: false,
                dataSets: []
            }
        }
    }

    renderContent(props: Props) {
        const items = props.dataSets.map(x => <li key={ x.id }>{ x.id }</li>);
        return <ul>{ items }</ul>
    }
}

export const DownloadDemographicsContent = connectToStores(DownloadDemographicsContentComponent);