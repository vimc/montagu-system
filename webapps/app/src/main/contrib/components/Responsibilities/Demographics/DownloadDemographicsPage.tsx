import * as React from "react";
import { PageWithHeaderAndNav } from "../../PageWithHeader/PageWithHeaderAndNav";
import { DownloadDataTitle } from "../DownloadDataTitle";
import { modellingGroupActions } from "../../../../shared/actions/ModellingGroupActions";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { touchstoneActions } from "../../../actions/TouchstoneActions";
import { doNothing } from "../../../../shared/Helpers";
import { demographicStore } from "../../../stores/DemographicStore";
import { DownloadDemographicsContent } from "./DownloadDemographicsContent";

interface LocationProps {
    groupId: string;
    touchstoneId: string;
}

export class DownloadDemographicsPage extends PageWithHeaderAndNav<LocationProps> {
    componentDidMount() {
        setTimeout(() => {
            modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
            responsibilityStore.fetchTouchstones().catch(doNothing).then(() => {
                touchstoneActions.setCurrentTouchstone(this.props.location.params.touchstoneId);
                demographicStore.fetchDataSets().catch(doNothing);
            });
        });
    }

    title(): JSX.Element {
        return <DownloadDataTitle title="Download demographic data sets" />
    }

    renderPageContent(): JSX.Element {
        return <DownloadDemographicsContent />;
    }

}