import * as React from "react";
import { DownloadDataTitle } from "../DownloadDataTitle";
import { modellingGroupActions } from "../../../../shared/actions/ModellingGroupActions";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { touchstoneActions } from "../../../actions/TouchstoneActions";
import { doNothing } from "../../../../shared/Helpers";
import { demographicStore } from "../../../stores/DemographicStore";
import { DownloadDemographicsContent } from "./DownloadDemographicsContent";
import {ContribPageWithHeader} from "../../PageWithHeader/ContribPageWithHeader";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {ResponsibilityOverviewPage} from "../Overview/ResponsibilityOverviewPage";

interface LocationProps {
    groupId: string;
    touchstoneId: string;
}

export class DownloadDemographicsPage extends ContribPageWithHeader<LocationProps> {
    load() {
        modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
        responsibilityStore.fetchTouchstones().catch(doNothing).then(() => {
            touchstoneActions.setCurrentTouchstone(this.props.location.params.touchstoneId);
            demographicStore.fetchDataSets().catch(doNothing);
            super.load();
        });
    }

    name() {
        return "Download demographic data sets";
    }

    title(): JSX.Element {
        return <DownloadDataTitle title="Download demographic data sets" />
    }

    urlFragment(): string {
        return "demographics/";
    }

    parent(): IPageWithParent {
        return new ResponsibilityOverviewPage();
    }

    renderPageContent(): JSX.Element {
        return <DownloadDemographicsContent />;
    }

}